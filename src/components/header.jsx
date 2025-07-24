import React from "react";

function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "fit-content",
        minWidth: "250px",
        background: "white",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
        borderWidth: "4px",
        borderStyle: "solid",
        borderColor: "var(--accent-colour)",
        borderRadius: "0.75rem",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        zIndex: 1000,
        marginTop: "1rem",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "var(--main-colour)",
          fontSize: "1.25rem",
        }}
      >
        Gym Whisper
      </h1>
    </header>
  );
}

export default Header;