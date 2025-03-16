var points = 0;
var cooldown = false;

// Update point count display
function updatePoints() {
    document.getElementById("pointcount").innerHTML = "You have " + points + " proof points";
}

// Solve a question with cooldown and animation
function solveQuestion() {
    if (cooldown) return;
    points++;
    updatePoints();
    cooldown = true;
    
    var button = document.querySelector('button[onclick="solveQuestion();"]');
    button.classList.add('cooldown');

    setTimeout(function() {
        cooldown = false;
        button.classList.remove('cooldown');
    }, 600);
}

// Unlock functions
function unlockPredicate() {
    if (points >= 100) {
        points -= 100;
        updatePoints();
        alert('Predicate Logic unlocked!');
    } else {
        alert('Not enough points to unlock Predicate Logic.');
    }
}

function unlockSet() {
    if (points >= 1000) {
        points -= 1000;
        updatePoints();
        alert('Set Theory unlocked!');
    } else {
        alert('Not enough points to unlock Set Theory.');
    }
}

function unlockRelations() {
    if (points >= 5000) {
        points -= 5000;
        updatePoints();
        alert('Relations unlocked!');
    } else {
        alert('Not enough points to unlock Relations.');
    }
}

function unlockClassifying() {
    if (points >= 99999) {
        points -= 99999;
        updatePoints();
        alert('Classifying Relations unlocked!');
    } else {
        alert('Not enough points to unlock Classifying Relations.');
    }
}

// Idle point generation every 5 seconds
setInterval(function() {
    points++;
    updatePoints();
}, 5000);

function toggleNav() {
    document.querySelector("nav").classList.toggle("open");
}