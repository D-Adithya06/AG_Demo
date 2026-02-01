function ModeSelector({ mode, setMode }) {
    return (
        <div className="mode-selector">
            <button
                id="work-btn"
                className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
                onClick={() => setMode('work')}
            >
                Work
            </button>
            <button
                id="break-btn"
                className={`mode-btn ${mode === 'break' ? 'active' : ''}`}
                onClick={() => setMode('break')}
            >
                Break
            </button>
        </div>
    );
}

export default ModeSelector;
