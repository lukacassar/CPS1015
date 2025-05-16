var points = 0;
var cooldown = false;
var baseGenerationRate = 2;
var predicateUpgrades = 0;
var pointsPerSolve = 1;
var solveCooldown = 600;


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
}

function solveQuestion() {
    if (cooldown) return;
    points += pointsPerSolve;
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
        document.getElementById('predicate-upgrade').style.display = 'flex'; // Show upgrade button as flex
        document.querySelector('button[onclick="unlockPredicate();"]').style.display = 'none'; // Hide Unlock Predicate Logic button
        updatePoints();
        alert('Predicate Logic unlocked! New upgrade available.');
    } else {
        alert(`Need ${unlockCosts.predicate - points} more points!`);
    }
}

function upgradePredicate() {
    if (points >= unlockCosts.predicateUpgrade) {
        points -= unlockCosts.predicateUpgrade;
        predicateUpgrades++;
        pointsPerSolve = 3; // Increase points per Solve Question click to 3
        document.getElementById('predicate-upgrade').style.display = 'none'; // Hide Boost Solve button (one-time use)
        updatePoints();
        updateTooltips();
        alert('Solve Question now awards 3 points per click!');
    } else {
        alert(`Need ${unlockCosts.predicateUpgrade - points} more points!`);
    }
}

function unlockSet() {
    if (points >= unlockCosts.set) {
        points -= unlockCosts.set;
        document.getElementById('set-upgrade').style.display = 'flex'; // Show set-upgrade button
        document.querySelector('button[onclick="unlockSet();"]').style.display = 'none'; // Hide Unlock Set Theory button
        updatePoints();
        alert('Set Theory unlocked! New upgrade available.');
    } else {
        alert(`Need ${unlockCosts.set - points} more points!`);
    }
}

function upgradeSet() {
    if (points >= unlockCosts.setUpgrade) {
        points -= unlockCosts.setUpgrade;
        baseGenerationRate += 0.2; 
        document.getElementById('set-upgrade').style.display = 'none'; 
        updatePoints();
        updateTooltips();
        alert('Idle generation rate increased by 1 point every 5 seconds!');
    } else {
        alert(`Need ${unlockCosts.setUpgrade - points} more points!`);
    }
}

function unlockRelations() {
    if (points >= unlockCosts.relations) {
        points -= unlockCosts.relations;
        document.getElementById('relations-upgrade').style.display = 'flex'; // Show relations-upgrade button
        document.querySelector('button[onclick="unlockRelations();"]').style.display = 'none'; // Hide Unlock Relations button
        updatePoints();
        alert('Relations unlocked! New upgrade available.');
    } else {
        alert(`Need ${unlockCosts.relations - points} more points!`);
    }
}

function upgradeRelations() {
    if (points >= unlockCosts.relationsUpgrade) {
        points -= unlockCosts.relationsUpgrade;
        document.getElementById('relations-upgrade').style.display = 'none'; // Hide relations-upgrade button (one-time use)
        setInterval(() => {
            pointsPerSolve *= 2.5; // Boost points by 2.5x
            updateTooltips();
            alert('Points boosted by 2.5x for 10 seconds!');
            setTimeout(() => {
                pointsPerSolve /= 2.5; // Revert boost after 10 seconds
                updateTooltips();
            }, 10000);
        }, 60000); // Repeat every 60 seconds
        updatePoints();
        updateTooltips();
        alert('Activated 2.5x point boost every 60 seconds for 10 seconds!');
    } else {
        alert(`Need ${unlockCosts.relationsUpgrade - points} more points!`);
    }
}

function unlockClassifying() {
    if (points >= unlockCosts.classifying) {
        points -= unlockCosts.classifying;
        document.getElementById('classifying-upgrade').style.display = 'flex'; // Show classifying-upgrade button
        document.querySelector('button[onclick="unlockClassifying();"]').style.display = 'none'; // Hide Unlock Classifying Relations button
        updatePoints();
        alert('Classifying Relations unlocked! Secret upgrade available.');
    } else {
        alert(`Need ${unlockCosts.classifying - points} more points!`);
    }
}

function upgradeClassifying() {
    if (points >= unlockCosts.classifyingUpgrade) {
        points -= unlockCosts.classifyingUpgrade;
        document.getElementById('classifying-upgrade').style.display = 'none'; // Hide classifying-upgrade button (one-time use)
        // Randomly choose between tripling points or reducing cooldown
        if (Math.random() < 0.5) {
            points *= 3; // Triple current points
            alert('Your points have been tripled!');
        } else {
            solveCooldown = 100; // Reduce Solve Question cooldown to 100ms
            alert('Solve Question cooldown reduced to 100ms!');
        }
        updatePoints();
        updateTooltips();
    } else {
        alert(`Need ${unlockCosts.classifyingUpgrade - points} more points!`);
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

// Idle Resource Generator
setInterval(function () {
    points += baseGenerationRate; 
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
});

