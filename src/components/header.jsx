import React from "react";

function Header() {
  return (
    <header
      style={{
        marginLeft: "1rem",
        marginRight: "1rem",
        marginTop: "1rem",
        background: "white",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
        borderWidth: "4px",
        borderStyle: "solid",
        borderColor: "var(--accent-colour)",
        borderRadius: "0.75rem",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
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