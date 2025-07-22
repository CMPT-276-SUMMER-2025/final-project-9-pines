'use client';
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const MicrophoneButton = () => {
    const [status, setStatus] = useState('idle');
    const [isClient, setIsClient] = useState(false);
    const [workoutData, setWorkoutData]= useState([]);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleClick = async () => {
        if (status === 'idle') {
            setStatus('recording');
            SpeechRecognition.startListening()
        } else if (status === 'recording') {
            SpeechRecognition.stopListening()
            console.log(transcript)
            console.log("processing")
            setStatus('processing');
            try {
                // Use the correct path for Next.js app directory API routes
                const response = await fetch('/api/llm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: transcript })
                });
                const data = await response.json();
                console.log("API Response:", data);
                console.log(workoutData)
                setWorkoutData(workoutData => [...workoutData, data.result]);
                // You can display the result to the user here if desired
            } catch (error) {
                console.error("Error calling LLM API:", error);
            }
            setStatus("idle")
        }
    };

    const getButtonContent = () => {
        switch (status) {
            case 'idle':
                return <img src="/assets/mic_icon.png" alt="Microphone Icon" style={styles.icon} />;
            case 'recording':
                return <img src="/assets/pending_icon.png" alt="Recording ..." style={styles.icon} />;
            case 'processing':
                return <img src='/assets/check_icon.png' alt="Check Icon" style={styles.icon} />;
            default:
                return <img src="/assets/mic_icon.png" alt="Microphone Icon" style={styles.icon} />;
        }
    };

    if (!isClient) {
        // Render nothing or a loading spinner until client-side hydration
        return null;
    }

    if (!browserSupportsSpeechRecognition) {
        return (
            <div>
                <h1>Your browser does not support speech recognition</h1>
            </div>
        );
    }
    if (!isMicrophoneAvailable) {
        // Render some fallback content
        return(
            <div>
                <h1>Please give microphone permission</h1>
            </div>
        )
      }

    return (
        <div>
            <button
                onClick={handleClick}
                className={`mic-button ${status}`}
                disabled={status === 'processing'}
                style={styles.button}>
                {getButtonContent()}
            </button>

            <p>{transcript}</p>

            {/*
                Example workoutData:
                const workoutData = [
                    'BenchPress,20,180lbs',
                    'PushUps,30,0lbs',
                    'LateralRaises,12,15lbs'
                ];
            */}
            {(() => {
                // You can replace this with a prop or state variable as needed
                //

                return (
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <table style={{
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            minWidth: 350,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            borderRadius: 16,
                            overflow: 'hidden',
                            background: '#fff'
                        }}>
                            <thead>
                                <tr style={{ background: '#f5f5f7' }}>
                                    <th style={{
                                        padding: '16px 24px',
                                        fontWeight: 600,
                                        fontSize: 18,
                                        color: '#222',
                                        borderBottom: '2px solid #e5e7eb',
                                        textAlign: 'left'
                                    }}>WorkoutType</th>
                                    <th style={{
                                        padding: '16px 24px',
                                        fontWeight: 600,
                                        fontSize: 18,
                                        color: '#222',
                                        borderBottom: '2px solid #e5e7eb',
                                        textAlign: 'left'
                                    }}>Reps</th>
                                    <th style={{
                                        padding: '16px 24px',
                                        fontWeight: 600,
                                        fontSize: 18,
                                        color: '#222',
                                        borderBottom: '2px solid #e5e7eb',
                                        textAlign: 'left'
                                    }}>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workoutData.map((csv, idx) => {
                                    let workoutType = '', reps = '', weight = '';
                                    if (typeof csv === 'string') {
                                        [workoutType, reps, weight] = csv.split(',');
                                    } else if (Array.isArray(csv)) {
                                        [workoutType, reps, weight] = csv;
                                    }
                                    return (
                                        <tr key={idx}>
                                            <td style={{
                                                padding: '14px 24px',
                                                borderBottom: '1px solid #f0f0f0',
                                                fontSize: 16,
                                                color: '#444'
                                            }}>{workoutType}</td>
                                            <td style={{
                                                padding: '14px 24px',
                                                borderBottom: '1px solid #f0f0f0',
                                                fontSize: 16,
                                                color: '#444'
                                            }}>{reps}</td>
                                            <td style={{
                                                padding: '14px 24px',
                                                borderBottom: '1px solid #f0f0f0',
                                                fontSize: 16,
                                                color: '#444'
                                            }}>{weight}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })()}
            </div>

    );
};

const styles = {
    button: {
        width: 437,
        height: 437,
        backgroundColor: '#A0A0A0',
        borderRadius: 29,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        margin: '0 auto',
    },
    icon: {
        width: 60,
        height: 60,
    }
};

export default MicrophoneButton;