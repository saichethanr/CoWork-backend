import React, { useState } from 'react';
import './CSS/Home.css';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    // uuid creates a unique id every time when you create a new room
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error('ROOM ID & username is required');
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter=(e)=>{
    if(e.code==='Enter'){
      joinRoom();
    }
  }

  return (
    <div className='homepagewrapper'>
      <div className='formwrapper'>
        <img className="logo" src="/COWORK.png" alt="code-work-logo" />
        <form>
          <h5 className="mainlabel">Enter username</h5>
          <div className="inputGroup">
            <input
              type="text"
              className="inputBox"
              placeholder="USERNAME"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />

            <h5 className="mainlabel">Enter room id</h5>
            <input
              type="text"
              className="inputBox"
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />

            <button className="btn joinbtn" onClick={joinRoom}>
              Join
            </button>
          </div>
          <span className="createInfo">
            If you don't have an invite, then create &nbsp;
            <button className="createNewBtn" onClick={createNewRoom}>
              new room
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Home;
