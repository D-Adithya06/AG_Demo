function TimerControls({ isRunning, onStart, onPause, onReset }) {
    return (
        <div className="controls">
            {!isRunning ? (
                <button id="start-btn" className="control-btn primary" onClick={onStart}>
                    Start
                </button>
            ) : (
                <button id="pause-btn" className="control-btn secondary" onClick={onPause}>
                    Pause
                </button>
            )}
            <button id="reset-btn" className="control-btn secondary" onClick={onReset}>
                Reset
            </button>
        </div>
    );
}

export default TimerControls;
