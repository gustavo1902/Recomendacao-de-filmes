import React from 'react';

// Componente para renderizar a lista de filmes populares na tela inicial.
const PopularMovies = ({ filmes, selecionarFilme }) => (
  <div className="filmes-populares">
    <h3>Filmes Populares:</h3>
    <ul>
      {filmes.map((filme) => (
        <li 
          key={filme.id} 
          onClick={() => selecionarFilme(filme.title)} 
          className="filme-item"
        >
          {filme.title}
        </li>
      ))}
    </ul>
  </div>
);

export default PopularMovies;
