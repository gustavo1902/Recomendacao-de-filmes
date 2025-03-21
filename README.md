# Recomendação de filmes

Este projeto é um sistema de recomendação de filmes com um frontend em React e um backend em Flask. Ele utiliza um algoritmo de recomendação baseado em conteúdo para sugerir filmes semelhantes ao pesquisado pelo usuário, com base em descrições de filmes e métricas de popularidade.

## Visão Geral

O sistema é composto por dois componentes principais:
- **API Backend em Flask**: Processa os dados dos filmes e gera recomendações.
- **Frontend em React**: Oferece uma interface para buscar filmes e visualizar recomendações.

## Funcionalidades

- Pesquisar filmes por nome
- Exibir recomendações de filmes baseadas em similaridade de conteúdo
- Mostrar filmes populares
- Sugestões de busca em tempo real
- Sistema de pontuação ponderada baseado na fórmula do IMDB

## Requisitos

### Backend
- Python 3.7+
- Flask
- pandas
- scikit-learn
- flask-cors

### Frontend
- Node.js 14+
- React
- axios

## Conjunto de Dados

O sistema utiliza o *TMDB 5000 Movie Dataset*, que inclui:
- `tmdb_5000_movies.csv`: Contém metadados dos filmes como título, visão geral, data de lançamento, etc.
- `tmdb_5000_credits.csv`: Contém informações sobre elenco e equipe de cada filme.

## Instalação e Configuração

### Configuração do Backend
1. Clone o repositório
2. Instale os pacotes Python necessários:
   ```bash
   pip install flask pandas scikit-learn flask-cors
   ```
3. Inicie o servidor Flask:
   ```bash
   python3 app.py
   ```

O servidor estará disponível em http://localhost:5000

### Configuração do Frontend
1. Navegue até o diretório do frontend:
    ```bash
    cd frontend
    ```
2. Instale as dependências do Node.js:
    ```bash
    npm install
    ```
3. Inicie o servidor React:
    ```bash
    npm start
    ```

O servidor estará disponível em http://localhost:3000

## Uso

1. Abra o navegador e vá para http://localhost:3000.
2. Use a barra de pesquisa para encontrar um filme.
3. Veja as recomendações baseadas no filme pesquisado.


## Endpoints da API

- **GET /recomendar-por-nome?movie_name={movie_name}**: Obtém recomendações de filmes com base no nome do filme.
- **GET /recomendar?movie_id={movie_id}**: Obtém recomendações de filmes com base no ID do filme.
- **GET /pesquisar?termo={termo}**: Pesquisa filmes por nome.
- **GET /filmes**: Obtém uma lista de filmes populares.

## Como o Sistema de Recomendação Funciona

O sistema de recomendação utiliza as seguintes técnicas:

- **Vetorização TF-IDF**: Transforma as descrições dos filmes em vetores numéricos.
- **Similaridade de Cosseno**: Mede a similaridade entre filmes com base em seus vetores de descrição.
- **Pontuação Ponderada**: Calcula uma pontuação para cada filme com base na contagem de votos e na média de avaliações, usando a fórmula do IMDB.

## Melhorias Futuras

- Implementar autenticação de usuários.
- Adicionar avaliações de usuários e filtragem colaborativa.
- Incluir mais metadados de filmes (gênero, atores, diretores) no algoritmo de recomendação.
- Adicionar pôsteres de filmes e detalhes adicionais.
- Implementar paginação para grandes conjuntos de resultados.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.
