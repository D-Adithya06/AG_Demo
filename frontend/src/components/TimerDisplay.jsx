function TimerDisplay({ timeLeft }) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-display" id="timer">
            {formatTime(timeLeft)}
        </div>
    );
}

export default TimerDisplay;
