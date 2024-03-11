import { useState, useRef, useEffect } from 'react';
import Client from '../Components/Client';
import './CSS/Editorpage.css';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { useLocation , useNavigate, Navigate,useParams} from 'react-router-dom';
import { initSocket } from '../socket';
import {Box} from "@chakra-ui/react";
import CodeEditor from '../Components/CodeEditor';
const EditorPage = () => {
  const [clients, setClients] = useState([]);

  

  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();

  function handleErrors(e) {
    console.log('socket error', e);
    toast.error('Socket connection failed, try again later.');
    reactNavigator('/');
}

  useEffect(() => {
    const init = async () => {
      
      const socket = await initSocket();
      socketRef.current = socket;
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

  
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined the room`);
        }
        console.log(clients);
        setClients(clients);
      });
    };
    init();
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainwrap">
      <div className="aside">
        <div className="asideInner">
          <h4>Collaborators</h4>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>
      <Box minH="100vh" zIndex={1000} bg="#0f0a19" color="gray.500" px={6} py={8}>
        <CodeEditor socketRef = {socketRef} roomId = {roomId}/>
      </Box>
    </div>
  );
};

export default EditorPage;
