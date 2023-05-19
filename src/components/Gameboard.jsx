import React from "react";
import playBtn from '../images/playBtn.png';
import pauseBtn from '../images/pause.png';
import Searchbar from "./Searchbar";
import { supabase } from "../client";
import { useState, useRef, useEffect } from "react";

const Gameboard = () => {
  const [quote, setQuote] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [answer, setAnswer] = useState('');
  const [skipped, setSkipped] = useState(false);
  const [num, setNum] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); 
  const audioRef = useRef(null);

  useEffect(() => {
    const handlePlayClick = async () => {
      try {
        const { data } = await supabase.from('Quotes').select('*');
        setQuotes(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };

    handlePlayClick();
  }, []);


  const handleNextQuote = () => {
    // handleSkipped();
    if(num < 3){

    
    const nextNum = num + 1;
    setNum(nextNum);
    setQuote(quotes[nextNum]?.quote || "No quotes found");
    setAnswer(quotes[nextNum]?.movie + ' (' + quotes[nextNum]?.release_date + ')');
    } else {
        //modal summary
    }
  };
  

  //CURRENT OBJECTIVE IS TO MAKE SURE THE MODAL IS DISPLAYED WHEN THE USER HITS THE SKIP BUTTON 
  //handleNextQuote in Searchbar is causing unlimited skips
  //may have to find a new dependency or something
  //watching out
  const handleSkipped = () => {
    setTimeout(() => {
        setSkipped(true);

    }, 100)

    setSkipped(false)

  };

  useEffect(() => {
    setIsPlaying(false)
  }, [num])
  

  const handleAudioToggle = () => {
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
    console.log(quotes[num]?.movie + ' ' + '(' + quotes[num]?.release_date + ')')
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
            <p className="quote">{quote}</p>
            <div className="gameBtn-container">
              <button onClick={handleSkipped} disabled={num === 3}>
                skip
              </button>
            </div>
            <span>Movie {num < 3 ? num + 1 : 3}/3</span>
          </>
        ) : (
          <p className="quote">Click the play button to start. Make sure your volume 🔊 is up!</p>
        )}
        <audio ref={audioRef} src={quotes[num]?.audio} onEnded={handleAudioToggle}></audio>
      </div>
      {quote !== '' && <Searchbar answer={answer} skipped={skipped} handleNextQuote={handleNextQuote} num={num} quote={quote}/>
}
    </div>
  );
};

export default Gameboard;