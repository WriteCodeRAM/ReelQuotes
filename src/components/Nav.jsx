import hamburger from  '../images/icons8-menu-30.png'
import settings from '../images/settings.png'
import logo from '../images/logo.png'
import {React, useState} from 'react'


const Nav = () => {

    const [open, isOpen] = useState(false)

    return (
       <nav>
        <button><img src={hamburger} alt="" /></button>

        <div className="logo-container">

        <h1 className='logo-text'>Reel<span>Quotes</span></h1>
       <img className="logo-img" src={logo} alt="" />
        </div>

        <button className='test'><img src={settings} alt="" /></button>

       </nav>
    )
}


export default Nav