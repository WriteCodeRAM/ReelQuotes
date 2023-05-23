import React from "react";
import playBtn from '../images/playBtn.png';
import pauseBtn from '../images/pause.png';
import Searchbar from "./Searchbar";
import { supabase } from "../client";
import { useState, useRef, useEffect } from "react";
import Summary from "./Summary";

const Gameboard = () => {
  const [quote, setQuote] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [answer, setAnswer] = useState('');
  const [skipped, setSkipped] = useState(false);
  const [num, setNum] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [gameOver, setIsGameOver] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const handlePlayClick = async () => {
      const storedResponses = JSON.parse(localStorage.getItem('GAME_RESPONSES'));
      if (storedResponses) {
        setQuotes('');
      } else {
        try {
          const { data } = await supabase.from('Quotes').select('*');
          const filteredData = data.filter(x => x.used === false ).slice(0,3)
          setQuotes(filteredData);
          window.localStorage.setItem('FILTERED_DATA', JSON.stringify(filteredData))
        } catch (error) {
          console.error(error);
        }
      }
    };

    handlePlayClick();
  }, []);

  useEffect(() => {
    localStorage.setItem("GAME_IS_OVER", JSON.stringify(gameOver));
  }, [gameOver]);

  useEffect(() => {
    const gameIsOverData = JSON.parse(localStorage.getItem("GAME_RESPONSES"));
    const currentDate = new Date().getDate();
    if (gameIsOverData?.length === 3) {
      setIsSummaryOpen(true)
    }
  }, []);

  const handleNextQuote = async () => {
    if (num < 3) {
      setIsLoading(true);
      setQuote('New quote loading :)');

      await supabase
        .from('Quotes')
        .update({ used: true })
        .eq('id', quotes[num]?.id);

      const nextNum = num + 1;
      setNum(nextNum);
      setQuote(quotes[nextNum]?.quote || "No quotes found");
      setAnswer(quotes[nextNum]?.movie + ' (' + quotes[nextNum]?.release_date + ')');
      setIsLoading(false);
    } else {
      //modal summary
    }
  };
  
  const handleSkipped = () => {
    setTimeout(() => {
      setSkipped(true);
    }, 100);
    setSkipped(false);
  };

  useEffect(() => {
    setIsPlaying(false);
  }, [num]);

  const handleAudioToggle = () => {
    const test = localStorage.getItem('GAME_RESPONSES')

    if(JSON.parse(test)?.length === 3) return 
    const currentAudio = audioRef.current;

    setQuote(quotes[num]?.quote || "No quotes found");
    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    setAnswer(quotes[num]?.movie + ' ' + '(' + quotes[num]?.release_date + ')');
    console.log(quotes[num]?.movie + ' ' + '(' + quotes[num]?.release_date + ')');
  }, [quotes, num]);

  return (
    <div className="game-container">
      <div className="playBtn-container">
        <img
          className="playBtn"
          src={isPlaying ? pauseBtn : playBtn}
          onClick={handleAudioToggle}
          alt=""
        />
      </div>
      <div className="quote-container">
        {quote !== '' ? (
          <>
            {isLoading && <div className="loading-animation"> <div className="lds-ripple"><div></div><div></div></div></div>}
            <p className="quote">{quote}</p>

            <div className="gameBtn-container">
              {localStorage.getItem('GAME_RESPONSES')?.length === 3 ? (
                <button disabled>
                  skip
                </button>
              ) : (
                <button onClick={handleSkipped} disabled={num === 3}>
                  skip
                </button>
              )}
            </div>
            <span>Movie {num < 3 ? num + 1 : 3}/3</span>
          </>
        ) : (
          <p className="quote">Click the play button to start. Make sure your volume 🔊 is up!</p>
        )}
        <audio ref={audioRef} src={quotes[num]?.audio} onEnded={handleAudioToggle}></audio>
      </div>
      {quote !== '' && localStorage.getItem(('GAME_RESPONSES'))?.length !== 3 && <Searchbar answer={answer} skipped={skipped} handleNextQuote={handleNextQuote} num={num} quote={quote}/>}
      <Summary isSummaryOpen={isSummaryOpen} onSummaryClose={() => setIsSummaryOpen(false)} />
    </div>
  );
};

export default Gameboard;
