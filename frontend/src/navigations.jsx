import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Gallery from "./Gallery";
import App from "./App";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Navigation() {
  return (
    
    <Router>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/gallery" element={<Gallery/>} />
      </Routes>
    </Router>
  );
}
export default Navigation;
