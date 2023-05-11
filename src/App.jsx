import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { supabase } from './client'
import Nav from './components/Nav'
import Gameboard from './components/Gameboard'

function App() {
  // const [quotes, setQuotes] = useState([])

  // useEffect(() => {
  //    async function fetchQuotes(){
  //     const {data} = await supabase.from('Quotes').select()
      
  //     setQuotes(data)

  //     console.log(data)
  //    }
  //    fetchQuotes()
  // }, [])

  return (
    <>
    <Nav/> 
    <Gameboard/> 
    </>
  )
     
}

export default App
