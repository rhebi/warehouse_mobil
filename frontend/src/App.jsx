import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import Home from "./component/home.jsx";
import Signup from "./component/signup.jsx";
import About from "./component/about.jsx";
import Car from "./component/car.jsx";
import Contact from "./component/contact.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/car" element={<Car />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

