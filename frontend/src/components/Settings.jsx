import { useState } from 'react';

function Settings({ onDurationChange }) {
    const [customVal, setCustomVal] = useState('');

    const handlePreset = (mins) => {
        onDurationChange(mins);
        setCustomVal('');
    };

    const handleCustomChange = (e) => {
        const val = e.target.value;
        setCustomVal(val);
    };

    const handleCustomSubmit = (e) => {
        if (e.key === 'Enter') {
            const mins = parseInt(customVal);
            if (mins > 0) {
                onDurationChange(mins);
            }
            e.target.blur();
        }
    };

    return (
        <div className="duration-controls">
            <span className="duration-label">Set Duration:</span>
            <div class="presets">
                <button className="preset-btn" onClick={() => handlePreset(25)}>25m</button>
                <button className="preset-btn" onClick={() => handlePreset(45)}>45m</button>
                <button className="preset-btn" onClick={() => handlePreset(60)}>60m</button>
            </div>
            <div className="custom-input">
                <input
                    type="number"
                    placeholder="Custom"
                    min="1"
                    max="180"
                    value={customVal}
                    onChange={handleCustomChange}
                    onKeyDown={handleCustomSubmit}
                />
                <span className="unit">min</span>
            </div>
        </div>
    );
}

export default Settings;
