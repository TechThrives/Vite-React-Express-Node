import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("${BACKEND_URL}/api/books/stats")
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <nav className="bg-gray-100 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Book Store</h1>
          <div>
            <Link to="/books" className="px-4">
              View Books
            </Link>
          </div>
        </div>
      </nav>

      <header
        className="text-center py-16 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2016/07/31/16/24/banner-1559400_960_720.jpg')`,
        }}
      >
        <h2 className="text-4xl font-bold mb-4">Welcome to Book Store</h2>
        <p className="text-lg">
          Discover your next favorite book from our collection.
        </p>
        <Link to="/books">
          <button className="mt-6 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg">
            Browse Books
          </button>
        </Link>
      </header>

      <div className="min-h-screen bg-gray-100 p-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Book Genre Statistics
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {stat.genre}
                </h3>
                <p className="text-gray-700">
                  <strong>Average Rating:</strong> {stat.averageRating}
                </p>
                <p className="text-gray-700">
                  <strong>Oldest Book:</strong> {stat.oldestBook}
                </p>
                <p className="text-gray-700">
                  <strong>Newest Book:</strong> {stat.newestBook}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
