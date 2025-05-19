let points = 0; 
let cooldown = false; 
let baseGenerationRate = 2; 
let predicateUpgrades = 0; 
let pointsPerSolve = 1; 
let solveCooldown = 600; 
let predicateUnlocked = false; 
let setUnlocked = false; 
let relationsUnlocked = false; 
let classifyingUnlocked = false; 
let totalUpgrades = 0; 
let setUpgraded = false;
let relationsUpgraded = false;
let classifyingUpgraded = false;
let bonusInterval = null; 
let idleInterval = null; 
let minigameScore = 0; 
let minigameInterval = null; 
let pointBoostActive = false; 
let playerId = localStorage.getItem('playerId') || null;
const API_URL = 'http://localhost:3000';

// in game notifications
function notify(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    const container = document.getElementById('notification-container');
    if (container) {
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000); 
    }
}

const achievements = [
    { id: 'points_100', name: 'First Steps', description: 'Accumulate 100 points', points: 100, unlocked: false },
    { id: 'points_1000', name: 'Proof Pro', description: 'Accumulate 1000 points', points: 1000, unlocked: false },
    { id: 'points_10000', name: 'Master of Proofs', description: 'Accumulate 10000 points', points: 10000, unlocked: false },
    { id: 'upgrades_1', name: 'First Upgrade', description: 'Purchase 1 upgrade', upgrades: 1, unlocked: false },
    { id: 'upgrades_2', name: 'Upgrade Enthusiast', description: 'Purchase 2 upgrades', upgrades: 2, unlocked: false },
    { id: 'upgrades_3', name: 'Upgrade Master', description: 'Purchase 3 upgrades', upgrades: 3, unlocked: false }
];

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.unlocked) {
            if (achievement.points && points >= achievement.points) {
                achievement.unlocked = true;
                notify(`${achievement.name} unlocked: ${achievement.description}`);
            } else if (achievement.upgrades && totalUpgrades >= achievement.upgrades) {
                achievement.unlocked = true;
                notify(`${achievement.name} unlocked: ${achievement.description}`);
            }
        }
    });
    updateAchievementsDisplay();
}

function toggleAchievements() {
    const panel = document.getElementById('achievements-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') {
        updateAchievementsDisplay();
    }
}

function updateAchievementsDisplay() {
    const list = document.getElementById('achievements-list');
    list.innerHTML = '';
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        if (achievement.points) {
            li.textContent = `${achievement.name}: ${achievement.description} (${points}/${achievement.points})`;
        } else if (achievement.upgrades) {
            li.textContent = `${achievement.name}: ${achievement.description} (${totalUpgrades}/${achievement.upgrades})`;
        }
        list.appendChild(li);
    });
}

function showPointsIndicator(pointsGained) {
    const indicator = document.createElement('div');
    indicator.className = 'points-gain';
    indicator.textContent = `+${pointsGained}`;
    const indicatorContainer = document.getElementById('points-indicator');
    if (indicatorContainer) {
        indicatorContainer.appendChild(indicator);
        setTimeout(() => {
            indicator.remove();
        }, 900); 
    }
}

function checkBonus() {
    let bonusChance = 0;
    if (classifyingUnlocked) {
        bonusChance = 0.40; 
    } else if (relationsUnlocked) {
        bonusChance = 0.20; 
    } else if (setUnlocked) {
        bonusChance = 0.10; 
    } else if (predicateUnlocked) {
        bonusChance = 0.01;
    }

    if (bonusChance > 0 && Math.random() < bonusChance) {
        points += 1000;
        showPointsIndicator(1000);
        updatePoints();
        notify('Bonus: +1000 points!');
    }
}

const unlockCosts = {
    predicate: 100,
    set: 1000,
    relations: 5000,
    classifying: 20000,
    predicateUpgrade: 250,
    setUpgrade: 1500, 
    relationsUpgrade: 7500, 
    classifyingUpgrade: 30000
};

function updatePoints() {
    document.getElementById("points-text").innerHTML = `You have ${points} proof points`;
    document.getElementById("rate-text").innerHTML = `Idle generation rate is at ${baseGenerationRate.toFixed(1)} points per 5 seconds`;
    checkAchievements();
}

