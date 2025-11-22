// --- Database Logic (Global Scope) ---
const cardData = [
    { number: '001', name: 'Pandorama', cost: 'AA', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L1', description: 'Your Card Limit is increased by 2.', lore: 'Those who reach the Pandorama shall behold the world anew.', image: 'images/pandorama.jpg' },
    { number: '002', name: 'Fountain of Youth', cost: 'GL', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L2', description: 'Gain 1 Time Point whenever you draw 3 Cards in your End Phase.', lore: 'The blood of the innocent soaks the ground beneath.', image: 'images/fountain_of_youth.jpg' },
    { number: '003', name: "Dragura's Wasteland", cost: 'FFF', rarity: '3', type: 'Landmark', set: 'Unity' },
    { number: '004', name: 'Planetarium', cost: 'FGL', rarity: '3', type: 'Landmark', set: 'Unity' },
    { number: '005', name: 'Laser Catalyst', cost: '', rarity: '3', type: 'Landmark', set: 'Unity' },
    { number: '006', name: "Lethargo's Temple", cost: '', rarity: '3', type: 'Landmark', set: 'Unity' },
    { number: '007', name: 'Clone Factory', cost: '', rarity: '3', type: 'Landmark', set: 'Unity' },
    { number: '008', name: 'Aetherlab', cost: '', rarity: '3', type: 'Landmark', set: 'Unity' },
    { number: '009', name: 'Ichor', cost: '', rarity: '6', type: 'Creature', set: 'Unity' },
    { number: '010', name: 'Cravus', cost: '', rarity: '6', type: 'Creature', set: 'Unity' },
    { number: '011', name: 'Entrophy', cost: '', rarity: '3', type: 'Creature', set: 'Unity' },
    { number: '012', name: 'Meridius', cost: '', rarity: '6', type: 'Creature', set: 'Unity' },
    { number: '013', name: 'Meridia', cost: '', rarity: '6', type: 'Creature', set: 'Unity' },
    { number: '014', name: 'Time Thief', cost: '', rarity: '3', type: 'Creature', set: 'Unity' },
    { number: '015', name: 'Rampadon', cost: '', rarity: '3', type: 'Creature', set: 'Unity' },
    { number: '016', name: 'Vulcanem', cost: '', rarity: '3', type: 'Creature', set: 'Unity' },
    { number: '017', name: 'Smoke', cost: '', rarity: '6', type: 'Artifact', set: 'Unity' },
    { number: '018', name: 'Dark Matter', cost: '', rarity: '6', type: 'Artifact', set: 'Unity' },
    { number: '019', name: 'Reflector', cost: '', rarity: '3', type: 'Artifact', set: 'Unity' },
    { number: '020', name: 'Talisman', cost: '', rarity: '3', type: 'Artifact', set: 'Unity' },
    { number: '021', name: 'Reversal', cost: '', rarity: '6', type: 'Spark', set: 'Unity' },
    { number: '022', name: 'Faith', cost: '', rarity: '6', type: 'Spark', set: 'Unity' },
    { number: '023', name: 'Threat', cost: '', rarity: '6', type: 'Spark', set: 'Unity' },
    { number: '024', name: 'Confiscation', cost: '', rarity: '6', type: 'Spark', set: 'Unity' },
    { number: '025', name: 'Healing Tree', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '026', name: 'Freeze', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '027', name: 'Dragon Throne', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '028', name: 'Unstoppable Force', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '029', name: 'Truce', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '030', name: 'Voider', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '031', name: 'Space Voider', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '032', name: 'Eternal Hour', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '033', name: 'Great Flood', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '034', name: 'Laser Bomb', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '035', name: "Daredevil's Reward", cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '036', name: "Lethargo's Approach", cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '037', name: 'Sacrifice', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '038', name: 'Break of Dawn', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '039', name: 'Sandstorm', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '040', name: 'Wormhole', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '041', name: "Dragura's Command", cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '042', name: "Rula's Support", cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '043', name: 'Contermination', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '044', name: "Noctura's Night", cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '045', name: 'Sunken City', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '046', name: "Kyro's Destiny", cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '047', name: 'Chrono Machine', cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '048', name: "Meridia's Revenge", cost: '', rarity: '1', type: 'Destiny', set: 'Unity' },
    { number: '049', name: 'Time Bender', cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '050', name: "Meridia's Cabin", cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '051', name: 'Repo Station', cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '052', name: 'Gravitas', cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '053', name: 'Hand of Rhone', cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '054', name: 'Atlantica', cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '055', name: 'Hyperscope', cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '056', name: 'Pyralos', cost: '', rarity: '3', type: 'Landmark', set: 'Duality' },
    { number: '057', name: 'Chrona', cost: '', rarity: '6', type: 'Creature', set: 'Duality' },
    { number: '058', name: 'Razo', cost: '', rarity: '', type: 'Creature', set: 'Duality' },
    { number: '059', name: 'Looper', cost: '', rarity: '', type: 'Creature', set: 'Duality' },
    { number: '060', name: 'Aromeas', cost: '', rarity: '', type: 'Creature', set: 'Duality' },
    { number: '061', name: 'Masiota', cost: '', rarity: '', type: 'Creature', set: 'Duality' },
    { number: '062', name: 'General Wave', cost: '', rarity: '', type: 'Creature', set: 'Duality' },
    { number: '063', name: 'Namandi', cost: '', rarity: '', type: 'Creature', set: 'Duality' },
    { number: '064', name: 'Sea Lord', cost: '', rarity: '', type: 'Creature', set: 'Duality' },
    { number: '065', name: 'Sleep Potion', cost: '', rarity: '6', type: 'Artifact', set: 'Duality' },
    { number: '066', name: 'Lotus', cost: '', rarity: '6', type: 'Artifact', set: 'Duality' },
    { number: '067', name: 'Rush', cost: '', rarity: '3', type: 'Artifact', set: 'Duality' },
    { number: '068', name: 'Cell Shield', cost: '', rarity: '3', type: 'Artifact', set: 'Duality' },
    { number: '069', name: 'Tame Beast', cost: '', rarity: '6', type: 'Spark', set: 'Duality' },
    { number: '070', name: 'Tele Control', cost: '', rarity: '6', type: 'Spark', set: 'Duality' },
    { number: '071', name: 'Alchemy', cost: '', rarity: '6', type: 'Spark', set: 'Duality' },
    { number: '072', name: 'Burden of Wealth', cost: '', rarity: '6', type: 'Spark', set: 'Duality' },
    { number: '073', name: 'Cosmic Eclipse', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '074', name: 'Fortunate Verdict', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '075', name: 'Unfortunate Verdict', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '076', name: 'Missing Merchants', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '077', name: 'Scorched Planet', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '078', name: 'Blind Raider', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '079', name: 'Natureon', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '080', name: 'Trade', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '081', name: 'Refill', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '082', name: 'Royal Privilege', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '083', name: 'Ashes to Flesh', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '084', name: 'Looking Glass', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '085', name: 'Vortex', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '086', name: "Amphion's Fog", cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '087', name: 'Will of Sarus', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '088', name: 'Lost Souls', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '089', name: "Dragon's Apprentice", cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '090', name: 'Scavenger', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '091', name: 'Surge', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '092', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '093', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '094', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '095', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '096', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' }
];

document.addEventListener('DOMContentLoaded', () => {
    // --- Parallax Effect ---
    const stars = document.querySelector('.stars');
    const twinkling = document.querySelector('.twinkling');

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        stars.style.transform = `translate(${x}px, ${y}px)`;
        twinkling.style.transform = `translate(${x * 2}px, ${y * 2}px)`;
    });

    // --- Navigation Logic ---
    const screens = {
        home: document.getElementById('home-screen'),
        localMode: document.getElementById('local-mode-screen'),
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen'),
        database: document.getElementById('database-screen'),
        events: document.getElementById('events-screen'),
        rules: document.getElementById('rules-screen'),
        construction: document.getElementById('construction-screen')
    };

    function showScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
                screen.classList.add('hidden');
            }
        });

        // Show target screen
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
            // Small timeout to allow display:flex to apply before opacity transition
            setTimeout(() => {
                screens[screenName].classList.add('active');
            }, 10);
        } else {
            console.error(`Screen not found: ${screenName}`);
        }

        // Toggle Header Visibility
        const header = document.getElementById('main-header');
        if (screenName === 'game') {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
    }

    // Home Screen Buttons
    document.getElementById('btn-local-play').addEventListener('click', () => showScreen('localMode'));
    document.getElementById('btn-online-play').addEventListener('click', () => showScreen('construction'));
    document.getElementById('btn-rules').addEventListener('click', () => showScreen('rules'));
    document.getElementById('btn-dev-mode').addEventListener('click', () => {
        startGame();
    });
    document.getElementById('btn-back-sa').addEventListener('click', () => {
        window.location.href = 'https://simonallmer.com';
    });

    // Title click to go home
    const gameTitle = document.querySelector('.game-title');
    if (gameTitle) {
        gameTitle.style.cursor = 'pointer';
        gameTitle.addEventListener('click', () => showScreen('home'));
    }

    // Database & Events Buttons
    const menuButtons = document.querySelectorAll('.main-menu .menu-btn');

    Array.from(menuButtons).forEach(btn => {
        if (btn.textContent.includes('Database')) {
            btn.classList.remove('disabled');
            btn.removeAttribute('data-tooltip');
            btn.addEventListener('click', () => {
                populateDatabase();
                showScreen('database');
            });
        }
        if (btn.textContent.includes('Events')) {
            btn.classList.remove('disabled');
            btn.removeAttribute('data-tooltip');
            btn.addEventListener('click', () => showScreen('events'));
        }
    });

    // Local Mode Screen Buttons
    document.getElementById('btn-mode-human').addEventListener('click', () => showScreen('setup'));

    // Handle "Back" buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Determine where to go back to based on current visibility
            if (screens.setup.classList.contains('active')) {
                showScreen('localMode');
            } else if (screens.localMode.classList.contains('active')) {
                showScreen('home');
            } else if (screens.database.classList.contains('active')) {
                showScreen('home');
            } else if (screens.events.classList.contains('active')) {
                showScreen('home');
            } else if (screens.rules.classList.contains('active')) {
                showScreen('home');
            } else if (screens.construction.classList.contains('active')) {
                showScreen('home');
            } else if (screens.game.classList.contains('active')) {
                showScreen('home');
            }
        });
    });

    // --- Setup Screen Logic ---
    document.querySelectorAll('input[name="sets"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const label = e.target.closest('.checkbox-btn');
            e.target.checked ? label.classList.add('selected') : label.classList.remove('selected');
        });
    });

    document.querySelectorAll('input[name="time"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.radio-btn').forEach(lbl => lbl.classList.remove('selected'));
            if (e.target.checked) e.target.closest('.radio-btn').classList.add('selected');
        });
    });

    // Start Game Button
    const btnStartGame = document.getElementById('btn-start-game');
    if (btnStartGame) {
        btnStartGame.addEventListener('click', () => {
            try {
                startGame();
            } catch (error) {
                console.error("Error starting game:", error);
                alert("Error starting game: " + error.message);
            }
        });
    } else {
        console.error("Start Game button not found!");
    }

    // --- Rules Page Logic ---
    // Tab switching
    const tabGeneralRules = document.getElementById('tab-general-rules');
    const tabKeywords = document.getElementById('tab-keywords');
    const generalRulesContent = document.getElementById('general-rules-content');
    const keywordsContent = document.getElementById('keywords-content');

    if (tabGeneralRules && tabKeywords) {
        tabGeneralRules.addEventListener('click', () => {
            tabGeneralRules.classList.add('active');
            tabKeywords.classList.remove('active');
            generalRulesContent.classList.add('active');
            generalRulesContent.classList.remove('hidden');
            keywordsContent.classList.remove('active');
            keywordsContent.classList.add('hidden');
        });

        tabKeywords.addEventListener('click', () => {
            tabKeywords.classList.add('active');
            tabGeneralRules.classList.remove('active');
            keywordsContent.classList.add('active');
            keywordsContent.classList.remove('hidden');
            generalRulesContent.classList.remove('active');
            generalRulesContent.classList.add('hidden');
        });
    }

    // Keyword accordion functionality
    document.querySelectorAll('.keyword-header').forEach(header => {
        header.addEventListener('click', () => {
            const keywordItem = header.closest('.keyword-item');
            const description = keywordItem.querySelector('.keyword-description');

            // Toggle expanded state
            keywordItem.classList.toggle('expanded');
            description.classList.toggle('hidden');
        });
    });

    // Keyword info panel functionality (for modal)
    const keywordInfoPanelModal = document.getElementById('keyword-info-panel-modal');
    const keywordInfoTitleModal = document.getElementById('keyword-info-title-modal');
    const keywordInfoContentModal = document.getElementById('keyword-info-content-modal');
    const closeKeywordInfoModal = document.getElementById('close-keyword-info-modal');

    // Function to show keyword info in modal side panel
    window.navigateToKeyword = function (keywordId) {
        // Don't close the modal - keep the card open!

        // Get keyword data from the Rules page
        const keywordItem = document.querySelector(`[data-keyword="${keywordId}"]`);
        if (keywordItem) {
            const keywordName = keywordItem.querySelector('.keyword-name').textContent;
            const keywordDesc = keywordItem.querySelector('.keyword-description p').textContent;

            // Update modal panel content
            keywordInfoTitleModal.textContent = keywordName;
            keywordInfoContentModal.innerHTML = `<p>${keywordDesc}</p>`;

            // Show modal panel
            keywordInfoPanelModal.classList.remove('hidden');
        }
    };

    // Close keyword info modal panel
    if (closeKeywordInfoModal) {
        closeKeywordInfoModal.addEventListener('click', () => {
            keywordInfoPanelModal.classList.add('hidden');
        });
    }

    // --- Game Logic ---
    let currentPhase = 0; // 0: Steam, 1: Construction, 2: Creature, 3: End

    function startGame() {
        console.log("Starting game...");
        renderBazaar();
        resetGameUI();
        showScreen('game');
    }

    function resetGameUI() {
        currentPhase = 0;
        updatePhaseUI();

        // Reset Hand Window
        const handWindow = document.getElementById('hand-window');
        const toggleText = handWindow.querySelector('.toggle-text');
        const toggleIcon = handWindow.querySelector('.toggle-icon');

        // Open by default
        handWindow.classList.remove('collapsed');
        toggleText.textContent = "Close Hand";
        toggleIcon.textContent = "▼";
    }

    // Phase Logic
    document.getElementById('btn-next-phase').addEventListener('click', () => {
        currentPhase = (currentPhase + 1) % 4;
        updatePhaseUI();
    });

    function updatePhaseUI() {
        const steps = document.querySelectorAll('.phase-step');
        steps.forEach((step, index) => {
            if (index === currentPhase) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Hand Window Logic
    const btnToggleHand = document.getElementById('btn-toggle-hand');
    const handWindow = document.getElementById('hand-window');

    btnToggleHand.addEventListener('click', () => {
        handWindow.classList.toggle('collapsed');
        const isCollapsed = handWindow.classList.contains('collapsed');
        const toggleText = handWindow.querySelector('.toggle-text');
        const toggleIcon = handWindow.querySelector('.toggle-icon');

        if (isCollapsed) {
            toggleText.textContent = "Open Hand";
            toggleIcon.textContent = "▲";
        } else {
            toggleText.textContent = "Close Hand";
            toggleIcon.textContent = "▼";
        }
    });

    function renderBazaar() {
        const row1 = document.getElementById('bazaar-row-1');
        const row2 = document.getElementById('bazaar-row-2');
        const row3 = document.getElementById('bazaar-row-3');

        if (!row1 || !row2 || !row3) {
            console.error("Bazaar rows not found!");
            return;
        }

        // Clear existing content
        row1.innerHTML = '';
        row2.innerHTML = '';
        row3.innerHTML = '';

        if (typeof cardData === 'undefined') {
            throw new Error("cardData is undefined");
        }

        // Filter Unity cards
        const unityCards = cardData.filter(card => card.set === 'Unity');

        // Row 1: 8 Landmarks (001-008)
        const landmarks = unityCards.filter(card => card.type === 'Landmark').slice(0, 8);
        landmarks.forEach(card => row1.appendChild(createGameCard(card)));

        // Row 2: 8 Creatures (009-016)
        const creatures = unityCards.filter(card => card.type === 'Creature').slice(0, 8);
        creatures.forEach(card => row2.appendChild(createGameCard(card)));

        // Row 3: 4 Artifacts (017-020) + 4 Sparks (021-024)
        const artifacts = unityCards.filter(card => card.type === 'Artifact').slice(0, 4);
        const sparks = unityCards.filter(card => card.type === 'Spark').slice(0, 4);

        artifacts.forEach(card => row3.appendChild(createGameCard(card)));
        sparks.forEach(card => row3.appendChild(createGameCard(card)));
    }

    function createGameCard(card) {
        const cardEl = document.createElement('div');
        cardEl.className = `game-card type-${card.type.toLowerCase()}`;

        let icon = '';
        switch (card.type) {
            case 'Landmark': icon = '🏛️'; break;
            case 'Creature': icon = '🐉'; break;
            case 'Artifact': icon = '🔮'; break;
            case 'Spark': icon = '⚡'; break;
            default: icon = '🃏';
        }

        cardEl.innerHTML = `
            <div class="card-top">
                <span>${card.number}</span>
                <span>${card.cost || '-'}</span>
            </div>
            <div class="card-type-icon">${icon}</div>
            <div class="card-name">${card.name}</div>
        `;

        // Add click handler for popup details
        cardEl.addEventListener('click', () => showCardPopup(card));

        return cardEl;
    }

    function populateDatabase() {
        const tbody = document.getElementById('database-body');
        if (tbody.children.length > 0) return; // Already populated

        cardData.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${card.number}</td>
                <td><span class="card-link" data-number="${card.number}">${card.name}</span></td>
                <td>${card.cost}</td>
                <td>${card.rarity}</td>
                <td>${card.type}</td>
                <td>${card.set}</td>
            `;
            tbody.appendChild(tr);
        });

        // Add click listeners to card links
        document.querySelectorAll('.card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const number = e.target.dataset.number;
                const card = cardData.find(c => c.number === number);
                if (card) showCardPopup(card);
            });
        });
    }

    // Search functionality for database
    const searchInput = document.getElementById('database-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const tbody = document.getElementById('database-body');
            const rows = tbody.querySelectorAll('tr');

            rows.forEach(row => {
                const nameCell = row.querySelector('td:nth-child(2)');
                if (nameCell) {
                    const cardName = nameCell.textContent.toLowerCase();
                    if (cardName.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // --- Modal Logic ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modals = {
        profile: document.getElementById('modal-profile'),
        options: document.getElementById('modal-options'),
        credits: document.getElementById('modal-credits'),
        cardPopup: document.getElementById('modal-card-popup')
    };

    function showCardPopup(card) {
        document.getElementById('popup-card-name').textContent = card.name;
        document.getElementById('popup-card-type').textContent = card.type;
        document.getElementById('popup-card-cost').textContent = card.cost || '-';
        document.getElementById('popup-card-rarity').textContent = card.rarity;
        document.getElementById('popup-card-set').textContent = card.set;
        document.getElementById('popup-card-number').textContent = card.number;
        document.getElementById('popup-card-location').textContent = card.location || '-';

        // Handle description with keyword links
        const descElement = document.getElementById('popup-card-desc');
        if (card.description) {
            let description = card.description;

            // Define keywords to link
            const keywords = {
                'Time Point': 'time-points',
                'Time Points': 'time-points',
                'End Phase': 'end-phase',
                'Health Points': 'health-points',
                'Steam Phase': 'steam-phase',
                'Construction Phase': 'construction-phase',
                'Creature Phase': 'creature-phase'
            };

            // Replace keywords with clickable links
            Object.keys(keywords).forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                description = description.replace(regex, match => {
                    return `<span class="keyword-link" onclick="navigateToKeyword('${keywords[keyword]}')">${match}</span>`;
                });
            });

            descElement.innerHTML = description;
        } else {
            descElement.textContent = '-';
        }

        document.getElementById('popup-card-lore').textContent = card.lore || '-';

        // Handle card image
        const imageContainer = document.getElementById('popup-card-image-container');
        const imageElement = document.getElementById('popup-card-image');

        if (card.image) {
            imageElement.src = card.image;
            imageContainer.classList.remove('hidden');
        } else {
            imageContainer.classList.add('hidden');
        }

        openModal('cardPopup');
    }

    function openModal(modalName) {
        Object.values(modals).forEach(m => m.classList.add('hidden'));
        modalOverlay.classList.remove('hidden');
        if (modals[modalName]) modals[modalName].classList.remove('hidden');
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        Object.values(modals).forEach(m => m.classList.add('hidden'));
    }

    document.getElementById('btn-profile').addEventListener('click', () => openModal('profile'));
    document.getElementById('btn-options').addEventListener('click', () => openModal('options'));
    document.getElementById('btn-credits').addEventListener('click', () => openModal('credits'));

    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', closeModal));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // --- Slider Logic ---
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector('input[type="range"]');
        // No value display needed as per design, just ticks
    });

    // --- Generic Disabled Button Handler ---
    const disabledButtons = document.querySelectorAll('.menu-btn.disabled, .mode-card.disabled, .lang-btn.disabled');
    disabledButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.style.animation = 'shake 0.5s';
            setTimeout(() => btn.style.animation = '', 500);
        });
    });
});

// Add shake animation style dynamically if not present
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
}
`;
document.head.appendChild(styleSheet);
