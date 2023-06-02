import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './client'
import Nav from './components/Nav'
import Gameboard from './components/Gameboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Leaderboard from './components/Leaderboards'
import About from './components/About'
import Suggestion from './components/Suggestion'

function App() {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const timeLeft = midnight - now;

      // Calculate the remaining hours, minutes, and seconds
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);

      return {
        hours: hours < 10 ? `0${hours}` : hours,
        minutes: minutes < 10 ? `0${minutes}` : minutes,
        seconds: seconds < 10 ? `0${seconds}` : seconds,
      };
    };

    const updateTimer = async () => {
      const time = calculateTimeLeft();
      setTimer(`${time.hours}:${time.minutes}:${time.seconds}`);

      if (time.hours == '00' && time.minutes == '00' && time.seconds == '00') {
    
        const filteredData = JSON.parse(localStorage.getItem('FILTERED_DATA'));
        if (filteredData) {
          const firstThreeItems = filteredData.slice(0, 3);
          const updatePromises = firstThreeItems.map((item) =>
            supabase.from('Quotes').update({ used: true }).eq('id', item.id)
          );


         
    
          Promise.all(updatePromises)
            .then(() => {
              // Clear the local storage
              localStorage.removeItem('GAME_RESPONSES');
              localStorage.removeItem('GAME_IS_OVER');
              localStorage.removeItem('STORED_NUM');
              localStorage.removeItem('FILTERED_DATA');
              // Reload the page to reset the game
              // window.location.reload();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } else {
        setTimeout(updateTimer, 1000);
      }
    };

    updateTimer();
  }, []);
 
  return (
    <>
    <Router>

    <Nav/> 
    <Routes>
    <Route  path="/home" element={<Gameboard/>} />
    <Route  path="/" element={<Gameboard timer={timer}/>} />
    <Route  path="/about" element={<About/>} />
    <Route  path="/leaderboard" element={<Leaderboard timer={timer}/>} />
    <Route  path="/suggest" element={<Suggestion/>} />
    </Routes>
    </Router>


    </>
  )
     
}

export default App
