from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS 
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)
# Habilitar CORS para todas as rotas
CORS(app)

df_elenco = pd.read_csv('../base/tmdb_5000_credits.csv') 
df_filmes = pd.read_csv('../base/tmdb_5000_movies.csv') 

df_elenco.columns = ['id', 'title', 'cast', 'crew']


df = df_filmes.merge(df_elenco[['id', 'cast', 'crew']], on='id')


df['overview'] = df['overview'].fillna('')

indices = pd.Series(df.index, index=df['title']).drop_duplicates()


tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['overview'])

cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Função para calcular a pontuação ponderada (Weighted Rating do IMDb)
def weighted_rating(x, m=None, C=None):
    if m is None:
        m = df['vote_count'].quantile(0.90)  
    if C is None:
        C = df['vote_average'].mean()  
    v = x['vote_count']
    R = x['vote_average']
    return (v / (v + m) * R) + (m / (m + v) * C)

# Adicionar a pontuação 'score' ao DataFrame
df['score'] = df.apply(weighted_rating, axis=1)


def get_recommendations(title, cosine_sim=cosine_sim):
    if title not in indices:
        return None
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]  
    movie_indices = [i[0] for i in sim_scores]
    return df.iloc[movie_indices][['title', 'vote_average', 'score']].to_dict(orient='records')

def recomendar_filme(movie_id):

    filme = df[df['id'] == movie_id]
    if filme.empty:
        return None
    title = filme['title'].iloc[0]
    recomendacoes = get_recommendations(title)
    if not recomendacoes:
        return []
    return recomendacoes

# Rota da API para recomendações por movie_id
@app.route('/recomendar', methods=['GET'])
def get_recomendacao():
    movie_id = request.args.get('movie_id', type=int)
    if not movie_id:
        return jsonify({'error': 'movie_id é obrigatório'}), 400
    
    recomendacoes = recomendar_filme(movie_id)
    if recomendacoes is None:
        return jsonify({'error': 'Filme não encontrado ou sem recomendações'}), 404
    
    return jsonify(recomendacoes)

# Adicionar uma rota para listar alguns filmes
@app.route('/filmes', methods=['GET'])
def get_filmes():
    
    amostra = df[['id', 'title']].head(10).to_dict(orient='records')
    return jsonify(amostra)

CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)