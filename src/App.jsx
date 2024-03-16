import React, { useState } from 'react';
import { Button } from 'antd';
import { AudioOutlined, StopOutlined } from '@ant-design/icons';
import { ReactMediaRecorder } from "react-media-recorder";
import './App.css';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const handleRecordClick = () => {
    // Implement your record logic here
    setRecording(true);
  };

  const handleStopClick = () => {
    // Implement your stop logic here
    setRecording(false);
  };

  const handleClearHistoryClick = async () => {
    try {
      const response = await axios.get('http://localhost:8000/clear');
      if (response.statusText == 'OK') {
        toast.success('Chat history has been cleared')
      }
    } catch (error) {
      console.error(error);
    }

  };

  const handleStop = async (blobUrl, blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'myvoice.wav');
    try {
      const response = await axios.post('http://localhost:8000/talk', formData, {
        headers: {
          "Content-Type": "audio/mpeg"
        },
        responseType: "arraybuffer"
      });
      const data = response.data;
      const blobMpeg = new Blob([data], {type: 'audio/mpeg'});
      const audio = new Audio()
      audio.src = window.URL.createObjectURL(blobMpeg)
      audio.play()
    } catch (error) {
      console.error(error)
    }
  }

  return (

     <ReactMediaRecorder
      audio
      onStop={handleStop}
      render={({ status, startRecording, stopRecording }) => (
          <div className="App">
            <div className="button-container">
              <ToastContainer/>
              <Button
                  className={`record-button ${status == 'recording' ? 'active' : ''}`}
                  shape="circle"
                  icon={<AudioOutlined/>}
                  size="large"
                  onClick={startRecording}
              />
              <Button
                  className={`stop-button ${status == 'recording' ? 'active' : ''}`}
                  shape="circle"
                  icon={<StopOutlined/>}
                  size="large"
                  onClick={stopRecording}
              />
              <Button
                  className="clear-button"
                  shape="rectangle"
                  size="large"
                  onClick={handleClearHistoryClick}
              >
                Clear History
              </Button>
            </div>
            <h2>Status: {status}</h2>
          </div>
      )}
     />
  );
}

export default App;
