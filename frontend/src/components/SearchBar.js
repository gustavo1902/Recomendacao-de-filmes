import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, handleSubmit, loading, searchResults, searchLoading, selecionarFilme }) => (
  <form onSubmit={handleSubmit}>
    <div className="search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite o nome de um filme"
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
);

export default SearchBar;