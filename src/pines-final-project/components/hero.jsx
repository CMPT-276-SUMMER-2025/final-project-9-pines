'use client';
import React from "react";
import MicrophoneButton from "./microphoneButton";

export default function Hero(){

   function callApi(prompt){
        //api call POST with prompt
        alert(prompt)
        //response: {workoutTpye,}
    }
    
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-center text-gray-800">
            GYM WHISPER
        </h1>
        
        <div className="relative w-full flex justify-center"><MicrophoneButton /></div>
    </div>
);

}
