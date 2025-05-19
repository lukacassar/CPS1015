const express = require('express');
const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(express.json());
app.use(express.static('.'));

let gameState = {};
// PREP FOR SAVE
app.post('/gameState', (req, res) => {
    const { playerId, points, minigameScore, baseGenerationRate, predicateUpgrades, pointsPerSolve, solveCooldown, predicateUnlocked, setUnlocked, relationsUnlocked, classifyingUnlocked, totalUpgrades, achievements } = req.body;

    // VALIDATION 
    if (!playerId || typeof playerId !== 'string' ||
        typeof points !== 'number' || points < 0 ||
        typeof minigameScore !== 'number' || minigameScore < 0 ||
        typeof baseGenerationRate !== 'number' || baseGenerationRate < 0 ||
        typeof predicateUpgrades !== 'number' || predicateUpgrades < 0 ||
        typeof pointsPerSolve !== 'number' || pointsPerSolve < 1 ||
        typeof solveCooldown !== 'number' || solveCooldown < 0 ||
        typeof predicateUnlocked !== 'boolean' ||
        typeof setUnlocked !== 'boolean' ||
        typeof relationsUnlocked !== 'boolean' ||
        typeof classifyingUnlocked !== 'boolean' ||
        typeof totalUpgrades !== 'number' || totalUpgrades < 0 ||
        !Array.isArray(achievements) || achievements.some(a => typeof a.unlocked !== 'boolean')) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    // DATA SAVE
    gameState[playerId] = { points, minigameScore, baseGenerationRate, predicateUpgrades, pointsPerSolve, solveCooldown, predicateUnlocked, setUnlocked, relationsUnlocked, classifyingUnlocked, totalUpgrades, achievements };

    res.json({ message: 'Game state saved' });
});

// GAME STATE
app.get('/gameState/:playerId', (req, res) => {
    const state = gameState[req.params.playerId];
    if (state) {
        res.json(state);
    } else {
        res.status(404).json({ error: 'Game state not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});