import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';

const API_KEY = '095e721b09eadf6c12c7599553d2d026'

const Searchbar = () => {
    const [movies, setMovies] = useState([]);
    const [input, setInput] = useState('');
  
    useEffect(() => {
      async function getSearchResults() {
        try {
          const res = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${input}`
          );
          setMovies(res.data.results.slice(0,5));
        } catch (error) {
          console.error(error);
        }
      }
  
      getSearchResults();
    }, [input]);
  
    const handleInputChange = (e) => {
      setInput(e.target.value);
    };
  
    const handleMovieClick = (title, date) => {
      console.log(title, date)
      setInput(title + ' ' + '(' + date.slice(0,4) + ')');
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
          <button className="submitBtn">Submit</button>
        </form>
      </div>
    );
  };
  
  export default Searchbar;
  