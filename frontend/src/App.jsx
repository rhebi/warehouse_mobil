import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home.jsx";
import Signup from "./pages/signup.jsx";
import About from "./pages/about.jsx";
import Car from "./pages/car.jsx";
import Contact from "./pages/contact.jsx";
import Login from "./pages/login.jsx";
import LayoutHeader from "./component/LayoutHeader.jsx";
import Dashboard from "./pages/dashboard_manager.jsx";

function App() {
  return (
    <Routes>
      {/* Routes dengan header */}
      <Route element={<LayoutHeader />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/car" element={<Car />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboardManager" element={<Dashboard />} />
      </Route>

      {/* Routes tanpa header */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Redirect selain itu */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
