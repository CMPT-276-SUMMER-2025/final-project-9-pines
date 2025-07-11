import React, {useState} from 'react';
import check_icon from '../assets/check_icon.png';
import mic_icon from '../assets/mic_icon.png';
import pending_icon from '../assets/pending_icon.png';  


const MicrophoneButton = () =>{
    const [status,setStatus] = useState('idle');  
    const handleClick =()=>
    {
        if(status==='idle')
        {
            console.log('Started recording');
            setStatus('recording');
        }
        else if(status==='recording')
        {
            console.log('Stopped recording');
            setStatus('processing');
            setTimeout(()=>{
                console.log('Processing complete');
                setStatus('idle');
            }, 3000);
        }
    };

    const getButtonContent=()=>
    {
        switch(status)
        {
            case 'idle':
                return <img src={mic_icon} alt="Microphone Icon" style={styles.icon} />;
            case 'recording':
                return <img src={pending_icon} alt="Recording ..." style={styles.icon} />;
            case 'processing':
                return <img src={check_icon} alt="Check Icon" style={styles.icon} />;
            default:
                return <img src={mic_icon} alt="Microphone Icon" style={styles.icon} />;
        }
    };

    return(
        <button 
            onClick={handleClick} 
            className={`mic-button ${status}`}
            disabled={status === 'processing'}
            style={styles.button}>
            {getButtonContent()}
            </button>
        
    );
};

const styles={
    button:{
        position: 'absolute',
        width: 437,
        height: 437,
        left: -220,
        top: 55,
        backgroundColor: '#A0A0A0',
        borderRadius: 29,
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',

    },
    icon:{
        width: 60,
        height: 60,
    }
};

export default MicrophoneButton;