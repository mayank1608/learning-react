import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);

  // Refs prevent re-renders when updating values used strictly inside logic blocks
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      // Calculate true starting point relative to performance timeline
      startTimeRef.current = performance.now() - elapsedTime;

      intervalRef.current = setInterval(() => {
        setElapsedTime(performance.now() - startTimeRef.current);
      }, 10); // Update roughly every 10ms for smooth millisecond rendering
    } else {
      clearInterval(intervalRef.current);
    }

    // Crucial cleanup function to clear interval on unmount or pause
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prevLaps) => [...prevLaps, elapsedTime]);
  };

  // Helper function to cleanly format raw milliseconds into HH:MM:SS.ms
  const formatTime = (totalMilliseconds) => {
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10); // 2 digits representation

    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  };

  return (
    <>
      <div className="stopwatch-container">
        <h1 className="stopwatch-title">React Stopwatch</h1>

        <div className="stopwatch-display">
          {formatTime(elapsedTime)}
        </div>

        <div className="stopwatch-controls">
          <button
            onClick={handleStartStop}
            className={`btn ${isRunning ? 'btn-pause' : 'btn-start'}`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="btn btn-lap"
          >
            Lap
          </button>

          <button
            onClick={handleReset}
            disabled={elapsedTime === 0}
            className="btn btn-reset"
          >
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="stopwatch-laps">
            <h3>Lap History</h3>
            <ul>
              {laps.map((lapTime, index) => (
                <li key={index}>
                  <span className="lap-number">Lap {index + 1}</span>
                  <span className="lap-time">{formatTime(lapTime)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default App
