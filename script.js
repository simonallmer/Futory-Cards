
document.addEventListener('DOMContentLoaded', () => {
    // --- Helpers ---
    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function getTopCard(el) {
        if (!el || !el.dataset.cardData) return null;
        try {
            const data = JSON.parse(el.dataset.cardData);
            if (Array.isArray(data)) return data[data.length - 1];
            return data;
        } catch(e) { return null; }
    }

    function updateStackIndicator(slot) {
        if (!slot) return;
        
        // Remove existing dynamic elements
        slot.querySelectorAll('.pile-counter, .rarity-indicator, .pile-label').forEach(e => e.remove());
        
        const isHistory = slot.classList.contains('history-pile');
        const isFuture = slot.classList.contains('future-pile');
        
        let data = [];
        try {
            data = JSON.parse(slot.dataset.cardData || '[]');
            if (!Array.isArray(data)) data = data ? [data] : [];
        } catch(e) { data = []; }

        const count = data.length;

        // If empty, reset visuals completely
        if (count === 0) {
            slot.classList.add('slot-empty');
            slot.style.backgroundImage = '';
            slot.style.backgroundColor = '';
            slot.textContent = '';
            
            const label = document.createElement('div');
            label.className = 'pile-label tech-font';
            label.textContent = isHistory ? 'History' : 'Future';
            slot.appendChild(label);
            return;
        }

        // Has cards
        slot.classList.remove('slot-empty');
        slot.textContent = '';
        
        const counter = document.createElement('div');
        counter.className = 'pile-counter tech-font';
        counter.textContent = count;
        slot.appendChild(counter);

        if (isHistory) {
            const topCard = data[data.length - 1];
            const slug = slugify(topCard.name);
            if (topCard.type === 'Steam') {
                slot.style.backgroundImage = `url('assets/${slug}.png')`;
            } else if (topCard.set === 'Unity' && slug) {
                slot.style.backgroundImage = `url('assets/cards/${slug}.png')`;
            } else {
                slot.style.backgroundImage = '';
                slot.style.backgroundColor = 'rgba(255,255,255,0.1)';
                slot.textContent = topCard.name;
            }
        } else {
            // Future is face down
            slot.style.backgroundImage = "url('assets/card_back.png')";
        }
    }

    // --- Elements ---
    const cards = document.querySelectorAll('.card');
    const cardModal = document.getElementById('card-modal');
    const closeCardModalBtn = document.getElementById('close-modal');
    
    // Top Menu Elements
    const btnDatabase = document.getElementById('btn-database');
    const databaseScreen = document.getElementById('database-screen');
    const closeDatabaseBtn = document.getElementById('close-database');
    const databaseBody = document.getElementById('database-body');
    const gameView = document.getElementById('game-view');

    // Multiplayer State
    let activePlayerCount = 2;
    const gameField = document.getElementById('game-field');
    const playerBoardTemplate = document.getElementById('player-zone-template');
    const playerCountToggle = document.getElementById('player-count-toggle');
    
    // Keywords List Elements
    const btnRules = document.getElementById('btn-rules');
    const btnKeywords = document.getElementById('btn-keywords');
    const btnOptions = document.getElementById('btn-options');
    const btnDevlog = document.getElementById('btn-devlog');
    const keywordsListModal = document.getElementById('keywords-list-modal');
    const closeKeywordsListBtn = document.getElementById('close-keywords-list');
    const keywordsListContainer = document.getElementById('keywords-list-container');
    const devlogScreen = document.getElementById('devlog-screen');
    const closeDevlog = document.getElementById('close-devlog');
    const sortBtns = document.querySelectorAll('.sort-btn');
    const keywordSearch = document.getElementById('keyword-search');

    // Keyword Details Modal (Small)
    const keywordModal = document.getElementById('keyword-modal');
    const closeKeywordModalBtn = document.getElementById('close-keyword-modal');
    const keywordTitle = document.getElementById('keyword-title');
    const keywordDesc = document.getElementById('keyword-desc');

    // Sets Modal Elements
    const btnSets = document.getElementById('btn-sets');
    const setsModal = document.getElementById('sets-modal');
    const closeSetsModalBtn = document.getElementById('close-sets-modal');
    const setBtns = document.querySelectorAll('.set-btn:not(.disabled)');

    // Location Modal Elements
    const locationModal = document.getElementById('location-modal');
    const closeLocationModalBtn = document.getElementById('close-location-modal');
    const locationCardPreview = document.getElementById('location-card-preview');

    // Rules Modal Elements
    const rulesModal = document.getElementById('rules-modal');
    const closeRulesModalBtn = document.getElementById('close-rules-modal');
    const rulesBook = document.getElementById('rules-book');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');

    // Dice Elements

    // Quick Help Elements
    const btnHelp = document.getElementById('btn-help');
    const helpWindow = document.getElementById('quick-help-window');
    const helpTitle = document.getElementById('help-title');
    const helpDesc = document.getElementById('help-desc');

    // Options Modal Elements
    const optionsModal = document.getElementById('options-modal');
    const closeOptionsModalBtn = document.getElementById('close-options-modal');

    // Game Over Elements
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const winnerTitle = gameOverOverlay ? gameOverOverlay.querySelector('.winner-title') : null;
    const btnPlayAgain = document.getElementById('btn-play-again');
    const btnBackMenu = document.getElementById('btn-back-menu');
    const btnStats = document.getElementById('btn-stats');
    const btnCloseOverlay = document.getElementById('btn-close-overlay');

    // Board Zones
    const landmarkZone = document.getElementById('landmark-zone');
    const creatureZone = document.getElementById('creature-zone');

    // --- Card Interaction State ---
    let heldCards = [];
    let heldCardSources = [];
    let heldGhost = null;
    let hoverTimer = null;

    // --- Turn & Phase State ---
    let currentPlayer = 1;
    let currentPhase = 0; // 0: Steam, 1: Construction, 2: Creature, 3: End
    let turnSkipped = false;
    let steamBoughtThisTurn = false;
    let gameStarted = false;
    let gameWon = false;
    let activeStrDebuff = 0;
    let totalTurns = 0;
    const phases = ['Steam', 'Construction', 'Creature', 'End'];

    let currentAttackerCard = null;
    let currentAttackerSlot = null;

    document.getElementById('btn-attack-execute')?.addEventListener('click', executeAttack);
    document.getElementById('btn-attack-cancel')?.addEventListener('click', cancelAttack);

    btnDevlog.onclick = () => {
        renderDevLog();
        renderChecklist();
        devlogScreen.classList.remove('hidden');
    };

    closeDevlog.onclick = () => {
        devlogScreen.classList.add('hidden');
    };

    const devlogTabs = document.querySelectorAll('.tab-btn');
    devlogTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            devlogTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const target = tab.dataset.tab;
            if (target === 'history') {
                document.getElementById('devlog-content').classList.remove('hidden');
                document.getElementById('devlog-checklist').classList.add('hidden');
            } else {
                document.getElementById('devlog-content').classList.add('hidden');
                document.getElementById('devlog-checklist').classList.remove('hidden');
            }
        });
    });

    const skipTurnBtn = document.getElementById('skip-turn-btn');
    if (skipTurnBtn) {
        skipTurnBtn.onclick = () => {
            if (currentPhase === 0) { // Only in Steam Phase
                turnSkipped = true;
                
                // --- Card Effect: Fountain of Youth ---
                const board = document.getElementById(`player-${currentPlayer}`);
                const landmarkSlots = Array.from(board.querySelectorAll('.landmark-zone-main .card:not(.slot-empty)'));
                const hasFountain = landmarkSlots.some(s => {
                    try {
                        return JSON.parse(s.dataset.cardData).name === 'Fountain of Youth';
                    } catch(e) { return false; }
                });

                if (hasFountain) {
                    // Priority: Day (left) die first. If Day is out (0), Night (right) die.
                    let targetDie = 'day';
                    if (playersState[currentPlayer].day <= 0) {
                        targetDie = 'night';
                    }
                    adjustPlayerDie(currentPlayer, targetDie, 1);
                }

                currentPhase = 3;
                updatePhaseUI();
            }
        };
    }

    const implementedCards = ["Pandorama", "Fountain of Youth", "Ichor", "Vulcanem", "Cravus", "Rampadon", "Smoke"];

    const devLogData = [
        { date: '2026-04-11', msg: 'Updated combat resolution: Changed automatic timer to a manual "Close" button for better readability of battle results.' },
        { date: '2026-04-11', msg: 'Refined combat UI: Removed redundant buttons, integrated toggle-based blocking, and replaced alerts with in-game feedback.' },
        { date: '2026-04-11', msg: 'Added visual combat enhancements with blocker previews, state-toggling, and card-tap animations.' },
        { date: '2026-04-11', msg: 'Implemented full combat resolution logic including spillover damage and automated history card movement.' },
        { date: '2026-04-11', msg: 'Integrated multiplayer targeting UI with circular player indicators for 3-4 player games.' },
        { date: '2026-04-11', msg: 'Added Dev Log tracking system to manage and display technical progress history.' },
        { date: '2026-04-10', msg: 'Finalized Steam phase purchase logic and Bazaar visibility mechanics during the game loop.' },
        { date: '2026-04-10', msg: 'Implemented expanding hand-fan UI and end-phase card limit enforcement with discard mechanics.' },
        { date: '2026-04-09', msg: 'Resolved card cloning bugs and synchronized card placement state across player zones.' }
    ];

    function renderDevLog() {
        const container = document.getElementById('devlog-content');
        container.innerHTML = '';
        devLogData.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.innerHTML = `
                <div class="log-date">${entry.date}</div>
                <div class="log-msg">${entry.msg}</div>
            `;
            container.appendChild(div);
        });
    }

    function renderChecklist() {
        const container = document.querySelector('#devlog-checklist .checklist-grid');
        if (!container) return;
        container.innerHTML = '';
        
        // Showing all cards from cardData.js
        cardData.forEach(card => {
            const isDone = implementedCards.includes(card.name);
            const item = document.createElement('div');
            item.className = `check-item ${isDone ? 'done' : ''}`;
            item.innerHTML = `
                <span class="name tech-font">${card.name}</span>
                <span class="status">${isDone ? '<span class="status-ok">✔</span>' : '<span class="status-x">✘</span>'}</span>
            `;
            container.appendChild(item);
        });
    }

    function initPlayerBoard(pNum) {
        const container = document.getElementById(`player-${pNum}`);
        if (!container) return;
        
        container.innerHTML = '';
        const clone = playerBoardTemplate.content.cloneNode(true);
        
        const creatureZoneMain = clone.querySelector('.creature-zone-main');
        const historyPileContainer = clone.querySelector('.history-pile-container');
        const landmarkZoneMain = clone.querySelector('.landmark-zone-main');
        const futurePileContainer = clone.querySelector('.future-pile-container');
        
        // Populate 5 Main Slots
        for (let i = 0; i < 5; i++) {
            landmarkZoneMain.appendChild(createSlot('landmark'));
            creatureZoneMain.appendChild(createSlot('creature', i === 2));
        }

        // Populate stacks
        const futureSlot = createStackSlot('Future', 'future-pile');
        const historySlot = createStackSlot('History', 'history-pile');
        
        futurePileContainer.appendChild(futureSlot);
        historyPileContainer.appendChild(historySlot);

        // --- Initialize Standard Deck (5 FireSteam, 2 GoldSteam, 1 Ichor) ---
        const fireSteam = cardData.find(c => c.number === 'STM1');
        const goldSteam = cardData.find(c => c.number === 'STM2');
        const ichor = cardData.find(c => c.number === '009');

        if (fireSteam && goldSteam && ichor) {
            let deck = [];
            for(let i=0; i<5; i++) deck.push({...fireSteam});
            for(let i=0; i<2; i++) deck.push({...goldSteam});
            for(let i=0; i<1; i++) deck.push({...ichor});
            
            shuffle(deck);
            
            futureSlot.dataset.cardData = JSON.stringify(deck);
            futureSlot.classList.remove('slot-empty');
            
            // Visual for Future Pile (Face Down)
            const backImg = 'card_back.png';
            futureSlot.style.backgroundImage = `url('assets/${backImg}')`;
            futureSlot.style.backgroundColor = 'transparent';
            futureSlot.querySelector('.pile-label').style.display = 'none';
            
            updateStackIndicator(futureSlot);
            bindHoverToElement(futureSlot, deck[deck.length - 1]);
        }

        container.appendChild(clone);
        
        // Ensure symmetrical hand layout matches the initial slots
        updateHandLayout(pNum);

        // Setup consolidated dice buttons for this player
        const dieButtons = container.querySelectorAll('.die-btn');
        dieButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayGroup = container.querySelector('.day-die-group');
                const nightGroup = container.querySelector('.night-die-group');
                
                // Logic: Affect Day (left) if it's in play. 
                // If Day is vanished and Night is not, affect Night.
                let target = 'day';
                if (dayGroup.classList.contains('vanished') && !nightGroup.classList.contains('vanished')) {
                    target = 'night';
                }
                
                adjustPlayerDie(pNum, target, btn.classList.contains('plus') ? 1 : -1);
            });
        });

        // Click on die face
        const diceNum = container.querySelectorAll('.circle-counter');
        diceNum.forEach(die => {
            die.addEventListener('click', () => {
                const type = die.classList.contains('orange-die') ? 'day' : 'night';
                adjustPlayerDie(pNum, type, -1);
            });
        });

        // Setup hand slots
        const handSlots = container.querySelectorAll('.hand-slot');
        handSlots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                if (heldCards.length > 0) {
                    if (slot.classList.contains('slot-empty')) {
                        placeCard(slot);
                    } else {
                        cancelGrab(); // Return current hold before grabbing new one to prevent stacking
                        const cardData = JSON.parse(slot.dataset.cardData);
                        grabCard(cardData, slot);
                        clearSlot(slot);
                    }
                } else if (!slot.classList.contains('slot-empty')) {
                    const cardData = JSON.parse(slot.dataset.cardData);
                    grabCard(cardData, slot);
                    clearSlot(slot);
                }
            });
        });

        // Setup auto-drop zone
        const autoDrop = container.querySelector('.hand-auto-drop');
        if (autoDrop) {
            autoDrop.addEventListener('click', (e) => {
                e.stopPropagation();
                if (heldCards.length > 0) {
                    placeCard(autoDrop);
                }
            });
        }

        function handleStartGame() {
            if (gameStarted) return;
            gameStarted = true;
            if (startGameBtn) startGameBtn.remove();
            
            // Global initialization for the first player
            currentPlayer = 1;
            currentPhase = 0;
            
            const phaseUI = document.getElementById('game-phase-display');
            if (phaseUI) phaseUI.classList.remove('hidden');
            
            const gameField = document.getElementById('game-field');
            if (gameField) {
                gameField.className = `players-${activePlayerCount} turn-p${currentPlayer}`;
            }

            // Reset all boards active-player class
            document.querySelectorAll('.player-zone').forEach(z => z.classList.remove('active-player'));
            const myBoard = document.getElementById(`player-${currentPlayer}`);
            if (myBoard) myBoard.classList.add('active-player');
            
            const pLabel = document.getElementById('active-player-label');
            if (pLabel) pLabel.textContent = `PLAYER ${currentPlayer}`;
            
            // Initial layout for all players
            for (let i = 1; i <= activePlayerCount; i++) updateHandLayout(i);

            // Now that boards are visible and active, deal cards to ALL active players
            for (let i = 1; i <= activePlayerCount; i++) {
                const pBoard = document.getElementById(`player-${i}`);
                if (!pBoard) continue;
                
                const pFuturePile = pBoard.querySelector('.future-pile');
                const pHandSlots = Array.from(pBoard.querySelectorAll('.hand-slot'));
                
                if (pFuturePile && pFuturePile.dataset.cardData) {
                    let data = JSON.parse(pFuturePile.dataset.cardData);
                    if (Array.isArray(data) && data.length >= 3) {
                        const availableSlots = pHandSlots.filter(s => s.classList.contains('slot-empty')).slice(0, 3);
                        availableSlots.forEach((slot, idx) => {
                            const card = data.pop();
                            if (card) {
                                pFuturePile.dataset.cardData = JSON.stringify(data);
                                updateStackIndicator(pFuturePile);
                                // Animation ONLY for current active player (Player 1 usually)
                                if (i === currentPlayer) {
                                    animateCardDeal(pFuturePile, slot, card);
                                } else {
                                    // Silent placement for others
                                    slot.classList.remove('slot-empty');
                                    slot.dataset.cardData = JSON.stringify(card);
                                    updateHandLayout(i);
                                }
                            }
                        });
                    }
                }
            }

            updatePhaseUI();
        }

        // Setup Start Game button ONCE for Player 1
        const startGameBtn = container.querySelector('.start-game-btn');
        if (pNum !== 1 && startGameBtn) {
            startGameBtn.remove();
        } else if (startGameBtn) {
            startGameBtn.addEventListener('click', handleStartGame);
            window.handleStartGame = () => handleStartGame(); // Global reference
        }

        updatePlayerDieUI(pNum, 'day');
        updatePlayerDieUI(pNum, 'night');
    }

    function animateCardDeal(sourceEl, targetSlot, cardData) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetSlot.getBoundingClientRect();
        
        const ghost = document.createElement('div');
        ghost.className = 'held-card-ghost';
        ghost.style.left = sourceRect.left + 'px';
        ghost.style.top = sourceRect.top + 'px';
        ghost.style.zIndex = '1000';
        
        // Start face-down
        const backImg = (cardData.type === 'Destiny' || cardData.location === 'D' || cardData.location === 'DA') ? 'destiny_back.png' : 'card_back.png';
        ghost.style.backgroundImage = `url('assets/${backImg}')`;
        
        document.body.appendChild(ghost);
        
        // Force layout
        ghost.offsetHeight;
        
        ghost.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
        ghost.style.left = targetRect.left + 'px';
        ghost.style.top = targetRect.top + 'px';
        ghost.style.transform = 'scale(1.3) rotate(0deg)'; // Hand slots are slightly larger

        setTimeout(() => {
            ghost.remove();
            targetSlot.classList.remove('slot-empty');
            targetSlot.dataset.cardData = JSON.stringify(cardData);
            
            const slug = slugify(cardData.name);
            if (cardData.type === 'Steam') {
                targetSlot.style.backgroundImage = `url('assets/${slug}.png')`;
            } else if (cardData.set === 'Unity' && slug) {
                targetSlot.style.backgroundImage = `url('assets/cards/${slug}.png')`;
            } else {
                targetSlot.style.backgroundImage = '';
                targetSlot.style.backgroundColor = 'rgba(255,255,255,0.1)';
                targetSlot.textContent = cardData.name;
            }
            bindHoverToElement(targetSlot, cardData);
            if (window.updateBazaarLighting) window.updateBazaarLighting();
            
            // Sync hand layout/count
            const board = targetSlot.closest('.player-zone');
            if (board) {
                const pNum = board.id.split('-')[1];
                updateHandLayout(pNum);
            }
        }, 600);
    }

    function createSlot(type, isMiddle = false) {
        const slot = document.createElement('div');
        slot.className = 'card slot-empty' + (isMiddle ? ' middle-slot' : '');
        slot.dataset.type = type;
        if (type === 'hand') slot.classList.add('hand-slot');
        
        slot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (heldCards.length > 0) {
                placeCard(slot);
            } else if (!slot.classList.contains('slot-empty') && !slot.classList.contains('history-pile')) {
                const cardData = JSON.parse(slot.dataset.cardData);
                
                // Add Attack logic here
                const isCreatureZone = slot.parentNode && slot.parentNode.classList.contains('creature-zone-main');
                const isMyBoard = slot.closest('.player-zone') && slot.closest('.player-zone').id === `player-${currentPlayer}`;
                
                if (isCreatureZone && isMyBoard && currentPhase === 2) {
                    // It's the Creature Phase and my creature - Try to attack
                    if (cardData.summonedOnTurn < totalTurns || cardData.name.includes("Cravus") || cardData.name.includes("Rampadon")) { 
                         showAttackMenu(cardData, slot);
                    } else {
                         alert("Summoning sickness! This creature can attack next turn.");
                    }
                    return; 
                }

                // If not attacking, lift card (except locked creatures handled by grabCard)
                grabCard(cardData, slot);
                if (heldCards.length > 0 && heldCardSources.includes(slot)) {
                    clearSlot(slot);
                }
            }
        });
        
        slot.addEventListener('mouseenter', () => {
            if (slot.classList.contains('slot-empty')) clearTimeout(hoverTimer);
        });

        return slot;
    }

    function clearSlot(slot) {
        slot.classList.add('slot-empty');
        slot.style.backgroundImage = '';
        slot.style.backgroundColor = '';
        slot.textContent = '';
        delete slot.dataset.cardData;

        if (slot.classList.contains('temporary-slot')) {
            slot.remove();
        }
        
        // Find which player board this belongs to and update layout
        const board = slot.closest('.player-zone');
        if (board) {
            const pNum = board.id.split('-')[1];
            updateHandLayout(pNum);
        }

        checkHandLimit();
    }

    function createStackSlot(labelTxt, pileClass) {
        const slot = document.createElement('div');
        slot.className = `card slot-empty stack-field ${pileClass}`;
        const label = document.createElement('div');
        label.className = 'pile-label tech-font';
        label.textContent = labelTxt;
        slot.appendChild(label);
        
        slot.addEventListener('click', (e) => {
            e.stopPropagation();
            if (heldCards.length > 0) {
                placeCard(slot);
            } else if (!slot.classList.contains('slot-empty') && !slot.classList.contains('history-pile')) {
                // Lift card from stack
                const data = JSON.parse(slot.dataset.cardData);
                let cardToGrab;
                
                if (Array.isArray(data)) {
                    cardToGrab = data.pop();
                    if (data.length === 0) {
                        delete slot.dataset.cardData;
                        clearStackSlot(slot, labelTxt);
                    } else {
                        slot.dataset.cardData = JSON.stringify(data);
                        // Update visual to new top card (for History) or maintain back (for Future)
                        const newTop = data[data.length - 1];
                        if (slot.classList.contains('history-pile')) {
                            const slug = slugify(newTop.name);
                            if (newTop.type === 'Steam') {
                                slot.style.backgroundImage = `url('assets/${slug}.png')`;
                            } else if (newTop.set === 'Unity' && slug) {
                                slot.style.backgroundImage = `url('assets/cards/${slug}.png')`;
                            } else {
                                slot.style.backgroundImage = '';
                                slot.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                slot.textContent = newTop.name;
                            }
                        }
                        bindHoverToElement(slot, newTop);
                        updateStackIndicator(slot);
                    }
                } else {
                    cardToGrab = data;
                    delete slot.dataset.cardData;
                    clearStackSlot(slot, labelTxt);
                }
                
                grabCard(cardToGrab, slot);
            }
        });
        return slot;
    }

    function clearStackSlot(slot, originalLabel) {
        slot.classList.add('slot-empty');
        slot.style.backgroundImage = '';
        slot.style.backgroundColor = '';
        slot.innerHTML = ''; // Clear label or card text
        const label = document.createElement('div');
        label.className = 'pile-label tech-font';
        label.textContent = originalLabel;
        slot.appendChild(label);
        delete slot.dataset.cardData;
    }



    function grabCard(card, sourceEl = null) {
        // Restriction: Creatures in Creature Zone cannot be grabbed
        if (sourceEl && sourceEl.parentNode && sourceEl.parentNode.classList.contains('creature-zone-main')) {
            return;
        }

        // If grabbing from Bazaar/Source, ensures we don't accidentally stack with previous holds
        const isFromBazaar = sourceEl && sourceEl.dataset.loc && !sourceEl.closest('.player-zone');
        const isFromHand = sourceEl && sourceEl.classList.contains('hand-slot');
        
        if (currentPhase === 3 && !isFromHand) {
            // Silently block non-hand grabs in End Phase
            return;
        }

        if (isFromBazaar) {
            heldCards = [];
            heldCardSources = [];
        }

        heldCards.push(card);
        heldCardSources.push(sourceEl);
        if (heldGhost) heldGhost.remove();
        
        // Show auto-drop buttons
        document.querySelectorAll('.hand-auto-drop').forEach(btn => btn.classList.remove('hidden'));

        updateHeldGhost();
        highlightValidZones(card);
    }

    function updateCreatureStatBadge(slot, card) {
        // Remove existing
        slot.querySelectorAll('.health-badge, .strength-badge').forEach(e => e.remove());
        
        if (!card || card.type !== 'Creature') return;

        // Strength Badge (Displays effectively current health/strength)
        const baseStr = getBaseStrength(card);
        const permMod = card.permanentStrMod || 0;
        const isAttacker = slot.closest('.player-zone') && slot.closest('.player-zone').id === `player-${currentPlayer}`;
        const tempMod = isAttacker ? -activeStrDebuff : 0;
        const damage = card.damageTaken || 0;
        
        // Final value: (Base + Buffs - Debuffs) - Damage
        const finalVal = Math.max(0, (baseStr + permMod + tempMod) - damage);
        
        const sb = document.createElement('div');
        sb.className = 'strength-badge tech-font';
        sb.textContent = finalVal;
        
        // Use baseStr + permMod as comparison point for context
        if (finalVal < (baseStr + permMod)) sb.classList.add('negative');
        else if (finalVal > (baseStr + permMod)) sb.classList.add('positive');
        
        slot.appendChild(sb);
    }

    function getBaseStrength(card) {
        let str = parseInt(card.cost) || 0;
        if (card.description && card.description.includes("Strength")) {
            const match = card.description.match(/Strength (\d+)/);
            if (match) str = parseInt(match[1]);
        }
        return str;
    }

    function updateHeldGhost() {
        if (heldGhost) heldGhost.remove();
        if (heldCards.length === 0) return;

        heldGhost = document.createElement('div');
        heldGhost.className = 'held-card-stack-ghost';
        heldGhost.style.position = 'fixed';
        heldGhost.style.pointerEvents = 'none';
        heldGhost.style.zIndex = '100000';
        
        const visualCount = Math.min(heldCards.length, 3);
        const topIdx = heldCards.length - 1;
        
        for (let i = 0; i < visualCount; i++) {
            const card = heldCards[topIdx - i];
            const layer = document.createElement('div');
            layer.className = 'held-card-ghost';
            layer.style.position = 'absolute';
            layer.style.transform = `translate(${i * 6}px, ${i * -6}px)`;
            layer.style.zIndex = visualCount - i;
            
            const slug = slugify(card.name);
            const backImg = (card.type === 'Destiny' || card.location === 'D' || card.location === 'DA') ? 'destiny_back.png' : 'card_back.png';
            
            if (card.type === 'Steam') {
                layer.style.backgroundImage = `url('assets/${slug}.png')`;
            } else if (card.set === 'Unity' && slug) {
                layer.style.backgroundImage = `url('assets/cards/${slug}.png')`;
            } else {
                layer.style.backgroundImage = `url('assets/${backImg}')`;
                layer.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }
            heldGhost.appendChild(layer);
        }
        document.body.appendChild(heldGhost);

        // Track mouse
        document.onmousemove = (e) => {
            if (heldGhost) {
                heldGhost.style.left = (e.clientX - 45) + 'px';
                heldGhost.style.top = (e.clientY - 60) + 'px';
            }
        };
    }

    function cancelGrab() {
        if (heldCards.length === 0) return;
        document.querySelectorAll('.hand-auto-drop').forEach(btn => btn.classList.add('hidden'));

        heldCards.forEach((card, idx) => {
            const sourceEl = heldCardSources[idx];
            if (sourceEl) {
                const rect = sourceEl.getBoundingClientRect();
                const tempGhost = document.createElement('div');
                tempGhost.className = 'held-card-ghost';
                tempGhost.style.position = 'fixed';
                tempGhost.style.left = (heldGhost.offsetLeft + idx * 6) + 'px';
                tempGhost.style.top = (heldGhost.offsetTop - idx * 6) + 'px';
                
                const slug = slugify(card.name);
                if (card.type === 'Steam') tempGhost.style.backgroundImage = `url('assets/${slug}.png')`;
                else if (card.set === 'Unity' && slug) tempGhost.style.backgroundImage = `url('assets/cards/${slug}.png')`;
                else tempGhost.style.backgroundImage = `url('assets/card_back.png')`;

                document.body.appendChild(tempGhost);

                setTimeout(() => {
                    tempGhost.style.transition = 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    tempGhost.style.left = rect.left + 'px';
                    tempGhost.style.top = rect.top + 'px';
                    tempGhost.style.transform = 'scale(0.8)';
                    tempGhost.style.opacity = '0';
                    setTimeout(() => {
                        tempGhost.remove();
                        // If it came from bazaar, we just let it be (it was never removed)
                        if (sourceEl.dataset.loc) return;

                        sourceEl.classList.remove('slot-empty');
                        sourceEl.dataset.cardData = JSON.stringify(card);
                        if (sourceEl.classList.contains('hand-slot')) {
                            const slug = slugify(card.name);
                            if (card.type === 'Steam') sourceEl.style.backgroundImage = `url('assets/${slug}.png')`;
                            else if (card.set === 'Unity' && slug) sourceEl.style.backgroundImage = `url('assets/cards/${slug}.png')`;
                            else {
                                sourceEl.style.backgroundImage = '';
                                sourceEl.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                sourceEl.textContent = card.name;
                            }
                        }
                        updateStackIndicator(sourceEl);
                        bindHoverToElement(sourceEl, card);
                        updateCreatureVisuals(sourceEl);
                    }, 400);
                }, 10);
            }
        });

        heldCards = [];
        heldCardSources = [];
        if (heldGhost) heldGhost.remove();
        heldGhost = null;
        clearHighlights();
        if (window.updateBazaarLighting) window.updateBazaarLighting();
    }

    function highlightValidZones(card) {
        clearHighlights();
        let targets = [];
        let color = 'white';
        const activeBoard = document.getElementById(`player-${currentPlayer}`);
        if (!activeBoard) return;

        if (card.type === 'Landmark') {
            targets = Array.from(activeBoard.querySelectorAll('.landmark-zone-main .card.slot-empty'));
            color = 'green';
        } else if (card.type === 'Artifact') {
            // Artifacts from bazaar go ONLY to the History pile
            targets = Array.from(activeBoard.querySelectorAll('.history-pile'));
            color = 'purple';
        } else if (card.type === 'Creature') {
            targets = Array.from(activeBoard.querySelectorAll('.hand-slot.slot-empty, .hand-auto-drop'));
            if (currentPhase === 1 || currentPhase === 2) {
                const zones = Array.from(activeBoard.querySelectorAll('.creature-zone-main .card.slot-empty'));
                targets = targets.concat(zones);
            }
            color = 'blue';
        } else if (card.type === 'Spark') {
            // Sparks ONLY to Abyss
            targets = Array.from(document.querySelectorAll('.card--abyss'));
            color = 'white'; 
        } else {
            // Steam etc to hand
            targets = Array.from(activeBoard.querySelectorAll('.hand-slot.slot-empty, .hand-auto-drop'));
        }

        // EVERY non-spark, non-steam card can now be added to Future or History as requested
        if (card.type !== 'Spark' && card.type !== 'Steam') {
            const universalTargets = Array.from(activeBoard.querySelectorAll('.future-pile, .history-pile'));
            universalTargets.forEach(t => {
                if (!targets.includes(t)) targets.push(t);
            });
        }

        targets.forEach(t => {
            const fire = document.createElement('div');
            fire.className = `fire-spot fire-${color}`;
            t.appendChild(fire);
            t.classList.add('valid-drop-target');
        });
    }

    function clearHighlights() {
        document.querySelectorAll('.fire-spot').forEach(f => f.remove());
        document.querySelectorAll('.valid-drop-target').forEach(t => t.classList.remove('valid-drop-target'));
    }

    function placeCard(targetSlot) {
        if (heldCards.length === 0) return;
        
        const isFuture = targetSlot.classList.contains('future-pile');
        const isHistory = targetSlot.classList.contains('history-pile');
        const isAbyss = targetSlot.classList.contains('card--abyss');
        const isStack = isFuture || isHistory || isAbyss;
        const isHand = targetSlot.classList.contains('hand-slot');
        const isAutoDrop = targetSlot.classList.contains('hand-auto-drop');
        const isCreatureZone = targetSlot.parentNode && targetSlot.parentNode.classList.contains('creature-zone-main');
        const isLandmarkZone = targetSlot.parentNode && targetSlot.parentNode.classList.contains('landmark-zone-main');
        const isHandAction = isHand || isAutoDrop;

        const topCard = heldCards[0];
        
        let isValid = false;
        if (topCard.type === 'Spark') {
            isValid = isAbyss; // ONLY Abyss for Spark
        } else {
            // Non-Sparks can go to stacks (Future/History) OR their specialized zones, but NOT Abyss here
            isValid = isFuture || isHistory ||
                      (topCard.type === 'Landmark' && isLandmarkZone) ||
                      (topCard.type === 'Artifact' && (isHistory || isHandAction)) ||
                      (topCard.type === 'Creature' && (isHandAction || isCreatureZone)) ||
                      (topCard.type === 'Steam' && isHandAction);
        }

        if (!isValid) return;



        // Phase specific restrictions for zones
        if (isCreatureZone && (currentPhase !== 1 && currentPhase !== 2)) return;
        if (isLandmarkZone && currentPhase !== 1) return;

        if (isAutoDrop) {
            const handSlotsContainer = targetSlot.closest('.player-zone').querySelector('.hand-slots');
            let firstEmptyArr = Array.from(handSlotsContainer.querySelectorAll('.hand-slot.slot-empty'));
            let firstEmpty = firstEmptyArr[0];
            
            if (!firstEmpty) {
                firstEmpty = createSlot('hand');
                firstEmpty.classList.add('temporary-slot');
                handSlotsContainer.appendChild(firstEmpty);
            }
            targetSlot = firstEmpty;
        }

        // Prevent overwriting occupied non-stack slots
        if (!isStack && !targetSlot.classList.contains('slot-empty')) return;

        // Perform move - remove from Bazaar if that's where it originated
        const sourceEl = heldCardSources[0];
        const isFromBazaar = sourceEl && sourceEl.dataset.loc && !sourceEl.closest('.player-zone');
        const isFromHand = sourceEl && sourceEl.classList.contains('hand-slot');
        const activeBoard = document.getElementById(`player-${currentPlayer}`);
        const isToActiveBoard = targetSlot.closest('.player-zone') === activeBoard;

        // ONLY pay if originating from Bazaar (Buying)
        if (isFromBazaar && topCard.cost) {
            if (currentPhase === 3) return; // Cannot buy during End Phase
            
            // Restriction: Only 1 Steam total per turn from Bazaar
            if (topCard.type === 'Steam') {
                if (steamBoughtThisTurn) return; // Silent block (no more alerts)
                steamBoughtThisTurn = true;
            }

            autoPayCost(topCard);
        }

        if (currentPhase === 3 && !isHistory && !isHandAction) {
            // End Phase only allows discarding to History or putting card back to Hand
            return;
        }

        function removeFromBazaar(source, cardData) {
            const loc = source.dataset.loc;
            if (loc && activeBazaar[loc]) {
                const idx = activeBazaar[loc].findIndex(c => c.name === cardData.name);
                if (idx !== -1) {
                    activeBazaar[loc].splice(idx, 1);
                    renderBazaar();
                }
            }
        }

        // Drop Logic
        if (heldCards.length > 1 && isHand) {
            const hand = targetSlot.closest('.hand-slots');
            const slots = Array.from(hand.querySelectorAll('.hand-slot'));
            const startIndex = slots.indexOf(targetSlot);
            
            let placedCount = 0;
            const currentHoldLength = heldCards.length;
            for (let i = startIndex; i < slots.length && placedCount < currentHoldLength; i++) {
                if (slots[i].classList.contains('slot-empty')) {
                    const c = heldCards[0];
                    const s = heldCardSources[0];
                    if (s && s.dataset.loc) removeFromBazaar(s, c);
                    
                    finishSingleCardPlacement(slots[i], c);
                    heldCards.shift();
                    heldCardSources.shift();
                    placedCount++;
                }
            }
        } else if (isStack) {
            while(heldCards.length > 0) {
                const c = heldCards.shift();
                const s = heldCardSources.shift();
                if (s && s.dataset.loc) removeFromBazaar(s, c);
                finishSingleCardPlacement(targetSlot, c);
            }
        } else {
            const c = heldCards.shift();
            const s = heldCardSources.shift();
            if (s && s.dataset.loc) removeFromBazaar(s, c);
            finishSingleCardPlacement(targetSlot, c);
        }

        if (heldCards.length === 0) {
            document.querySelectorAll('.hand-auto-drop').forEach(btn => btn.classList.add('hidden'));
            if (heldGhost) heldGhost.remove();
            heldGhost = null;
            document.onmousemove = null;
            clearHighlights();
        } else {
            updateHeldGhost();
            highlightValidZones(heldCards[0]);
        }
        
        if (window.updateBazaarLighting) window.updateBazaarLighting();
        
        const board = targetSlot.closest('.player-zone');
        if (board) {
            const pNum = board.id.split('-')[1];
            consolidateHand(pNum);
        } else {
            checkHandLimit(); 
        }

        // Auto-end Steam Phase (0) after a purchase from Bazaar placed into hand
        if (currentPhase === 0 && isFromBazaar && topCard.type === 'Steam' && isHandAction) {
            setTimeout(progressPhase, 700);
        }
    }

    function finishSingleCardPlacement(targetSlot, card) {
        const isFuture = targetSlot.classList.contains('future-pile');
        const isHistory = targetSlot.classList.contains('history-pile');
        const isAbyss = targetSlot.classList.contains('card--abyss');
        const isStack = isFuture || isHistory || isAbyss;

        targetSlot.classList.remove('slot-empty');
        
        if (isStack) {
            let deck = [];
            if (targetSlot.dataset.cardData) {
                try {
                    deck = JSON.parse(targetSlot.dataset.cardData);
                    if (!Array.isArray(deck)) deck = [deck];
                } catch(e) { deck = []; }
            }
            deck.push(card);
            targetSlot.dataset.cardData = JSON.stringify(deck);
        } else {
            // Initialize creature-specific stats if placed in creature zone
            if (targetSlot.parentNode && targetSlot.parentNode.classList.contains('creature-zone-main')) {
                card.summonedOnTurn = totalTurns;
                card.damageTaken = 0;
                // Capture base health (strength)
                if (!card.baseHealth) {
                    card.baseHealth = parseInt(card.health) || 1;
                }
            }
            targetSlot.dataset.cardData = JSON.stringify(card);
        }

        const slug = slugify(card.name);
        const label = targetSlot.querySelector('.pile-label');
        if (label) label.style.display = 'none';

        if (isFuture) {
            const backImg = (card.type === 'Destiny' || card.location === 'D' || card.location === 'DA') ? 'destiny_back.png' : 'card_back.png';
            targetSlot.style.backgroundImage = `url('assets/${backImg}')`;
            targetSlot.style.backgroundColor = 'transparent';
            targetSlot.textContent = '';
        } else if (card.type === 'Steam') {
            targetSlot.style.backgroundImage = `url('assets/${slug}.png')`;
            targetSlot.style.backgroundColor = 'transparent';
            targetSlot.textContent = '';
        } else if (card.set === 'Unity' && slug) {
            targetSlot.style.backgroundImage = `url('assets/cards/${slug}.png')`;
            targetSlot.style.backgroundColor = 'transparent';
            targetSlot.textContent = '';
        } else {
            targetSlot.style.backgroundImage = '';
            targetSlot.style.backgroundColor = 'rgba(255,255,255,0.1)';
            targetSlot.textContent = card.name;
        }

        if (isStack) updateStackIndicator(targetSlot);
        bindHoverToElement(targetSlot, card);
        updateCreatureVisuals(targetSlot);
    }

    function bindHoverToElement(el, cardData) {
        // Remove old listeners if any (simplified here)
        el.onmouseenter = () => {
            clearTimeout(hoverTimer);
            hoverTimer = setTimeout(() => {
                showCardDetails(cardData);
            }, 750);
        };
        el.onmouseleave = () => {
            clearTimeout(hoverTimer);
            cardModal.classList.add('hidden');
        };
    }

    document.addEventListener('mousemove', (e) => {
        if (heldGhost) {
            heldGhost.style.left = (e.clientX - 40) + 'px';
            heldGhost.style.top = (e.clientY - 55) + 'px';
        }
    });

    function initAllActiveBoards() {
        // Always reset all 4 just in case
        for (let i = 1; i <= 4; i++) {
            initPlayerBoard(i);
        }
    }

    // Make keyword accessible globally for inline onclick
    window.showKeyword = function(keywordKey) {
        renderKeywordsList(); // Ensure list is ready
        showKeywordDetail(keywordKey);
        keywordsListModal.classList.remove('hidden');
    };

    // --- State and Bazaar Logic ---
    let selectedSets = ['Unity'];
    let activeBazaar = {};

    function initBazaarInventory() {
        activeBazaar = {};
        cardData.forEach(card => {
            if (!activeBazaar[card.location]) activeBazaar[card.location] = [];
            
            let count = parseInt(card.rarity);
            if (card.type === 'Landmark') count = 3;
            if (card.type === 'Spark') count = 6;
            if (card.type === 'Steam') count = 10;
            if (isNaN(count)) count = 3; 

            // Create deep copies for each card in the pile
            for (let i = 0; i < count; i++) {
                activeBazaar[card.location].push({ ...card });
            }
        });
    }
    initBazaarInventory();

    function renderBazaar() {
        cards.forEach(card => {
            const loc = card.dataset.loc;
            if (!loc) return;

            const allInLoc = activeBazaar[loc] || [];
            const availableCards = allInLoc.filter(c => selectedSets.includes(c.set));
            
            // Clean up old stack visuals (Undoing previous stack thing)
            card.querySelectorAll('.card-stack-layer').forEach(e => e.remove());

            if (availableCards.length === 0) {
                card.classList.add('empty-pile');
                card.style.backgroundImage = '';
                card.style.backgroundColor = '';
                card.style.border = '';
            } else {
                card.classList.remove('empty-pile');
                
                const topCard = availableCards[availableCards.length - 1];
                const isSingleSet = selectedSets.length === 1;
                const isDestiny = topCard.type === 'Destiny' || loc === 'D' || loc === 'DA';
                const isAbyss = loc === 'AB';
                const isSteam = topCard.type === 'Steam';

                // Display count indicator only
                card.querySelectorAll('.rarity-indicator').forEach(e => e.remove());
                if (availableCards.length > 1) {
                    const indicator = document.createElement('div');
                    indicator.className = 'rarity-indicator tech-font';
                    indicator.innerHTML = `<span class="count-value">${availableCards.length}</span><span class="count-label"> LEFT</span>`;
                    card.appendChild(indicator);
                }

                if (isSingleSet && !isDestiny && !isAbyss && !isSteam) {
                    const slug = slugify(topCard.name);
                    card.style.backgroundImage = `url('assets/cards/${slug}.png')`;
                    card.style.backgroundColor = 'transparent';
                    card.style.border = 'none';
                } else {
                    card.style.backgroundImage = '';
                    card.style.backgroundColor = '';
                    card.style.border = '';
                }
            }
        });
    }

    function updateBazaarLighting() {
        if (!activeBazaar) return;

        const bazaarCards = document.querySelectorAll('.bazaar-area .card');
        
        if (!gameStarted) {
            bazaarCards.forEach(cardContainer => cardContainer.classList.remove('unavailable'));
            return;
        }

        const myBoard = document.getElementById(`player-${currentPlayer}`);
        if (!myBoard) return;

        let mySteams = { F: 0, G: 0, L: 0, A: 0 };
        const handSlots = Array.from(myBoard.querySelectorAll('.hand-slot'));
        handSlots.forEach(s => {
            if (!s.classList.contains('slot-empty') && s.dataset.cardData) {
                try {
                    const data = JSON.parse(s.dataset.cardData);
                    if (data.type === 'Steam') {
                        if (data.name.includes('Fire')) mySteams.F++;
                        else if (data.name.includes('Gold')) mySteams.G++;
                        else if (data.name.includes('Laser')) mySteams.L++;
                        mySteams.A++; 
                    }
                } catch(e) {}
            }
        });

        let hasLethargos = false;
        let hasAetherlab = false;
        const landmarks = Array.from(myBoard.querySelectorAll('.landmark-zone-main .card'));
        landmarks.forEach(s => {
            if (!s.classList.contains('slot-empty') && s.dataset.cardData) {
                try {
                    const data = JSON.parse(s.dataset.cardData);
                    if (data.name === "Lethargo's Temple") hasLethargos = true;
                    if (data.name === "Aetherlab") hasAetherlab = true;
                } catch(e) {}
            }
        });

        const canAfford = (topCard) => {
            if (topCard.location === 'AB' || topCard.location === 'D' || topCard.location === 'DA') return true; 
            if (topCard.name === 'FireSteam' || !topCard.cost || topCard.cost === '-') return true;

            let costString = topCard.cost;
            if (topCard.name === 'GoldSteam') costString = 'AAA';

            if (hasLethargos) return true;

            let costCost = { F: 0, G: 0, L: 0, A: 0 };
            for (let char of costString) {
                if (char === 'F') costCost.F++;
                else if (char === 'G') costCost.G++;
                else if (char === 'L') costCost.L++;
                else if (char === 'A') costCost.A++;
            }

            let availF = mySteams.F;
            let availG = mySteams.G;
            let availL = mySteams.L;

            if (availF < costCost.F) return false;
            availF -= costCost.F;

            if (availG < costCost.G) return false;
            availG -= costCost.G;

            if (availL < costCost.L) return false;
            availL -= costCost.L;

            let remainingSteams = availF + availG + availL;
            if (remainingSteams < costCost.A) return false;

            return true;
        };

        bazaarCards.forEach(cardContainer => {
            if (cardContainer.classList.contains('empty-pile')) {
                cardContainer.classList.remove('unavailable');
                return;
            }

            const loc = cardContainer.dataset.loc;
            if (!loc) return;
            const availableCards = (activeBazaar[loc] || []).filter(c => selectedSets.includes(c.set));
            if (availableCards.length === 0) {
                cardContainer.classList.remove('unavailable');
                return;
            }

            const topCard = availableCards[availableCards.length - 1];
            const isSteam = topCard.type === 'Steam';

            let isAvailablePhase = false;
            if (currentPhase === 0) {
                if (isSteam) isAvailablePhase = true;
            } else if (currentPhase === 1) {
                if (!isSteam) isAvailablePhase = true;
                if (isSteam && hasAetherlab) isAvailablePhase = true;
            } else if (currentPhase === 2 || currentPhase === 3) {
                isAvailablePhase = false; 
            }
            
            const affordable = canAfford(topCard);

            if (!isAvailablePhase || !affordable) {
                cardContainer.classList.add('unavailable');
            } else {
                cardContainer.classList.remove('unavailable');
            }
        });
    }

    window.updateBazaarLighting = updateBazaarLighting;

    renderBazaar();
    updateBazaarLighting();

    // --- Interaction Logic ---
    // --- Interaction Logic Rebinding ---
    cards.forEach(cardContainer => {
        const loc = cardContainer.dataset.loc;
        if (!loc) return;

        cardContainer.addEventListener('click', (e) => {
            // Deselect / Return logic
            if (heldCards.length > 0) {
                e.stopPropagation();
                // If it's Abyss, we place. Otherwise, we return to source.
                if (cardContainer.classList.contains('card--abyss') && heldCards[0].type === 'Spark') {
                    placeCard(cardContainer);
                } else {
                    cancelGrab();
                }
                return;
            }

            if (cardContainer.classList.contains('unavailable')) return;

            const allInLoc = activeBazaar[loc] || [];
            const availableCards = allInLoc.filter(c => selectedSets.includes(c.set));
            if (availableCards.length === 0) return;
            
            // If all cards in the pile are the same name, just grab the top one directly
            const allSame = availableCards.every(c => c.name === availableCards[0].name);

            if (allSame) {
                if (heldCards.length === 0) {
                    if (!gameStarted && cardContainer.closest('.bazaar-area')) return; // Block direct grab before start
                    grabCard(availableCards[availableCards.length - 1], cardContainer);
                }
                return;
            }

            // Location stack modal
            const locationTitle = document.getElementById('location-title');
            const locationCards = document.getElementById('location-cards');
            locationTitle.textContent = cardContainer.dataset.type + " Stack";
            locationCards.innerHTML = '';
            locationCardPreview.classList.add('hidden');

            availableCards.forEach(c => {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'location-card-item glass-panel';
                cardDiv.innerHTML = `
                    <div class="loc-card-header">
                        <span class="loc-card-num">${c.number || ''}</span>
                        <span class="loc-card-name">${c.name}</span>
                    </div>
                    <div class="loc-card-cost">${c.cost || '-'}</div>
                `;
                
                cardDiv.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    if (!gameStarted && cardContainer.closest('.bazaar-area')) return; // Block grab from modal before start
                    if (heldCards.length > 0) return; // Prevent double-grab
                    grabCard(c, cardContainer); // Stack returns to its Bazaar container
                    locationModal.classList.add('hidden');
                });
                
                // Hover preview for items in list
                bindHoverToElement(cardDiv, c);
                
                locationCards.appendChild(cardDiv);
            });
            locationModal.classList.remove('hidden');
        });

        // Bazaar card hover logic
        cardContainer.addEventListener('mouseenter', () => {
            const availableCards = cardData.filter(c => selectedSets.includes(c.set) && c.location === loc);
            if (availableCards.length > 0) {
                hoverTimer = setTimeout(() => {
                    showCardDetails(availableCards[availableCards.length-1], true);
                }, 750);
            }
        });
        cardContainer.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            cardModal.classList.add('hidden');
        });
    });

    // --- Modal Controls ---
    btnOptions.addEventListener('click', () => {
        optionsModal.classList.remove('hidden');
    });

    closeOptionsModalBtn.addEventListener('click', () => {
        optionsModal.classList.add('hidden');
    });

    closeCardModalBtn.addEventListener('click', () => {
        cardModal.classList.add('hidden');
    });

    closeKeywordModalBtn.addEventListener('click', () => {
        keywordModal.classList.add('hidden');
    });
    
    closeLocationModalBtn.addEventListener('click', () => {
        locationModal.classList.add('hidden');
    });

    closeSetsModalBtn.addEventListener('click', () => {
        setsModal.classList.add('hidden');
    });

    btnSets.addEventListener('click', () => {
        setsModal.classList.remove('hidden');
    });

    btnRules.addEventListener('click', () => {
        rulesModal.classList.remove('hidden');
    });

    closeRulesModalBtn.addEventListener('click', () => {
        rulesModal.classList.add('hidden');
    });

    // --- 3D Book Logic ---
    let currentPage = 0;
    const pages = document.querySelectorAll('.book-page');

    function updateBook() {
        pages.forEach((page, index) => {
            if (index < currentPage) {
                page.classList.add('flipped');
                page.style.zIndex = index;
            } else {
                page.classList.remove('flipped');
                page.style.zIndex = pages.length - index;
            }
        });
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateBook();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < pages.length - 1) {
            currentPage++;
            updateBook();
        }
    });

    const playersState = {
        1: { day: 12, night: 12 },
        2: { day: 12, night: 12 },
        3: { day: 12, night: 12 },
        4: { day: 12, night: 12 }
    };

    function updatePlayerDieUI(pNum, type) {
        const playerEl = document.getElementById(`player-${pNum}`);
        if (!playerEl) return;

        const val = playersState[pNum][type];
        const groupEl = playerEl.querySelector(type === 'day' ? '.day-die-group' : '.night-die-group');
        const counterEl = groupEl.querySelector('.circle-counter');

        if (val <= 0) {
            groupEl.classList.add('vanished');
        } else {
            groupEl.classList.remove('vanished');
            counterEl.textContent = val;
            
            // Pulse effect
            counterEl.classList.add('pulse-update');
            setTimeout(() => counterEl.classList.remove('pulse-update'), 600);
        }
        
        checkGameOver();
    }

    function checkGameOver() {
        if (!gameOverOverlay) return;
        
        let alivePlayers = [];
        for (let i = 1; i <= activePlayerCount; i++) {
            const p = playersState[i];
            if ((p.day + p.night) > 0) {
                alivePlayers.push(i);
            }
        }

        if (alivePlayers.length === 1) {
            gameWon = true;
            const winnerNum = alivePlayers[0];
            if (winnerText) winnerText.textContent = `PLAYER ${winnerNum} WON!`;
            gameOverOverlay.classList.remove('hidden');
            
            // Add "Switch View" button for post-game inspection
            if (!document.getElementById('btn-switch-view')) {
                const switchBtn = document.createElement('button');
                switchBtn.id = 'btn-switch-view';
                switchBtn.className = 'menu-btn combat-btn';
                switchBtn.textContent = 'SWITCH VIEW';
                switchBtn.style.marginTop = '15px';
                switchBtn.onclick = () => {
                    const nextP = (currentPlayer % activePlayerCount) + 1;
                    currentPlayer = nextP;
                    
                    document.querySelectorAll('.player-zone').forEach(z => z.classList.remove('active-player'));
                    const activeBoard = document.getElementById(`player-${currentPlayer}`);
                    if (activeBoard) {
                        activeBoard.classList.add('active-player');
                        const label = document.getElementById('active-player-label');
                        if (label) label.textContent = `PLAYER ${currentPlayer} (END STATE)`;
                        
                        const gameField = document.getElementById('game-field');
                        if (gameField) {
                            gameField.className = `players-${activePlayerCount} turn-p${currentPlayer}`;
                        }
                    }
                };
                gameOverOverlay.querySelector('.overlay-content').appendChild(switchBtn);
            }
        } else if (alivePlayers.length === 0) {
            gameWon = true;
            if (winnerText) winnerText.textContent = `DRAW!`;
            gameOverOverlay.classList.remove('hidden');
        }
    }

    function adjustPlayerDie(pNum, type, delta) {
        // "Once a die is lost (at 0), it can't be brought back"
        if (playersState[pNum][type] <= 0 && delta > 0) return;

        playersState[pNum][type] = Math.max(0, Math.min(12, playersState[pNum][type] + delta));
        updatePlayerDieUI(pNum, type);
    }

    // --- Quick Help Logic ---
    let helpActive = false;
    const helpData = {
        'abyss': { title: 'Abyss', desc: 'VOID ZONE. Cards cast into the Abyss are removed from the current timeline.' },
        'steam-red': { title: 'Fire Steam', desc: 'RESOURCES. Used primarily to acquire aggressive or high-damage cards.' },
        'steam-gold': { title: 'Gold Steam', desc: 'RESOURCES. Used for construction and high-tier landmarks.' },
        'steam-pink': { title: 'Laser Steam', desc: 'RESOURCES. Used for precision tools and advanced artifact tech.' },
        'destiny': { title: 'Destiny', desc: 'GLOBAL EVENTS. Cards that alter the fundamental laws of the current session.' },
        'landmark': { title: 'Landmark', desc: 'STRUCTURES. Permanent cards that provide ongoing passive benefits.' },
        'creature': { title: 'Creature', desc: 'MINIONS. Your primary units for combat, defense, and objective control.' },
        'artifact': { title: 'Artifact', desc: 'UTILITY. Persistent tools that can be activated for unique abilities.' },
        'spark': { title: 'Spark', desc: 'INSTANT. One-time effects that resolve and go to History immediately.' },
        'history': { title: 'History', desc: 'DISCARD. Where used sparks and destroyed landmarks or creatures reside.' },
        'future': { title: 'Future', desc: 'DECK. Your upcoming potential. Draw cards from here into your hand.' },
        'day-die': { title: 'Day Counter', desc: 'TIME TRACKER. Tracks the sunlight or brightness level. Influences specific cards.' },
        'night-die': { title: 'Night Counter', desc: 'TIME TRACKER. Tracks the shadow or darkness level. Activates night-only abilities.' },
        'player-hand': { title: 'Active Hand', desc: 'YOUR DECK. These are the cards currently available for you to play.' },
        'inactive-hand': { title: 'Opponent Hand', desc: 'QUANTITY. This shows how many cards the opponent is currently holding.' }
    };

    btnHelp.addEventListener('click', () => {
        helpActive = !helpActive;
        btnHelp.classList.toggle('active', helpActive);
        helpWindow.classList.toggle('hidden', !helpActive);
        
        if (!helpActive) {
            helpTitle.textContent = 'Quick Help';
            helpDesc.textContent = 'Hover over any area to learn more.';
        }
    });

    document.addEventListener('mouseover', (e) => {
        if (!helpActive) return;

        const target = e.target;
        let area = null;

        if (target.closest('.card--abyss')) area = 'abyss';
        else if (target.closest('.card-red')) area = 'steam-red';
        else if (target.closest('.card-gold')) area = 'steam-gold';
        else if (target.closest('.card-pink')) area = 'steam-pink';
        else if (target.closest('.card--destiny')) area = 'destiny';
        else if (target.closest('.card--landmark') || target.closest('.landmark-zone')) area = 'landmark';
        else if (target.closest('.card--creature') || target.closest('.creature-zone')) area = 'creature';
        else if (target.closest('.card--artifact')) area = 'artifact';
        else if (target.closest('.card--spark')) area = 'spark';
        else if (target.closest('.history-pile')) area = 'history';
        else if (target.closest('.future-pile')) area = 'future';
        else if (target.closest('.day-die-group')) area = 'day-die';
        else if (target.closest('.night-die-group')) area = 'night-die';
        else if (target.closest('.player-hand-container')) area = 'player-hand';
        else if (target.closest('.inactive-hand-display')) area = 'inactive-hand';

        if (area && helpData[area]) {
            helpTitle.textContent = helpData[area].title;
            helpDesc.textContent = helpData[area].desc;
        }
    });

    // --- Keywords List Logic ---
    let currentSort = 'az';

    btnKeywords.addEventListener('click', () => {
        renderKeywordsList();
        keywordsListModal.classList.remove('hidden');
    });

    closeKeywordsListBtn.addEventListener('click', () => {
        keywordsListModal.classList.add('hidden');
    });

    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.dataset.sort;
            renderKeywordsList();
        });
    });

    keywordSearch.addEventListener('input', () => {
        renderKeywordsList();
    });

    function renderKeywordsList() {
        const query = keywordSearch.value.toLowerCase();
        keywordsListContainer.innerHTML = '';

        let keys = Object.keys(keywordsMap).filter(k => 
            k.toLowerCase().includes(query) || 
            keywordsMap[k].desc.toLowerCase().includes(query)
        );

        let firstKey = null;

        if (currentSort === 'az') {
            keys.sort().forEach((key, index) => {
                if (index === 0) firstKey = key;
                keywordsListContainer.appendChild(createKeywordItem(key));
            });
        } else {
            // Sort by Category
            const categories = {};
            keys.forEach(key => {
                const cat = keywordsMap[key].cat || 'General';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(key);
            });

            const sortedCats = Object.keys(categories).sort();
            sortedCats.forEach((cat, catIdx) => {
                const catTitle = document.createElement('h3');
                catTitle.className = 'category-title';
                catTitle.textContent = cat;
                keywordsListContainer.appendChild(catTitle);

                categories[cat].sort().forEach((key, keyIdx) => {
                    if (catIdx === 0 && keyIdx === 0) firstKey = key;
                    keywordsListContainer.appendChild(createKeywordItem(key));
                });
            });
        }

        // Show first keyword by default if nothing selected and search result exists
        if (firstKey) {
            showKeywordDetail(firstKey);
        } else {
            document.getElementById('display-keyword-title').textContent = 'No results';
            document.getElementById('display-keyword-desc').textContent = '';
            document.getElementById('keyword-meta-tags').innerHTML = '';
        }
    }

    function createKeywordItem(key) {
        const item = keywordsMap[key];
        const div = document.createElement('div');
        div.className = 'keyword-item';
        div.setAttribute('data-keyword', key);
        div.innerHTML = `<span class="keyword-name">${key}</span>`;
        
        div.addEventListener('click', () => {
            showKeywordDetail(key);
        });
        return div;
    }

    function showKeywordDetail(key) {
        const item = keywordsMap[key];
        if (!item) return;

        // Update UI
        document.getElementById('display-keyword-title').textContent = key;
        document.getElementById('display-keyword-desc').textContent = item.desc;
        
        const tags = document.getElementById('keyword-meta-tags');
        tags.innerHTML = `<span class="cat-badge">${item.cat || 'General'}</span>`;

        // Highlight active item in list
        document.querySelectorAll('.keyword-item').forEach(el => {
            el.classList.remove('active');
            if (el.getAttribute('data-keyword') === key) {
                el.classList.add('active');
            }
        });
    }

    setBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const setName = btn.dataset.set;
            if (selectedSets.includes(setName)) {
                if (selectedSets.length > 1) {
                    selectedSets = selectedSets.filter(s => s !== setName);
                    btn.classList.remove('active');
                }
            } else {
                selectedSets.push(setName);
                btn.classList.add('active');
            }
            renderBazaar();
        });
    });

    // Global modal closing logic (outside contents and interactive elements)
    document.addEventListener('click', (e) => {
        const isInteractive = e.target.closest('.card') || 
                            e.target.closest('.location-card-item') || 
                            e.target.closest('.menu-btn') || 
                            e.target.closest('.die-btn') || 
                            e.target.closest('.dice-d12') ||
                            e.target.closest('.modal-content') ||
                            e.target.closest('.card-link') ||
                            e.target.closest('.keyword-link');
        
        if (!isInteractive) {
            [cardModal, keywordModal, setsModal, locationModal, optionsModal, keywordsListModal, rulesModal].forEach(m => {
                if(m) m.classList.add('hidden');
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (heldCards.length > 0) {
                cancelGrab();
                return;
            }
            cardModal.classList.add('hidden');
            keywordModal.classList.add('hidden');
            setsModal.classList.add('hidden');
            locationModal.classList.add('hidden');
            optionsModal.classList.add('hidden');
            keywordsListModal.classList.add('hidden');
            rulesModal.classList.add('hidden');
            if (!databaseScreen.classList.contains('hidden')) {
                databaseScreen.classList.add('hidden');
                gameView.style.display = 'block'; // Or however we handle background
            }
        }
    });

    // --- Database Logic ---
    let isDatabasePopulated = false;

    btnDatabase.addEventListener('click', () => {
        if (!isDatabasePopulated) {
            populateDatabase();
            isDatabasePopulated = true;
        }
        databaseScreen.classList.remove('hidden');
        // Hide game view optionally
        // gameView.style.display = 'none';
    });

    closeDatabaseBtn.addEventListener('click', () => {
        databaseScreen.classList.add('hidden');
        // gameView.style.display = 'block';
    });

    function populateDatabase() {
        databaseBody.innerHTML = '';
        cardData.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${card.number}</td>
                <td><span class="card-link" data-number="${card.number}">${card.name}</span></td>
                <td>${card.cost || '-'}</td>
                <td>${card.rarity || '-'}</td>
                <td>${card.type || '-'}</td>
                <td>${card.set || '-'}</td>
            `;
            databaseBody.appendChild(tr);
        });

        // Add listeners to card links
        document.querySelectorAll('.card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const num = e.target.getAttribute('data-number');
                const cData = cardData.find(c => c.number === num);
                if (cData) {
                    showCardDetails(cData);
                }
            });
        });
    }

    /**
     * TUTORIAL NOTE: Auto-Payment Logic
     * ---------------------------------
     * How it works:
     * When a card with a 'cost' is played into a player zone, the system scans the player's 
     * hand slots from left to right (s1 -> s5).
     * It looks for Steam cards (STM1, STM2, STM3) that match the cost requirements (F, G, L, A).
     * If the full cost can be satisfied, the matching cards are automatically moved to the 
     * History pile with a flying animation.
     * This ensures a predictable payment flow where the leftmost available resources are used first.
     */
    function autoPayCost(card) {
        if (!card.cost) return;
        
        const activeBoard = document.getElementById(`player-${currentPlayer}`);
        if (!activeBoard) return;

        const handSlots = Array.from(activeBoard.querySelectorAll('.hand-slot'));
        const historySlot = activeBoard.querySelector('.history-pile');
        if (!historySlot) return;

        const costChars = card.cost.split('');
        let slotsToUse = [];
        let usedSlotIndices = new Set();

        for (const char of costChars) {
            let found = false;
            for (let i = 0; i < handSlots.length; i++) {
                if (usedSlotIndices.has(i)) continue;
                const slot = handSlots[i];
                if (slot.classList.contains('slot-empty')) continue;

                const slotData = JSON.parse(slot.dataset.cardData);
                // Simple matching: F->STM1, G->STM2, L->STM3, A->Any STM
                if ((char === 'F' && slotData.number === 'STM1') ||
                    (char === 'G' && slotData.number === 'STM2') ||
                    (char === 'L' && slotData.number === 'STM3') ||
                    (char === 'A' && ['STM1', 'STM2', 'STM3'].includes(slotData.number))) {
                    
                    slotsToUse.push({ slot, data: slotData });
                    usedSlotIndices.add(i);
                    found = true;
                    break;
                }
            }
            if (!found) {
                // Could not satisfy full cost - abort auto-pay
                console.log("Could not satisfy full cost for auto-pay");
                return;
            }
        }

        // If we reach here, we found all cards
        slotsToUse.forEach((item, index) => {
            animateCardToHistory(item.slot, historySlot, item.data, index * 100);
            clearSlot(item.slot);
        });
    }

    function animateCardToHistory(sourceEl, historySlot, cardData, delay = 0) {
        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = historySlot.getBoundingClientRect();
        
        setTimeout(() => {
            const ghost = document.createElement('div');
            ghost.className = 'held-card-ghost';
            ghost.style.position = 'fixed';
            ghost.style.left = sourceRect.left + 'px';
            ghost.style.top = sourceRect.top + 'px';
            ghost.style.zIndex = '2000';
            
            const slug = slugify(cardData.name);
            if (cardData.type === 'Steam') {
                ghost.style.backgroundImage = `url('assets/${slug}.png')`;
            } else if (cardData.set === 'Unity' && slug) {
                ghost.style.backgroundImage = `url('assets/cards/${slug}.png')`;
            } else {
                ghost.style.backgroundImage = "url('assets/card_back.png')";
            }
            
            document.body.appendChild(ghost);
            
            // Force layout
            ghost.offsetHeight;
            
            ghost.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            ghost.style.left = targetRect.left + 'px';
            ghost.style.top = targetRect.top + 'px';
            ghost.style.transform = 'scale(0.5)';
            ghost.style.opacity = '0';

            setTimeout(() => {
                ghost.remove();
                
                // ADD DATA TO HISTORY PERSISTENTLY
                let deck = [];
                try {
                    deck = JSON.parse(historySlot.dataset.cardData || '[]');
                } catch(e) { deck = []; }
                deck.push(cardData);
                historySlot.dataset.cardData = JSON.stringify(deck);
                
                updateStackIndicator(historySlot);
            }, 600);
        }, delay);
    }

    function updateCreatureVisuals(slot) {
        if (!slot || slot.classList.contains('slot-empty') || !slot.dataset.cardData) return;
        try {
            const card = JSON.parse(slot.dataset.cardData);
            if (card.type !== 'Creature') return;

            slot.querySelectorAll('.creature-stat-badge, .health-badge, .str-marker').forEach(b => b.remove());
            
            // Calculate special buffs (e.g., Meridia)
            let bonus = 0;
            if (card.name === 'Meridia') {
                const history = slot.closest('.player-zone').querySelector('.history-pile');
                if (history && history.dataset.cardData) {
                    try {
                        const hData = JSON.parse(history.dataset.cardData);
                        const artifacts = Array.isArray(hData) ? hData.filter(c => c.type === 'Artifact').length : (hData.type === 'Artifact' ? 1 : 0);
                        bonus = artifacts;
                    } catch(e) {}
                }
            }
            
            const base = parseInt(card.baseHealth) || 0;
            const curStr = base + bonus - (card.damageTaken || 0);
            
            // Only show the badge if the strength/health has changed from the printed/base value
            if (curStr === base && bonus === 0 && (card.damageTaken || 0) === 0) return;

            const badge = document.createElement('div');
            badge.className = 'creature-stat-badge tech-font';
            badge.textContent = curStr;
            
            if ((card.damageTaken || 0) > 0) badge.classList.add('damage');
            if (bonus > 0) badge.classList.add('buffed');

            slot.appendChild(badge);
        } catch(e) {}
    }

    function showAttackMenu(attackerCard, attackerSlot) {
        currentAttackerCard = attackerCard;
        currentAttackerSlot = attackerSlot;
        document.getElementById('attack-action-menu').classList.remove('hidden');
    }

    function executeAttack() {
        document.getElementById('attack-action-menu').classList.add('hidden');
        if (currentAttackerCard && currentAttackerSlot) {
            triggerAttack(currentAttackerCard, currentAttackerSlot);
        }
    }

    function cancelAttack() {
        document.getElementById('attack-action-menu').classList.add('hidden');
        currentAttackerCard = null;
        currentAttackerSlot = null;
    }

    function triggerAttack(attackerCard, attackerSlot) {
        if (activePlayerCount === 2) {
            const defender = currentPlayer === 1 ? 2 : 1;
            initiateDefense(attackerCard, attackerSlot, defender);
        } else {
            const overlay = document.getElementById('target-player-overlay');
            const list = document.getElementById('target-player-list');
            list.innerHTML = '';
            
            for (let i = 1; i <= activePlayerCount; i++) {
                if (i === currentPlayer) continue;
                const circle = document.createElement('div');
                circle.className = `target-circle p${i}`;
                circle.textContent = `P${i}`;
                circle.onclick = () => {
                    overlay.classList.add('hidden');
                    initiateDefense(attackerCard, attackerSlot, i);
                };
                list.appendChild(circle);
            }
            overlay.classList.remove('hidden');
        }
    }

    function initiateDefense(attacker, attackerSlot, defenderNum) {
        const defenderBoard = document.getElementById(`player-${defenderNum}`);
        const defenseOverlay = document.getElementById('defense-overlay');
        const attackerPreview = document.getElementById('attacker-preview');
        const defenderTarget = document.getElementById('defender-target');
        const feedbackEl = document.getElementById('combat-feedback');
        const btnBlock = document.getElementById('btn-block-creature');
        const btnArtifact = document.getElementById('btn-play-artifact');
        const btnContinue = document.getElementById('btn-combat-continue');

        attackerPreview.style.backgroundImage = attackerSlot.style.backgroundImage;
        attackerPreview.classList.remove('battle-tap-attacker');
        defenderTarget.classList.remove('battle-tap-defender');
        feedbackEl.classList.remove('combat-feedback-vital');

        const availableCreatures = Array.from(defenderBoard.querySelectorAll('.creature-zone-main .card:not(.slot-empty)'));
        const artifactsInHand = Array.from(defenderBoard.querySelectorAll('.hand-slot:not(.slot-empty)')).filter(s => {
            const dataStr = s.dataset.cardData;
            if (!dataStr) return false;
            try {
                const d = JSON.parse(dataStr);
                return d.type === 'Artifact';
            } catch(e) { return false; }
        });

        let isBlocking = false;
        let isCombatResolved = false;
        
        const isRampadon = attacker.name.includes("Rampadon");
        if (isRampadon) {
             btnBlock.disabled = true;
             btnBlock.style.opacity = "0.5";
             feedbackEl.textContent = "Unblockable Attacker Detected!";
        } else if (availableCreatures.length > 0) {
            const firstCreatureSlot = availableCreatures[0];
            defenderTarget.style.backgroundImage = firstCreatureSlot.style.backgroundImage;
            defenderTarget.classList.add('faded');
            defenderTarget.textContent = "";
            btnBlock.disabled = false;
        } else {
            defenderTarget.style.backgroundImage = "";
            defenderTarget.classList.remove('faded', 'active-blocker');
            defenderTarget.textContent = `P${defenderNum}`;
            btnBlock.disabled = true;
        }

        btnArtifact.disabled = artifactsInHand.length === 0;
        btnBlock.classList.remove('in-use');
        btnArtifact.classList.remove('in-use');
        btnContinue.textContent = "CONTINUE";
        if (!isRampadon) feedbackEl.textContent = "Direct Damage Selected";
        
        // Ensure options are visible
        btnBlock.classList.remove('hidden');
        btnArtifact.classList.remove('hidden');

        btnBlock.onclick = () => {
            if (isCombatResolved || isRampadon) return;
            isBlocking = !isBlocking;
            if (isBlocking) {
                defenderTarget.classList.remove('faded');
                defenderTarget.classList.add('active-blocker');
                btnBlock.classList.add('in-use');
                feedbackEl.textContent = "Blocking with Creature";
            } else {
                defenderTarget.classList.add('faded');
                defenderTarget.classList.remove('active-blocker');
                btnBlock.classList.remove('in-use');
                feedbackEl.textContent = "Direct Damage Selected";
            }
        };

        btnArtifact.onclick = () => {
            if (isCombatResolved) return;
            if (artifactsInHand.length > 0) {
                defenseOverlay.classList.add('hidden');
                selectArtifactToPlay(attacker, attackerSlot, defenderNum, artifactsInHand);
            }
        };

        btnContinue.onclick = () => {
            if (isCombatResolved) {
                defenseOverlay.classList.add('hidden');
                return;
            }

            // Lock the phase
            isCombatResolved = true;
            btnBlock.classList.add('hidden');
            btnArtifact.classList.add('hidden');
            btnContinue.textContent = "CLOSE";

            if (isBlocking) {
                const blockerSlot = availableCreatures[0];
                const blockerData = JSON.parse(blockerSlot.dataset.cardData);
                
                feedbackEl.textContent = "Resolving Battle...";
                attackerPreview.classList.add('battle-tap-attacker');
                defenderTarget.classList.add('battle-tap-defender');
                
                setTimeout(() => {
                    resolveCombat(attacker, attackerSlot, blockerData, blockerSlot, defenderNum);
                }, 400);
            } else {
                feedbackEl.textContent = "Resolving Strike...";
                attackerPreview.classList.add('battle-tap-attacker');
                setTimeout(() => {
                    resolveDamageDirect(attacker, attackerSlot, defenderNum);
                }, 400);
            }
        };

        defenseOverlay.classList.remove('hidden');
    }

    // Automatic blocking logic - selectBlocker removed as per user request


    function resolveDamageDirect(attacker, attackerSlot, defenderNum) {
        const feedbackEl = document.getElementById('combat-feedback');
        feedbackEl.classList.add('combat-feedback-vital');
        
        const str = calculateCurrentStrength(attacker, attackerSlot);
        feedbackEl.textContent = `Direct Strike for ${str} Damage!`;
        
        resolveDamageDirectly(str, defenderNum);
        
        const attackerHistory = attackerSlot.closest('.player-zone').querySelector('.history-pile');
        clearSlot(attackerSlot);
        finishSingleCardPlacement(attackerHistory, attacker);
        // initAllActiveBoards() removed - it was resetting the game.
    }

    function calculateCurrentStrength(attacker, attackerSlot) {
        let bonus = 0;
        if (attacker.name === 'Meridia') {
            const history = attackerSlot.closest('.player-zone').querySelector('.history-pile');
            if (history && history.dataset.cardData) {
                try {
                    const hData = JSON.parse(history.dataset.cardData);
                    bonus = Array.isArray(hData) ? hData.filter(c => c.type === 'Artifact').length : 0;
                } catch(e) {}
            }
        }
        let base = (parseInt(attacker.baseHealth) || 0) + bonus - (attacker.damageTaken || 0);
        return Math.max(0, base - activeStrDebuff);
    }

    function resolveCombat(attacker, attackerSlot, blockerData, blockerSlot, defenderNum) {
        const feedbackEl = document.getElementById('combat-feedback');
        feedbackEl.classList.add('combat-feedback-vital');
        
        const attackerStr = calculateCurrentStrength(attacker, attackerSlot);
        let bBonus = 0;
        if (blockerData.name === 'Meridia') {
            const h = blockerSlot.closest('.player-zone').querySelector('.history-pile');
            try {
                const d = JSON.parse(h.dataset.cardData);
                bBonus = Array.isArray(d) ? d.filter(c => c.type === 'Artifact').length : 0;
            } catch(e) {}
        }
        const blockerStr = (parseInt(blockerData.baseHealth) || 0) + bBonus - (blockerData.damageTaken || 0);
        
        const attackerHistory = attackerSlot.closest('.player-zone').querySelector('.history-pile');
        const blockerHistory = blockerSlot.closest('.player-zone').querySelector('.history-pile');

        if (attackerStr > blockerStr) {
            const overflow = attackerStr - blockerStr;
            feedbackEl.textContent = `Blocker Defeated! ${overflow} Spillover Damage.`;
            
            clearSlot(blockerSlot);
            finishSingleCardPlacement(blockerHistory, blockerData);
            resolveDamageDirectly(overflow, defenderNum);
        } else if (attackerStr < blockerStr) {
            feedbackEl.textContent = "Attacker Repelled! Defender Survives.";
            blockerData.damageTaken = (blockerData.damageTaken || 0) + attackerStr;
            blockerSlot.dataset.cardData = JSON.stringify(blockerData);
            updateCreatureStatBadge(blockerSlot, blockerData);
        } else {
            feedbackEl.textContent = "Mutual Destruction! Both cards to History.";
            clearSlot(blockerSlot);
            finishSingleCardPlacement(blockerHistory, blockerData);
        }

        // Cleanup Attacker - ALWAYS move to history regardless of outcome
        clearSlot(attackerSlot);
        finishSingleCardPlacement(attackerHistory, attacker);
    }

    function resolveDamageDirectly(damage, playerNum) {
        const state = playersState[playerNum];
        if (!state) return;
        
        let remain = damage;
        // Reduce leftmost (Day) die first
        if (state.day > 0) {
            const dec = Math.min(state.day, remain);
            state.day -= dec;
            remain -= dec;
        }
        if (remain > 0 && state.night > 0) {
            state.night = Math.max(0, state.night - remain);
        }
        
        updatePlayerDieUI(playerNum, 'day');
        updatePlayerDieUI(playerNum, 'night');
        
        if (state.day <= 0 && state.night <= 0) {
            checkGameOver();
        }
    }

    function resolveBlock(attacker, attackerSlot, defenderNum) {
        const defenderBoard = document.getElementById(`player-${defenderNum}`);
        const availableCreatures = Array.from(defenderBoard.querySelectorAll('.creature-zone-main .card:not(.slot-empty)'));
        if (availableCreatures.length === 0) {
            resolveDamageDirectly(parseInt(attacker.baseHealth) || 0, defenderNum);
            return;
        }
        selectBlocker(attacker, attackerSlot, defenderNum, availableCreatures);
    }


    function passDevice(toPlayer, callback, customBtnText = "START TURN") {
        const overlay = document.getElementById('pass-device-overlay');
        const hint = document.getElementById('next-player-hint');
        const btn = document.getElementById('start-turn-btn');
        
        hint.textContent = `PLAYER ${toPlayer}`;
        btn.textContent = customBtnText;
        overlay.classList.remove('hidden');
        
        btn.onclick = () => {
            overlay.classList.add('hidden');
            if (callback) callback();
        };
    }

    function selectArtifactToPlay(attacker, attackerSlot, defenderNum, handSlots) {
        passDevice(defenderNum, () => {
            // Switch View to Defender
            document.querySelectorAll('.player-zone').forEach(z => z.classList.remove('active-player'));
            document.getElementById(`player-${defenderNum}`).classList.add('active-player');
            const gameField = document.getElementById('game-field');
            const originalClass = gameField.className;
            gameField.className = `players-${activePlayerCount} turn-p${defenderNum}`;
            
            document.body.classList.add('artifact-selection-active');
            let selectedSlots = [];

            // Temporary Continue button
            const followUp = document.createElement('button');
            followUp.className = 'menu-btn combat-btn sticky-confirm';
            followUp.textContent = 'CONFIRM SELECTION';
            followUp.style.position = 'fixed';
            followUp.style.bottom = '40px';
            followUp.style.left = '50%';
            followUp.style.transform = 'translateX(-50%)';
            followUp.style.width = '240px';
            followUp.style.zIndex = '6000';
            document.body.appendChild(followUp);

            handSlots.forEach(slot => {
                slot.classList.add('valid-block-target');
                // Use capturing listener to override the default grab behavior
                const listener = (e) => {
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    if (slot.classList.contains('selected')) {
                        slot.classList.remove('selected');
                        selectedSlots = selectedSlots.filter(s => s !== slot);
                    } else {
                        slot.classList.add('selected');
                        selectedSlots.push(slot);
                    }
                };
                slot.addEventListener('click', listener, true);
                slot._selectionListener = listener; // Store for removal
            });

            followUp.onclick = () => {
                // Process Multi-Selection
                let smokesPlayed = 0;
                selectedSlots.forEach(slot => {
                    const artifactData = JSON.parse(slot.dataset.cardData);
                    const history = slot.closest('.player-zone').querySelector('.history-pile');
                    clearSlot(slot);
                    finishSingleCardPlacement(history, artifactData);
                    
                    // CARD EFFECT: SMOKE (Stackable)
                    if (artifactData.name === "Smoke") {
                        activeStrDebuff += 1;
                        smokesPlayed++;
                    }
                });

                // Update all attackers visually to show the new debuff
                document.querySelectorAll(`.p${currentPlayer} .creature-zone-main .card:not(.slot-empty)`).forEach(s => {
                    const data = JSON.parse(s.dataset.cardData);
                    updateCreatureStatBadge(s, data);
                });

                followUp.remove();
                document.body.classList.remove('artifact-selection-active');
                handSlots.forEach(s => {
                    s.classList.remove('valid-block-target', 'selected');
                    if (s._selectionListener) {
                        s.removeEventListener('click', s._selectionListener, true);
                        delete s._selectionListener;
                    }
                });
                
                // Refresh combat feedback to show the debuff if any smokes played
                if (smokesPlayed > 0) {
                     const feedback = document.getElementById('combat-feedback');
                     feedback.textContent = `Smoke deployed! Attackers -${smokesPlayed} Strength this turn.`;
                     feedback.classList.add('combat-feedback-vital');
                }
                
                // Switch View back to Attacker
                document.querySelectorAll('.player-zone').forEach(z => z.classList.remove('active-player'));
                document.getElementById(`player-${currentPlayer}`).classList.add('active-player');
                gameField.className = originalClass;

                // Return to defense overlay
                const defenseOverlay = document.getElementById('defense-overlay');
                defenseOverlay.classList.remove('hidden');
                initiateDefense(attacker, attackerSlot, defenderNum);
            };
        }, "SELECT ARTIFACT");
    }

    function showCardDetails(card, showBazaarStack = false) {
        const cardImg = document.getElementById('modal-card-img');
        const cardDetails = document.getElementById('card-details');
        const pdfCard = document.createElement('div'); // Temporary or re-use? 
        // The modal-content only has modal-card-img and card-details.
        // Let's add a container for the PDF-like rendering in the modal if it's Duality.
        
        let pdfTemplate = document.getElementById('modal-pdf-template');
        if (!pdfTemplate) {
            // Create the template structure in the modal if it doesn't exist
            const modalContent = document.querySelector('.card-modal-content');
            pdfTemplate = document.getElementById('pdf-card-template').cloneNode(true);
            pdfTemplate.id = 'modal-pdf-template';
            modalContent.appendChild(pdfTemplate);
        }

        // Reset visibility
        cardImg.classList.add('hidden');
        cardImg.style.display = 'none';
        cardDetails.classList.add('hidden');
        pdfTemplate.classList.add('hidden');
        pdfTemplate.style.display = 'none';

        if (card.set === 'Duality') {
            // Render Duality using PDF Template
            renderCardInTemplate(card, pdfTemplate);
            pdfTemplate.classList.remove('hidden');
            pdfTemplate.style.display = 'flex';
            pdfTemplate.classList.add('duality-card');
            
            if (card.type === 'Destiny') {
                pdfTemplate.classList.add('destiny-duality');
            } else {
                pdfTemplate.classList.remove('destiny-duality');
            }
            
            if (card.name === '(Coming soon)') {
                pdfTemplate.querySelector('.pdf-name').textContent = 'Coming Soon';
                pdfTemplate.querySelector('.pdf-desc').textContent = 'This card is currently under development.';
            }

        } else {
            // Unity or Steam
            // Always populate background data
            document.getElementById('modal-card-name').textContent = card.name || '-';
            document.getElementById('detail-type').textContent = card.type || '-';
            document.getElementById('detail-cost').textContent = card.cost || '-';
            document.getElementById('detail-rarity').textContent = card.rarity || '-';
            document.getElementById('detail-set').textContent = card.set || '-';
            document.getElementById('detail-number').textContent = card.number || '-';
            document.getElementById('detail-location').textContent = card.location || '-';
            
            const descEl = document.getElementById('detail-desc');
            if (card.description) {
                let desc = card.description;
                Object.keys(keywordsMap).forEach(kw => {
                    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
                    desc = desc.replace(regex, match => {
                        return `<span class="keyword-link" onclick="window.showKeyword('${kw}')">${match}</span>`;
                    });
                });
                descEl.innerHTML = desc;
            } else {
                descEl.textContent = '-';
            }

            document.getElementById('detail-lore').textContent = card.lore || '';

            cardImg.classList.remove('hidden');
            cardImg.style.display = 'block';

            if (card.type === 'Steam') {
                if (card.name === 'FireSteam') cardImg.src = 'assets/firesteam.png';
                else if (card.name === 'GoldSteam') cardImg.src = 'assets/goldsteam.png';
                else if (card.name === 'LaserSteam') cardImg.src = 'assets/lasersteam.png';
                else cardImg.src = 'assets/card_back.png';
            } else if (card.type === 'Destiny Abyss') {
                cardImg.src = 'assets/destiny_back.png';
                cardImg.style.display = 'none';
            } else {
                const slug = slugify(card.name);
                cardImg.src = `assets/cards/${slug}.png`;
            }
        }

        // --- Handle Modal Inventory Stack ---
        const modalContainer = document.querySelector('.card-modal-content');
        modalContainer.querySelectorAll('.modal-stack-back').forEach(b => b.remove());

        const loc = card.location;
        const remainingInBazaar = (activeBazaar[loc] || []).filter(c => selectedSets.includes(c.set)).length;

        if (showBazaarStack && remainingInBazaar > 1) {
            // Place remaining cards ABOVE the main card (subtract current = 1)
            for (let i = 0; i < Math.min(remainingInBazaar - 1, 10); i++) {
                const back = document.createElement('div');
                back.className = 'modal-stack-back';
                if (card.type === 'Destiny' || loc === 'D' || loc === 'DA') {
                    back.style.backgroundImage = 'url("assets/destiny_back.png")';
                } else {
                    back.style.backgroundImage = 'url("assets/card_back.png")';
                }
                // Increase offset to see the card art properly
                back.style.top = `-${(i + 1) * 30}px`; 
                back.style.zIndex = -1 - i;
                modalContainer.appendChild(back);
            }
        }

        cardModal.classList.remove('hidden');
    }

    function slugify(name) {
        if (!name) return '';
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    }

    function showPreviewDetails(card) {
        const cardImg = document.getElementById('preview-card-img');
        const pdfCard = document.getElementById('pdf-card-template');

        // Reset visibility
        cardImg.classList.add('hidden');
        cardImg.style.display = 'none';
        pdfCard.classList.add('hidden');
        pdfCard.style.display = 'none';

        if (card.set === 'Duality') {
            renderCardInTemplate(card, pdfCard);
            pdfCard.classList.remove('hidden');
            pdfCard.style.display = 'flex';
            pdfCard.classList.add('duality-card');
            
            if (card.type === 'Destiny') {
                pdfCard.classList.add('destiny-duality');
            } else {
                pdfCard.classList.remove('destiny-duality');
            }
        } else {
            // Unity or Steam
            pdfCard.classList.remove('duality-card');
            pdfCard.classList.remove('destiny-duality');
            
            // Path logic
            cardImg.classList.remove('hidden');
            cardImg.style.display = 'block';

            if (card.type === 'Steam') {
                if (card.name === 'FireSteam') cardImg.src = 'assets/firesteam.png';
                else if (card.name === 'GoldSteam') cardImg.src = 'assets/goldsteam.png';
                else if (card.name === 'LaserSteam') cardImg.src = 'assets/lasersteam.png';
                else cardImg.src = 'assets/card_back.png';
            } else if (card.type === 'Destiny Abyss') {
                cardImg.src = 'assets/destiny_back.png';
                if (card.name === 'Destiny Abyss') {
                    cardImg.style.display = 'none';
                }
            } else {
                const slug = slugify(card.name);
                cardImg.src = `assets/cards/${slug}.png`;
            }
        }

        locationCardPreview.classList.remove('hidden');
    }

    function renderCardInTemplate(card, template) {
        const nameEl = template.querySelector('.pdf-name') || template.querySelector('#preview-card-name');
        const costEl = template.querySelector('.pdf-cost') || template.querySelector('#preview-cost');
        const rarityEl = template.querySelector('.pdf-rarity span') || template.querySelector('#preview-rarity');
        const typeEl = template.querySelector('.pdf-type-badge') || template.querySelector('#preview-type');
        const descEl = template.querySelector('.pdf-desc') || template.querySelector('#preview-desc');
        const healthEl = template.querySelector('.pdf-health') || template.querySelector('#preview-health');
        const healthValEl = template.querySelector('.health-val') || template.querySelector('#preview-health-val');
        const numEl = template.querySelector('.pdf-meta span:first-child') || template.querySelector('#preview-number');
        const typeSmallEl = template.querySelector('.pdf-meta span:nth-child(2)') || template.querySelector('#preview-type-small');
        const loreEl = template.querySelector('.pdf-lore') || template.querySelector('#preview-lore');

        if (nameEl) nameEl.textContent = card.name || '-';
        if (rarityEl) rarityEl.textContent = card.rarity || '-';
        if (typeEl) typeEl.textContent = (card.type || '').toUpperCase();
        if (numEl) numEl.textContent = card.number || '-';
        if (typeSmallEl) typeSmallEl.textContent = card.type || '-';
        
        if (costEl) {
            costEl.innerHTML = '';
            if (card.cost && card.cost !== '-') {
                for (let i = 0; i < card.cost.length; i++) {
                    const char = card.cost[i];
                    const orb = document.createElement('div');
                    orb.className = 'cost-orb cost-' + char;
                    costEl.appendChild(orb);
                }
            }
        }
        
        if (descEl) {
            let desc = card.description || '';
            Object.keys(keywordsMap).forEach(kw => {
                const regex = new RegExp(`\\b${kw}\\b`, 'gi');
                desc = desc.replace(regex, match => {
                    return `<span class="keyword-link" onclick="window.showKeyword('${kw}')">${match}</span>`;
                });
            });
            descEl.innerHTML = desc;
        }

        if (loreEl) loreEl.textContent = card.lore ? '"' + card.lore + '"' : '';

        if (healthEl) {
            if (card.type === 'Creature' && card.health) {
                healthEl.classList.remove('hidden');
                if (healthValEl) healthValEl.textContent = card.health;
            } else {
                healthEl.classList.add('hidden');
            }
        }

        let bgColor = '#444'; 
        const typeLower = (card.type || '').toLowerCase();
        if(typeLower === 'landmark') bgColor = '#8db59d';
        if(typeLower === 'creature') bgColor = '#819bcf';
        if(typeLower === 'artifact') bgColor = '#a086b5';
        if(typeLower === 'spark') bgColor = '#a8a8aa';
        if(typeLower === 'destiny') bgColor = '#222';
        template.style.backgroundColor = bgColor;
    }

    // --- Player Count Toggle ---
    playerCountToggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-btn');
        if (!btn) return;
        
        playerCountToggle.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        activePlayerCount = parseInt(btn.dataset.count);
        gameField.className = `players-${activePlayerCount}`;
        
        // Re-init boards
        // Re-init boards
        initAllActiveBoards();
    });

    // --- Turn & Phase Logic ---
    function setupTurnControl() {
        const nextPhaseBtn = document.getElementById('next-phase-btn');
        const startTurnBtn = document.getElementById('start-turn-btn');
        
        if (nextPhaseBtn) nextPhaseBtn.onclick = progressPhase;
        if (startTurnBtn) startTurnBtn.onclick = startTurn;
        
        document.addEventListener('keydown', (e) => {
            const phaseDisplay = document.getElementById('game-phase-display');
            const passOverlay = document.getElementById('pass-device-overlay');
            
            if (e.code === 'Space') {
                if (!gameStarted) {
                    e.preventDefault();
                    if (window.handleStartGame) window.handleStartGame();
                } else if (passOverlay && !passOverlay.classList.contains('hidden')) {
                    e.preventDefault();
                    startTurn();
                } else if (phaseDisplay && !phaseDisplay.classList.contains('hidden')) {
                    // Only if overlay is NOT showing
                    e.preventDefault();
                    progressPhase();
                }
            }
        });
    }

    function progressPhase() {
        if (gameWon) return; // Disable all phase interaction if game won
        if (currentPhase === 3) {
            // Final check on hand limit
            if (!canEndTurn()) return;
        }

        if (currentPhase < 3) {
            currentPhase++;
            updatePhaseUI();
        } else {
            finishTurn();
        }
    }

    function canEndTurn() {
        const board = document.getElementById(`player-${currentPlayer}`);
        if (!board) return true;

        let maxHand = 5;
        const landmarks = Array.from(board.querySelectorAll('.landmark-zone-main .card:not(.slot-empty)'));
        landmarks.forEach(s => {
            try {
                const data = JSON.parse(s.dataset.cardData);
                if (data.name === 'Pandorama') maxHand += 2;
            } catch(e) {}
        });

        const handSlots = Array.from(board.querySelectorAll('.hand-slot'));
        const occupiedCount = handSlots.filter(s => !s.classList.contains('slot-empty')).length;

        return occupiedCount <= maxHand;
    }

    function updatePhaseUI() {
        const blocks = document.querySelectorAll('.phase-block');
        blocks.forEach((b, i) => {
            b.classList.toggle('active', i === currentPhase);
        });
        
        const btn = document.getElementById('next-phase-btn');
        const skipBtn = document.getElementById('skip-turn-btn');

        if (btn) {
            if (currentPhase === 3) {
                btn.textContent = 'End Turn';
                triggerEndPhaseDrawing();
            } else {
                btn.textContent = 'Next Phase';
                endPhaseTriggered = false; // Reset for next cycle
            }
        }

        if (skipBtn) {
            // Show Skip Turn ONLY in Steam Phase (0)
            if (currentPhase === 0) {
                skipBtn.classList.remove('hidden');
            } else {
                skipBtn.classList.add('hidden');
            }
        }

        if (window.updateBazaarLighting) window.updateBazaarLighting();
        checkHandLimit();
    }

    function checkHandLimit() {
        const board = document.getElementById(`player-${currentPlayer}`);
        if (!board) return;
        
        let maxHand = 5;
        // Check for Pandorama in Landmark Zone
        const landmarks = Array.from(board.querySelectorAll('.landmark-zone-main .card:not(.slot-empty)'));
        landmarks.forEach(s => {
            try {
                const data = JSON.parse(s.dataset.cardData);
                if (data.name === 'Pandorama') maxHand += 2;
            } catch(e) {}
        });

        const handSlots = Array.from(board.querySelectorAll('.hand-slot'));
        const occupiedSlots = handSlots.filter(s => !s.classList.contains('slot-empty'));
        const occupiedCount = occupiedSlots.length;

        handSlots.forEach((s, idx) => {
            // Apply overflow style to cards beyond the limit
            if (idx >= maxHand && !s.classList.contains('slot-empty')) {
                s.classList.add('overflow-slot');
            } else {
                s.classList.remove('overflow-slot');
            }
        });

        const btn = document.getElementById('next-phase-btn');
        if (btn && currentPhase === 3) {
            const currentOK = canEndTurn();
            
            if (!currentOK) {
                // Determine how many to discard
                const board = document.getElementById(`player-${currentPlayer}`);
                let maxHand = 5;
                const landmarks = Array.from(board.querySelectorAll('.landmark-zone-main .card:not(.slot-empty)'));
                landmarks.forEach(s => {
                    try {
                        const data = JSON.parse(s.dataset.cardData);
                        if (data.name === 'Pandorama') maxHand += 2;
                    } catch(e) {}
                });
                const handSlots = Array.from(board.querySelectorAll('.hand-slot'));
                const occupiedCount = handSlots.filter(s => !s.classList.contains('slot-empty')).length;

                btn.disabled = true;
                btn.classList.add('disabled');
                btn.textContent = `Discard (${occupiedCount - maxHand})`;
            } else {
                btn.disabled = false;
                btn.classList.remove('disabled');
                btn.textContent = 'End Turn';
            }
        }
    }

    let endPhaseTriggered = false; // Prevent multiple triggers in same phase

    async function animateReshuffle(pNum) {
        const board = document.getElementById(`player-${pNum}`);
        const historyPile = board.querySelector('.history-pile');
        const futurePile = board.querySelector('.future-pile');
        
        const historyRect = historyPile.getBoundingClientRect();
        const futureRect = futurePile.getBoundingClientRect();
        
        // Move 3 "ghost cards" to represent the pile moving
        for (let i = 0; i < 3; i++) {
            const ghost = document.createElement('div');
            ghost.className = 'held-card-ghost';
            ghost.style.position = 'fixed';
            ghost.style.left = historyRect.left + 'px';
            ghost.style.top = historyRect.top + 'px';
            ghost.style.zIndex = '3000';
            ghost.style.backgroundImage = "url('assets/card_back.png')";
            document.body.appendChild(ghost);
            
            ghost.offsetHeight; // Force layout
            
            ghost.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            ghost.style.left = futureRect.left + 'px';
            ghost.style.top = futureRect.top + 'px';
            ghost.style.opacity = '0';
            ghost.style.transform = 'scale(0.8)';
            
            setTimeout(() => ghost.remove(), 700);
            await new Promise(r => setTimeout(r, 150));
        }
    }

    async function triggerEndPhaseDrawing() {
        if (endPhaseTriggered) return;
        endPhaseTriggered = true;

        const board = document.getElementById(`player-${currentPlayer}`);
        if (!board) return;
        
        const futurePile = board.querySelector('.future-pile');
        const historyPile = board.querySelector('.history-pile');
        if (!futurePile || !historyPile) return;

        const drawCount = turnSkipped ? 3 : 2;
        
        const getFutureData = () => {
            try { return JSON.parse(futurePile.dataset.cardData || '[]'); } catch(e) { return []; }
        };
        const getHistoryData = () => {
            try { return JSON.parse(historyPile.dataset.cardData || '[]'); } catch(e) { return []; }
        };

        const initialFuture = getFutureData();
        const initialHistory = getHistoryData();
        const totalAvailable = initialFuture.length + initialHistory.length;
        const actualDraw = Math.min(drawCount, totalAvailable);

        const targets = [];
        for (let i = 0; i < actualDraw; i++) {
            const allSlots = Array.from(board.querySelectorAll('.hand-slot'));
            let targetSlot = allSlots.find(s => s.classList.contains('slot-empty') && !targets.includes(s));
            if (!targetSlot) {
                targetSlot = createSlot('hand');
                targetSlot.classList.add('temporary-slot');
                board.querySelector('.hand-slots').appendChild(targetSlot);
            }
            targets.push(targetSlot);
        }

        // Use a loop instead of simple forEach to handle async reshuffle if needed
        for (let i = 0; i < targets.length; i++) {
            const targetSlot = targets[i];
            
            let currentFuture = getFutureData();
            
            if (currentFuture.length === 0) {
                let currentHistory = getHistoryData();
                if (currentHistory.length > 0) {
                    // PERFORM VISUAL RESHUFFLE
                    await animateReshuffle(currentPlayer);
                    
                    currentFuture = shuffleArray([...currentHistory]);
                    historyPile.dataset.cardData = JSON.stringify([]);
                    updateStackIndicator(historyPile);
                    futurePile.dataset.cardData = JSON.stringify(currentFuture);
                    updateStackIndicator(futurePile);
                }
            }

            if (currentFuture.length > 0) {
                const card = currentFuture.pop();
                futurePile.dataset.cardData = JSON.stringify(currentFuture);
                updateStackIndicator(futurePile);
                
                updateHandLayout(currentPlayer);
                animateCardDeal(futurePile, targetSlot, card);
                
                setTimeout(checkHandLimit, 650);
            }
            
            // Wait for card animation to finish before next draw
            await new Promise(r => setTimeout(r, 500));
        }
    }

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function consolidateHand(playerNum) {
        const board = document.getElementById(`player-${playerNum}`);
        if (!board) return;
        
        const handSlots = Array.from(board.querySelectorAll('.hand-slot'));
        const handContainer = board.querySelector('.hand-slots');
        const cards = [];
        
        // 1. Collect all non-empty cards from current slots
        handSlots.forEach(slot => {
            if (!slot.classList.contains('slot-empty') && slot.dataset.cardData) {
                cards.push(JSON.parse(slot.dataset.cardData));
            }
        });

        // 2. Clear all slots
        handSlots.forEach(slot => {
            slot.classList.add('slot-empty');
            slot.style.backgroundImage = '';
            slot.style.backgroundColor = '';
            slot.textContent = '';
            delete slot.dataset.cardData;
        });

        // 3. Re-populate from the left
        cards.forEach((card, i) => {
            let slot = handSlots[i];
            if (!slot) {
                // If we have more cards than slots, create a temporary one
                slot = createSlot('hand');
                slot.classList.add('temporary-slot');
                handContainer.appendChild(slot);
            }
            slot.classList.remove('slot-empty');
            slot.dataset.cardData = JSON.stringify(card);

            const slug = slugify(card.name);
            if (card.type === 'Steam') {
                slot.style.backgroundImage = `url('assets/${slug}.png')`;
                slot.style.backgroundColor = 'transparent';
                slot.textContent = '';
            } else if (card.set === 'Unity' && slug) {
                slot.style.backgroundImage = `url('assets/cards/${slug}.png')`;
                slot.style.backgroundColor = 'transparent';
                slot.textContent = '';
            } else {
                slot.style.backgroundImage = '';
                slot.style.backgroundColor = 'rgba(255,255,255,0.1)';
                slot.textContent = card.name;
            }
            bindHoverToElement(slot, card);
            updateCreatureVisuals(slot);
        });

        // 4. Cleanup: Remove any empty temporary slots (keeping the standard 5)
        const updatedSlots = Array.from(board.querySelectorAll('.hand-slot'));
        for (let i = updatedSlots.length - 1; i >= 5; i--) {
            if (updatedSlots[i].classList.contains('slot-empty') && updatedSlots[i].classList.contains('temporary-slot')) {
                updatedSlots[i].remove();
            }
        }

        updateHandLayout(playerNum);
    }

    function updateHandLayout(playerNum) {
        const board = document.getElementById(`player-${playerNum}`);
        if (!board) return;
        
        // --- Card Effect: Pandorama ---
        let handLimitBoost = 0;
        const landmarkSlots = board.querySelectorAll('.landmark-zone-main .card:not(.slot-empty)');
        landmarkSlots.forEach(slot => {
            try {
                const data = JSON.parse(slot.dataset.cardData);
                if (data.name === 'Pandorama') {
                    handLimitBoost += 2;
                }
            } catch(e) {}
        });

        const handSlots = Array.from(board.querySelectorAll('.hand-slot'));
        const activeLimit = 5 + handLimitBoost;
        
        // Calculate the total number of slots that NEED to be shown (limit slots + any occupied overflow slots)
        const visibleSlots = handSlots.filter((slot, index) => index < activeLimit || !slot.classList.contains('slot-empty'));
        const totalDisplayedCount = visibleSlots.length;

        handSlots.forEach((slot, index) => {
            const isVisible = index < activeLimit || !slot.classList.contains('slot-empty');
            
            if (isVisible) {
                slot.classList.remove('hidden-slot');
                slot.style.setProperty('--fan-total', totalDisplayedCount);
                slot.style.setProperty('--fan-index', index);
            } else {
                slot.classList.add('hidden-slot');
            }
            
            // Re-apply classes for CSS effects (s1, s2, etc.)
            for (let i = 1; i <= 20; i++) slot.classList.remove(`s${i}`);
            slot.classList.add(`s${index + 1}`);
        });

        // Update card count display for inactive boards
        const countLabel = board.querySelector('.hand-card-count');
        if (countLabel) {
            const occupiedCount = handSlots.filter(s => !s.classList.contains('slot-empty')).length;
            countLabel.textContent = occupiedCount;
        }

        checkHandLimit();
    }

    function finishTurn() {
        cancelGrab();
        const nextP = (currentPlayer % activePlayerCount) + 1;
        
        // If we full-cycled back to Player 1, increment total turns
        if (nextP === 1) {
            totalTurns++;
        }

        currentPlayer = nextP;
        currentPhase = 0;
        turnSkipped = false;
        steamBoughtThisTurn = false;
        activeStrDebuff = 0;

        const hint = document.getElementById('next-player-hint');
        if (hint) hint.textContent = `To Player ${currentPlayer}`;
        
        const label = document.getElementById('active-player-label');
        if (label) label.textContent = `PLAYER ${currentPlayer}`;
        
        const gameField = document.getElementById('game-field');
        if (gameField) {
            gameField.className = `players-${activePlayerCount} turn-p${currentPlayer}`;
        }

        // Reset all boards active-player class
        document.querySelectorAll('.player-zone').forEach(z => z.classList.remove('active-player'));
        const activeBoard = document.getElementById(`player-${currentPlayer}`);
        if (activeBoard) activeBoard.classList.add('active-player');

        const phaseDisplay = document.getElementById('game-phase-display');
        if (phaseDisplay) phaseDisplay.classList.add('hidden');

        const overlay = document.getElementById('pass-device-overlay');
        if (overlay) overlay.classList.remove('hidden');
    }

    function startTurn() {
        const overlay = document.getElementById('pass-device-overlay');
        if (overlay) overlay.classList.add('hidden');
        
        const phaseDisplay = document.getElementById('game-phase-display');
        if (phaseDisplay) phaseDisplay.classList.remove('hidden');
        
        updatePhaseUI();
        if (window.updateBazaarLighting) window.updateBazaarLighting();
        consolidateHand(currentPlayer);
    }

    // --- Game Over Button Handlers ---
    if (btnPlayAgain) {
        btnPlayAgain.addEventListener('click', () => {
            gameOverOverlay.classList.add('hidden');
            // Complete reset: Re-initialize player states and boards
            gameStarted = false;
            for (let i = 1; i <= 4; i++) {
                if (playersState[i]) {
                    playersState[i].day = 12;
                    playersState[i].night = 12;
                }
            }
            initAllActiveBoards();
        });
    }

    if (btnBackMenu) {
        btnBackMenu.addEventListener('click', () => {
            window.location.reload(); // Returns to fresh start/menu state
        });
    }

    if (btnStats) {
        btnStats.addEventListener('click', () => {
            alert('Stats coming soon! Tracking damage per player...');
        });
    }

    if (btnCloseOverlay) {
        btnCloseOverlay.addEventListener('click', () => {
            gameOverOverlay.classList.add('hidden');
        });
    }

    setupTurnControl();
    initAllActiveBoards(); // Initial spawn
});
