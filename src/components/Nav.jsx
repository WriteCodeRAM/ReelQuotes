import hamburger from '../images/icons8-menu-30.png';
import settings from '../images/settings.png';
import logo from '../images/logo.png';
import leaderboardIcon from '../images/leaderboard.png';
import about from '../images/about.png';
import submit from '../images/submit.png';
import { React, useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <button onClick={() => setOpen(!open)}>
        <img src={hamburger} alt="Menu" />
      </button>

      <ul className={`nav-links ${open ? 'open' : ''}`}>
        <li className="nav-link">
          <Link to="/about" onClick={()=> setOpen(false)}> About <img src={about} alt="" /></Link>
        </li>
        <li className="nav-link">
        <Link to="/leaderboard" onClick={()=> setOpen(false)}>Leaderboard <img src={leaderboardIcon} alt="" /></Link>
        </li>
        <li className="nav-link">
        <Link to="/suggest" onClick={()=> setOpen(false)} >Submit Suggestions <img src={submit} alt="" /></Link>
        </li>
      </ul>

<Link to={'/'}>
      <div className="logo-container">
        <h1 className="logo-text">
          Reel<span>Quotes</span>
        </h1>
        <img className="logo-img" src={logo} alt="Logo" />
      </div>
      </Link>
      <button className="test">
        <img src={settings} alt="Settings" />
        {/* change username
        can only change username once per month 
        /Found a bug? submit your findings   */}
      </button>
    </nav>
  );
};

export default Nav;
