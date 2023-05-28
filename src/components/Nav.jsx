import hamburger from '../images/icons8-menu-30.png';
import settings from '../images/settings.png';
import logo from '../images/logo.png';
import leaderboardIcon from '../images/leaderboard.png';
import about from '../images/about.png';
import submit from '../images/submit.png';
import { React, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SettingsModal from './SettingsModal';

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleMenuClick = (event) => {
    event.stopPropagation(); // Stop event propagation to prevent closing the menu immediately
    setOpen(!open);
  };

  return (
    <nav>
      <button onClick={handleMenuClick}>
        <img src={hamburger} alt="Menu" />
      </button>

      <ul ref={navRef} className={`nav-links ${open ? 'open' : ''}`}>
        <li className="nav-link">
          <Link to="/about" onClick={() => setOpen(false)}>
            {' '}
            About <img src={about} alt="" />
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/leaderboard" onClick={() => setOpen(false)}>
            Leaderboard <img src={leaderboardIcon} alt="" />
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/suggest" onClick={() => setOpen(false)}>
            Submit Suggestions <img src={submit} alt="" />
          </Link>
        </li>
      </ul>

      <Link to={'/'}>
        <div className="logo-container" onClick={() => setOpen(false)}>
          <h1 className="logo-text">
            Reel<span>Quotes</span>
          </h1>
          <img className="logo-img" src={logo} alt="Logo" />
        </div>
      </Link>
      <button className="test" onClick={() => setSettingsOpen(true)}>
        <img src={settings} alt="Settings"  />
        <SettingsModal settingsOpen={settingsOpen} setSettingsOpen={setSettingsOpen} />
      </button>
      
    </nav>
  );
};

export default Nav;
