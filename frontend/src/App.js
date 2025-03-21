import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [movieId, setMovieId] = useState('');
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [erro, setErro] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(false);

  
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

  const buscarRecomendacoes = async () => {
    setLoading(true);
    setErro('');
    
    try {
      console.log(`Buscando recomendações para o ID: ${movieId}`);
      const response = await axios.get(`http://localhost:5000/recomendar?movie_id=${movieId}`, {
        
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
    if (!movieId) {
      setErro('Por favor, digite um ID de filme');
      return;
    }
    buscarRecomendacoes();
  };

  return (
    <div className="App">
      <h1>Recomendador de Filmes</h1>
      
      {filmes.length > 0 && (
        <div className="filmes-disponiveis">
          <h3>Alguns IDs de filmes disponíveis:</h3>
          <ul>
            {filmes.map((filme) => (
              <li key={filme.id}>
                ID: {filme.id} - {filme.title}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          placeholder="Digite o ID do filme"
          required
        />
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
          <h2>Recomendações:</h2>
          <ul>
            {recomendacoes.map((filme, index) => (
              <li key={index}>
                <strong>{filme.title}</strong> - Nota: {filme.vote_average} 
                (Score: {typeof filme.score === 'number' ? filme.score.toFixed(2) : filme.score})
              </li>
            ))}
          </ul>
        </div>
      ) : !erro && !loading && movieId && (
        <p>Nenhuma recomendação encontrada para o ID fornecido.</p>
      )}
    </div>
  );
}

export default App;