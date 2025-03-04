import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <h1 className="text-3xl font-bold mb-4">Page Not Found!!!</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
