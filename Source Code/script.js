/**
 * Project: Math Sprint Game
 * File: script.js
 * Date: February 17, 2026
 * Description: Core game logic, timer handling, score calculation, and DOM manipulation.
 * 
 * Created by: Ashwini Jaiswal & Sharmishtha Khairmode
 * Repository: https://github.com/Amey-Thakur/MATH-SPRINT-GAME
 * License: MIT
 */

// =========================================
//   CONSOLE EASTER EGG 🏃‍♂️
// =========================================
console.log(
    "%c🏃🏻‍♂️ Math Sprint Game",
    "font-size: 24px; font-weight: bold; color: #8b5cf6; text-shadow: 2px 2px 0 #1e1b4b;"
);
console.log(
    "%c➕➖✖️➗ Race against time with math equations!",
    "font-size: 14px; color: #64748b;"
);
console.log(
    "%c🎮 Developed by Ashwini Jaiswal & Sharmishtha Khairmode",
    "font-size: 12px; color: #22c55e;"
);
console.log(
    "%c🔗 https://github.com/Amey-Thakur/MATH-SPRINT-GAME",
    "font-size: 12px; color: #2563eb;"
);
console.log(
    "%c⚠️ This game is protected. Please respect the authors' work!",
    "font-size: 12px; color: #f59e0b; font-weight: bold;"
);

// =========================================
//   SECURITY MEASURES 🔒
// =========================================
(function initSecurity() {
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    document.addEventListener('dragstart', function (e) { e.preventDefault(); });
    document.addEventListener('selectstart', function (e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || (e.ctrlKey && e.key === 'u')) e.preventDefault();
    });
})();
// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
const shareBtn = document.querySelector('.share-btn');
const levelGrid = document.getElementById('level-grid');
const hintButton = document.getElementById('hint-button');
const hintMessage = document.getElementById('hint-message');
const dailyChallengeButton = document.getElementById('daily-challenge');
const nextLevelButton = document.getElementById('next-level-button');

// Equations
// Game Logic: State Variables
// These variables track the application state including scoring, timer, 
// and the mathematical equations generated for the current session.
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Timer Variables
// Precision tracking using 0.1s intervals.
let timer;
let timePlayed = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';
let gameMode = 'quick';
let selectedLevel = 1;
let streak = 0;
let streakBonusCoins = 0;
let runHints = 0;
let lastRunAccuracy = 0;
let dailyRunDate = '';
let hintUsedForQuestion = false;

const levelDefinitions = [
    { name: 'Number Explorer', tier: 'Beginner', operations: ['add'], range: 10 },
    { name: 'Make Ten', tier: 'Beginner', operations: ['add'], range: 20 },
    { name: 'Subtraction Steps', tier: 'Beginner', operations: ['subtract'], range: 20 },
    { name: 'Mixed Foundations', tier: 'Beginner', operations: ['add', 'subtract'], range: 30 },
    { name: 'Times-Table Trail', tier: 'Rookie', operations: ['multiply'], range: 10 },
    { name: 'Division Dash', tier: 'Rookie', operations: ['divide'], range: 12 },
    { name: 'Operation Mix', tier: 'Rookie', operations: ['add', 'subtract', 'multiply', 'divide'], range: 14 },
    { name: 'Fraction Foundations', tier: 'Rookie', operations: ['fraction'], range: 12 },
    { name: 'Fraction Sprint', tier: 'Intermediate', operations: ['fraction'], range: 16 },
    { name: 'Fraction Mix', tier: 'Intermediate', operations: ['fraction', 'multiply', 'divide'], range: 18 },
    { name: 'Decimal Addition', tier: 'Intermediate', operations: ['decimal-add'], range: 25 },
    { name: 'Decimal Subtraction', tier: 'Intermediate', operations: ['decimal-subtract'], range: 30 },
    { name: 'Decimal Multiplication', tier: 'Intermediate', operations: ['decimal-multiply'], range: 20 },
    { name: 'Percent Basics', tier: 'Advanced', operations: ['percent'], range: 50 },
    { name: 'Percent Power', tier: 'Advanced', operations: ['percent'], range: 100 },
    { name: 'Percent Change', tier: 'Advanced', operations: ['percent', 'decimal-add'], range: 120 },
    { name: 'Square Roots & Squares', tier: 'Advanced', operations: ['square'], range: 15 },
    { name: 'Square & Multiply', tier: 'Expert', operations: ['square', 'multiply'], range: 20 },
    { name: 'Mental Math Flow', tier: 'Expert', operations: ['mental'], range: 50 },
    { name: 'Expert Mixed Sprint', tier: 'Expert', operations: ['add', 'subtract', 'multiply', 'divide', 'fraction', 'decimal-add', 'decimal-subtract', 'percent', 'square', 'mental'], range: 100 },
];

const achievements = [
    { id: 'first-round', label: 'First Sprint', description: 'Finish a round' },
    { id: 'perfect-round', label: 'Perfect Sprint', description: 'Answer a round with 100% accuracy' },
    { id: 'streak-5', label: 'On Fire', description: 'Build a 5-answer streak' },
    { id: 'daily-champion', label: 'Daily Champion', description: 'Complete a daily challenge' },
    { id: 'campaign-clear', label: 'Math Master', description: 'Complete all 20 levels' },
];

