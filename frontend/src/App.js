import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [movieId, setMovieId] = useState('');
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [erro, setErro] = useState('');

  const buscarRecomendacoes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/recomendar?movie_id=${movieId}`);
      setRecomendacoes(response.data);
      setErro('');
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao buscar recomendações');
      setRecomendacoes([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    buscarRecomendacoes();
  };

  return (
    <div className="App">
      <h1>Recomendador de Filmes</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          placeholder="Digite o ID do filme"
          required
        />
        <button type="submit">Buscar Recomendações</button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      {recomendacoes.length > 0 && (
        <div className="recomendacoes">
          <h2>Recomendações:</h2>
          <ul>
            {recomendacoes.map((filme, index) => (
              <li key={index}>
                <strong>{filme.title}</strong> - Nota: {filme.vote_average} (Score: {filme.score.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;