function solveQuestion() {
    if (!cooldown) {
        let pointsGained = pointBoostActive ? pointsPerSolve * 3 : pointsPerSolve;
        points += pointsGained;
        showPointsIndicator(pointsGained);
        updatePoints();
        checkAchievements();
        cooldown = true;
        let solveButton = document.querySelector('.game-button-container .button');
        solveButton.classList.add('cooldown');
        setTimeout(function () {
            cooldown = false;
            solveButton.classList.remove('cooldown');
        }, solveCooldown);
    }
}

function unlockPredicate() {
    if (predicateUnlocked) return;
    if (points >= unlockCosts.predicate) {
        points -= unlockCosts.predicate;
        document.getElementById('predicate-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockPredicate();"]').style.display = 'none';
        predicateUnlocked = true; 
        updatePoints();
        notify('Predicate Logic unlocked! New upgrade available.');
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.predicate - points} more points!`);
    }
}

function upgradePredicate() {
    if (predicateUpgrades > 0) return;
    if (points >= unlockCosts.predicateUpgrade) {
        points -= unlockCosts.predicateUpgrade;
        predicateUpgrades++;
        pointsPerSolve = 3;
        document.getElementById('predicate-upgrade').style.display = 'none';
        totalUpgrades++; 
        updatePoints();
        updateTooltips();
        checkAchievements(); 
        notify('Solve Question now awards 3 points per click!');
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.predicateUpgrade - points} more points!`);
    }
}

function unlockSet() {
    if (setUnlocked) return;
    if (points >= unlockCosts.set) {
        points -= unlockCosts.set;
        document.getElementById('set-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockSet();"]').style.display = 'none';
        setUnlocked = true; 
        updatePoints();
        notify('Set Theory unlocked! New upgrade available.');
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.set - points} more points!`);
    }
}

function upgradeSet() {
    if (setUpgraded) return;
    if (points >= unlockCosts.setUpgrade) {
        points -= unlockCosts.setUpgrade;
        setUpgraded = true;
        document.getElementById('set-upgrade').style.display = 'none';
        setInterval(() => {
            baseGenerationRate += 1;
            updatePoints();
            updateTooltips();
        }, 5000);
        totalUpgrades++; 
        updatePoints();
        updateTooltips();
        checkAchievements(); 
        notify('Idle generation rate will now increase by 1 point every 5 seconds!');
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.setUpgrade - points} more points!`);
    }
}

function unlockRelations() {
    if (relationsUnlocked) return;
    if (points >= unlockCosts.relations) {
        points -= unlockCosts.relations;
        document.getElementById('relations-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockRelations();"]').style.display = 'none';
        relationsUnlocked = true; 
        updatePoints();
        notify('Relations unlocked! New upgrade available.');
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.relations - points} more points!`);
    }
}

function upgradeRelations() {
    if (relationsUpgraded) return;
    if (points >= unlockCosts.relationsUpgrade) {
        points -= unlockCosts.relationsUpgrade;
        relationsUpgraded = true;
        document.getElementById('relations-upgrade').style.display = 'none';
        setInterval(() => {
            pointsPerSolve *= 2.5;
            updateTooltips();
            notify('Points boosted by 2.5x for 10 seconds!');
            setTimeout(() => {
                pointsPerSolve /= 2.5;
                updateTooltips();
            }, 10000);
        }, 60000);
        totalUpgrades++; 
        updatePoints();
        updateTooltips();
        checkAchievements(); 
        notify('Activated 2.5x point boost every 60 seconds for 10 seconds!');
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.relationsUpgrade - points} more points!`);
    }
}

