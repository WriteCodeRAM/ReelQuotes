import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';
import Modal from './Modal';
import correctSymbol from '../images/checkmark.png';
import wrongSymbol from '../images/redX.png';
import searchIcon from '../images/search-icon.png';
import Summary from './Summary';

const API_KEY = '095e721b09eadf6c12c7599553d2d026';

const Searchbar = ({ answer, skipped, handleNextQuote, num, quote }) => {
  const [movies, setMovies] = useState([]);
  const [input, setInput] = useState('');
  const [symbol, setSymbol] = useState(null);
  const [title, setTitle] = useState(null);
  const [poster, setPoster] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [responses, setResponses] = useState(() => {
    const storedResponses = JSON.parse(localStorage.getItem('GAME_RESPONSES'));
    return storedResponses || [];
  });
  const [score, setScore] = useState(0);

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

  useEffect(() => {
    if (skipped) {
      setInput('');
      handleSubmit();
    }
  }, [skipped]);

  const handleMovieClick = async (title, date) => {
    setInput(title + ' ' + '(' + date.slice(0, 4) + ')');
    const movieName = answer.substring(0, answer.indexOf('(')).trim();

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(
          movieName
        )}`
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
    if (e) {
      e.preventDefault();
    }

    if (input === '' && !skipped) return;

    window.localStorage.setItem('STORED_NUM', num + 1);

    const STORED_SCORE = JSON.parse(localStorage.getItem('STORED_SCORE'))

    const res = {
      symbol: symbol,
      poster: poster,
      title: title,
      score: STORED_SCORE, 
    };

    console.log(answer);
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
        res.poster = imageUrl;
      }
    } catch (error) {
      console.error(error);
    }

    setSymbol(input === answer ? correctSymbol : wrongSymbol);
    if (input === answer) {
      res.symbol = correctSymbol;
      res.score = STORED_SCORE + 1
    } else {
      res.symbol = wrongSymbol;
    }

    res.title = answer;
    res.quote = quote;
    setTitle(answer);
    setIsOpen(true);

    if (num < 3) {
      handleResponse(res);
    }

    setInput('');
    console.log(num);

    // handleNextQuote();
  };

  const handleResponse = (res) => {
    const checkResponses = window.localStorage.getItem('GAME_RESPONSES');
    const parsedResponses = checkResponses ? JSON.parse(checkResponses) : [];
    const updatedResponses = [...parsedResponses, res];
    setResponses(updatedResponses);
    window.localStorage.setItem('GAME_RESPONSES', JSON.stringify(updatedResponses));
  };

  const handleCloseModal = () => {
    setIsOpen(false);

    if (num === 2) {
      setSummaryOpen(true);
    }
    handleNextQuote();
  };

  const handleSummaryModalClose = () => {
    setSummaryOpen(false);
  };

  return (
    <div className="searchbar-container">
      {movies.length > 0 && (
        <div className="search-results">
          <MovieCard movies={movies} handleMovieClick={handleMovieClick} />
        </div>
      )}
      <form action="" className="submit-form">
        <div className="search-input-container">
          <input
            type="text"
            className="input-text"
            value={input}
            onChange={handleInputChange}
            placeholder="Search for the name of the movie here!"
          />
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
        </div>
        <button className="submitBtn" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      <Modal symbol={symbol} title={answer} poster={poster} isOpen={isOpen} onClose={handleCloseModal} />
      <Summary isSummaryOpen={isSummaryOpen} onSummaryClose={handleSummaryModalClose} responses={responses} />
    </div>
  );
};

export default Searchbar;
