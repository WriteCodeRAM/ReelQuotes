import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Searchbar = () => {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState('Enter the name of the movie here!');

  useEffect(() => {
    async function getSearchResults() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=095e721b09eadf6c12c7599553d2d026&language=en-US&page=1&include_adult=false&query=${input}`
        );
        setMovies(res.data.results);
      } catch (error) {
        console.error(error);
      }
    }

    getSearchResults();
  }, [input]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <>
      <MovieCard movies={movies} />
      <form action="" className="submit-form">
        <input type="text" className="" value={input} onChange={handleInputChange} />
        <button className="submitBtn">Submit</button>
      </form>
    </>
  );
};

export default Searchbar;
