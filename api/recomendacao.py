from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)

# Carregar os dados
df_elenco = pd.read_csv('../base/tmdb_5000_credits.csv') 
df_filmes = pd.read_csv('../base/tmdb_5000_movies.csv') 

# Renomear colunas do df_elenco para consistência
df_elenco.columns = ['id', 'title', 'cast', 'crew']

# Mesclar os dois DataFrames pelo 'id'
df = df_filmes.merge(df_elenco[['id', 'cast', 'crew']], on='id')

# Preencher valores NaN em 'overview' com string vazia
df['overview'] = df['overview'].fillna('')

# Criar índices para busca por título
indices = pd.Series(df.index, index=df['title']).drop_duplicates()

# Criar a matriz TF-IDF para calcular similaridade baseada em 'overview'
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['overview'])

# Calcular a similaridade de cosseno entre os filmes
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Função para calcular a pontuação ponderada (Weighted Rating do IMDb)
def weighted_rating(x, m=None, C=None):
    if m is None:
        m = df['vote_count'].quantile(0.90)  # Mínimo de votos (90º percentil)
    if C is None:
        C = df['vote_average'].mean()  # Média geral das notas
    v = x['vote_count']
    R = x['vote_average']
    return (v / (v + m) * R) + (m / (m + v) * C)

# Adicionar a pontuação 'score' ao DataFrame
df['score'] = df.apply(weighted_rating, axis=1)

# Função de recomendação baseada em título e similaridade
def get_recommendations(title, cosine_sim=cosine_sim):
    if title not in indices:
        return None
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]  # Top 10 filmes similares (exclui o próprio filme)
    movie_indices = [i[0] for i in sim_scores]
    return df.iloc[movie_indices][['title', 'vote_average', 'score']].to_dict(orient='records')

# Função de recomendação baseada em movie_id
def recomendar_filme(movie_id):
    # Encontrar o título correspondente ao movie_id
    filme = df[df['id'] == movie_id]
    if filme.empty:
        return None
    title = filme['title'].iloc[0]
    recomendacoes = get_recommendations(title)
    return recomendacoes if recomendacoes else []

# Rota da API para recomendações por movie_id
@app.route('/recomendar', methods=['GET'])
def get_recomendacao():
    movie_id = request.args.get('movie_id', type=int)
    if not movie_id:
        return jsonify({'error': 'movie_id é obrigatório'}), 400
    
    recomendacoes = recomendar_filme(movie_id)
    if not recomendacoes:
        return jsonify({'error': 'Filme não encontrado ou sem recomendações'}), 404
    
    return jsonify(recomendacoes)

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)