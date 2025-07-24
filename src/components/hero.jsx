import React from "react";
import MicrophoneButton from "./microphoneButton";

export default function Hero(){

   function callApi(prompt){
        //api call POST with prompt
        alert(prompt)
        //response: {workoutTpye,}
    }
    
    return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#f9fafb", // Tailwind's bg-gray-50
        flexDirection: "column"
      }}
    >
        <h1
          style={{
            fontSize: "2.25rem", // Tailwind's text-4xl
            fontWeight: "bold",
            textAlign: "center",
            color: "#1f2937", // Tailwind's text-gray-800
            marginBottom: "2rem"
          }}
        >
            GYM WHISPER
        </h1>
        
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <MicrophoneButton />
        </div>
    </div>
);

}
