import React from 'react';

const RecommendationsList = ({ recommendations, movieName }) => (
  <div className="recomendacoes">
    <h2>Recomendações para "{movieName}":</h2>
    <ul>
      {recommendations.map((filme, index) => (
        <li key={index}>
          <strong>{filme.title}</strong> - Nota: {filme.vote_average} 
          (Score: {typeof filme.score === 'number' ? filme.score.toFixed(2) : filme.score})
        </li>
      ))}
    </ul>
  </div>
);

export default RecommendationsList;