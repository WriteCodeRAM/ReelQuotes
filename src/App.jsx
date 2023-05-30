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

      if (time.hours == '21' && time.minutes == '37' && time.seconds == '00') {
    
        const gameScore = JSON.parse(localStorage.getItem('GAME_RESPONSES'));
        let score = 0;
        const filteredData = JSON.parse(localStorage.getItem('FILTERED_DATA'));
        if (filteredData) {
          const firstThreeItems = filteredData.slice(0, 3);
          const updatePromises = firstThreeItems.map((item) =>
            supabase.from('Quotes').update({ used: true }).eq('id', item.id)
          );

          gameScore.forEach((x) => {
            score += x.score;
          });

          const userUUID = localStorage.getItem('UUID');

         
    
          Promise.all(updatePromises)
            .then(() => {
              supabase
  .from('Users')
  .select('score')
  .eq('UUID', userUUID)
  .then((response) => {
    // Retrieve the current score value
    const currentScore = response.data[0].score;
    
    // Add the local score variable to the current score
    const updatedScore = currentScore + score;
    
    // Update the 'score' column in the Supabase table
    supabase
      .from('Users')
      .update({ score: updatedScore })
      .eq('UUID', userUUID)
      .then((response) => {
        console.log('Score updated successfully');
      })
      .catch((error) => {
        console.error('Error updating score:', error);
      });
  })
  .catch((error) => {
    console.error('Error retrieving current score:', error);
  });
            })
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
