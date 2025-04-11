import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-[#1e1f25] flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="text-gray-400 mb-6 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition duration-200"
      >
        Go to Home
      </button>
    </div>
  );
}
