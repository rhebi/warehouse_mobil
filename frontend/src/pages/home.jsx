import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";


const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/token", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Unauthorized");
        const data = await response.json();
        setUser({
          name: data.name,
          email: data.email,
        });
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "DELETE",
        credentials: "include",
      });
      setUser(null);
      navigate("/");
    } catch (err) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden font-[Poppins]">
      <main className="main-container">
        <section className="hero-section relative w-full h-screen overflow-hidden">
          <img
            src="/img/chiron.jpg" 
            alt="Bugatti Chiron"
            className="w-full h-full object-cover"
          />
          <div className="overlay absolute top-0 left-0 w-full h-full flex flex-col justify-between items-start px-10 py-10 bg-black/60">
            <div>
              <h1 className="text-4xl italic font-semibold text-white">
                The Future Of Luxury
              </h1>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-3xl italic font-medium text-white self-end mt-auto">
                Driving and Fast
              </p>
              {user && (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer bg-black/90 text-center py-2 fixed bottom-0 left-0 w-full z-10">
        <p className="copyright text-xs text-white">
          © 2025 Ronaldo Luxury Car
        </p>
      </footer>
    </div>
  );
};

export default Home;