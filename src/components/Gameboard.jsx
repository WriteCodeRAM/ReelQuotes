import React from "react"
import playBtn from '../images/playBtn.png'
import Searchbar from "./Searchbar"
import { useState } from "react"



const Gameboard = ({maybe}) => { 

    const [quote, setQuote] = useState("Quotes will appear here.")


    return (
        <div className="game-container">
 
            <div className="playBtn-container">

            <img className="playBtn" src={playBtn} alt="" />


            </div>
            <div className="quote-container">
                <p className="quote">"{quote}"</p>
                <button>hint</button>
                <span>Movie 1/3</span>
            </div>

        <Searchbar/>
        </div>
    )
}


export default Gameboard