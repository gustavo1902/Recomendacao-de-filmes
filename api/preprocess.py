import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import pickle

print("Iniciando pré-processamento...")

# Carregar os dados
df_elenco = pd.read_csv('../base/tmdb_5000_credits.csv') 
df_filmes = pd.read_csv('../base/tmdb_5000_movies.csv') 

df_elenco.columns = ['id', 'title', 'cast', 'crew']
df = df_filmes.merge(df_elenco[['id', 'cast', 'crew']], on='id')
df['overview'] = df['overview'].fillna('')

tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['overview'])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

indices = pd.Series(df.index, index=df['title']).drop_duplicates()

with open('processed_data.pkl', 'wb') as f:
    pickle.dump({
        'movies_df': df,
        'cosine_sim': cosine_sim,
        'indices': indices
    }, f)

print("Pré-processamento concluído! Arquivo 'processed_data.pkl' criado.")