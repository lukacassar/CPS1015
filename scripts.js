var points = 0;
var cooldown = false;
var baseGenerationRate = 2;
var predicateUpgrades = 0; 
var pointsPerSolve = 1; 


const unlockCosts = {
    predicate: 100,
    set: 1000,
    relations: 5000,
    classifying: 99999,
    predicateUpgrade: 250
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
        }, 600);
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
        updatePoints();
        alert('Set Theory unlocked!');
    } else {
        alert(`Need ${unlockCosts.set - points} more points!`);
    }
}

function unlockRelations() {
    if (points >= unlockCosts.relations) {
        points -= unlockCosts.relations;
        updatePoints();
        alert('Relations unlocked!');
    } else {
        alert(`Need ${unlockCosts.relations - points} more points!`);
    }
}

function unlockClassifying() {
    if (points >= unlockCosts.classifying) {
        points -= unlockCosts.classifying;
        updatePoints();
        alert('Classifying Relations unlocked!');
    } else {
        alert(`Need ${unlockCosts.classifying - points} more points!`);
    }
}

function createTooltips() {
    const items = [
        { selector: 'button[onclick="unlockPredicate();"]', cost: unlockCosts.predicate },
        { selector: 'button[onclick="unlockSet();"]', cost: unlockCosts.set },
        { selector: 'button[onclick="unlockRelations();"]', cost: unlockCosts.relations },
        { selector: 'button[onclick="unlockClassifying();"]', cost: unlockCosts.classifying },
        { selector: '#predicate-upgrade', cost: unlockCosts.predicateUpgrade }
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
    const predicateButton = document.querySelector('#predicate-upgrade');
    if (predicateButton) {
        const tooltip = predicateButton.querySelector('.tooltip');
        if (tooltip) {
            tooltip.textContent = `Cost: ${unlockCosts.predicateUpgrade} points`;
        }
    }
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

