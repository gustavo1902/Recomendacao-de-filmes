from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

# --- Carregar os dados pré-processados ---
# Esta é a única parte necessária para carregar os dados.
try:
    with open('processed_data.pkl', 'rb') as f:
        data = pickle.load(f)
    df = data['movies_df']
    cosine_sim = data['cosine_sim']
    indices = data['indices']
    print("Dados pré-processados carregados com sucesso!")
except FileNotFoundError:
    print("ERRO: Arquivo 'processed_data.pkl' não encontrado. Execute o script 'preprocess.py' primeiro.")
    exit()

# --- Funções de Lógica (não precisam de alteração) ---

def buscar_filmes(texto_busca, limite=10):
    """Busca filmes por nome parcial usando o DataFrame carregado."""
    texto_busca = texto_busca.lower()
    # Garante que a coluna 'title' seja do tipo string para usar .str
    resultados = df[df['title'].str.lower().str.contains(texto_busca, na=False)]
    return resultados.sort_values('score', ascending=False).head(limite)[['id', 'title']].to_dict(orient='records')

def get_recommendations(title):
    """Gera recomendações baseadas no título do filme."""
    if title not in indices:
        # Tenta encontrar uma correspondência aproximada se o título exato não existir
        correspondencias = df[df['title'].str.lower() == title.lower()]
        if correspondencias.empty:
            return None
        # Pega o título exato da correspondência encontrada
        title = correspondencias.iloc[0]['title']
        
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]  # Pega os 10 filmes mais similares
    movie_indices = [i[0] for i in sim_scores]
    return df.iloc[movie_indices][['id', 'title', 'vote_average', 'score']].to_dict(orient='records')

# --- Rotas da API (não precisam de alteração) ---

@app.route('/recomendar-por-nome', methods=['GET'])
def get_recomendacao_por_nome():
    movie_name = request.args.get('movie_name')
    if not movie_name:
        return jsonify({'error': 'movie_name é obrigatório'}), 400
    
    recomendacoes = get_recommendations(movie_name)
    if recomendacoes is None:
        return jsonify({'error': 'Filme não encontrado ou sem recomendações'}), 404
    
    return jsonify(recomendacoes)

@app.route('/pesquisar', methods=['GET'])
def pesquisar_filmes():
    termo = request.args.get('termo', '')
    if not termo or len(termo) < 2:
        return jsonify({'error': 'Termo de busca muito curto'}), 400
    
    resultados = buscar_filmes(termo)
    return jsonify(resultados)

@app.route('/filmes', methods=['GET'])
def get_filmes():
    # Retorna os filmes ordenados por popularidade do DataFrame já carregado
    amostra = df.sort_values('popularity', ascending=False)[['id', 'title']].head(20).to_dict(orient='records')
    return jsonify(amostra)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)