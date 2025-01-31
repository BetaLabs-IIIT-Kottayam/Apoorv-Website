import React from 'react';
import loader from "../assets/loader.png"

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="relative w-80 h-80">
        <img
          src={loader}
          alt="Loader"
          className="w-full h-full object-cover opacity-100 animate-fade"
        />
      </div>
    </div>
  );
};

export default Loader;