function unlockClassifying() {
    if (classifyingUnlocked) return;
    if (points >= unlockCosts.classifying) {
        points -= unlockCosts.classifying;
        document.getElementById('classifying-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockClassifying();"]').style.display = 'none';
        classifyingUnlocked = true; 
        updatePoints();
        notify('Classifying Relations unlocked! Secret upgrade available.');
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.classifying - points} more points!`);
    }
}

function upgradeClassifying() {
    if (classifyingUpgraded) return;
    if (points >= unlockCosts.classifyingUpgrade) {
        points -= unlockCosts.classifyingUpgrade;
        classifyingUpgraded = true;
        document.getElementById('classifying-upgrade').style.display = 'none';
        if (Math.random() < 0.5) {
            points *= 3;
            notify('Your points have been tripled!');
        } else {
            solveCooldown = 100;
            notify('Solve Question cooldown reduced to 100ms!');
        }
        totalUpgrades++; 
        updatePoints();
        updateTooltips();
        checkAchievements(); 
        saveGameState();
    } else {
        notify(`Need ${unlockCosts.classifyingUpgrade - points} more points!`);
    }
}

function createTooltips() {
    const items = [
        { selector: 'button[onclick="unlockPredicate();"]', cost: unlockCosts.predicate },
        { selector: 'button[onclick="unlockSet();"]', cost: unlockCosts.set },
        { selector: 'button[onclick="unlockRelations();"]', cost: unlockCosts.relations },
        { selector: 'button[onclick="unlockClassifying();"]', cost: unlockCosts.classifying },
        { selector: '#predicate-upgrade', cost: unlockCosts.predicateUpgrade },
        { selector: '#set-upgrade', cost: unlockCosts.setUpgrade },
        { selector: '#relations-upgrade', cost: unlockCosts.relationsUpgrade },
        { selector: '#classifying-upgrade', cost: unlockCosts.classifyingUpgrade }
    ];

    items.forEach(item => {
        const button = document.querySelector(item.selector);
        if (button) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = `Cost: ${item.cost} points`;
            button.appendChild(tooltip);
        }
    });
}

function updateTooltips() {
    const buttons = [
        { selector: '#predicate-upgrade', cost: unlockCosts.predicateUpgrade },
        { selector: '#set-upgrade', cost: unlockCosts.setUpgrade },
        { selector: '#relations-upgrade', cost: unlockCosts.relationsUpgrade },
        { selector: '#classifying-upgrade', cost: unlockCosts.classifyingUpgrade }
    ];

    buttons.forEach(button => {
        const element = document.querySelector(button.selector);
        if (element) {
            const tooltip = element.querySelector('.tooltip');
            if (tooltip) {
                tooltip.textContent = `Cost: ${button.cost} points`;
            }
        }
    });
}

function startMinigame() {
    // PAUSE AND LOAD MINIGAME
    clearInterval(idleInterval);
    clearInterval(bonusInterval);
    idleInterval = null;
    bonusInterval = null;
    document.getElementById('menu-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('minigame-section').style.display = 'block';
    document.getElementById('minigame-score').style.display = 'none';
    minigameScore = 0;
    
    let spawnInterval = 1000; 
    const gameDuration = 30000; 
    let startTime = Date.now();

    
    function spawnCircle() {
        const container = document.getElementById('minigame-container');
        const circle = document.createElement('div');
        circle.className = 'minigame-circle';
        const maxX = container.clientWidth - 80;
        const maxY = container.clientHeight - 80;
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        circle.onclick = () => {
            minigameScore++;
            circle.remove();
        };
        container.appendChild(circle);
        setTimeout(() => circle.remove(), 1300);
    }

    // Adjusts circle spawn rate over time
    function updateSpawnInterval() {
        const elapsed = Date.now() - startTime;
        if (elapsed >= 25000) spawnInterval = 100; // 0.1s at 25s
        else if (elapsed >= 20000) spawnInterval = 200; // 0.2s at 20s
        else if (elapsed >= 15000) spawnInterval = 400; // 0.4s at 15s
        else if (elapsed >= 10000) spawnInterval = 600; // 0.6s at 10s
        else if (elapsed >= 5000) spawnInterval = 800; // 0.8s at 5s
    }

    
    minigameInterval = setInterval(() => {
        updateSpawnInterval();
        spawnCircle();
    }, spawnInterval);

    
    setTimeout(() => {
        clearInterval(minigameInterval);
        minigameInterval = null;
        document.getElementById('minigame-score').style.display = 'block';
        document.getElementById('score-text').textContent = `You clicked ${minigameScore} circles`;
    }, gameDuration);
}

function endMinigame() {
    // Back to normal main game
    document.getElementById('minigame-section').style.display = 'none';
    document.getElementById('menu-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    idleInterval = setInterval(function () {
        let pointsGained = pointBoostActive ? baseGenerationRate * 3 : baseGenerationRate;
        points += pointsGained;
        showPointsIndicator(pointsGained);
        updatePoints();
    }, 5000);
    bonusInterval = setInterval(checkBonus, 60000);
    
    if (minigameScore > 0) {
        pointBoostActive = true;
        notify('3x Point boost active for ' + minigameScore + ' seconds!');
        setTimeout(() => {
            pointBoostActive = false;
            updatePoints();
            notify('Point boost ended!');
        }, minigameScore * 1000); 
    }
    saveGameState();
}

// UPGRADE SIDEBAR
function toggleNav() {
    document.querySelector("nav").classList.toggle("open");
    document.getElementById("nav-toggle").classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    if (!playerId) {
        playerId = 'player-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('playerId', playerId);
    }
    document.getElementById('menu-section').style.display = 'block';
    document.getElementById('game-section').style.display = 'none';
    createTooltips();
    updateTooltips();
    updateAchievementsDisplay();
    loadGameState();
}

function startGame() {
    document.getElementById('menu-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    updatePoints();
    document.getElementById('event-button').onclick = startMinigame;
    idleInterval = setInterval(function () {
        points += baseGenerationRate;
        showPointsIndicator(baseGenerationRate);
        updatePoints();
    }, 5000);
    bonusInterval = setInterval(checkBonus, 60000);
}

function returnToMenu() {
    document.getElementById('game-section').style.display = 'none';
    document.getElementById('menu-section').style.display = 'block';
    clearInterval(idleInterval);
    clearInterval(bonusInterval);
    idleInterval = null;
    bonusInterval = null;
    saveGameState();
}

async function saveGameState() {
    if (!playerId) return;
    const state = {
        playerId,
        points,
        minigameScore,
        baseGenerationRate,
        predicateUpgrades,
        pointsPerSolve,
        solveCooldown,
        predicateUnlocked,
        setUnlocked,
        relationsUnlocked,
        classifyingUnlocked,
        totalUpgrades,
        setUpgraded,
        relationsUpgraded,
        classifyingUpgraded,
        achievements: achievements.map(a => ({ id: a.id, unlocked: a.unlocked }))
    };
    const response = await fetch(`${API_URL}/gameState`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    });
}

async function loadGameState() {
    if (!playerId) return;
    const response = await fetch(`${API_URL}/gameState/${playerId}`);
    if (response.ok) {
        const state = await response.json();
        points = state.points || 0;
        minigameScore = state.minigameScore || 0;
        baseGenerationRate = state.baseGenerationRate || 2;
        predicateUpgrades = state.predicateUpgrades || 0;
        pointsPerSolve = state.pointsPerSolve || 1;
        solveCooldown = state.solveCooldown || 600;
        predicateUnlocked = state.predicateUnlocked || false;
        setUnlocked = state.setUnlocked || false;
        relationsUnlocked = state.relationsUnlocked || false;
        classifyingUnlocked = state.classifyingUnlocked || false;
        totalUpgrades = state.totalUpgrades || 0;
        setUpgraded = state.setUpgraded || false;
        relationsUpgraded = state.relationsUpgraded || false;
        classifyingUpgraded = state.classifyingUpgraded || false;
        if (state.achievements) {
            state.achievements.forEach(saved => {
                const achievement = achievements.find(a => a.id === saved.id);
                if (achievement) achievement.unlocked = saved.unlocked;
            });
        }
        updatePoints();
        document.getElementById('predicate-upgrade').style.display = predicateUnlocked && predicateUpgrades === 0 ? 'flex' : 'none';
        document.getElementById('set-upgrade').style.display = setUnlocked && !setUpgraded ? 'flex' : 'none';
        document.getElementById('relations-upgrade').style.display = relationsUnlocked && !relationsUpgraded ? 'flex' : 'none';
        document.getElementById('classifying-upgrade').style.display = classifyingUnlocked && !classifyingUpgraded ? 'flex' : 'none';
        document.querySelector('button[onclick="unlockPredicate();"]').style.display = predicateUnlocked ? 'none' : 'block';
        document.querySelector('button[onclick="unlockSet();"]').style.display = setUnlocked ? 'none' : 'block';
        document.querySelector('button[onclick="unlockRelations();"]').style.display = relationsUnlocked ? 'none' : 'block';
        document.querySelector('button[onclick="unlockClassifying();"]').style.display = classifyingUnlocked ? 'none' : 'block';
    }
}