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

# Função para buscar filmes por nome parcial
def buscar_filmes(texto_busca, limite=10):
    texto_busca = texto_busca.lower()
    resultados = df[df['title'].str.lower().str.contains(texto_busca)]
    return resultados.sort_values('score', ascending=False).head(limite)[['id', 'title']].to_dict(orient='records')

# Função de recomendação baseada em título e similaridade
def get_recommendations(title, cosine_sim=cosine_sim):

    if title not in indices:
        correspondencias = df[df['title'].str.lower().str.contains(title.lower())]
        if correspondencias.empty:
            return None
        title = correspondencias.iloc[0]['title']
        
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]  
    movie_indices = [i[0] for i in sim_scores]
    return df.iloc[movie_indices][['id', 'title', 'vote_average', 'score']].to_dict(orient='records')

# Rota da API para recomendações por nome do filme
@app.route('/recomendar-por-nome', methods=['GET'])
def get_recomendacao_por_nome():
    movie_name = request.args.get('movie_name')
    if not movie_name:
        return jsonify({'error': 'movie_name é obrigatório'}), 400
    
    recomendacoes = get_recommendations(movie_name)
    if recomendacoes is None:
        return jsonify({'error': 'Filme não encontrado ou sem recomendações'}), 404
    
    return jsonify(recomendacoes)

# Mantendo a rota original para compatibilidade
@app.route('/recomendar', methods=['GET'])
def get_recomendacao():
    movie_id = request.args.get('movie_id', type=int)
    if not movie_id:
        return jsonify({'error': 'movie_id é obrigatório'}), 400
    
    filme = df[df['id'] == movie_id]
    if filme.empty:
        return jsonify({'error': 'Filme não encontrado'}), 404
    
    title = filme['title'].iloc[0]
    recomendacoes = get_recommendations(title)
    if recomendacoes is None:
        return jsonify({'error': 'Filme sem recomendações'}), 404
    
    return jsonify(recomendacoes)

# Rota para pesquisar filmes
@app.route('/pesquisar', methods=['GET'])
def pesquisar_filmes():
    termo = request.args.get('termo', '')
    if not termo or len(termo) < 2:
        return jsonify({'error': 'Termo de busca muito curto'}), 400
    
    resultados = buscar_filmes(termo)
    return jsonify(resultados)

# Rota para listar alguns filmes populares
@app.route('/filmes', methods=['GET'])
def get_filmes():
    # Retornar filmes ordenados por popularidade
    amostra = df.sort_values('popularity', ascending=False)[['id', 'title']].head(20).to_dict(orient='records')
    return jsonify(amostra)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)