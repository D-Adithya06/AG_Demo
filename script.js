// Initial Durations
let workDuration = 25 * 60;
let breakDuration = 5 * 60;

let timeLeft = workDuration;
let timerInterval = null;
let isWorkMode = true;

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playZenChime() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // 528Hz - Solfeggio frequency (Miracle tone/Love frequency)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(528, audioCtx.currentTime);

    // Smooth attack and decay (bell envelope)
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 3); // Decay

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 3);
}

// DOM Elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const workBtn = document.getElementById('work-btn');
const breakBtn = document.getElementById('break-btn');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    const mode = isWorkMode ? 'Work' : 'Break';
    document.title = `${formatTime(timeLeft)} - ${mode} | Pomodoro`;
}

function startTimer() {
    if (timerInterval) return;

    // Ensure audio context is ready (browser policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    startBtn.disabled = true;
    pauseBtn.disabled = false;

    // Add pulsing effect to timer when active
    timerDisplay.style.opacity = '1';

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            playZenChime();
            // alert(isWorkMode ? 'Work session complete! Take a break.' : 'Break over! Back to work.');
            resetTimer(false); // Reset but don't clear mode
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer(manual = true) {
    pauseTimer();
    // Reset to the *current* set duration for that mode
    timeLeft = isWorkMode ? workDuration : breakDuration;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function switchMode(mode) {
    isWorkMode = mode === 'work';

    // Update UI
    if (isWorkMode) {
        workBtn.classList.add('active');
        breakBtn.classList.remove('active');
        timeLeft = workDuration;
    } else {
        breakBtn.classList.add('active');
        workBtn.classList.remove('active');
        timeLeft = breakDuration;
    }

    // Stop timer and reset display on mode switch
    pauseTimer();
    updateDisplay();
    startBtn.disabled = false;
}

function setCustomTime(minutes) {
    if (!minutes || minutes <= 0) return;

    if (isWorkMode) {
        workDuration = minutes * 60;
        timeLeft = workDuration;
    } else {
        breakDuration = minutes * 60;
        timeLeft = breakDuration;
    }

    pauseTimer();
    updateDisplay();
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', () => resetTimer(true));

workBtn.addEventListener('click', () => switchMode('work'));
breakBtn.addEventListener('click', () => switchMode('break'));

// Duration Controls
const presetBtns = document.querySelectorAll('.preset-btn');
const customInput = document.getElementById('custom-time');

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mins = parseInt(btn.dataset.time);
        setCustomTime(mins);
        customInput.value = ''; // Clear custom input when using preset
    });
});

customInput.addEventListener('change', () => {
    const mins = parseInt(customInput.value);
    setCustomTime(mins);
});

customInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const mins = parseInt(customInput.value);
        setCustomTime(mins);
        customInput.blur();
    }
});

// Initialize
updateDisplay();
