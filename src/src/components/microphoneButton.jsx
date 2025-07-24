import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { callGeminiAPI } from '../api/llm/gemini';
import 'material-icons/iconfont/material-icons.css';

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
                const response = await callGeminiAPI(transcript)
                console.log("API Response:", response);
                console.log(workoutData)
                setWorkoutData(workoutData => [...workoutData, response.result]);
            } catch (error) {
                console.error("Error calling LLM API:", error);
            }
            setStatus("idle")
        }
    };

    const getButtonContent = () => {
        switch (status) {
            case 'idle':
                return <span className="material-icons" style={{ fontSize: "3rem" }}>mic</span>
            case 'recording':
                return <span class="material-icons">more_horiz</span>
            case 'processing':
                return <span class="material-icons">check</span>
            default:
                return <span className="material-icons" style={{ fontSize: "3rem" }}>mic</span>
        }
    };

    if (!isClient) {
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
                // Removed Tailwind className, replaced with style
                disabled={status === 'processing'}
                style={{
                    ...styles.button,
                    backgroundColor:
                        status === 'idle'
                            ? '#A0A0A0'
                            : status === 'recording'
                            ? '#FFD700'
                            : status === 'processing'
                            ? '#4ADE80'
                            : '#A0A0A0',
                    boxShadow:
                        status === 'recording'
                            ? '0 0 0 8px rgba(250, 204, 21, 0.2)'
                            : status === 'processing'
                            ? '0 0 0 8px rgba(74, 222, 128, 0.2)'
                            : '0 2px 12px rgba(0,0,0,0.08)',
                    outline: status === 'recording' ? '2px solid #facc15' : 'none',
                    border: status === 'processing' ? '2px solid #4ADE80' : 'none',
                    opacity: status === 'processing' ? 0.7 : 1,
                }}>
                {getButtonContent()}
            </button>

            <p style={{textAlign: 'center', fontSize: 18, marginTop: 16, color: '#222'}}>{transcript}</p>

            {(() => {
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