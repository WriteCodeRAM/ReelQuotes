import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import Modal from './Modal';
import correctSymbol from '../images/checkmark.png';
import wrongSymbol from '../images/redX.png';

const API_KEY = '095e721b09eadf6c12c7599553d2d026';

const Searchbar = ({ answer, skipped, handleNextQuote }) => {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState('');
  const [symbol, setSymbol] = useState(null);
  const [title, setTitle] = useState(null);
  const [poster, setPoster] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [line, setLine] = useState('')

  useEffect(() => {
    async function getSearchResults() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${input}`
        );
        setMovies(res.data.results.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    }

    getSearchResults();
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

//watch out for this one too
 useEffect(() => {
  if (skipped) {
    setInput('');
    console.log('running')
    handleSubmit()
  }
}, [skipped]);

  const handleMovieClick = async (title, date) => {
    setInput(title + ' ' + '(' + date.slice(0, 4) + ')');
    const movieName = answer.substring(0, answer.indexOf('(')).trim();

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(movieName)}`
      );
  
      if (response.data.results.length > 0) {
        const movie = response.data.results[0];
        const posterPath = movie.poster_path;
        const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
        setPoster(imageUrl);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleSubmit = async (e) => {
    if(e){

      e.preventDefault();
    }
  
    console.log(answer)
    try {
      const movieName = answer.substring(0, answer.indexOf('(')).trim();
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${movieName}`
      );
      
      if (response.data.results.length > 0) {
        const movie = response.data.results[0];
        const posterPath = movie.poster_path;
        const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
        setPoster(imageUrl);
        
      }
    } catch (error) {
      console.error(error);
    }
  
    setSymbol(input === answer ? correctSymbol : wrongSymbol);
    setTitle(answer);
    setIsOpen(true);
    setInput('');


  

    // handleNextQuote();

  };
  
  
  const handleCloseModal = () => {
    setIsOpen(false);

      handleNextQuote();

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

      <Modal symbol={symbol} title={answer} poster={poster} isOpen={isOpen} onClose={handleCloseModal} line={line} />
    </div>
  );
};

export default Searchbar;