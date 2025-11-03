import React, { useState, useEffect, useRef } from 'react';
import './StreamTimer.css'; // We'll create this file next

function StreamTimer() {
  // State for the main time in seconds (e.g., 25 minutes = 1500 seconds)
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  // State for the time input (e.g., "25:00")
  const [inputTime, setInputTime] = useState('30:00');
  // State for timer status (running or paused)
  const [isRunning, setIsRunning] = useState(false);
  // Ref to hold the interval ID without re-rendering
  const intervalRef = useRef(null);

  const [sessionName, setSessionName] = useState('Focus');

  // --- Core Timer Logic (runs when isRunning or timeInSeconds changes) ---
  useEffect(() => {
    if (isRunning && timeInSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimeInSeconds((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeInSeconds === 0 && isRunning) {
      // Timer finished!
      clearInterval(intervalRef.current);
      setIsRunning(false);
    //   alert('Time is up!'); // Simple notification
    } else {
      // Stop the interval if it's paused or stopped
      clearInterval(intervalRef.current);
    }

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeInSeconds]);

  // --- Time Formatting ---
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    // Pad with zero: 5 -> 05
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // --- Handler Functions ---

  const handleInputChange = (event) => {
    // Basic validation to keep the format M:SS or MM:SS
    let value = event.target.value;
    // Allow only digits and a single colon
    value = value.replace(/[^\d:]/g, '');
    setInputTime(value);
  };

  const parseInputTime = (timeString) => {
    const parts = timeString.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return (minutes * 60) + seconds;
    }
    return 0; // Invalid format
  };

  const handleSetTime = () => {
    clearInterval(intervalRef.current); // Stop any running timer
    setIsRunning(false);
    const newTotalSeconds = parseInputTime(inputTime);
    setTimeInSeconds(newTotalSeconds);
  };

  const handleStartPause = () => {
    if (timeInSeconds > 0) {
      setIsRunning(!isRunning); // Toggle running state
    } else {
      // If time is 0, first set the time from input before starting
      handleSetTime();
      if (parseInputTime(inputTime) > 0) {
          setIsRunning(true);
      }
    }
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeInSeconds(0);
    // Reset the input field to a common default like 25:00
    setInputTime('30:00'); 
  };

  const changeSessionName = () => {
    // sessionName === 'Focus' ? setSessionName('Break') : setSessionName('Focus');

    setSessionName((prevName) => (prevName === 'Focus' ? 'Break' : 'Focus'));

  }

  return (
    <div className="timer-container">
      <h1 onClick={changeSessionName}>{sessionName}</h1>
      <div className="time-display">
        {formatTime(timeInSeconds)}
      </div>

      <div className="input-group">
        <input
          type="text"
          value={inputTime}
          onChange={handleInputChange}
          placeholder="MM:SS"
          className="time-input"
        />
        <button onClick={handleSetTime} className="btn set-btn">
          SET TIME
        </button>
      </div>

      <div className="controls">
        <button onClick={handleStartPause} className={`btn ${isRunning ? 'pause-btn' : 'start-btn'}`}>
          {isRunning ? 'PAUSE' : timeInSeconds > 0 ? 'RESUME' : 'START'}
        </button>
        <button onClick={handleStop} className="btn stop-btn" disabled={timeInSeconds === 0 && !isRunning}>
          STOP
        </button>
      </div>

    </div>
  );
}

export default StreamTimer;