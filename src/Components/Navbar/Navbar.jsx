import React from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
    const [menu,setMenu]= React.useState("shop");
    const navigate=useNavigate();
  
    const handleSignup = (e) => {
      navigate(`/signup`);
    };
    const handleLogin = (e) => {
      navigate(`/login`);
    };
  return (
    <div>
      <div className='navbar'>
        <div className='nav-logo'> 
                <img src="/COWORK.png"  alt=""/>
             </div>
            <ul className='nav-menu'>
                <li onClick={()=>{setMenu("About")}}><Link style={{textDecoration:'none'}}to='/'>About</Link>{menu==="About"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Features")}}><Link style={{textDecoration:'none'}}to='/features'>Features</Link>{menu==="features"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("Support")}}><Link style={{textDecoration:'none'}}to='/support'>Support</Link>{menu==="support"?<hr/>:<></>}</li>
      
            </ul>
            <div className='nav-login-cart'>
              <Link to='/login'><button onClick={handleLogin}>Login</button></Link>
                <Link to='/signup'><button onClick={handleSignup}>Sign up</button></Link>
            </div>
            
        </div>
    </div>
  )
}

export default Navbar