const progressStorageKey = 'mathSprintProgress';
let progress = loadProgress();

// Scroll
let valueY = 0;

// Refresh Splash Page Best Scores
function bestScoresToDOM() {
    bestScores.forEach((bestScore, index) => {
        const bestScoreEl = bestScore;
        bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
    });
}

// Check Local Storage for Best Scores, set bestScoreArray
/**
 * Local Storage Management
 * Retrieves 'bestScores' from the browser's local storage to maintain persistence across sessions.
 * If no data exists, initializes a default array with zeroed scores.
 */
function getSavedBestScores() {
    if (localStorage.getItem('bestScores')) {
        bestScoreArray = JSON.parse(localStorage.bestScores);
    } else {
        bestScoreArray = [
            { questions: 10, bestScore: finalTimeDisplay },
            { questions: 25, bestScore: finalTimeDisplay },
            { questions: 50, bestScore: finalTimeDisplay },
            { questions: 99, bestScore: finalTimeDisplay },
        ];
        localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
    }
    bestScoresToDOM();
}

function createNewProgress() {
    return {
        xp: 0,
        coins: 10,
        highestLevel: 1,
        completedLevels: [],
        achievements: [],
        currentStreak: 0,
        bestStreak: 0,
        roundsPlayed: 0,
        totalCorrect: 0,
        totalAnswered: 0,
        leaderboard: [],
        dailyCompleted: '',
    };
}

function loadProgress() {
    const savedProgress = localStorage.getItem(progressStorageKey);
    if (!savedProgress) return createNewProgress();

    try {
        const parsed = JSON.parse(savedProgress);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new TypeError('Player progress must be a JSON object.');
        }
        const defaults = createNewProgress();
        return {
            ...defaults,
            ...parsed,
            xp: Number.isFinite(parsed.xp) ? Math.max(0, parsed.xp) : defaults.xp,
            coins: Number.isFinite(parsed.coins) ? Math.max(0, parsed.coins) : defaults.coins,
            highestLevel: Number.isInteger(parsed.highestLevel)
                ? Math.min(20, Math.max(1, parsed.highestLevel))
                : defaults.highestLevel,
            completedLevels: Array.isArray(parsed.completedLevels)
                ? parsed.completedLevels.filter((level) => Number.isInteger(level) && level >= 1 && level <= 20)
                : defaults.completedLevels,
            achievements: Array.isArray(parsed.achievements)
                ? parsed.achievements.filter((id) => achievements.some((achievement) => achievement.id === id))
                : defaults.achievements,
            bestStreak: Number.isInteger(parsed.bestStreak) ? Math.max(0, parsed.bestStreak) : defaults.bestStreak,
            currentStreak: Number.isInteger(parsed.currentStreak) ? Math.max(0, parsed.currentStreak) : defaults.currentStreak,
            roundsPlayed: Number.isInteger(parsed.roundsPlayed) ? Math.max(0, parsed.roundsPlayed) : defaults.roundsPlayed,
            totalCorrect: Number.isInteger(parsed.totalCorrect) ? Math.max(0, parsed.totalCorrect) : defaults.totalCorrect,
            totalAnswered: Number.isInteger(parsed.totalAnswered) ? Math.max(0, parsed.totalAnswered) : defaults.totalAnswered,
            leaderboard: Array.isArray(parsed.leaderboard)
                ? parsed.leaderboard.filter((entry) => entry
                    && Number.isInteger(entry.level) && entry.level >= 0 && entry.level <= 20
                    && Number.isFinite(entry.accuracy) && entry.accuracy >= 0 && entry.accuracy <= 100
                    && Number.isFinite(Number(entry.time)))
                : defaults.leaderboard,
        };
    } catch (error) {
        console.error('Saved player progress could not be read:', error);
        return createNewProgress();
    }
}

function saveProgress() {
    localStorage.setItem(progressStorageKey, JSON.stringify(progress));
    renderDashboard();
}

function getTodayKey() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
}

function renderDashboard() {
    document.getElementById('player-level').textContent = `Level ${progress.highestLevel}`;
    document.getElementById('player-xp').textContent = `${progress.xp} XP`;
    document.getElementById('player-coins').textContent = String(progress.coins);
    hintButton.title = `Current balance: ${progress.coins} coins`;
    document.getElementById('player-streak').textContent = String(progress.bestStreak);
    const accuracy = progress.totalAnswered
        ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
        : 0;
    document.getElementById('player-accuracy').textContent = `${accuracy}%`;

    const achievementList = document.getElementById('achievement-list');
    achievementList.textContent = '';
    achievements.forEach((achievement) => {
        const badge = document.createElement('span');
        const earned = progress.achievements.includes(achievement.id);
        badge.className = `achievement-badge${earned ? ' earned' : ''}`;
        badge.textContent = earned ? `★ ${achievement.label}` : `◇ ${achievement.label}`;
        badge.title = achievement.description;
        achievementList.appendChild(badge);
    });

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.textContent = '';
    if (!progress.leaderboard.length) {
        const emptyEntry = document.createElement('li');
        emptyEntry.textContent = 'Finish a round to post your first score';
        leaderboardList.appendChild(emptyEntry);
    } else {
        progress.leaderboard.slice(0, 5).forEach((entry) => {
            const listEntry = document.createElement('li');
            listEntry.textContent = `${entry.level ? `Lv. ${entry.level}` : 'Quick'} · ${entry.accuracy}% · ${entry.time}s`;
            leaderboardList.appendChild(listEntry);
        });
    }

    dailyChallengeButton.disabled = progress.dailyCompleted === getTodayKey();
    dailyChallengeButton.textContent = dailyChallengeButton.disabled ? 'Daily complete ✓' : 'Daily challenge';
    renderLevelGrid();
}

