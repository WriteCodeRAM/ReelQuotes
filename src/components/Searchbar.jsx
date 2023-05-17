import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import Modal from './Modal';
import correctSymbol from '../images/checkmark.png';
import wrongSymbol from '../images/redX.png';

const API_KEY = '095e721b09eadf6c12c7599553d2d026';

const Searchbar = ({ answer }) => {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState('');
  const [symbol, setSymbol] = useState(null);
  const [title, setTitle] = useState(null);
  const [poster, setPoster] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getSearchResults() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${input}`
        );
        setMovies(res.data.results.slice(0, 5));
        console.log(res.data)
      } catch (error) {
        console.error(error);
      }
    }

    getSearchResults();
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleMovieClick = async (title, date, movieId) => {
    setInput(title + ' ' + '(' + date.slice(0, 4) + ')');
    
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
      const posterPath = response.data.poster_path;
      const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
      setPoster(imageUrl);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === answer) {
      setSymbol(correctSymbol);
      setTitle(answer);
      console.log(poster)
    } else {
      setSymbol(wrongSymbol);
      setTitle(answer);
      console.log(poster)

    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="searchbar-container">
      {movies.length > 0 && (
        <div className="search-results">
          <MovieCard movies={movies} handleMovieClick={handleMovieClick} />
        </div>
      )}
      <form action="" className="submit-form">
        <input
          type="text"
          className=""
          value={input}
          onChange={handleInputChange}
          placeholder="Search for the name of the movie here!"
        />
        <button className="submitBtn" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      <Modal symbol={symbol} title={answer} poster={poster} isOpen={isOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Searchbar;
