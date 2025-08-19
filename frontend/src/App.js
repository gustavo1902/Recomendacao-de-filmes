import React, { useState, useEffect } from 'react';
import { getPopularMovies, searchMovies, getRecommendations } from './services/api';
import SearchBar from './components/SearchBar';
import RecommendationsList from './components/RecommendationsList';
import PopularMovies from './components/PopularMovies';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [movieName, setMovieName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [filmes, setFilmes] = useState([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- Carregar filmes populares ao iniciar ---
  useEffect(() => {
    const carregarFilmesPopulares = async () => {
      try {
        const response = await getPopularMovies();
        setFilmes(response.data);
      } catch (error) {
        console.error('Erro ao carregar filmes populares:', error);
        setErro('Não foi possível carregar os filmes populares.');
      }
    };
    carregarFilmesPopulares();
  }, []);

  // --- Lógica de busca com Debounce ---
  useEffect(() => {
    const buscarFilmes = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const response = await searchMovies(searchTerm);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Erro ao pesquisar filmes:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      buscarFilmes();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // --- Função para buscar recomendações ---
  const buscarRecomendacoes = async () => {
    setLoading(true);
    setErro('');
    setRecomendacoes([]);
    try {
      const response = await getRecommendations(movieName);
      setRecomendacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
      let mensagemErro = "Ocorreu um erro. Verifique se a API está rodando.";
      if (error.response && error.response.status === 404) {
        mensagemErro = `Nenhuma recomendação encontrada para "${movieName}".`;
      }
      setErro(mensagemErro);
      setRecomendacoes([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Manipulador do formulário ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!movieName) {
      setErro('Por favor, selecione um filme da lista.');
      return;
    }
    setSearchTerm(movieName); // Sincroniza o campo de busca com o filme selecionado
    setSearchResults([]); // Limpa os resultados da busca
    buscarRecomendacoes();
  };

  // --- Função para selecionar um filme ---
  const selecionarFilme = (titulo) => {
    setMovieName(titulo);
    setSearchTerm(titulo);
    setSearchResults([]);
  };

  return (
    <div className="App">
      <h1>Recomendação de Filmes</h1>
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSubmit={handleSubmit}
        loading={loading}
        searchResults={searchResults}
        searchLoading={searchLoading}
        selecionarFilme={selecionarFilme}
      />

      {erro && <ErrorMessage message={erro} />}

      {recomendacoes.length > 0 && (
        <RecommendationsList recommendations={recomendacoes} movieName={movieName} />
      )}
      
      {filmes.length > 0 && !searchTerm && !recomendacoes.length > 0 && (
        <PopularMovies filmes={filmes} selecionarFilme={selecionarFilme} />
      )}
    </div>
  );
}

export default App;
