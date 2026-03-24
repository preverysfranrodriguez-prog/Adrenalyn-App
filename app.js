document.addEventListener('DOMContentLoaded', () => {
    const cardGrid = document.getElementById('card-grid');
    const searchInput = document.getElementById('search-input');
    const statsSummary = document.getElementById('stats-summary');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const scanBtn = document.getElementById('scan-btn');
    const aiModal = document.getElementById('ai-modal');
    const closeModal = document.querySelector('.close-modal');
    const cameraInput = document.getElementById('camera-input');
    const captureBtn = document.getElementById('capture-btn');
    const scanPreview = document.getElementById('scan-preview');
    const aiAssistantBtn = document.getElementById('ai-assistant-btn');

    const teamFilter = document.getElementById('team-filter');

    let collection = JSON.parse(localStorage.getItem('adrenalyn_collection')) || {};
    let currentFilter = 'all';
    let currentTeam = 'all';
    let cards = [];

    const teams = [
        { name: "ALAVÉS", start: 1, end: 18, color: "#1e4fb9" },
        { name: "BILBAO", start: 19, end: 36, color: "#e30613" },
        { name: "ATLÉTICO", start: 37, end: 54, color: "#cb2a2e" },
        { name: "BARÇA", start: 55, end: 72, color: "#004d98" },
        { name: "BETIS", start: 73, end: 90, color: "#00913c" },
        { name: "CELTA", start: 91, end: 108, color: "#85b3e6" },
        { name: "ELCHE", start: 109, end: 126, color: "#006437" },
        { name: "ESPANYOL", start: 127, end: 144, color: "#0083ca" },
        { name: "GETAFE", start: 145, end: 162, color: "#004791" },
        { name: "GIRONA", start: 163, end: 180, color: "#e20612" },
        { name: "LEVANTE", start: 181, end: 198, color: "#e20612" },
        { name: "REAL MADRID", start: 199, end: 216, color: "#ffffff" },
        { name: "MALLORCA", start: 217, end: 234, color: "#e20612" },
        { name: "OSASUNA", start: 235, end: 252, color: "#9e1d2c" },
        { name: "OVIEDO", start: 253, end: 270, color: "#004e9c" },
        { name: "RAYO", start: 271, end: 288, color: "#e20612" },
        { name: "REAL SOCIEDAD", start: 289, end: 306, color: "#0055a4" },
        { name: "SEVILLA", start: 307, end: 324, color: "#e20612" },
        { name: "VALENCIA", start: 325, end: 342, color: "#ffffff" },
        { name: "VILLARREAL", start: 343, end: 360, color: "#ffec00" }
    ];

    const categories = [
        { name: "¡VAMOS!", start: 361, end: 380 },
        { name: "GUANTES DE ORO", start: 381, end: 387 },
        { name: "KRYPTONITA", start: 388, end: 396 },
        { name: "DIAMANTES", start: 397, end: 414 },
        { name: "INFLUENCERS", start: 415, end: 423 },
        { name: "PROTAS", start: 424, end: 441 },
        { name: "SUPERCRACKS (1)", start: 442, end: 454 },
        { name: "SUPERCRACKS (2)", start: 455, end: 467 },
        { name: "CHAMPIONS", start: 468, end: 468 },
        { name: "BALON DE ORO", start: 469, end: 474 },
        { name: "EXCELLENCE", start: 475, end: 475 },
        { name: "ATÓMICA", start: 476, end: 476 },
        { name: "INVENCIBLE", start: 477, end: 477 },
        { name: "CAMPEON", start: 478, end: 478 }
    ];

    // --- Data Initialization ---
    function initCards() {
        cards = [];
        
        // Teams 1-360
        teams.forEach(team => {
            // Options for filter
            const opt = document.createElement('option');
            opt.value = team.name;
            opt.textContent = team.name;
            teamFilter.appendChild(opt);

            for (let i = team.start; i <= team.end; i++) {
                const isCrest = i === team.start;
                cards.push({
                    id: i.toString(),
                    name: isCrest ? `ESCUDO ${team.name}` : `JUGADOR ${i}`,
                    type: isCrest ? 'crest' : 'player',
                    team: team.name,
                    color: team.color
                });
            }
        });

        // Categories 361-478
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.name;
            opt.textContent = cat.name;
            teamFilter.appendChild(opt);

            for (let i = cat.start; i <= cat.end; i++) {
                cards.push({ id: i.toString(), name: cat.name, type: 'special' });
            }
        });

        // Additional Specials from Image
        const specialSeries = [
            { name: "MOMENTUM", players: ["ASPAS", "A. GARCIA", "EYONG", "PEDRI", "KOKE", "CLÁSICO"] },
            { name: "MÍTICOS INVENCIBLE", players: ["ATLETI", "ORO"] },
            { name: "PANINI EXTRA GOLD", players: ["YAMAL", "MBAPPE"] },
            { name: "NEW MASTER", ids: ["NM1", "NM2", "NM3", "NM4", "NM5", "NM6", "NM7", "NM8", "NM9", "NM10", "NM11", "NM12", "NM13", "NM14", "NM15"] },
            { name: "STADIUM CARD", ids: ["1 BIS", "19 BIS", "37 BIS", "55 BIS", "73 BIS", "91 BIS", "109 BIS", "127 BIS", "145 BIS", "163 BIS", "181 BIS", "199 BIS", "217 BIS", "235 BIS", "253 BIS", "271 BIS", "289 BIS", "307 BIS", "325 BIS", "343 BIS"] },
            { name: "MEGAPACK", players: ["NICO", "DE JONG", "HUIJSEN"] },
            { name: "TIN BOX SERIE ORO", players: ["SANCET", "KOKE", "GÜLER", "MIKAUTADZE"] },
            { name: "POCKET BOX PLATINUM", players: ["CAZORLA", "FERMÍN", "ASPAS", "MURIQI"] },
            { name: "SOBRE PREMIUM", players: ["WILLIAMS", "WILL FIRMA", "FERRAN T", "FERRAN FIR", "OYARZABAL", "OYAR FIRMA", "AYOZE", "AYOZE FIRMA"] },
            { name: "SOBRE PREMIUM ORO", players: ["PEDRI", "YAMAL", "ISCO", "JOAN GARC", "HANCKO", "BELLINGAN", "DE FRUTOS", "CUBARSI", "SORLOTH", "OUNAHI"] }
        ];

        specialSeries.forEach(series => {
            const opt = document.createElement('option');
            opt.value = series.name;
            opt.textContent = series.name;
            teamFilter.appendChild(opt);

            if (series.players) {
                series.players.forEach(p => {
                    cards.push({ id: `${series.name}:${p}`, displayId: series.name, name: p, type: 'extra' });
                });
            } else if (series.ids) {
                series.ids.forEach(id => {
                    cards.push({ id: id, name: series.name, type: 'extra' });
                });
            }
        });

        renderCards();
        updateStats();
    }

    // --- Logic ---
    function handleCardClick(id) {
        if (!collection[id]) collection[id] = { owned: false, repeated: 0 };
        
        if (!collection[id].owned) {
            collection[id].owned = true;
            collection[id].repeated = 0;
        } else {
            collection[id].repeated++;
        }
        saveAndRefresh();
    }

    function handleCardSecondary(id) {
        if (!collection[id]) return;
        
        if (collection[id].repeated > 0) {
            collection[id].repeated--;
        } else if (collection[id].owned) {
            collection[id].owned = false;
        }
        saveAndRefresh();
    }

    function saveAndRefresh() {
        localStorage.setItem('adrenalyn_collection', JSON.stringify(collection));
        renderCards();
        updateStats();
    }

    function updateStats() {
        const ownedCount = Object.values(collection).filter(c => c.owned).length;
        const totalCards = cards.length;
        const percent = Math.round((ownedCount / totalCards) * 100) || 0;
        statsSummary.textContent = `${ownedCount}/${totalCards} (${percent}%)`;
    }

    // --- Database (IndexedDB) ---
    const dbName = "AdrenalynDB";
    let db;
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (e) => {
        db = e.target.result;
        if (!db.objectStoreNames.contains('photos')) {
            db.createObjectStore('photos', { keyPath: 'id' });
        }
    };
    request.onsuccess = (e) => {
        db = e.target.result;
        renderCards(); // Initial render once DB is ready
    };

    function savePhoto(id, blob) {
        if (!db) return;
        const tx = db.transaction('photos', 'readwrite');
        tx.objectStore('photos').put({ id, blob });
    }

    async function getPhoto(id) {
        return new Promise((resolve) => {
            if (!db) return resolve(null);
            const tx = db.transaction('photos', 'readonly');
            const store = tx.objectStore('photos');
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result ? req.result.blob : null);
            req.onerror = () => resolve(null);
        });
    }

    // --- Rendering ---
    let isRendering = false;
    async function renderCards() {
        if (isRendering) return;
        isRendering = true;

        const query = searchInput.value.toLowerCase();
        
        // Predetermine which cards to show
        const filteredCards = cards.filter(card => {
            const matchesSearch = card.id.toLowerCase().includes(query) || 
                                 card.name.toLowerCase().includes(query) ||
                                 (card.team && card.team.toLowerCase().includes(query));
            
            const matchesTeam = currentTeam === 'all' || 
                               card.team === currentTeam || 
                               card.id.startsWith(currentTeam) || 
                               card.name === currentTeam ||
                               (card.id.includes(':') && card.id.split(':')[0] === currentTeam);

            const status = collection[card.id] || {};
            
            if (currentFilter === 'missing') return matchesSearch && matchesTeam && !status.owned;
            if (currentFilter === 'repeated') return matchesSearch && matchesTeam && status.repeated > 0;
            return matchesSearch && matchesTeam;
        });

        // Optimization: Get all photos first if possible (complex) 
        // Or just clear and render without awaiting inside the loop to avoid DOM shifts during events
        
        cardGrid.innerHTML = '';
        if (filteredCards.length === 0) {
            cardGrid.innerHTML = '<div class="loader">No se encontraron cartas.</div>';
            isRendering = false;
            return;
        }

        // Create fragments for performance
        const fragment = document.createDocumentFragment();

        for (const card of filteredCards) {
            const status = collection[card.id] || { owned: false, repeated: 0 };
            const cardEl = document.createElement('div');
            cardEl.className = `card-item ${status.owned ? 'owned' : ''} ${status.repeated > 0 ? 'repeated' : ''}`;
            cardEl.id = `card-${card.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
            
            cardEl.innerHTML = `
                <div class="card-number">${card.displayId || card.id}</div>
                <div class="card-name">${card.name}</div>
                ${status.repeated > 0 ? `<div class="repeated-indicator">${status.repeated}</div>` : ''}
            `;

            // Load photo asynchronously without blocking the loop
            getPhoto(card.id).then(photoBlob => {
                if (photoBlob) {
                    cardEl.classList.add('has-photo');
                    cardEl.style.backgroundImage = `url(${photoBlob})`;
                } else if (card.team) {
                    cardEl.setAttribute('data-team-shading', card.team.substring(0, 3));
                    cardEl.style.setProperty('--team-glow', `${card.color}33`);
                    cardEl.setAttribute('data-team-color', card.color);
                }
            });

            // Improved Touch Logic
            let touchTimer;
            let moved = false;
            let longPressed = false;

            cardEl.ontouchstart = (e) => {
                moved = false;
                longPressed = false;
                touchTimer = setTimeout(() => {
                    longPressed = true;
                    handleCardSecondary(card.id);
                    if (navigator.vibrate) navigator.vibrate(50);
                }, 700);
            };

            cardEl.ontouchmove = () => { moved = true; clearTimeout(touchTimer); };
            
            cardEl.ontouchend = (e) => {
                clearTimeout(touchTimer);
                if (!moved && !longPressed) {
                    // This was a clean tap
                    handleCardClick(card.id);
                }
                if (longPressed) e.preventDefault();
            };

            // Desktop clicks
            cardEl.onclick = (e) => {
                if (e.pointerType === 'touch') return; // Handled by touch events
                handleCardClick(card.id);
            };

            cardEl.oncontextmenu = (e) => {
                e.preventDefault();
                handleCardSecondary(card.id);
            };

            fragment.appendChild(cardEl);
        }

        cardGrid.appendChild(fragment);
        updateStats();
        isRendering = false;
    }

    // --- Events ---
    searchInput.addEventListener('input', renderCards);
    teamFilter.addEventListener('change', (e) => {
        currentTeam = e.target.value;
        renderCards();
    });

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderCards();
        };
    });

    // --- AI Scanner logic ---
    scanBtn.onclick = () => aiModal.style.display = 'block';
    closeModal.onclick = () => aiModal.style.display = 'none';
    window.onclick = (e) => { if (e.target === aiModal) aiModal.style.display = 'none'; };

    captureBtn.onclick = () => cameraInput.click();

    cameraInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => processAndIdentify(img);
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    function processAndIdentify(img) {
        const canvas = document.getElementById('crop-canvas');
        const ctx = canvas.getContext('2d');
        const cropWidth = img.width * 0.8;
        const cropHeight = img.height * 0.8;
        const startX = (img.width - cropWidth) / 2;
        const startY = (img.height - cropHeight) / 2;
        canvas.width = 400;
        canvas.height = 560;
        ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
        const croppedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        scanPreview.style.backgroundImage = `url(${croppedBase64})`;
        scanPreview.style.backgroundSize = 'cover';
        identifyCard(croppedBase64);
    }

    // Load saved API Key
    const apiKeyInput = document.getElementById('api-key-input');
    apiKeyInput.value = localStorage.getItem('adrenalyn_api_key') || '';
    apiKeyInput.onchange = (e) => localStorage.setItem('adrenalyn_api_key', e.target.value);

    async function identifyCard(base64Image) {
        const apiKey = apiKeyInput.value;
        const aiStatus = document.getElementById('ai-status');
        if (!apiKey) {
            aiStatus.innerHTML = '<span style="color: #ff3e3e">Error: Introduce tu API Key de OpenRouter abajo.</span>';
            return;
        }

        aiStatus.innerHTML = 'Identificando carta (buscando círculo a la derecha)...';

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'google/gemini-flash-1.5',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: 'Eres un experto en cartas Adrenalyn XL 2024-25. Instrucciones:\n1. Busca el círculo blanco pequeño en la parte superior derecha de la carta (debajo del escudo del equipo). El número dentro de ese círculo es el número de la carta.\n2. Ignora los números grandes en cajas de colores en la parte inferior (son puntuaciones de juego).\n3. Identifica el nombre del jugador que aparece debajo de las puntuaciones.\nResponde SOLO así: "NÚMERO - NOMBRE" (ej: "76 - BELLERÍN").\nSi no estás seguro del número, usa solo el nombre.' },
                                { type: 'image_url', image_url: { url: base64Image } }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            const resultText = data.choices[0].message.content.trim().toUpperCase().replace(/["']/g, '');
            let [cardId, ...nameParts] = resultText.split(' - ');
            const cardName = nameParts.join(' ');

            const found = cards.find(c => c.id === cardId || 
                                         (c.id.includes(':') && c.id.split(':')[1] === cardId) ||
                                         (c.name.toUpperCase() === cardId) ||
                                         (cardName && c.name.toUpperCase().includes(cardName)));
            
            if (found) {
                const finalId = found.id;
                aiStatus.innerHTML = `<span style="color: #4caf50">¡Identificada! ${found.name} (#${found.id})</span>`;
                savePhoto(finalId, base64Image);
                if (!collection[finalId] || !collection[finalId].owned) handleCardClick(finalId);
                
                setTimeout(() => {
                    aiModal.style.display = 'none';
                    currentTeam = 'all';
                    currentFilter = 'all';
                    filterBtns.forEach(b => b.classList.remove('active'));
                    filterBtns[0].classList.add('active');
                    teamFilter.value = 'all';
                    renderCards();
                    
                    const safeId = `card-${finalId.replace(/[^a-zA-Z0-9]/g, '_')}`;
                    const element = document.getElementById(safeId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        element.classList.add('highlight');
                        setTimeout(() => element.classList.remove('highlight'), 3000);
                    }
                }, 1500);
            } else {
                aiStatus.innerHTML = `Dudado como "${resultText}", prueba de nuevo o márcalo a mano.`;
            }
        } catch (error) {
            console.error('AI Error:', error);
            aiStatus.innerHTML = `<span style="color: #ff3e3e">Error: ${error.message}</span>`;
        }
    }

    aiAssistantBtn.onclick = () => alert('Asistente IA: ¡Hola!');
    initCards();
});
