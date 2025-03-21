import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [movieName, setMovieName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [erro, setErro] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Carregar filmes populares ao iniciar
  useEffect(() => {
    const carregarFilmes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/filmes');
        setFilmes(response.data);
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        setErro('Erro ao carregar lista de filmes. Verifique se o servidor está rodando.');
      }
    };
    carregarFilmes();
  }, []);

  // Função para buscar filmes enquanto o usuário digita
  const buscarFilmes = async (termo) => {
    if (termo.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/pesquisar?termo=${encodeURIComponent(termo)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar filmes:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce para a pesquisa
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        buscarFilmes(searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Função para buscar recomendações
  const buscarRecomendacoes = async () => {
    setLoading(true);
    setErro('');
    
    try {
      console.log(`Buscando recomendações para o filme: ${movieName}`);
      const response = await axios.get(`http://localhost:5000/recomendar-por-nome?movie_name=${encodeURIComponent(movieName)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Resposta recebida:', response.data);
      setRecomendacoes(response.data);
      setErro('');
    } catch (error) {
      console.error('Erro completo:', error);
      let mensagemErro;
      if (error.response) {
        mensagemErro = `Erro ${error.response.status}: ${error.response.data.error || error.message}`;
      } else if (error.request) {
        mensagemErro = "Erro de conexão: O servidor não está respondendo. Verifique se a API está rodando.";
      } else {
        mensagemErro = `Erro ao buscar recomendações: ${error.message}`;
      }
      setErro(mensagemErro);
      setRecomendacoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movieName) {
      setErro('Por favor, digite o nome de um filme');
      return;
    }
    buscarRecomendacoes();
  };

  // Selecionar um filme da lista de resultados
  const selecionarFilme = (titulo) => {
    setMovieName(titulo);
    setSearchTerm(titulo);
    setSearchResults([]);
  };

  return (
    <div className="App">
      <h1>Recomendador de Filmes</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setMovieName(e.target.value);
            }}
            placeholder="Digite o nome do filme"
            required
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchLoading ? (
                <div className="loading-results">Buscando...</div>
              ) : (
                searchResults.map((filme) => (
                  <div 
                    key={filme.id} 
                    className="search-item"
                    onClick={() => selecionarFilme(filme.title)}
                  >
                    {filme.title}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Recomendações'}
        </button>
      </form>

      {erro && (
        <div className="erro">
          <p>{erro}</p>
        </div>
      )}

      {recomendacoes.length > 0 ? (
        <div className="recomendacoes">
          <h2>Recomendações para "{movieName}":</h2>
          <ul>
            {recomendacoes.map((filme, index) => (
              <li key={index}>
                <strong>{filme.title}</strong> - Nota: {filme.vote_average} 
                (Score: {typeof filme.score === 'number' ? filme.score.toFixed(2) : filme.score})
              </li>
            ))}
          </ul>
        </div>
      ) : !erro && !loading && movieName && (
        <p>Nenhuma recomendação encontrada para o filme informado.</p>
      )}
      
      {filmes.length > 0 && !searchTerm && (
        <div className="filmes-populares">
          <h3>Filmes Populares:</h3>
          <ul>
            {filmes.map((filme) => (
              <li key={filme.id} onClick={() => selecionarFilme(filme.title)} className="filme-item">
                {filme.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;