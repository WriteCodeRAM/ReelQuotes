import React, { useState, useEffect } from 'react';
import playBtn from '../images/playBtn.png';
import pauseBtn from '../images/pause.png';
import Searchbar from './Searchbar';
import { supabase } from '../client';
import { useRef } from 'react';
import Summary from './Summary';
import Tutorial from './Tutorial';

const Gameboard = ( {timer}) => {
  const [quote, setQuote] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [answer, setAnswer] = useState('');
  const [skipped, setSkipped] = useState(false);
  const [num, setNum] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [UUID, setUUID] = useState(localStorage.getItem('UUID'));

  const audioRef = useRef(null);

  useEffect(() => {
    const handlePlayClick = async () => {
      const storedResponses = JSON.parse(localStorage.getItem('GAME_RESPONSES'));
      const storedNum = JSON.parse(localStorage.getItem('STORED_NUM'));
      if (storedResponses && storedNum === 3) {
        setQuotes([]);
        
      } else if (storedNum >= 1 && storedNum < 3) {
        const filteredData = JSON.parse(localStorage.getItem('FILTERED_DATA'));
        setQuotes(filteredData);
        setNum(storedNum);
        setQuote(filteredData[storedNum].quote);
      } else {
        try {
          const { data } = await supabase.from('Quotes').select('*');
          const filteredData = data.filter((x) => x.used === false).slice(0, 3);

          setQuotes(filteredData);
          window.localStorage.setItem('FILTERED_DATA', JSON.stringify(filteredData));
          window.localStorage.setItem('GAME_OVER', JSON.stringify(false));

          window.localStorage.setItem('STORED_NUM', JSON.stringify(num));
          window.localStorage.setItem('STORED_SCORE', JSON.stringify(num));
        } catch (error) {
          console.error(error);
        }
      }
    };

    handlePlayClick();
  }, []);

  useEffect(() => {
    const gameIsOverData = JSON.parse(localStorage.getItem('GAME_RESPONSES'));
    if (gameIsOverData?.length === 3) {
      setIsSummaryOpen(true);
    }
  }, []);

  const handleNextQuote = () => {
    if (num < 3) {
   

        setIsLoading(true);
        setQuote('New quote loading :)');
  

      setTimeout(()=> {

        const nextNum = num + 1;
        setNum(nextNum);
        setQuote(quotes[nextNum]?.quote || 'No quotes found');
        setAnswer(quotes[nextNum]?.movie + ' (' + quotes[nextNum]?.release_date + ')');
        setIsLoading(false);
      }, 400)
    } else {
      setIsSummaryOpen(true);
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
    const test = localStorage.getItem('GAME_RESPONSES');

    if (JSON.parse(test)?.length === 3) return;
    const currentAudio = audioRef.current;

    setQuote(quotes[num]?.quote || 'No quotes found');
    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    setAnswer(quotes[num]?.movie + ' ' + '(' + quotes[num]?.release_date + ')');

  }, [quotes, num]);

  const handleUUIDSubmit = (submittedUUID) => {
    setUUID(submittedUUID);
    localStorage.setItem('UUID', submittedUUID);
  };

  return (
    <div className="game-container">
      {!UUID && <Tutorial onUUIDSubmit={handleUUIDSubmit} />}
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
            {isLoading && (
              <div className="loading-animation">
                <div className="lds-ripple">
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            <p className="quote">{quote}</p>

            <div className="gameBtn-container">
              {localStorage.getItem('GAME_RESPONSES')?.length === 3 ? (
                <button disabled>skip</button>
              ) : (
                <button onClick={handleSkipped} disabled={num === 3} className='skip-btn'>
                  skip
                </button>
              )}
            </div>
            <span>Movie {num < 3 ? num + 1 : 3}/3</span>
          </>
        ) : ( localStorage.getItem('STORED_NUM') !== '3' && (
          <p className="quote">
            Click the play button to start. Make sure your volume{' '}
            <span role="img" aria-label="volume">
              🔊
            </span>{' '}
            is up!
          </p> )  || (
          
          <h3>
                New game of Reel<span>Quotes</span> available in: <span>{timer}</span>
              </h3>
          )
        )}
        <audio ref={audioRef} src={quotes[num]?.audio} onEnded={handleAudioToggle}></audio>
      </div>
      {quote !== '' && localStorage.getItem('GAME_RESPONSES')?.length !== 3 && ( 
      <Searchbar answer={answer} skipped={skipped} handleNextQuote={handleNextQuote} num={num} quote={quote} timer={timer} />
      )}
      <Summary isSummaryOpen={isSummaryOpen} onSummaryClose={() => setIsSummaryOpen(false)} timer={timer} />
    </div>
  );
};

export default Gameboard;
