var points = 0;
var cooldown = false;
var baseGenerationRate = 2;
var predicateUpgrades = 0;
var pointsPerSolve = 1;
var solveCooldown = 600;
let predicateUnlocked = false;
let setUnlocked = false;
let relationsUnlocked = false;
let classifyingUnlocked = false;

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

let totalUpgrades = 0; 


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
    if (cooldown) return;
    points += pointsPerSolve;
    showPointsIndicator(pointsPerSolve);
    updatePoints();
    cooldown = true;

    var button = document.querySelector('button[onclick="solveQuestion();"]');
    if (button) {
        button.classList.add('cooldown');
        setTimeout(function () {
            cooldown = false;
            button.classList.remove('cooldown');
        }, solveCooldown);
    }
}

function unlockPredicate() {
    if (points >= unlockCosts.predicate) {
        points -= unlockCosts.predicate;
        document.getElementById('predicate-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockPredicate();"]').style.display = 'none';
        predicateUnlocked = true; 
        updatePoints();
        notify('Predicate Logic unlocked! New upgrade available.');
    } else {
        notify(`Need ${unlockCosts.predicate - points} more points!`);
    }
}

function upgradePredicate() {
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
    } else {
        notify(`Need ${unlockCosts.predicateUpgrade - points} more points!`);
    }
}

function unlockSet() {
    if (points >= unlockCosts.set) {
        points -= unlockCosts.set;
        document.getElementById('set-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockSet();"]').style.display = 'none';
        setUnlocked = true; 
        updatePoints();
        notify('Set Theory unlocked! New upgrade available.');
    } else {
        notify(`Need ${unlockCosts.set - points} more points!`);
    }
}

function upgradeSet() {
    if (points >= unlockCosts.setUpgrade) {
        points -= unlockCosts.setUpgrade;
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
    } else {
        notify(`Need ${unlockCosts.setUpgrade - points} more points!`);
    }
}

function unlockRelations() {
    if (points >= unlockCosts.relations) {
        points -= unlockCosts.relations;
        document.getElementById('relations-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockRelations();"]').style.display = 'none';
        relationsUnlocked = true; 
        updatePoints();
        notify('Relations unlocked! New upgrade available.');
    } else {
        notify(`Need ${unlockCosts.relations - points} more points!`);
    }
}

function upgradeRelations() {
    if (points >= unlockCosts.relationsUpgrade) {
        points -= unlockCosts.relationsUpgrade;
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
    } else {
        notify(`Need ${unlockCosts.relationsUpgrade - points} more points!`);
    }
}

function unlockClassifying() {
    if (points >= unlockCosts.classifying) {
        points -= unlockCosts.classifying;
        document.getElementById('classifying-upgrade').style.display = 'flex';
        document.querySelector('button[onclick="unlockClassifying();"]').style.display = 'none';
        classifyingUnlocked = true; 
        updatePoints();
        notify('Classifying Relations unlocked! Secret upgrade available.');
    } else {
        notify(`Need ${unlockCosts.classifying - points} more points!`);
    }
}

function upgradeClassifying() {
    if (points >= unlockCosts.classifyingUpgrade) {
        points -= unlockCosts.classifyingUpgrade;
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


setInterval(function () {
    points += baseGenerationRate; 
    showPointsIndicator(baseGenerationRate); 
    updatePoints();
}, 5000);  

function toggleNav() {
    document.querySelector("nav").classList.toggle("open");
    document.getElementById("nav-toggle").classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', function() {
    updatePoints();
    createTooltips();
    updateTooltips();
    updateAchievementsDisplay();
    setInterval(checkBonus, 30000); 
});

