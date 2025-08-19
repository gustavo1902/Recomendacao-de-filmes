import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPopularMovies = () => apiClient.get('/filmes');

export const searchMovies = (term) => apiClient.get(`/pesquisar?termo=${encodeURIComponent(term)}`);

export const getRecommendations = (movieName) => apiClient.get(`/recomendar-por-nome?movie_name=${encodeURIComponent(movieName)}`);