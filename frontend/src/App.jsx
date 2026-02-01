import { useState, useEffect, useRef } from 'react';
import './App.css';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import ModeSelector from './components/ModeSelector';
import Settings from './components/Settings';

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'

  // Durations in minutes
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  const audioCtxRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  useEffect(() => {
    // Update title
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.title = `${timeString} - ${mode === 'work' ? 'Work' : 'Break'} | Pomodoro`;
  }, [timeLeft, mode]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Logic when timer ends:
      if (!isAlarmPlaying) {
        startAlarm();
      }
      resetTimer(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Handle mode switching
  useEffect(() => {
    setIsRunning(false);
    stopAlarm(); // Stop alarm if switching modes
    if (mode === 'work') {
      setTimeLeft(workDuration * 60);
    } else {
      setTimeLeft(breakDuration * 60);
    }
  }, [mode, workDuration, breakDuration]);


  const playSingleChime = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // 440Hz - Standard Alert (Sharper but soothing Triangle wave)
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);

    // Smooth attack and decay (shorter pulse for looping)
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5); // Lower volume for triangle wave
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 4);
  };

  const startAlarm = () => {
    setIsAlarmPlaying(true);
    playSingleChime(); // First chime
    // Loop every 5 seconds
    alarmIntervalRef.current = setInterval(() => {
      playSingleChime();
    }, 5000);
  };

  const stopAlarm = () => {
    setIsAlarmPlaying(false);
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const startTimer = () => {
    stopAlarm(); // Ensure alarm is off when starting
    // Initialize audio context on user interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = (manual = true) => {
    setIsRunning(false);
    if (manual) stopAlarm(); // Only stop alarm on manual reset
    if (mode === 'work') {
      setTimeLeft(workDuration * 60);
    } else {
      setTimeLeft(breakDuration * 60);
    }
  };

  const handleDurationChange = (mins) => {
    if (mode === 'work') {
      setWorkDuration(mins);
      setTimeLeft(mins * 60);
    } else {
      setBreakDuration(mins);
      setTimeLeft(mins * 60);
    }
    setIsRunning(false);
  };

  return (
    <div className="container">
      <div className="timer-card glass">
        <div className="app-header">
          <h1>Focus Flow</h1>
          <p className="description">Master your time, one session at a time.</p>
        </div>

        <ModeSelector mode={mode} setMode={setMode} />

        <Settings onDurationChange={handleDurationChange} />

        <TimerDisplay timeLeft={timeLeft} />

        {isAlarmPlaying && (
          <div style={{ marginBottom: '20px', animation: 'fadeIn 0.5s' }}>
            <button
              className="control-btn"
              style={{ background: '#ff6b6b', color: 'white', border: 'none', boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)' }}
              onClick={stopAlarm}
            >
              STOP
            </button>
          </div>
        )}

        <TimerControls
          isRunning={isRunning}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
        />
      </div>
    </div>
  );
}

export default App;
