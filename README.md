# Recomendação de Filmes

Um sistema de recomendação de filmes que utiliza filtragem baseada em conteúdo, construído com React no frontend e Flask no backend.

**[Acesse a demonstração](https://youtu.be/XToHq0zCY3g) |**

## ✨ Funcionalidades Principais

-   **Busca Inteligente:** Encontre filmes com sugestões em tempo real.
-   **Recomendações por Conteúdo:** Receba sugestões baseadas na sinopse do filme escolhido.
-   **Ranking Ponderado:** Os filmes são classificados por um score que considera a média de votos e a popularidade (IMDb Weighted Rating).
-   **Desempenho Otimizado:** O backend utiliza dados pré-processados para respostas rápidas.

## 🛠️ Tecnologias Utilizadas

| Frontend      | Backend       | Data Science        |
| ------------- |:-------------:| -------------------:|
| React         | Flask         | Pandas              |
| Axios         | Python        | Scikit-learn        |
| CSS3          | Gunicorn      | TF-IDF              |

## 🚀 Como Executar o Projeto

### Pré-requisitos

-   Node.js v14+
-   Python 3.7+
-   `pip`

### Backend

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/seu-usuario/seu-repo.git](https://github.com/seu-usuario/seu-repo.git)
    cd seu-repo/backend
    ```
2.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
3.  Execute o pré-processamento (apenas uma vez):
    ```bash
    python preprocess.py
    ```
4.  Inicie o servidor:
    ```bash
    flask run
    ```
    O servidor estará rodando em `http://localhost:5000`.

### Frontend
1.  Navegue até a pasta do frontend:
    ```bash
    cd ../frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie a aplicação:
    ```bash
    npm start
    ```
    A aplicação abrirá em `http://localhost:3000`.

## 📈 Melhorias Futuras

-   [ ] Implementar deploy em um serviço como Vercel (frontend) e Heroku/Render (backend).
-   [ ] Adicionar imagens (pôsteres) dos filmes na interface.
-   [ ] Containerizar a aplicação com Docker para facilitar o setup.
-   [ ] Expandir o modelo de recomendação para incluir gêneros, diretores e elenco (filtragem híbrida).