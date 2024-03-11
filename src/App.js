import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from "./Pages/Home.jsx";
import EditorPage from "./Pages/EditorPage.jsx";
import Homepage from './Pages/homepage.jsx';
import {Toaster} from 'react-hot-toast'
import SignUp from './Pages/SignUp.jsx';
import Login from './Pages/Login.jsx';
function App() {
  return (
    <>
    <div>
      <Toaster position="top-right" toastOptions={{
        success:{
          theme:{
            primary:'#4ae088',
          },
        },
      }}></Toaster>
    </div>
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage/>}></Route>
      <Route path="/join" element={<Home/>}></Route>
      <Route path="/editor/:roomId" element={<EditorPage/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
