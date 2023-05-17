import React from "react";
import playBtn from '../images/playBtn.png';
import pauseBtn from '../images/pause.png';
import Searchbar from "./Searchbar";
import { supabase } from "../client";
import { useState, useRef, useEffect } from "react";

const Gameboard = () => {
  const [quote, setQuote] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [poster, setPoster] = useState(null);
  const [answer, setAnswer] = useState('')
  const [num, setNum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayClick = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('Quotes').select('*');
      setQuotes(data.slice(0, 3));
      setQuote(data[num]?.quote || "No quotes found");
      setAnswer(data[num].movie + ' ' + '(' + data[num].release_date + ')')
      handleAudioToggle();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quote) {
      setAnswer(quotes[num]?.movie + ' ' + '(' + quotes[num]?.release_date.slice(0, 4) + ')');
    }
  }, [quote]);

  const handleNextQuote = () => {
    setNum(num + 1);
    setQuote(quotes[num + 1]?.quote || "No quotes found");
    setAnswer(data[num + 1]?.movie + ' ' + '(' + data[num+1]?.release_date + ')')

  };

  const handleAudioToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="game-container">
      <div className="playBtn-container" onClick={handlePlayClick}>
        <img
          className="playBtn"
          src={isPlaying ? pauseBtn : playBtn}
          onClick={handleAudioToggle}
          alt=""
        />
      </div>
      <div className="quote-container">
        {quote ? (
          <>
            <p className="quote">{quote}</p>
            <div className="gameBtn-container">
              <button onClick={handleNextQuote} disabled={num === 2}>
                skip
              </button>
            </div>
            <span>Movie {num + 1}/3</span>
          </>
        ) : (
          <p className="quote">Click the play button to get a quote</p>
        )}
        {quote && (
          <audio ref={audioRef} src={quotes[num]?.audio}></audio>
        )}
      </div>

      <Searchbar answer={answer} poster={poster} />
    </div>
  );
};

export default Gameboard;