function renderLevelGrid() {
    levelGrid.textContent = '';
    levelDefinitions.forEach((level, index) => {
        const levelNumber = index + 1;
        const unlocked = levelNumber <= progress.highestLevel;
        const completed = progress.completedLevels.includes(levelNumber);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `level-card${unlocked ? '' : ' locked'}${completed ? ' completed' : ''}`;
        button.disabled = !unlocked;
        button.dataset.level = String(levelNumber);
        button.innerHTML = `<span class="level-number">${completed ? '✓' : unlocked ? levelNumber : '🔒'}</span><span class="level-name">${level.name}</span><span class="level-tier">${level.tier}</span>`;
        levelGrid.appendChild(button);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'game-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2600);
}

function unlockAchievement(achievementId) {
    if (progress.achievements.includes(achievementId)) return { xp: 0, coins: 0 };
    const achievement = achievements.find((item) => item.id === achievementId);
    if (!achievement) return { xp: 0, coins: 0 };
    progress.achievements.push(achievementId);
    progress.xp += 25;
    progress.coins += 10;
    playBeep(1480, 'sine', 0.18);
    showToast(`Achievement unlocked: ${achievement.label} · +25 XP · +10 coins`);
    return { xp: 25, coins: 10 };
}

function startCampaignLevel(levelNumber, mode = 'campaign') {
    selectedLevel = levelNumber;
    gameMode = mode;
    questionAmount = '10';
    dailyRunDate = mode === 'daily' ? getTodayKey() : '';
    showCountdown();
}

function startDailyChallenge() {
    if (progress.dailyCompleted === getTodayKey()) {
        showToast('You have already claimed today’s challenge reward.');
        return;
    }
    startCampaignLevel(progress.highestLevel, 'daily');
}

function replayCurrentRun() {
    if (gameMode === 'quick') {
        showCountdown();
    } else if (gameMode === 'daily' && progress.dailyCompleted !== getTodayKey()) {
        startDailyChallenge();
    } else {
        startCampaignLevel(selectedLevel, gameMode);
    }
}

function startNextLevel() {
    if (gameMode === 'campaign' && selectedLevel < progress.highestLevel) {
        startCampaignLevel(selectedLevel + 1);
    }
}

function returnToMenu() {
    clearInterval(timer);
    scorePage.hidden = true;
    gamePage.hidden = true;
    countdownPage.hidden = true;
    splashPage.hidden = false;
    playAgainBtn.hidden = true;
    shareBtn.hidden = true;
    nextLevelButton.hidden = true;
}

function renderRunRewards(rewards) {
    document.getElementById('run-rewards').textContent = rewards;
}

function finishProgressRun() {
    const correctAnswers = rightCount;
    lastRunAccuracy = Math.round((correctAnswers / Number(questionAmount)) * 100);
    progress.roundsPlayed += 1;
    progress.totalCorrect += correctAnswers;
    progress.totalAnswered += Number(questionAmount);

    const canClaimDailyReward = gameMode !== 'daily' || progress.dailyCompleted !== dailyRunDate;
    let earnedXp = canClaimDailyReward ? correctAnswers * 10 + Math.floor(lastRunAccuracy / 10) : 0;
    let earnedCoins = correctAnswers * 2 + streakBonusCoins;
    progress.xp += earnedXp;
    if (canClaimDailyReward) {
        progress.coins += earnedCoins;
    } else {
        earnedCoins = 0;
    }

    let unlockedLevel = false;
    if (gameMode === 'campaign' && lastRunAccuracy >= 70) {
        if (!progress.completedLevels.includes(selectedLevel)) {
            progress.completedLevels.push(selectedLevel);
        }
        if (selectedLevel === progress.highestLevel && selectedLevel < 20) {
            progress.highestLevel += 1;
            unlockedLevel = true;
            progress.coins += 15;
            earnedCoins += 15;
        }
    }

    if (gameMode === 'daily' && dailyRunDate && progress.dailyCompleted !== dailyRunDate) {
        progress.dailyCompleted = dailyRunDate;
        progress.coins += 20;
        progress.xp += 50;
        earnedXp += 50;
        earnedCoins += 20;
    }

    const earnedAchievements = [];
    if (progress.roundsPlayed === 1) earnedAchievements.push(unlockAchievement('first-round'));
    if (lastRunAccuracy === 100) earnedAchievements.push(unlockAchievement('perfect-round'));
    if (progress.bestStreak >= 5) earnedAchievements.push(unlockAchievement('streak-5'));
    if (gameMode === 'daily' && dailyRunDate && progress.dailyCompleted === dailyRunDate && canClaimDailyReward) {
        earnedAchievements.push(unlockAchievement('daily-champion'));
    }
    if (gameMode === 'campaign' && selectedLevel === 20 && lastRunAccuracy >= 70) {
        earnedAchievements.push(unlockAchievement('campaign-clear'));
    }
    earnedAchievements.forEach((reward) => {
        earnedXp += reward.xp;
        earnedCoins += reward.coins;
    });

    progress.leaderboard.push({
        level: gameMode === 'quick' ? 0 : selectedLevel,
        accuracy: lastRunAccuracy,
        time: finalTime.toFixed(1),
        date: getTodayKey(),
    });
    progress.leaderboard.sort((a, b) => b.accuracy - a.accuracy || Number(a.time) - Number(b.time));
    progress.leaderboard = progress.leaderboard.slice(0, 10);
    saveProgress();

    const modeLabel = gameMode === 'quick' ? 'Quick play' : `${gameMode === 'daily' ? 'Daily challenge' : `Level ${selectedLevel}`} · ${levelDefinitions[selectedLevel - 1].name}`;
    const streakReward = canClaimDailyReward && streakBonusCoins ? ` · streak bonus +${streakBonusCoins} coins` : '';
    renderRunRewards(`${modeLabel} · ${lastRunAccuracy}% accuracy · +${earnedXp} XP · +${earnedCoins} coins${streakReward}${runHints ? ` · ${runHints} hint${runHints === 1 ? '' : 's'} used` : ''}`);
    nextLevelButton.hidden = !(gameMode === 'campaign' && unlockedLevel);
}

// Update Best Score Array
function updateBestScore() {
    bestScoreArray.forEach((score, index) => {
        // Select correct Best Score to update
        if (questionAmount == score.questions) {
            // Return  Best Score as number with one decimal
            // const savedBestScore = (parseInt(bestScoreArray[index].bestScore)).toFixed(1);
            const savedBestScore = Number(bestScoreArray[index].bestScore);
            // Update if the new final score is less or replacing zero
            if (savedBestScore === 0 || savedBestScore > finalTime) {
                bestScoreArray[index].bestScore = finalTimeDisplay;
            }
        }
    });
    // Update Splash Page
    bestScoresToDOM();
    // Save to Local Storage
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reset Game
function playAgain() {
    returnToMenu();
    equationsArray = [];
    playerGuessArray = [];
    valueY = 0;
}

// Show Score Page
// Show Score Page
function showScorePage() {
    playAgainBtn.hidden = false;
    if (shareBtn) shareBtn.hidden = false;
    document.querySelector('.menu-btn').hidden = false;

    gamePage.hidden = true;
    scorePage.hidden = false;
}

// Generate Image & Share (Download)
function shareScore() {
    console.log("Share button clicked!");
    try {
        const shareCard = document.getElementById('share-card');
        const shareTime = document.getElementById('share-time-value');
        const shareBase = document.getElementById('share-base');
        const sharePenalty = document.getElementById('share-penalty');

        if (!shareCard || !shareTime) {
            console.error("Share elements missing!");
            return;
        }

        // Populate Data
        shareTime.textContent = `${finalTime.toFixed(1)}s`;
        shareBase.textContent = `${timePlayed.toFixed(1)}s`;
        sharePenalty.textContent = `+${penaltyTime.toFixed(1)}s`;
        console.log("Data populated. Starting html2canvas...");

        // Check availability
        if (typeof html2canvas === 'undefined') {
            alert("Error: html2canvas library not loaded. Check internet connection.");
            return;
        }

        // Generate Canvas
        html2canvas(shareCard, {
            scale: 3, // Ultra-High resolution for promotion
            backgroundColor: null,
            useCORS: true,
            logging: false,
            allowTaint: true
        }).then(canvas => {
            console.log("Premium Canvas generated!");
            const link = document.createElement('a');
            const fileTime = finalTime.toFixed(1);
            link.download = `MathSprint-Score-${fileTime}s.png`;
            link.href = canvas.toDataURL('image/png', 1.0); // Max quality
            link.click();
        }).catch(err => {
            console.error("html2canvas error:", err);
            alert("Error generating image: " + err.message);
        });
    } catch (error) {
        console.error("Share Logic Error:", error);
        alert("Something went wrong! " + error.message);
    }
}

// Format & Display Time in DOM
function scoresToDOM() {
    finalTimeDisplay = finalTime.toFixed(1);
    if (gameMode === 'quick') {
        updateBestScore();
    }

    // Set Base Time and Penalty
    baseTimeEl.textContent = `${timePlayed.toFixed(1)}s`;
    penaltyTimeEl.textContent = `+${penaltyTime.toFixed(1)}s`;
    finalTimeEl.textContent = `${finalTimeDisplay}s`;

    // Find Best Score for current Question Amount
    let bestScoreIndex = 0;
    switch (questionAmount) {
        case '10': bestScoreIndex = 0; break;
        case '25': bestScoreIndex = 1; break;
        case '50': bestScoreIndex = 2; break;
        case '99': bestScoreIndex = 3; break;
    }

    // Best Time (Robust Display)
    const bestTimeEl = document.querySelector('.best-time');
    if (bestTimeEl) {
        // Check if a score exists at this index
        const hasBestScore = bestScoreArray[bestScoreIndex] && bestScoreArray[bestScoreIndex].bestScore;

        if (hasBestScore) {
            bestTimeEl.textContent = `${bestScoreArray[bestScoreIndex].bestScore}s`;
        } else {
            bestTimeEl.textContent = '0.0s';
        }
    } else {
        console.error('Best Time Element not found in DOM');
    }

    if (gameMode !== 'quick') {
        const bestCampaignTime = progress.leaderboard
            .filter((entry) => entry.level === selectedLevel)
            .map((entry) => Number(entry.time))
            .sort((a, b) => a - b)[0];
        document.querySelector('.best-time').textContent = bestCampaignTime === undefined
            ? '0.0s'
            : `${bestCampaignTime.toFixed(1)}s`;
    }
    // Scroll to the Top, go to Score Page
    itemContainer.scrollTo({ top: 0, behavior: 'instant' });
    showScorePage();
}

// Stop Timer, Process Results, go to Score Page
function checkTime() {
    if (playerGuessArray.length === Number(questionAmount)) {
        clearInterval(timer);
        // Check for wrong guesses, add penalty time
        equationsArray.forEach((equation, index) => {
            if (equation.evaluated === playerGuessArray[index]) {
                // Correct Guess, No penalty

            } else {
                // Incorrect Guess, dd Penalty
                penaltyTime += 0.5;
            }
        });
        finalTime = timePlayed + penaltyTime;
        finishProgressRun();
        scoresToDOM();
    }
}

// Timer Display
const timerDisplay = document.querySelector('.timer-display');

// Add a tenth of a second to timePlayed
function addTime() {
    timePlayed += 0.1;
    checkTime();
    timerDisplay.textContent = `Time: ${timePlayed.toFixed(1)}s`;
}

// Start timer when game page is clicked
function startTimer() {
    // Reset times
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0;
    timerDisplay.textContent = 'Time: 0.0s';
    timer = setInterval(addTime, 100);
}

// Scroll, Store user selection in playerGuessArray
// Scroll, Store user selection in playerGuessArray
let currentEquationIndex = 0; // Track active equation

function playGameSound(isCorrect) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (isCorrect) {
        // High pitch "Ding"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // A6
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else {
        // Low pitch "Buzz"
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }
    osc.connect(gain);
    gain.connect(audioCtx.destination);
}

const rightScoreEl = document.getElementById('right-score');
const wrongScoreEl = document.getElementById('wrong-score');
let rightCount = 0;
let wrongCount = 0;

function select(guessedTrue) {
    // Sound Effect Logic & Visual Feedback
    const currentEquation = equationsArray[currentEquationIndex];
    if (currentEquation) {
        // Compare string 'true'/'false' with boolean guess
        const isCorrect = currentEquation.evaluated === (guessedTrue ? 'true' : 'false');
        playGameSound(isCorrect);

        // Visual Feedback (Color History)
        const itemElements = document.querySelectorAll('.item');
        if (itemElements[currentEquationIndex]) {
            itemElements[currentEquationIndex].classList.add(isCorrect ? 'answered-right' : 'answered-wrong');
        }

        // Live Score Update
        if (isCorrect) {
            rightCount++;
            rightScoreEl.textContent = rightCount;
            streak++;
            if (streak % 3 === 0) {
                streakBonusCoins += 5;
                playBeep(1180, 'sine', 0.14);
            }
            document.getElementById('streak-display').textContent = `🔥 ${streak} streak`;
            progress.currentStreak = streak;
            progress.bestStreak = Math.max(progress.bestStreak, streak);
        } else {
            wrongCount++;
            wrongScoreEl.textContent = wrongCount;
            streak = 0;
            streakBonusCoins = 0;
            document.getElementById('streak-display').textContent = '🔥 0 streak';
            document.getElementById('streak-display').textContent = '🔥 0 streak';
            progress.currentStreak = 0;

            // Trigger Penalty Animation on Timer
            const timerDisplay = document.getElementById('timer-display');
            timerDisplay.classList.remove('penalty-flash');
            void timerDisplay.offsetWidth; // Trigger reflow
            timerDisplay.classList.add('penalty-flash');
        }

        // Button Feedback Animation
        const clickedBtn = guessedTrue ? document.getElementById('right-btn') : document.getElementById('wrong-btn');
        if (clickedBtn) {
            // Remove previous classes
            clickedBtn.classList.remove('btn-success-flash', 'btn-error-flash');
            void clickedBtn.offsetWidth; // Trigger reflow

            // Add appropriate class: Good Move (Green) or Bad Move (Red)
            clickedBtn.classList.add(isCorrect ? 'btn-success-flash' : 'btn-error-flash');

            // Cleanup after animation
            setTimeout(() => {
                clickedBtn.classList.remove('btn-success-flash', 'btn-error-flash');
            }, 400);
        }
    }

    // Scroll 80 pixels
    valueY += 80;
    const scrollSurface = document.querySelector('.scroll-surface');
    scrollSurface.style.transform = `translateY(-${valueY}px)`;
    // itemContainer.scroll({ top: valueY, behavior: 'smooth' }); // Removed native scroll

    // Toggle Text Highlight
    const itemElements = document.querySelectorAll('.item');
    if (itemElements[currentEquationIndex]) {
        itemElements[currentEquationIndex].classList.remove('item-active');
    }
    currentEquationIndex++;
    if (itemElements[currentEquationIndex]) {
        itemElements[currentEquationIndex].classList.add('item-active');
    }
    hintUsedForQuestion = false;
    hintMessage.hidden = true;
    hintButton.disabled = false;

    // Add player guess to array
    return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

function useHint() {
    const currentEquation = equationsArray[currentEquationIndex];
    if (!currentEquation || hintUsedForQuestion) return;
    if (progress.coins < 5) {
        showToast('You need 5 coins to use a hint.');
        return;
    }

    progress.coins -= 5;
    runHints++;
    hintUsedForQuestion = true;
    hintButton.disabled = true;
    hintMessage.textContent = currentEquation.hint;
    hintMessage.hidden = false;
    saveProgress();
}

// Display Game Page
function showGamePage() {
    gamePage.hidden = false;
    countdownPage.hidden = true;
    // Scroll to Top
    valueY = 0; // Ensure reset
    const scrollSurface = document.querySelector('.scroll-surface');
    if (scrollSurface) scrollSurface.style.transform = `translateY(0px)`;

    // Reset Counters
    rightCount = 0;
    wrongCount = 0;
    rightScoreEl.textContent = '0';
    wrongScoreEl.textContent = '0';
    streak = 0;
    runHints = 0;
    hintUsedForQuestion = false;
    hintMessage.hidden = true;
    hintButton.disabled = false;
    startTimer();
}

// Get Random Number up to amax number
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function randomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(value) {
    return String(Number(value.toFixed(3)));
}

function createArithmeticQuestion(operation, range) {
    let first;
    let second;
    let result;
    let expression;

    switch (operation) {
        case 'add':
            first = randomIntInclusive(1, range);
            second = randomIntInclusive(1, range);
            result = first + second;
            expression = `${first} + ${second}`;
            break;
        case 'subtract':
            first = randomIntInclusive(1, range);
            second = randomIntInclusive(1, range);
            if (first < second) [first, second] = [second, first];
            result = first - second;
            expression = `${first} − ${second}`;
            break;
        case 'multiply':
            first = randomIntInclusive(2, Math.min(range, 30));
            second = randomIntInclusive(2, Math.min(range, 12));
            result = first * second;
            expression = `${first} × ${second}`;
            break;
        case 'divide':
            second = randomIntInclusive(2, Math.min(range, 12));
            result = randomIntInclusive(2, Math.min(range, 20));
            first = second * result;
            expression = `${first} ÷ ${second}`;
            break;
        case 'fraction': {
            const denominators = [2, 4, 5, 8, 10];
            const firstDenominator = denominators[randomIntInclusive(0, denominators.length - 1)];
            const secondDenominator = denominators[randomIntInclusive(0, denominators.length - 1)];
            const firstNumerator = randomIntInclusive(1, Math.min(firstDenominator - 1, range));
            const secondNumerator = randomIntInclusive(1, Math.min(secondDenominator - 1, range));
            const subtract = Math.random() < 0.5;
            const left = firstNumerator / firstDenominator;
            const right = secondNumerator / secondDenominator;
            result = subtract ? Math.abs(left - right) : left + right;
            const leftText = `${firstNumerator}/${firstDenominator}`;
            const rightText = `${secondNumerator}/${secondDenominator}`;
            expression = subtract && left < right
                ? `${rightText} − ${leftText}`
                : `${leftText} ${subtract ? '−' : '+'} ${rightText}`;
            break;
        }
        case 'decimal-add':
        case 'decimal-subtract':
        case 'decimal-multiply': {
            const leftTenths = randomIntInclusive(10, range * 10);
            const rightTenths = randomIntInclusive(10, range * 10);
            first = leftTenths / 10;
            second = rightTenths / 10;
            if (operation === 'decimal-add') {
                result = first + second;
                expression = `${formatNumber(first)} + ${formatNumber(second)}`;
            } else if (operation === 'decimal-subtract') {
                if (first < second) [first, second] = [second, first];
                result = first - second;
                expression = `${formatNumber(first)} − ${formatNumber(second)}`;
            } else {
                result = first * second;
                expression = `${formatNumber(first)} × ${formatNumber(second)}`;
            }
            break;
        }
        case 'percent': {
            const percentages = [10, 20, 25, 50, 75];
            const percentage = percentages[randomIntInclusive(0, percentages.length - 1)];
            first = randomIntInclusive(20, Math.max(20, range));
            result = (percentage / 100) * first;
            expression = `${percentage}% of ${first}`;
            break;
        }
        case 'square':
            first = randomIntInclusive(2, Math.min(range, 30));
            result = first * first;
            expression = `${first}²`;
            break;
        case 'mental': {
            const mentalOperation = ['add', 'subtract', 'multiply'][randomIntInclusive(0, 2)];
            if (mentalOperation === 'add') {
                first = randomIntInclusive(2, range) * 10;
                second = randomIntInclusive(1, 9);
                result = first + second;
                expression = `${first} + ${second}`;
            } else if (mentalOperation === 'subtract') {
                first = randomIntInclusive(2, range) * 10;
                second = randomIntInclusive(1, 9);
                result = first - second;
                expression = `${first} − ${second}`;
            } else {
                first = randomIntInclusive(2, Math.min(range, 25));
                second = randomIntInclusive(9, 11);
                result = first * second;
                expression = `${first} × ${second}`;
            }
            break;
        }
        default:
            throw new Error(`Unsupported arithmetic operation: ${operation}`);
    }

    return { expression, result: Number(formatNumber(result)) };
}

// Create Correct/Incorrect Random Equations
/**
 * Equation Generation Algorithm
 * randomly selects a subset of equations to be mathematically correct,
 * and forces the remainder to be incorrect by slightly altering the result.
 * This ensures unpredictable gameplay.
 */
function createEquations() {
    const level = gameMode === 'quick' ? { operations: ['add', 'subtract', 'multiply', 'divide'], range: 9 } : levelDefinitions[selectedLevel - 1];
    const questionCount = Number(questionAmount);
    currentEquationIndex = 0;
    equationsArray = [];
    playerGuessArray = [];
    const operations = level.operations;
    for (let index = 0; index < questionCount; index++) {
        const operation = operations[randomIntInclusive(0, operations.length - 1)];
        const question = createArithmeticQuestion(operation, level.range);
        const answer = formatNumber(question.result);
        const isCorrect = Math.random() < 0.5;
        let shownAnswer = answer;
        if (!isCorrect) {
            const adjustment = Number.isInteger(question.result) ? 1 : 0.1;
            const direction = Math.random() < 0.5 ? -1 : 1;
            shownAnswer = formatNumber(question.result + adjustment * direction);
            if (shownAnswer === answer) shownAnswer = formatNumber(question.result + 0.37);
        }
        equationsArray.push({
            value: `${question.expression} = ${shownAnswer}`,
            evaluated: String(isCorrect),
            hint: `The expression on the left evaluates to ${answer}. Compare it with the number after the equals sign.`,
        });
    }
    shuffle(equationsArray);
}

// Add Equations to DOM
// Add Equations to DOM
function equationsToDOM() {
    const scrollSurface = document.querySelector('.scroll-surface');
    equationsArray.forEach((equation, index) => {
        // Item
        const item = document.createElement('div');
        item.classList.add('item');

        // Highlight first item
        if (index === 0) {
            item.classList.add('item-active');
        }

        // Equation Grid Container
        const grid = document.createElement('div');
        grid.classList.add('equation-grid');

        const parts = equation.value.split(' ');

        parts.forEach(part => {
            const span = document.createElement('h1');
            span.textContent = part;
            grid.appendChild(span);
        });

        // Append to Surface
        item.appendChild(grid);
        scrollSurface.appendChild(item);
    });
}

// Dynamically adding correct/incorrect equations
// Dynamically adding correct/incorrect equations
function populateGamePage() {
    // Reset DOM
    itemContainer.textContent = '';

    // Create Scroll Surface
    const scrollSurface = document.createElement('div');
    scrollSurface.classList.add('scroll-surface');
    itemContainer.appendChild(scrollSurface);

    // Spacer
    const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
    scrollSurface.appendChild(topSpacer);

    // Create Equations, Build Elements in DOM
    createEquations();
    equationsToDOM();

    // Set Blank Space Below
    const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-500');
    scrollSurface.appendChild(bottomSpacer);
}

// Sound Synthesis
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq = 600, type = 'sine', duration = 0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();

    // Hold sound for duration, then fade out quickly
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + duration);
    osc.stop(now + duration);
}

// Displays 3, 2, 1 GO!
function countdownStart() {
    let count = 3;
    countdown.textContent = count;
    playBeep(600, 'sine', 0.1);
    countdown.classList.remove('pop-in');
    void countdown.offsetWidth; // Trigger reflow
    countdown.classList.add('pop-in');

    const timeCountDown = setInterval(() => {
        count--;
        if (count === 0) {
            countdown.textContent = 'GO!';
            playBeep(1200, 'square', 1.0); // Long sustain for GO
            countdown.classList.remove('pop-in');
            void countdown.offsetWidth;
            countdown.classList.add('pop-in');
        } else if (count === -1) {
            showGamePage();
            clearInterval(timeCountDown);
        } else {
            countdown.textContent = count;
            playBeep(600, 'sine', 0.1);
            countdown.classList.remove('pop-in');
            void countdown.offsetWidth;
            countdown.classList.add('pop-in');
        }
    }, 1000);
}

// Navigate from Splash page to Countdown Page
function showCountdown() {
    scorePage.hidden = true;
    gamePage.hidden = true;
    countdownPage.hidden = false;
    splashPage.hidden = true;
    const modeLabel = document.getElementById('game-mode-label');
    modeLabel.textContent = gameMode === 'quick'
        ? 'Quick play'
        : `${gameMode === 'daily' ? 'Daily challenge' : `Level ${selectedLevel}`} · ${levelDefinitions[selectedLevel - 1].name}`;
    populateGamePage();
    countdownStart();
}

// Get the value from Selected radio button
function getRadioValue() {
    let radioValue;
    radioInputs.forEach((radioInput) => {
        if (radioInput.checked) {
            radioValue = radioInput.value;
        }
    });
    return radioValue;
}

// Form that decides amount of questions
function selectQuestionAmount(e) {
    e.preventDefault();
    questionAmount = getRadioValue();
    if (questionAmount) {
        gameMode = 'quick';
        showCountdown();
    }
}

// Switch selected input styling
startForm.addEventListener('change', () => {
    radioContainers.forEach((radioEl) => {
        // Remove Selected Label Styling
        radioEl.classList.remove('selected-label');
        // Check if the input within this container is checked
        // Note: The input is expected to be the second child (index 1) based on HTML structure
        if (radioEl.children[1].checked) {
            radioEl.classList.add('selected-label');
        }
    });
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
levelGrid.addEventListener('click', (event) => {
    const levelButton = event.target.closest('[data-level]');
    if (levelButton && !levelButton.disabled) {
        startCampaignLevel(Number(levelButton.dataset.level));
    }
});
dailyChallengeButton.addEventListener('click', startDailyChallenge);
hintButton.addEventListener('click', useHint);
renderDashboard();

// =========================================
//   GEOMETRIC CONSTELLATION FOOTER
// =========================================
const canvas = document.getElementById('footer-canvas');
const footer = document.querySelector('.footer');
const ctx = canvas ? canvas.getContext('2d') : null;
const leftLink = document.querySelector('.link-left');
const rightLink = document.querySelector('.link-right');

let animationMode = 'default'; // 'default', 'grid', or 'spiral'
let particles = [];
const particleCount = 60;
const connectionDistance = 100;

if (canvas && ctx) {
    // Resize Canvas
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
            this.color = '#333';
            this.targetX = null;
            this.targetY = null;
        }

        update() {
            // Mode Logic
            if (animationMode === 'grid') {
                // Move towards target in Grid
                if (this.targetX !== null && this.targetY !== null) {
                    const dx = this.targetX - this.x;
                    const dy = this.targetY - this.y;
                    this.x += dx * 0.1;
                    this.y += dy * 0.1;
                }
                this.color = 'dodgerblue';
            } else if (animationMode === 'spiral') {
                // Move towards Spiral paths
                if (this.targetX !== null && this.targetY !== null) {
                    const dx = this.targetX - this.x;
                    const dy = this.targetY - this.y;
                    this.x += dx * 0.1; // Smooth ease
                    this.y += dy * 0.1;
                }
                this.color = 'magenta';
            } else {
                // Default Brownian Motion
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off walls
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                this.color = '#555';
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Calculate Targets for Shapes
    function setGridTargets() {
        const cols = 10;
        const rows = Math.ceil(particleCount / cols);
        const paddingX = canvas.width / cols;
        const paddingY = canvas.height / rows;

        particles.forEach((p, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            p.targetX = col * paddingX + paddingX / 2;
            p.targetY = row * paddingY + paddingY / 2;
        });
    }

    function setSpiralTargets() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const spacing = 4; // Tightness

        particles.forEach((p, i) => {
            const angle = i * 0.5;
            const radius = spacing * angle;
            p.targetX = centerX + radius * Math.cos(angle);
            p.targetY = centerY + radius * Math.sin(angle);
        });
    }

    // Interaction Listeners
    if (leftLink) {
        leftLink.addEventListener('mouseenter', () => {
            animationMode = 'grid';
            setGridTargets();
            footer.classList.add('hover-left');
        });
        leftLink.addEventListener('mouseleave', () => {
            animationMode = 'default';
            footer.classList.remove('hover-left');
            // Give random velocities back
            particles.forEach(p => {
                p.vx = (Math.random() - 0.5) * 1.5;
                p.vy = (Math.random() - 0.5) * 1.5;
            });
        });
    }

    if (rightLink) {
        rightLink.addEventListener('mouseenter', () => {
            animationMode = 'spiral';
            setSpiralTargets();
            footer.classList.add('hover-right');
        });
        rightLink.addEventListener('mouseleave', () => {
            animationMode = 'default';
            footer.classList.remove('hover-right');
            particles.forEach(p => {
                p.vx = (Math.random() - 0.5) * 1.5;
                p.vy = (Math.random() - 0.5) * 1.5;
            });
        });
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect lines
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = 1 - dist / connectionDistance; // Fade out by distance
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// On Load
getSavedBestScores();

// Footer Operator Animation
function cycleFooterOperator() {
    const operatorEl = document.querySelector('.math-operator');
    if (!operatorEl) return;

    const states = [
        { text: '&', color: 'var(--primary-color)' },
        { text: '+', color: 'var(--success)' },      // Green
        { text: '-', color: 'var(--danger)' },       // Red
        { text: '×', color: '#8b5cf6' },             // Purple
        { text: '÷', color: '#f59e0b' }              // Orange
    ];

    let index = 0;

    setInterval(() => {
        index = (index + 1) % states.length;
        const state = states[index];

        // Animate Out
        operatorEl.style.transform = 'scale(0.5) rotate(180deg)';
        operatorEl.style.opacity = '0';

        setTimeout(() => {
            // Change Content
            operatorEl.textContent = state.text;
            operatorEl.style.color = state.color;

            // Animate In
            operatorEl.style.transform = 'scale(1.2) rotate(0deg)';
            operatorEl.style.opacity = '1';

            // Settle
            setTimeout(() => {
                operatorEl.style.transform = 'scale(1)';
            }, 200);
        }, 250); // Wait for half transition

    }, 2000); // Change every 2 seconds
}

// Start Animation
document.addEventListener('DOMContentLoaded', cycleFooterOperator);