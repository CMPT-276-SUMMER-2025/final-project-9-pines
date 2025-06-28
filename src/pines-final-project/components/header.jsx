import React from "react";

const Header = () => {
  return (
    <header className="mx-4 mt-4 bg-white shadow-md border-4 border-[var(--accent-colour)] rounded-xl py-6 px-4 sm:mx-6 sm:mt-6 md:mx-10 md:mt-8">
      <h1 className="text-center font-bold text-[var(--main-colour)] text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        Gym Whisper
      </h1>
    </header>
  );
};

export default Header;