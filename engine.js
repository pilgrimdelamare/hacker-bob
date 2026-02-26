const AppEngine = (function() {
    const SFX = {
        correct: new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'),
        wrong: new Audio('https://assets.mixkit.co/active_storage/sfx/3112/3112-preview.mp3'),
        victory: new Audio('https://upload.wikimedia.org/wikipedia/commons/b/b5/Jingle_achievement_00.mp3'),
        gameover: new Audio('https://assets.mixkit.co/active_storage/sfx/3125/3125-preview.mp3')
    };
    
    let state = { xp: 0, streak: 0, completedMissions: {}, penaltyUnlockTime: 0 };
    let session = { modIdx: 0, misIdx: 0, exIdx: 0, lives: 10, errors: 0, isAnswered: false, selectedOption: null };

    const DOM = {
        views: document.querySelectorAll('.view-layer'),
        xp: document.getElementById('val-xp'),
        streak: document.getElementById('val-streak'),
        modContainer: document.getElementById('modules-container'),
        globalProgress: document.getElementById('global-progress-bar'),
        misContainer: document.getElementById('missions-container'),
        modTitle: document.getElementById('module-title-display'),
        modDesc: document.getElementById('module-desc-display'),
        exArea: document.getElementById('exercise-dynamic-area'),
        exProgress: document.getElementById('exercise-progress-bar'),
        livesDisplay: document.getElementById('lives-display'),
        mascot: document.getElementById('exercise-mascot'),
        btnMain: document.getElementById('btn-main-action'),
        drawer: document.getElementById('feedback-drawer'),
        drwIcon: document.getElementById('fb-icon'),
        drwTitle: document.getElementById('fb-title'),
        drwMsg: document.getElementById('fb-msg'),
        drwBtn: document.getElementById('btn-drawer-next'),
        overlayGO: document.getElementById('overlay-gameover'),
        timerGO: document.getElementById('penalty-timer')
    };

    let penaltyInterval = null;
    let activeKeyHandlers = []; // cleanup keyboard listeners between exercises

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function cleanupKeyHandlers() {
        activeKeyHandlers.forEach(fn => document.removeEventListener('keydown', fn));
        activeKeyHandlers = [];
    }

    function init() {
        loadState();
        bindGlobalEvents();
        checkPenaltyState();
    }

    function loadState() {
        try { const saved = localStorage.getItem('HackerBobData_v1'); if (saved) state = JSON.parse(saved); } catch(e) {}
        updateTopBar();
    }

    function saveState() {
        try { localStorage.setItem('HackerBobData_v1', JSON.stringify(state)); } catch(e) {}
        updateTopBar();
    }

    function updateTopBar() {
        DOM.xp.innerText = state.xp;
        if (!window.holdCoinUpdate) {
            DOM.streak.innerText = Object.keys(state.completedMissions).length;
        }
    }

    function navigateTo(viewId) {
        DOM.views.forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
        hideFeedback();
    }

    function renderHome() {
        DOM.modContainer.innerHTML = '';
        let totalMissions = 0; let doneMissions = 0;
        AppCurriculum.forEach((mod, index) => {
            let modDoneCount = 0;
            mod.missions.forEach(m => { totalMissions++; if (state.completedMissions[m.id]) { modDoneCount++; doneMissions++; } });
            const isAllDone = modDoneCount === mod.missions.length;
            const el = document.createElement('div');
            el.className = `mod-item card ${isAllDone ? 'done' : ''}`;
            el.innerHTML = `<div class="icon-box">${mod.icon}</div><div class="mod-info"><h3>${mod.title}</h3><p class="subtitle">${mod.desc}</p></div>`;
            el.onclick = () => renderMissions(index);
            DOM.modContainer.appendChild(el);
        });
        const pct = totalMissions > 0 ? (doneMissions / totalMissions) * 100 : 0;
        DOM.globalProgress.style.width = `${pct}%`;
        navigateTo('view-home');
    }

    function renderMissions(modIdx) {
        session.modIdx = modIdx;
        const mod = AppCurriculum[modIdx];
        DOM.modTitle.innerText = `${mod.icon} ${mod.title}`;
        DOM.modDesc.innerText = mod.desc;
        DOM.misContainer.innerHTML = '';
        mod.missions.forEach((mis, index) => {
            const history = state.completedMissions[mis.id];
            const isDone = !!history;
            const stars = history ? history.stars : 0;
            const el = document.createElement('div');
            el.className = `mis-item card ${isDone ? 'done' : ''}`;
            el.innerHTML = `<div class="icon-box" style="border-radius:50%">${isDone ? '✔' : index + 1}</div><div class="mod-info"><h3>${mis.title}</h3><p class="subtitle">${mis.xpReward} XP</p></div><div class="text-orange" style="font-size:1.2rem; font-weight:bold;">${'⭐'.repeat(stars)}</div>`;
            el.onclick = () => startExerciseSession(index);
            DOM.misContainer.appendChild(el);
        });
        navigateTo('view-missions');
    }

    function startExerciseSession(misIdx) {
        session.misIdx = misIdx; session.exIdx = 0; session.lives = 10; session.errors = 0;
        updateLivesUI(); setMascot('base'); navigateTo('view-exercise'); loadCurrentExercise();
    }

    function updateLivesUI() {
        let heartsHTML = '';
        for(let i=0; i<10; i++) heartsHTML += i < session.lives ? '❤️' : '🤍';
        DOM.livesDisplay.innerText = heartsHTML;
    }

    function setMascot(type) {
        DOM.mascot.src = `${type}.png`;
        DOM.mascot.className = '';
        void DOM.mascot.offsetWidth;
        if(type === 'felice') DOM.mascot.classList.add('anim-pop');
        if(type === 'arrabbiato') DOM.mascot.classList.add('anim-shake');
    }

    function loadCurrentExercise() {
        const mis = AppCurriculum[session.modIdx].missions[session.misIdx];
        if (session.exIdx >= mis.exercises.length) { triggerVictory(mis); return; }
        const ex = mis.exercises[session.exIdx];
        session.isAnswered = false; session.selectedOption = null;
        cleanupKeyHandlers();
        hideFeedback(); setMascot('base');
        const pct = (session.exIdx / mis.exercises.length) * 100;
        DOM.exProgress.style.width = `${pct}%`;
        
        // Sostituiamo il bottone per resettare i listener e impostiamo di default block
        const newBtn = DOM.btnMain.cloneNode(true);
        DOM.btnMain.parentNode.replaceChild(newBtn, DOM.btnMain);
        DOM.btnMain = newBtn;
        DOM.btnMain.style.display = 'block'; 
        DOM.btnMain.disabled = true;
        DOM.btnMain.innerText = ex.type === 'info' ? 'Ho Capito' : 'Verifica';

        DOM.exArea.innerHTML = '';
        if (ex.type === 'info') buildInfoNode(ex);
        else if (ex.type === 'quiz') buildQuizNode(ex);
        else if (ex.type === 'tf') buildTFNode(ex);
        else if (ex.type === 'sim_click') buildSimClickNode(ex);
        else if (ex.type === 'sim_type') buildSimTypeNode(ex);
        else if (ex.type === 'sim_drag') buildSimDragNode(ex);
        else if (ex.type === 'sim_steps') buildSimStepsNode(ex);
        else if (ex.type === 'sim_combo') buildSimComboNode(ex);
        else if (ex.type === 'sim_keyboard')   buildSimKeyboardNode(ex);
        else if (ex.type === 'sim_shortcut')   buildSimShortcutNode(ex);
        else if (ex.type === 'sim_game')       buildSimGameNode(ex);
        else if (ex.type === 'sim_popup')      buildSimPopupNode(ex);
        else if (ex.type === 'sim_multistep')  buildSimMultistepNode(ex);
        else if (ex.type === 'sim_tab_form')         buildSimTabFormNode(ex);
        else if (ex.type === 'sim_delete_fix')       buildSimDeleteFixNode(ex);
        else if (ex.type === 'sim_select_overwrite') buildSimSelectOverwriteNode(ex);
        else if (ex.type === 'sim_search_click')     buildSimSearchClickNode(ex);
        else if (ex.type === 'sim_pinning')          buildSimPinningNode(ex);
        else if (ex.type === 'sim_fake_x')            buildSimFakeXNode(ex);
        else if (ex.type === 'sim_escape')            buildSimEscapeNode(ex);

        if (typeof ex.onSetup === 'function') ex.onSetup();
    }

    
    function buildSimComboNode(ex) {
        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="ex-text" id="combo-instruction">${ex.tasks[0].instruction}</div>
                <div style="margin-top:10px; font-size:0.85rem; color:var(--clr-text-muted); font-weight:900; text-transform:uppercase;" id="combo-progress">Azione 1 di ${ex.tasks.length}</div>
            </div>
            ${generateSimulationHTML(ex.simType)}
        `;
        DOM.btnMain.style.display = 'none';

        const simArea = document.getElementById('sim-interactive-area') || document.querySelector('.sim-window');
        let currentStep = 0;
        let clickCount = 0;
        let clickTimer;

        const advanceCombo = () => {
            currentStep++;
            if (currentStep >= ex.tasks.length) {
                handleSuccess("Eccezionale! Hai completato l'operazione combinata alla perfezione.");
            } else {
                const textEl = document.getElementById('combo-instruction');
                textEl.innerHTML = ex.tasks[currentStep].instruction;
                document.getElementById('combo-progress').innerText = `Azione ${currentStep + 1} di ${ex.tasks.length}`;
            }
        };

        simArea.addEventListener('click', (e) => {
            if (session.isAnswered) return;
            const task = ex.tasks[currentStep];
            const clickedEl = e.target.closest('.target-el');
            if (!clickedEl) return;

            if (task.isDoubleClick) {
                clickCount++;
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => { clickCount = 0; handleError("Devi fare due clic VELOCI!"); }, 500);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    if (clickedEl.id === task.targetId) advanceCombo();
                    else handleError("Elemento sbagliato!");
                }
            } else {
                if (clickedEl.id === task.targetId) advanceCombo();
                else handleError("Elemento sbagliato!");
            }
        });
    }

    function buildInfoNode(ex) {
        DOM.btnMain.style.display = 'block';
        DOM.exArea.innerHTML = `<div class="ex-bubble"><h2 class="text-blue" style="margin-bottom:10px;">${ex.title}</h2><div class="ex-text">${ex.text.replace(/\n/g, '<br><br>')}</div></div>`;
        DOM.btnMain.disabled = false;
        DOM.btnMain.onclick = () => handleSuccess("Ottimo, proseguiamo!");
    }

    function buildQuizNode(ex) {
        DOM.btnMain.style.display = 'block';
        let html = `<div class="ex-bubble"><div class="ex-text">${ex.q}</div></div>`;
        ex.options.forEach((opt, idx) => { html += `<button class="option-btn" data-idx="${idx}">${opt}</button>`; });
        DOM.exArea.innerHTML = html;
        const btns = DOM.exArea.querySelectorAll('.option-btn');
        btns.forEach(btn => {
            btn.onclick = () => {
                if(session.isAnswered) return;
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                session.selectedOption = parseInt(btn.dataset.idx);
                DOM.btnMain.disabled = false;
            };
        });
        DOM.btnMain.onclick = () => evaluateAnswer(session.selectedOption === ex.correctIdx, ex.explanation, btns, ex.correctIdx);
    }

    function buildTFNode(ex) {
        DOM.btnMain.style.display = 'block';
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.q}</div></div><div class="tf-grid"><button class="option-btn" data-val="true"><span style="font-size:2rem">✅</span><br>VERO</button><button class="option-btn" data-val="false"><span style="font-size:2rem">❌</span><br>FALSO</button></div>`;
        const btns = DOM.exArea.querySelectorAll('.option-btn');
        btns.forEach(btn => {
            btn.onclick = () => {
                if(session.isAnswered) return;
                btns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                session.selectedOption = (btn.dataset.val === 'true');
                DOM.btnMain.disabled = false;
            };
        });
        DOM.btnMain.onclick = () => evaluateAnswer(session.selectedOption === ex.correctVal, ex.explanation, btns, ex.correctVal ? 0 : 1);
    }

    function generateSimulationHTML(simType) {
        if (simType === 'desktop') return `<div class="sim-window" id="sim-interactive-area"><div class="sim-header">💻 Schermo del tuo PC</div><div class="sim-desktop"><div class="sim-icon target-el" id="icon-docs"><div class="sim-icon-emoji">📁</div><div class="sim-icon-label">Documenti</div></div><div class="sim-icon target-el" id="icon-trash"><div class="sim-icon-emoji">🗑️</div><div class="sim-icon-label">Cestino</div></div><div class="sim-icon target-el" id="icon-browser"><div class="sim-icon-emoji">🌐</div><div class="sim-icon-label">Internet</div></div><div class="taskbar-volume target-el" id="icon-volume" title="Volume" style="position: absolute; bottom: 10px; right: 20px; cursor: pointer; font-size: 1.5rem; background: rgba(255,255,255,0.9); border-radius: 50%; width: 35px; height: 35px; text-align: center; line-height: 35px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 50;">🔊</div></div><div class="sim-taskbar"><div class="sim-start-btn target-el" id="btn-start">⊞</div><div class="sim-taskbar-search target-el" id="bar-search" style="max-width:100px;">🔍 Cerca</div><div class="sim-icon target-el" id="icon-taskbar-explorer" style="width:30px; height:30px; padding:0; justify-content:center; border-radius:4px;"><div class="sim-icon-emoji" style="font-size:1.2rem; filter:none;">📁</div></div></div></div>`;
        else if (simType === 'browser') return `<div class="sim-window"><div class="sim-header">🌐 Browser Web</div><div class="sim-browser-top"><div class="sim-nav-btn">⬅</div><div class="sim-nav-btn">➡</div><div class="sim-nav-btn">↻</div><div class="sim-url-bar"><span id="browser-lock" class="target-el" style="cursor:pointer;">🔒</span><input type="text" class="sim-url-input" id="sim-typing-field" placeholder="Cerca o inserisci un indirizzo web..." autocomplete="off"></div></div><div class="sim-browser-content"><h1 style="color:#CCC; font-family:var(--font-heading);">Nuova Scheda</h1></div></div>`;
        else if (simType === 'explorer') return `<div class="sim-window"><div class="sim-header">📁 Esplora File</div><div class="explorer-chrome"><div class="sim-nav-btn">⬅</div><div class="sim-nav-btn">➡</div><div class="explorer-path">💻 Questo PC › <strong id="path-text">Documenti</strong></div></div><div class="explorer-body" id="sim-interactive-area"><div class="explorer-sidebar"><div class="sidebar-item">🖥️ Desktop</div><div class="sidebar-item target-el" id="side-docs" style="background:#E8F5E9; color:var(--clr-green-shadow)">📄 Documenti</div><div class="sidebar-item target-el" id="side-gallery">🖼️ Immagini</div><div class="sidebar-item">⬇️ Scaricati</div></div><div class="files-area" style="position:relative;"><div class="file-item target-el" id="file-excel" draggable="true"><div class="file-icon">📊</div><div class="file-name" style="font-weight:bold; color:#107c41;">Bilancio.xlsx</div></div><div class="folder-item target-el drop-zone" id="folder-lavoro"><div class="folder-icon">📁</div><div class="folder-name">Lavoro</div></div><div class="folder-item target-el" id="folder-screen"><div class="folder-icon">📁</div><div class="folder-name">Screenshot</div></div><div class="file-item target-el" id="file-referto" draggable="true" style="display:none;"><div class="file-icon">📄</div><div class="file-name">Referto.pdf</div></div><div class="file-item target-el" id="file-contratto" draggable="true"><div class="file-icon">📄</div><div class="file-name">Lettera.docx</div></div><div class="file-item target-el" id="file-pdf" draggable="true"><div class="file-icon">📄</div><div class="file-name">Lettera.pdf</div></div><div class="file-item target-el" id="file-ricevuta" draggable="true"><div class="file-icon">🧾</div><div class="file-name">Ricevuta_Amazon.pdf</div></div><div class="file-item target-el" id="file-vecchio" draggable="true"><div class="file-icon">🗑️</div><div class="file-name">Ricevuta_Vecchia.pdf</div></div><div class="file-item target-el" id="file-foto" draggable="true"><div class="file-icon">🖼️</div><div class="file-name">Foto.jpg</div></div><div class="file-item target-el" id="file-zip"><div class="file-icon">🤐</div><div class="file-name">Foto_Vacanze.zip</div></div><div class="recycle-zone drop-zone" id="recycle-bin">🗑️ Cestino — Trascina qui per eliminare</div><button id="btn-extract-confirm" class="btn-primary target-el" style="position: absolute; bottom: 10px; right: 10px; width: auto; font-size: 0.9rem; padding: 10px; z-index: 100;">Estrai Tutto Qui</button></div></div></div>`;
        else if (simType === 'email_inbox') return `<div class="sim-window" style="display:flex; flex-direction:column; height:300px; background:white;"><div class="sim-header" style="background:#ea4335; color:white; border-bottom:none;">✉️ M-Mail</div><div style="display:flex; flex:1; overflow:hidden;"><div style="width:120px; background:#f4f5f7; border-right:1px solid #ddd; padding:10px;"><button class="btn-solid" style="padding:8px; font-size:0.9rem; margin-bottom:15px; width:100%; background:white; color:#333; border:1px solid #ccc; box-shadow:0 2px 0 #ccc;">✏️ Scrivi</button><div style="font-weight:bold; color:#ea4335; font-size:0.9rem; padding:8px; background:#fce8e6; border-radius:8px;">📥 In arrivo</div></div><div style="flex:1; background:white; display:flex; flex-direction:column;"><div class="target-el" id="email-lucia" style="padding:15px; border-bottom:1px solid #eee; cursor:pointer; display:flex; gap:10px; align-items:center; transition:background 0.2s;"><strong style="width:80px; font-size:0.9rem;">Lucia 👩‍🦰</strong><span style="color:#555; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><strong>Foto vacanze!</strong> - Ciao papà, guarda le foto...</span></div><div class="target-el" id="email-banca" style="padding:15px; border-bottom:1px solid #eee; cursor:pointer; display:flex; gap:10px; align-items:center; transition:background 0.2s;"><strong style="width:80px; font-size:0.9rem;">Banca 🏦</strong><span style="color:#555; font-size:0.9rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><strong>Recupero Password</strong> - Codice di sicurezza e link di reset...</span></div></div></div></div>`;
        else if (simType === 'email_read') return `<div class="sim-window" style="display:flex; flex-direction:column; height:300px; background:white;"><div class="sim-header" style="background:#ea4335; color:white; border-bottom:none;">✉️ M-Mail</div><div style="display:flex; flex:1; overflow:hidden;"><div style="width:120px; background:#f4f5f7; border-right:1px solid #ddd; padding:10px;"><button class="btn-solid" style="padding:8px; font-size:0.9rem; margin-bottom:15px; width:100%; background:white; color:#333; border:1px solid #ccc; box-shadow:0 2px 0 #ccc;">✏️ Scrivi</button><div style="font-weight:bold; color:#ea4335; font-size:0.9rem; padding:8px; background:#fce8e6; border-radius:8px;">📥 In arrivo</div></div><div style="flex:1; background:white; padding:20px; display:flex; flex-direction:column;"><h2 style="margin-bottom:5px; font-family:var(--font-body); font-weight:900; font-size:1.3rem;">Foto vacanze! 🏖️</h2><span style="color:#777; font-size:0.85rem; margin-bottom:15px; font-weight:bold;">Da: lucia@gmail.com</span><p style="flex:1; color:#333; font-weight:700; line-height:1.5;">Ciao papà!<br><br>Ti mando le foto delle vacanze. Spero ti piacciano!<br><br>Un abbraccio,<br>Lucia</p><div style="display:flex; gap:10px;"><button class="btn-icon target-el" id="btn-reply" style="width:auto; padding:0 15px; font-size:0.9rem; border-color:#ccc; border-bottom-color:#bbb; color:#555;">↩️ Rispondi</button><button class="btn-icon target-el" id="btn-forward" style="width:auto; padding:0 15px; font-size:0.9rem; border-color:#ccc; border-bottom-color:#bbb; color:#555;">↪️ Inoltra</button></div></div></div></div>`;
        else if (simType === 'email_compose') return `<div class="sim-window" style="display:flex; flex-direction:column; height:300px; background:white;"><div class="sim-header" style="background:#ea4335; color:white; border-bottom:none;">✉️ M-Mail</div><div style="display:flex; flex:1; overflow:hidden;"><div style="width:120px; background:#f4f5f7; border-right:1px solid #ddd; padding:10px;"><div style="font-weight:bold; color:#ea4335; font-size:0.9rem; padding:8px; background:#fce8e6; border-radius:8px;">📥 In arrivo</div></div><div style="flex:1; background:#f4f5f7; display:flex; justify-content:flex-end; flex-direction:column; padding:20px;"><div style="background:white; border-radius:10px 10px 0 0; border:1px solid #ccc; box-shadow:0 -4px 10px rgba(0,0,0,0.1); display:flex; flex-direction:column; height:200px;"><div style="background:#404040; color:white; padding:8px 15px; border-radius:9px 9px 0 0; font-size:0.9rem; font-weight:bold;">Nuovo messaggio</div><div style="padding:8px 15px; border-bottom:1px solid #eee; display:flex; align-items:center;"><span style="color:#777; width:40px; font-size:0.9rem; font-weight:bold;">A:</span><input type="text" id="sim-typing-field" placeholder="" autocomplete="off" style="border:none; outline:none; flex:1; font-family:var(--font-body); font-weight:700; font-size:1rem; color:#333;"></div><div style="padding:8px 15px; border-bottom:1px solid #eee; display:flex; align-items:center;"><span style="color:#777; width:40px; font-size:0.9rem; font-weight:bold;">Ogg:</span><input type="text" placeholder="" autocomplete="off" style="border:none; outline:none; flex:1; font-family:var(--font-body); font-weight:700; font-size:1rem; color:#333;"></div><div style="flex:1; padding:15px; color:#aaa; font-weight:bold; font-size:0.9rem;">Scrivi qui il messaggio...</div><div style="padding:10px 15px; border-top:1px solid #eee;"><div class="target-el" id="sim-interactive-area" style="display:flex; align-items:center; gap:10px;"><button class="btn-secondary target-el" id="btn-attach" style="background:#95a5a6; border:none; padding:8px 15px; border-radius:8px; color:white; cursor:pointer; font-size: 0.9rem;">📎 Allega</button><button class="btn-solid target-el" id="btn-send" style="background:#1a73e8; border-bottom: 4px solid #1557b0; padding:8px 20px; font-size:0.9rem; width:auto; border-radius:8px; color:white;">Invia</button></div></div></div></div></div></div>`;
        else if (simType === 'download_page') return `<div class="sim-window" style="background:white; height:250px;"><div class="sim-browser-top"><div class="sim-nav-btn">⬅</div><div class="sim-nav-btn">➡</div><div class="sim-url-bar"><span id="browser-lock" class="target-el" style="cursor:pointer;">🔒</span><span style="font-weight:bold; font-size:0.9rem; color:#333;">www.moduli.gov.it</span></div></div><div style="padding:20px;"><h2 style="font-family:var(--font-heading); color:#333; margin-bottom:10px;">Modulo ISEE 2026</h2><p style="color:#666; font-size:0.9rem; font-weight:bold;">Scarica il documento ufficiale in formato PDF per la dichiarazione.</p><div class="download-box"><span style="font-weight:bold; color:#333;">📄 Modulo_ISEE.pdf (256 KB)</span><button class="btn-download target-el" id="btn-dl-pdf">⬇️ Scarica PDF</button></div></div></div>`;
        else if (simType === 'drive_sim') return `<div class="sim-window" style="background:white; display:flex; flex-direction:column; height:250px;"><div class="sim-header" style="background:#F1F3F4; border-bottom:1px solid #ddd; color:#1A73E8;">☁️ Google Drive</div><div style="display:flex; flex:1;"><div class="drive-sidebar"><div class="btn-drive-new target-el" id="btn-drive-add">➕ Nuovo</div><div style="font-weight:bold; color:#1A73E8; font-size:0.85rem; padding:8px; background:#E8F4FF; border-radius:6px;">🏠 Il mio Drive</div></div><div style="flex:1; padding:15px;"><div style="font-weight:900; color:#777; font-size:0.8rem; text-transform:uppercase; margin-bottom:10px;">I tuoi file</div><div class="drive-item">📁 Foto Vacanze</div><div class="drive-item">📄 Curriculum.pdf</div></div></div></div>`;
        else if (simType === 'word_sim') return `<div class="sim-window"><div id="sim-interactive-area" style="background:#e0e0e0; min-height: 250px; position:relative; padding-bottom: 20px;"><div class="word-header" style="background: #2b579a; color: white; padding: 10px; display: flex; gap: 20px;"><div class="target-el" id="btn-file" style="cursor:pointer; font-weight:bold;">File</div><div class="target-el" id="btn-print" style="cursor:pointer; font-weight:bold;">Stampa</div></div><div class="word-page" style="background: white; width: 80%; max-width: 400px; height: 180px; margin: 20px auto; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.2); border: 1px solid #ccc; text-align:left;"><h3 style="margin-top:0;">Oggetto: Invio Documentazione</h3><p>Gentile Commercialista,</p><p>In allegato trova la documentazione richiesta convertita in formato PDF.</p><p>Cordiali saluti.</p></div></div></div>`;
                else if (simType === 'excel_sim') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; background:white; height:100%;"><div style="background:#107c41; color:white; padding:5px 10px; font-size:0.9rem; display:flex; align-items:center; gap:10px;"><span style="font-weight:bold; font-family:var(--font-heading);">📗 Excel</span><span>Bilancio.xlsx</span></div><div style="background:#f3f2f1; padding:5px 10px; border-bottom:1px solid #e1dfdd; display:flex; gap:15px; align-items:center; font-size:0.9rem;"><div style="display:flex; gap:5px; border-right:1px solid #ccc; padding-right:15px;"><button class="target-el" id="btn-bold" style="font-weight:bold; border:1px solid #ccc; background:white; padding:4px 10px; cursor:pointer; border-radius:4px;">G</button><button class="target-el" id="btn-currency" style="font-weight:bold; border:1px solid #ccc; background:white; padding:4px 10px; cursor:pointer; border-radius:4px;">€</button></div><button class="target-el" id="btn-autosum" style="border:1px solid #ccc; background:white; padding:4px 10px; cursor:pointer; border-radius:4px; font-weight:bold; color:#107c41;">Σ Somma</button></div><div style="display:flex; padding:4px 10px; border-bottom:1px solid #e1dfdd; align-items:center; gap:10px; background:white;"><span style="font-style:italic; color:#777; font-weight:bold;">fx</span><input type="text" id="sim-typing-field" autocomplete="off" placeholder="Inserisci testo o formula..." style="flex:1; border:1px solid #ccc; outline:none; padding:4px 8px; font-family:var(--font-body); font-size:0.9rem; border-radius:4px;"></div><div style="flex:1; overflow:hidden; display:flex; flex-direction:column; background:#fff; position:relative;" ><div style="display:flex; background:#f3f2f1; border-bottom:1px solid #ccc; text-align:center; font-size:0.85rem; color:#666; font-weight:bold;"><div style="width:30px; border-right:1px solid #ccc;"></div><div style="width:120px; border-right:1px solid #ccc; position:relative;">A<div id="col-resize" class="target-el" draggable="true" style="position:absolute; right:-5px; top:0; bottom:0; width:10px; background:rgba(0,0,0,0.1); cursor:col-resize; z-index:10;"></div></div><div id="col-drop-zone" class="target-el drop-zone" style="width:80px; border-right:1px solid #ccc;">B</div><div style="width:80px; border-right:1px solid #ccc;">C</div></div><div style="display:flex; border-bottom:1px solid #e1dfdd;"><div style="width:30px; background:#f3f2f1; border-right:1px solid #ccc; text-align:center; font-size:0.85rem; color:#666; padding:4px 0;">1</div><div class="target-el" id="cell-a1" style="width:120px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem; white-space:nowrap; overflow:hidden;"></div><div class="target-el" id="cell-b1" style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;"></div><div class="target-el" id="cell-c1" style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;"></div></div><div style="display:flex; border-bottom:1px solid #e1dfdd;"><div style="width:30px; background:#f3f2f1; border-right:1px solid #ccc; text-align:center; font-size:0.85rem; color:#666; padding:4px 0;">2</div><div class="target-el" id="cell-a2" style="width:120px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem; cursor:pointer;">Entrate</div><div class="target-el" id="cell-b2" style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem; text-align:right; cursor:pointer;">1500</div><div style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;"></div></div><div style="display:flex; border-bottom:1px solid #e1dfdd;"><div style="width:30px; background:#f3f2f1; border-right:1px solid #ccc; text-align:center; font-size:0.85rem; color:#666; padding:4px 0;">3</div><div class="target-el" id="cell-a3" style="width:120px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;">Uscite</div><div class="target-el" id="cell-b3" style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem; text-align:right;">900</div><div style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;"></div></div><div style="display:flex; border-bottom:1px solid #e1dfdd;"><div style="width:30px; background:#f3f2f1; border-right:1px solid #ccc; text-align:center; font-size:0.85rem; color:#666; padding:4px 0;">4</div><div class="target-el" id="cell-a4" style="width:120px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;">Frigorifero</div><div class="target-el" id="cell-b4" style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem; text-align:right;">400</div><div class="target-el" id="cell-c4" style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;"></div></div><div style="display:flex; border-bottom:1px solid #e1dfdd;"><div style="width:30px; background:#f3f2f1; border-right:1px solid #ccc; text-align:center; font-size:0.85rem; color:#666; padding:4px 0;">5</div><div class="target-el" id="cell-a5" style="width:120px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem; font-weight:bold; cursor:pointer;">Risparmio</div><div class="target-el" id="cell-b5" style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem; text-align:right; cursor:pointer;"></div><div style="width:80px; border-right:1px solid #e1dfdd; padding:4px 5px; font-size:0.85rem;"></div></div></div></div>`;
                else if (simType === 'spid_sim') return `<div class="sim-window" id="sim-interactive-area" style="background:#f9f9f9; height:100%; display:flex; flex-direction:column; align-items:center; padding-top:30px;"><div style="font-family:var(--font-heading); color:#0066CC; font-size:1.5rem; margin-bottom:20px;">INPS</div><div id="spid-step-1"><button class="target-el" id="btn-spid-main" style="background:#0066CC; color:white; border:none; padding:12px 24px; font-size:1.1rem; border-radius:6px; font-weight:bold; cursor:pointer;">Accedi con SPID</button></div><div id="spid-step-2" style="display:none; background:white; border:1px solid #ccc; width:250px; text-align:left; box-shadow:0 4px 10px rgba(0,0,0,0.1);"><div style="padding:10px; border-bottom:1px solid #eee; font-weight:bold; color:#555;">Scegli il provider</div><div class="target-el" id="btn-provider-poste" style="padding:12px; border-bottom:1px solid #eee; cursor:pointer; font-weight:bold; color:#0066CC;">✉️ PosteID</div><div style="padding:12px; cursor:pointer; font-weight:bold; color:#555;">🛡️ SielteID</div></div><div id="spid-step-3" style="display:none; width:250px; text-align:left;"><label style="font-size:0.8rem; font-weight:bold; color:#555;">Nome Utente SPID</label><input type="text" id="sim-typing-field" autocomplete="off" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:4px;"><button class="btn-primary" style="padding:8px;">Entra</button></div></div>`;
        else if (simType === 'health_sim') return `<div class="sim-window" id="sim-interactive-area" style="background:white; height:100%; display:flex; flex-direction:column;"><div style="background:#0055aa; color:white; padding:10px; font-weight:bold; font-family:var(--font-heading);">✚ Fascicolo Sanitario Regionale</div><div style="padding:20px;"><h3 style="color:#333;">Esami e Referti</h3><div style="border:1px solid #eee; border-left:4px solid #28a745; padding:15px; margin-top:15px; display:flex; justify-content:space-between; align-items:center; background:#fafafa;"><div><strong style="color:#333;">Esami del Sangue</strong><br><span style="color:#777; font-size:0.8rem;">Data: 12 Maggio 2026</span></div><button class="target-el" id="btn-download-referto" style="background:#28a745; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:bold;">📄 Scarica</button></div></div></div>`;
        else if (simType === 'save_as_dialog') return `<div class="sim-window" id="sim-interactive-area" style="background:#ccc; height:100%; position:relative; display:flex; align-items:center; justify-content:center;"><div style="background:white; border:1px solid #999; border-radius:6px; box-shadow:0 5px 15px rgba(0,0,0,0.3); width:90%; height:85%; display:flex; flex-direction:column; font-family:sans-serif;"><div style="background:#fff; padding:8px 12px; border-bottom:1px solid #ccc; display:flex; justify-content:space-between; font-size:0.85rem;"><span style="color:#333;">Salva con nome</span><span style="color:#999;">✕</span></div><div style="display:flex; flex:1;"><div style="width:110px; border-right:1px solid #ccc; padding:10px; font-size:0.8rem;"><div style="padding:6px; cursor:pointer;">🖥️ Desktop</div><div class="target-el" id="side-docs-save" style="padding:6px; cursor:pointer; transition:background 0.2s;">📄 Documenti</div><div style="padding:6px; cursor:pointer;">🖼️ Immagini</div></div><div style="flex:1; padding:15px; background:#fff; display:flex; flex-direction:column; justify-content:flex-end;"><div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;"><span style="font-size:0.8rem; color:#555;">Nome file:</span><input type="text" value="Referto.pdf" readonly style="flex:1; padding:4px; border:1px solid #0078D4; background:#e5f1fb;"></div></div></div><div style="background:#f0f0f0; padding:10px; text-align:right; border-top:1px solid #ccc;"><button class="target-el" id="btn-save-confirm" style="background:#0078D4; color:white; border:none; padding:6px 20px; border-radius:4px; cursor:pointer; font-size:0.85rem;">Salva</button></div></div></div>`;
        else if (simType === 'pdf_referto') return `<div class="sim-window" id="sim-interactive-area" style="background:#525659; height:100%; display:flex; justify-content:center; padding:15px; overflow-y:auto;"><div class="target-el" id="pdf-doc" style="background:white; width:90%; min-height:100%; box-shadow:0 0 15px rgba(0,0,0,0.5); padding:25px; color:black; text-align:left; cursor:pointer;"><h2 style="border-bottom:2px solid #333; padding-bottom:5px; color:#c0392b; font-size:1.1rem; margin-top:0;">ASL - LABORATORIO ANALISI</h2><div style="margin-top:15px; font-family:monospace; font-size:0.9rem; line-height:1.6;"><strong>PAZIENTE:</strong> Tu<br><strong>ESAME:</strong> Analisi di routine<br><strong>MEDICO:</strong> Dott. Hacker Bob<br><br><div style="text-align:center; margin-top:20px; padding:20px; border:2px dashed #c0392b; background:#fff0f0;"><div style="font-weight:bold; color:#555; margin-bottom:10px;">ESITO UFFICIALE DIAGNOSTICO:</div><span style="color:#c0392b; font-size:1.3rem; font-weight:bold;">LA DIAGNOSI È CHIARA:<br>PUZZI.</span></div></div></div></div>`;
        else if (simType === 'bank_login') return `<div class="sim-window" id="sim-interactive-area" style="background:#f4f7f6; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;"><div style="background:white; padding:30px; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1); width:80%; text-align:center;"><h2 style="color:#2c3e50; margin-bottom:15px; margin-top:0;">Banca Online</h2><input type="text" placeholder="Codice Cliente" readonly style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ccc; background:#eee;"><input type="password" placeholder="Password" readonly style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ccc; background:#eee;"><button style="width:100%; background:#2c3e50; color:white; border:none; padding:10px; border-radius:4px; font-weight:bold; opacity:0.5;">Accedi</button><div class="target-el" id="link-forgot-pwd" style="margin-top:15px; color:#3498db; font-size:0.85rem; font-weight:bold; cursor:pointer; text-decoration:underline;">Hai dimenticato la password?</div></div></div>`;
        else if (simType === 'otp_sim') return `<div class="sim-window" style="background:#fff; height:100%; display:flex; align-items:center; padding:15px; gap:15px;"><div style="flex:1; text-align:center;"><h3 style="color:#2c3e50; font-size:1rem; margin-top:0;">Sicurezza</h3><p style="font-size:0.75rem; color:#666; margin-bottom:10px;">Inserisci il codice ricevuto via SMS</p><input type="text" id="sim-typing-field" autocomplete="off" placeholder="------" style="width:100%; padding:10px; font-size:1.5rem; text-align:center; border:2px solid #ccc; border-radius:6px; letter-spacing:5px;"></div><div style="width:100px; height:190px; background:#222; border-radius:12px; border:3px solid #111; position:relative; display:flex; flex-direction:column; overflow:hidden;"><div style="background:#000; color:white; font-size:0.55rem; text-align:center; padding:2px;">10:45 | 5G</div><div style="flex:1; background:#e0e5ec; padding:8px;"><div style="background:white; border-radius:6px; padding:6px; font-size:0.65rem; box-shadow:0 2px 4px rgba(0,0,0,0.1); margin-top:5px; border-left:3px solid #2c3e50;"><strong style="color:#333;">Banca</strong><br>Codice di sicurezza: <strong style="font-size:0.8rem; color:#2c3e50;">456789</strong>. Non cederlo a nessuno.</div></div></div></div>`;
        else if (simType === 'pagopa_pdf') return `<div class="sim-window" id="sim-interactive-area" style="background:#e0e0e0; height:100%; display:flex; justify-content:center; padding:15px;"><div style="background:white; width:90%; box-shadow:0 0 10px rgba(0,0,0,0.2); padding:20px; font-family:sans-serif; text-align:left;"><div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0066CC; padding-bottom:10px;"><h3 style="color:#0066CC; margin:0; font-size:1.1rem;">pagoPA</h3><span style="font-size:0.7rem; color:#555;">Avviso di Pagamento</span></div><div style="margin-top:15px; font-size:0.8rem; color:#333;"><strong>Ente Creditore:</strong> Comune di HackerCity<br><strong>Importo:</strong> 25,00 €<br></div><div style="margin-top:20px; background:#f4f9ff; border:1px dashed #0066CC; padding:15px; text-align:center;"><div style="font-size:0.75rem; color:#555; font-weight:bold; margin-bottom:5px;">Codice Avviso (IUV)</div><div style="font-family:monospace; font-size:1.2rem; letter-spacing:1px; color:#111; user-select:text; -webkit-user-select:text; cursor:text;" title="Trascina il mouse per selezionare">123456789012345678</div><div style="font-size:0.65rem; color:#999; margin-top:5px;">(Seleziona il codice sopra e copia)</div></div></div></div>`;
        else if (simType === 'payment_portal') return `<div class="sim-window" style="background:#fff; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;"><div style="background:#f8f9fa; padding:25px; border-radius:8px; border:1px solid #dee2e6; width:85%; text-align:left;"><h3 style="color:#333; margin-top:0; margin-bottom:15px; font-size:1rem;">Pagamento Multe / Mensa</h3><label style="font-size:0.8rem; font-weight:bold; color:#555; display:block; margin-bottom:5px;">Incolla qui il Codice Avviso (IUV):</label><input type="text" id="sim-typing-field" autocomplete="off" placeholder="Es. 1234..." style="width:100%; padding:10px; font-family:monospace; font-size:1.1rem; border:2px solid #0066CC; border-radius:4px;"><button class="btn-primary" style="margin-top:15px; padding:10px; font-size:0.9rem;">Procedi al Pagamento</button></div></div>`;
        else if (simType === 'cup_calendar') return `<div class="sim-window" id="sim-interactive-area" style="background:white; height:100%; display:flex; flex-direction:column;"><div style="background:#17a2b8; color:white; padding:10px; font-weight:bold; font-size:0.9rem;">CUP - Prenota Appuntamento</div><div style="padding:15px; display:flex; gap:15px; height:100%;"><div style="flex:1.2;"><h4 style="margin-top:0; margin-bottom:10px; font-size:0.85rem; color:#555;">1. Seleziona la data:</h4><div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center; font-size:0.75rem;"><div style="font-weight:bold;">L</div><div style="font-weight:bold;">M</div><div style="font-weight:bold;">M</div><div style="font-weight:bold;">G</div><div style="font-weight:bold;">V</div><div style="font-weight:bold;">S</div><div style="font-weight:bold;">D</div><div style="color:#ccc;">11</div><div style="color:#ccc;">12</div><div style="color:#ccc;">13</div><div style="color:#ccc;">14</div><div class="target-el" id="cal-day-15" style="background:#d4edda; border:1px solid #28a745; color:#155724; cursor:pointer; font-weight:bold; padding:4px; border-radius:4px; transition:background 0.2s;">15</div><div style="color:#ccc;">16</div><div style="color:#ccc;">17</div></div></div><div id="time-slots" style="flex:1; border-left:1px solid #eee; padding-left:15px; display:none;"><h4 style="margin-top:0; margin-bottom:10px; font-size:0.85rem; color:#555;">2. Orari disponibili:</h4><div class="target-el" id="time-0900" style="padding:8px; border:1px solid #ccc; margin-bottom:5px; border-radius:4px; cursor:pointer; font-size:0.8rem; text-align:center;">09:00</div><div class="target-el" id="time-1130" style="padding:8px; border:1px solid #ccc; margin-bottom:5px; border-radius:4px; cursor:pointer; font-size:0.8rem; text-align:center; font-weight:bold; color:#0066CC;">11:30</div></div></div><div id="btn-confirm-container" style="padding:10px; text-align:right; border-top:1px solid #eee; display:none;"><button class="btn-primary target-el" id="btn-confirm-book" style="width:auto; padding:8px 20px; font-size:0.85rem;">Conferma</button></div></div>`;
        else if (simType === 'win_frozen') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex; flex-direction:column;"><div style="flex:1; background:linear-gradient(135deg, #0f5b9e, #368ee0); padding:20px;"><div style="background:white; opacity:0.7; height:120px; border:1px solid #ccc; box-shadow:0 2px 10px rgba(0,0,0,0.3); pointer-events:none;"><div style="background:#eee; padding:5px; border-bottom:1px solid #ccc; font-weight:bold; color:#777;">Programma (Non risponde)</div><div style="padding:20px; text-align:center;">Attendere prego...</div></div></div><div class="sim-taskbar target-el" id="sim-taskbar" style="cursor:context-menu; justify-content:flex-start; padding-left:15px; color:#aaa; font-weight:bold;">⊞ Start &nbsp;&nbsp;|&nbsp;&nbsp; 📁 &nbsp;&nbsp;|&nbsp;&nbsp; 🌐</div></div>`;
        else if (simType === 'task_manager') return `<div class="sim-window" id="sim-interactive-area" style="background:#f4f4f4; height:250px; display:flex; justify-content:center; align-items:center;"><div style="background:white; border:1px solid #999; box-shadow:0 4px 10px rgba(0,0,0,0.2); width:85%;"><div style="background:#fff; padding:8px 12px; border-bottom:1px solid #eee; font-weight:bold; font-size:0.9rem;">Gestione Attività</div><div style="padding:15px;"><div style="background:#e5f1fb; padding:8px; border:1px solid #cce4f7; font-weight:bold; font-size:0.85rem; color:#333;">Programma (Non risponde)</div><div style="text-align:right; margin-top:15px;"><button class="btn-primary target-el" id="btn-end-task" style="padding:6px 20px; font-size:0.85rem; width:auto;">Termina attività</button></div></div></div></div>`;
        else if (simType === 'win_start') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex; flex-direction:column;"><div style="flex:1; background:linear-gradient(135deg, #0f5b9e, #368ee0); position:relative;"><div style="position:absolute; bottom:0; left:0; width:220px; background:rgba(20,20,20,0.95); border-top-right-radius:8px; color:white; font-family:sans-serif; font-size:0.9rem; box-shadow:2px -2px 10px rgba(0,0,0,0.5); z-index:10;"><div style="padding:15px; border-bottom:1px solid #333; display:flex; gap:10px;"><div class="target-el" id="btn-power" style="cursor:pointer; padding:5px; border-radius:4px; font-weight:bold; transition:background 0.2s;">⏻ Arresta</div></div><div class="target-el" id="btn-restart" style="padding:12px 15px; cursor:pointer; font-weight:bold; transition:background 0.2s; color:#1CB0F6;">🔄 Riavvia il sistema</div></div></div><div class="sim-taskbar"><div class="sim-start-btn" style="background:#444;">⊞</div></div></div>`;
        else if (simType === 'explorer_downloads') return `<div class="sim-window"><div class="sim-header">📁 Esplora File</div><div class="explorer-chrome"><div class="explorer-path">💻 Questo PC › <strong id="path-text">Scaricati</strong></div></div><div class="explorer-body" id="sim-interactive-area"><div class="explorer-sidebar"><div class="sidebar-item">🖥️ Desktop</div><div class="sidebar-item drop-zone" id="side-trash" style="font-weight:bold; color:#cc0000;">🗑️ Cestino</div></div><div class="files-area"><div class="file-item"><div class="file-icon">📄</div><div class="file-name">Menu.pdf</div></div><div class="file-item"><div class="file-icon">🖼️</div><div class="file-name">Foto.jpg</div></div><div class="file-item"><div class="file-icon">📦</div><div class="file-name">Setup.exe</div></div></div></div></div>`;
        else if (simType === 'explorer_downloads_selected') return `<div class="sim-window"><div class="sim-header">📁 Esplora File</div><div class="explorer-chrome"><div class="explorer-path">💻 Questo PC › <strong id="path-text">Scaricati</strong></div></div><div class="explorer-body" id="sim-interactive-area"><div class="explorer-sidebar"><div class="sidebar-item">🖥️ Desktop</div><div class="sidebar-item target-el drop-zone" id="side-trash" style="font-weight:bold; color:#cc0000;">🗑️ Cestino</div></div><div class="files-area"><div class="target-el" id="files-group" draggable="true" style="display:flex; gap:8px; padding:10px; background:#e3f2fd; border:2px dashed #0078D4; border-radius:8px; cursor:grab; box-shadow:0 4px 10px rgba(0,0,0,0.1);"><div class="file-item"><div class="file-icon">📄</div><div class="file-name">Menu.pdf</div></div><div class="file-item"><div class="file-icon">🖼️</div><div class="file-name">Foto.jpg</div></div><div class="file-item"><div class="file-icon">📦</div><div class="file-name">Setup.exe</div></div></div></div></div></div>`;
        else if (simType === 'desktop_recycle') return `<div class="sim-window" id="sim-interactive-area"><div class="sim-header">💻 Schermo del tuo PC</div><div class="sim-desktop" style="height:250px;"><div class="sim-icon target-el" id="icon-trash" style="margin:20px;"><div class="sim-icon-emoji" style="font-size:3rem; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.4));">🗑️</div><div class="sim-icon-label" style="font-size:0.9rem; margin-top:5px;">Cestino<br>(Pieno)</div></div></div></div>`;
        else if (simType === 'explorer_usb') return `<div class="sim-window" id="sim-interactive-area"><div class="sim-header">📁 Esplora File</div><div class="explorer-chrome"><div class="explorer-path">💻 Questo PC</div></div><div class="explorer-body"><div class="explorer-sidebar"><div class="sidebar-item">🖥️ Desktop</div><div class="sidebar-item target-el" id="side-usb" style="background:#fff3cd; color:#856404; border:1px solid #ffeeba; font-weight:bold; margin-top:10px;">💾 USB (E:)</div></div><div class="files-area"><div style="padding:20px; color:#666; font-weight:bold; width:100%; text-align:center;">Nessun file selezionato</div></div></div></div>`;
        else if (simType === 'wifi_error') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex; flex-direction:column; background:white;"><div class="sim-browser-top"><div class="sim-url-bar"><span style="color:#333; font-weight:bold;">www.google.it</span></div></div><div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;"><div style="font-size:3rem; margin-bottom:10px;">🦖</div><h3 style="margin-bottom:5px; color:#555;">Nessuna connessione a Internet</h3><p style="color:#999; font-size:0.85rem; font-weight:bold;">Controlla la rete in basso a destra.</p></div><div class="sim-taskbar" style="background:#111;"><div style="flex:1;"></div><div class="target-el" id="icon-wifi" style="color:white; font-size:1.2rem; cursor:pointer; padding:5px; background:rgba(255,255,255,0.1); border-radius:4px;">🌐✖️</div></div></div>`;
        else if (simType === 'wifi_menu') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex; flex-direction:column; background:white;"><div style="flex:1; position:relative;"><div style="position:absolute; bottom:0; right:10px; width:220px; background:white; border:1px solid #ccc; box-shadow:0 -2px 10px rgba(0,0,0,0.2); border-radius:8px 8px 0 0; font-family:sans-serif; overflow:hidden;"><div style="padding:10px; background:#f4f4f4; font-weight:900; font-size:0.9rem; border-bottom:1px solid #ddd;">Reti Wi-Fi</div><div class="target-el" id="wifi-network" style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; cursor:pointer; background:#e8f4fd;"><strong>📶 Casa-WiFi</strong><button class="target-el btn-primary" id="btn-wifi-connect" style="padding:4px 10px; font-size:0.8rem; width:auto; border-radius:4px;">Connetti</button></div><div style="padding:15px; color:#999; font-weight:bold;">📶 Rete-Ospiti</div></div></div><div class="sim-taskbar" style="background:#111;"><div style="flex:1;"></div><div style="color:white; font-size:1.2rem; padding:5px;">🌐</div></div></div>`;
        else if (simType === 'win_update') return `<div class="sim-window" id="sim-interactive-area" style="background:#f3f2f1; height:250px; display:flex;"><div style="width:120px; background:#e1dfdd; padding:15px; font-size:0.85rem; font-weight:bold; color:#333; border-right:1px solid #ccc;">⚙️ Impostazioni<br><br><span style="color:#0078d4;">🔄 Update</span></div><div style="flex:1; padding:20px; background:white;"><h2 style="font-family:sans-serif; font-size:1.3rem; font-weight:bold; margin-bottom:15px; color:#0078d4;">Windows Update</h2><p style="font-size:0.9rem; color:#555; margin-bottom:20px; font-weight:bold;">Non sei aggiornato.<br>Mancano aggiornamenti importanti di sicurezza.</p><button class="btn-primary target-el" id="btn-check-updates" style="width:auto; padding:8px 20px; font-size:0.9rem; border-radius:4px;">Verifica disponibilità aggiornamenti</button></div></div>`;
        else if (simType === 'win_defender') return `<div class="sim-window" id="sim-interactive-area" style="background:#f3f2f1; height:250px; display:flex;"><div style="width:120px; background:#e1dfdd; padding:15px; font-size:0.85rem; font-weight:bold; color:#333; border-right:1px solid #ccc;">🛡️ Sicurezza</div><div style="flex:1; padding:20px; background:white;"><h2 style="font-family:sans-serif; font-size:1.3rem; font-weight:bold; margin-bottom:15px; color:#333;">Protezione da virus</h2><div style="border:1px solid #eee; background:#fafafa; padding:15px; border-radius:6px; display:flex; align-items:center; gap:15px;"><div style="font-size:2.5rem; color:#107c41;">🛡️</div><div><strong style="display:block; font-size:0.95rem; color:#333;">Nessuna minaccia attuale</strong><span style="font-size:0.8rem; color:#777; font-weight:bold;">Ultima analisi: molto tempo fa.</span><br><button class="btn-primary target-el" id="btn-quick-scan" style="width:auto; padding:6px 15px; font-size:0.85rem; border-radius:4px; margin-top:8px;">Scansione veloce</button></div></div></div></div>`;
        else if (simType === 'print_queue') return `<div class="sim-window" id="sim-interactive-area" style="background:white; height:250px; display:flex; flex-direction:column; border:1px solid #ccc;"><div style="background:#f0f0f0; padding:8px 10px; border-bottom:1px solid #ccc; font-weight:bold; font-size:0.9rem; display:flex; align-items:center; gap:8px;">🖨️ Stampante - 2 documenti in coda</div><div style="display:flex; background:#fafafa; border-bottom:1px solid #ddd; padding:5px 10px; font-size:0.8rem; font-weight:bold; color:#555;"><div style="flex:2;">Nome documento</div><div style="flex:1;">Stato</div></div><div class="target-el" id="print-doc-error" style="display:flex; padding:8px 10px; border-bottom:1px solid #eee; font-size:0.85rem; background:#fff0f0; cursor:context-menu; transition:background 0.2s;"><div style="flex:2; font-weight:bold; color:#333;">📄 Lettera_Urgente.pdf</div><div style="flex:1; color:#c0392b; font-weight:bold;">Errore - In stampa</div></div><div style="display:flex; padding:8px 10px; font-size:0.85rem;"><div style="flex:2; font-weight:bold; color:#777;">📄 Foto.jpg</div><div style="flex:1; color:#777; font-weight:bold;">In coda</div></div></div>`;
        else if (simType === 'drive_backup') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex;"><div style="flex:1; background:linear-gradient(135deg, #0f5b9e, #368ee0); padding:10px;"><div style="color:white; font-size:0.8rem; font-weight:bold; margin-bottom:10px; text-shadow:0 1px 2px #000;">💻 Il tuo Desktop</div><div class="target-el" id="folder-lavoro" draggable="true" style="width:70px; text-align:center; cursor:grab; padding:5px; border-radius:8px;"><div style="font-size:2.5rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📁</div><div style="color:white; font-size:0.8rem; font-weight:bold; text-shadow:0 1px 2px #000;">Lavoro</div></div></div><div style="flex:1.5; background:white; display:flex; flex-direction:column; border-left:2px solid #ccc;"><div style="background:#F1F3F4; padding:8px; border-bottom:1px solid #ddd; color:#1A73E8; font-weight:bold; font-size:0.85rem; display:flex; align-items:center; gap:5px;">☁️ Google Drive</div><div class="target-el drop-zone" id="drive-drop-zone" style="flex:1; margin:15px; border:2px dashed #1A73E8; border-radius:10px; display:flex; align-items:center; justify-content:center; background:#f4f9ff; color:#1A73E8; font-weight:bold; font-size:0.9rem; text-align:center; transition:background 0.2s;">Trascina qui le cartelle<br>per fare il backup</div></div></div>`;
        else if (simType === 'browser_search') return `<div class="sim-window" id="sim-interactive-area" style="background:white; display:flex; flex-direction:column;"><div style="display:flex; align-items:center; padding:6px 10px; gap:6px; background:#f1f3f4; border-bottom:1px solid #ddd;"><div style="font-size:0.9rem; padding:4px 8px; cursor:pointer; border:1px solid #ccc; background:white; border-radius:4px;">⬅</div><div style="font-size:0.9rem; padding:4px 8px; cursor:pointer; border:1px solid #ccc; background:white; border-radius:4px;">➡</div><div style="font-size:0.9rem; padding:4px 8px; cursor:pointer; border:1px solid #ccc; background:white; border-radius:4px;">↻</div><div style="flex:1; display:flex; align-items:center; background:white; border:2px solid #ccc; border-radius:20px; padding:4px 12px; gap:6px; margin:0 6px;"><span style="color:#888; font-size:0.85rem;">🌐</span><input type="text" id="sim-typing-field" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="https://" style="border:none; outline:none; flex:1; font-size:0.9rem; font-weight:700; color:#333; background:transparent;"></div></div><div style="flex:1; display:flex; align-items:center; justify-content:center; height:160px; color:#ccc; font-size:2rem;">🌐</div></div>`;
        else if (simType === 'browser_search_prefilled') return `<div class="sim-window" id="sim-interactive-area" style="background:white; display:flex; flex-direction:column;"><div style="display:flex; align-items:center; padding:6px 10px; gap:6px; background:#f1f3f4; border-bottom:1px solid #ddd;"><div style="font-size:0.9rem; padding:4px 8px; border:1px solid #ccc; background:white; border-radius:4px; cursor:pointer;">⬅</div><div style="flex:1; display:flex; align-items:center; background:white; border:2px solid #0078d4; border-radius:20px; padding:4px 14px; gap:8px; margin:0 6px;"><span style="color:#888;">🔒</span><span style="font-size:0.9rem; font-weight:700; color:#333; flex:1;">https://www.comune.it</span></div></div><div style="flex:1; display:flex; align-items:center; justify-content:center; height:160px; flex-direction:column; gap:10px;"><div style="font-size:2rem;">🌐</div><div style="color:#aaa; font-weight:bold; font-size:0.9rem;">Premi INVIO per aprire la pagina…</div></div></div>`;
        else if (simType === 'form_registration') return `<div class="sim-window" id="sim-interactive-area" style="background:white; overflow:hidden;"><div style="background:#0078d4; color:white; padding:12px 18px; font-weight:bold; font-size:1rem;">📝 Modulo di Registrazione</div><div style="padding:20px; display:flex; flex-direction:column; gap:14px;"><div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.82rem; font-weight:900; color:#555; text-transform:uppercase; letter-spacing:0.5px;">Nome *</label><input type="text" class="form-field-input" id="form-field-0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="es. Mario" style="padding:10px 12px; border:2px solid #ddd; border-radius:8px; font-size:0.95rem; font-weight:700; outline:none; transition:border-color 0.2s; font-family:inherit;"></div><div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.82rem; font-weight:900; color:#555; text-transform:uppercase; letter-spacing:0.5px;">Cognome *</label><input type="text" class="form-field-input" id="form-field-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="es. Rossi" style="padding:10px 12px; border:2px solid #ddd; border-radius:8px; font-size:0.95rem; font-weight:700; outline:none; transition:border-color 0.2s; font-family:inherit;"></div><div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.82rem; font-weight:900; color:#555; text-transform:uppercase; letter-spacing:0.5px;">Città *</label><input type="text" class="form-field-input" id="form-field-2" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="es. Roma" style="padding:10px 12px; border:2px solid #ddd; border-radius:8px; font-size:0.95rem; font-weight:700; outline:none; transition:border-color 0.2s; font-family:inherit;"></div></div></div>`;
        else if (simType === 'text_editor_fix') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:220px;"><div style="background:#f0f0f0; padding:5px 12px; border-bottom:1px solid #ccc; font-size:0.8rem; font-weight:bold; color:#555; display:flex; gap:20px;"><span>File</span><span>Modifica</span><span>Formato</span></div><div style="background:#fff8dc; flex:1; display:flex; flex-direction:column; padding:8px; gap:6px;"><div style="font-size:0.75rem; color:#888; font-weight:bold; border-bottom:1px dashed #ddd; padding-bottom:4px;">Blocco Note — correggi il testo</div><input type="text" id="text-fix-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="flex:1; border:none; outline:none; font-family:Consolas,monospace; font-size:1.4rem; font-weight:bold; letter-spacing:3px; color:#222; background:transparent; padding:8px 4px;"></div><div style="background:#f0f0f0; padding:3px 10px; font-size:0.72rem; color:#666; border-top:1px solid #ccc;">← → muovi cursore | CANC elimina a destra | BACKSPACE elimina a sinistra</div></div>`;
        else if (simType === 'browser_url_fix') return `<div class="sim-window" style="display:flex; flex-direction:column; height:280px; background:#fff;"><div style="background:#f1f3f4; border-bottom:1px solid #ddd; padding:6px 10px; display:flex; align-items:center; gap:6px;"><div style="display:flex; gap:4px; margin-right:4px;"><div style="width:11px;height:11px;border-radius:50%;background:#ff5f57;"></div><div style="width:11px;height:11px;border-radius:50%;background:#febc2e;"></div><div style="width:11px;height:11px;border-radius:50%;background:#28c840;"></div></div><div style="font-size:1rem; padding:3px 8px; cursor:pointer; color:#555;">⬅</div><div style="font-size:1rem; padding:3px 8px; cursor:pointer; color:#555;">➡</div><div style="font-size:1rem; padding:3px 8px; cursor:pointer; color:#555;">↻</div><div style="flex:1; display:flex; align-items:center; background:white; border:2px solid #ccc; border-radius:20px; padding:3px 14px; gap:6px; margin:0 6px;"><span style="color:#888; font-size:0.85rem;">🔒</span><input type="text" id="text-fix-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="border:none; outline:none; flex:1; font-size:0.9rem; font-weight:700; color:#c0392b; background:transparent; font-family:Consolas,monospace;"></div></div><div id="sim-interactive-area" style="flex:1; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:8px; color:#bbb;"><div style="font-size:2.5rem;">🌐</div><div style="font-weight:bold; font-size:0.9rem;">Correggi l'indirizzo e premi Verifica</div></div></div>`;
        else if (simType === 'browser_login') return `<div class="sim-window" style="display:flex; flex-direction:column; height:280px; background:#fff;"><div style="background:#f1f3f4; border-bottom:1px solid #ddd; padding:6px 10px; display:flex; align-items:center; gap:6px;"><div style="display:flex; gap:4px; margin-right:4px;"><div style="width:11px;height:11px;border-radius:50%;background:#ff5f57;"></div><div style="width:11px;height:11px;border-radius:50%;background:#febc2e;"></div><div style="width:11px;height:11px;border-radius:50%;background:#28c840;"></div></div><div style="font-size:1rem; padding:3px 8px; color:#555;">⬅</div><div style="font-size:1rem; padding:3px 8px; color:#555;">➡</div><div style="font-size:1rem; padding:3px 8px; color:#555;">↻</div><div style="flex:1; display:flex; align-items:center; background:white; border:2px solid #1a73e8; border-radius:20px; padding:3px 14px; gap:6px; margin:0 6px;"><span style="color:#1a73e8; font-size:0.85rem;">🔒</span><span style="font-size:0.9rem; font-weight:700; color:#333; font-family:Consolas,monospace;">https://www.comune.it/login</span></div></div><div id="sim-interactive-area" style="flex:1; background:#f8f9fa; display:flex; align-items:center; justify-content:center; padding:10px;"><div style="background:white; border:1px solid #e0e0e0; border-radius:10px; padding:20px 24px; width:100%; max-width:280px; box-shadow:0 2px 10px rgba(0,0,0,0.08);"><div style="font-weight:900; font-size:1rem; color:#1a73e8; margin-bottom:14px; text-align:center;">🏛️ Portale Comune</div><div style="display:flex; flex-direction:column; gap:10px;"><div style="display:flex; flex-direction:column; gap:3px;"><label style="font-size:0.78rem; font-weight:900; color:#555; text-transform:uppercase; letter-spacing:0.5px;">Nome utente</label><input type="text" class="form-field-input" id="form-field-0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="mario.rossi" style="padding:8px 10px; border:2px solid #ddd; border-radius:6px; font-size:0.9rem; font-weight:700; outline:none; transition:border-color 0.2s; font-family:inherit;"></div><div style="display:flex; flex-direction:column; gap:3px;"><label style="font-size:0.78rem; font-weight:900; color:#555; text-transform:uppercase; letter-spacing:0.5px;">Password</label><input type="password" class="form-field-input" id="form-field-1" autocomplete="off" placeholder="••••••••" style="padding:8px 10px; border:2px solid #ddd; border-radius:6px; font-size:0.9rem; font-weight:700; outline:none; transition:border-color 0.2s; font-family:inherit;"></div></div></div></div></div>`;
        else if (simType === 'email_overwrite') return `<div class="sim-window" style="display:flex; flex-direction:column; height:280px; background:white;"><div style="background:#ea4335; color:white; padding:8px 15px; font-weight:bold; font-family:var(--font-heading);">✉️ Nuova Email</div><div style="padding:8px 15px; border-bottom:1px solid #eee; font-size:0.85rem; color:#555; font-weight:bold;"><strong style="color:#888;">A:</strong> cliente@gmail.com</div><div style="padding:8px 15px; border-bottom:1px solid #eee; font-size:0.85rem; color:#555; font-weight:bold;"><strong style="color:#888;">Ogg:</strong> Conferma ordine #4521</div><div id="sim-interactive-area" style="flex:1; padding:12px 15px; display:flex; flex-direction:column; gap:6px;"><div style="font-size:0.75rem; color:#aaa; font-weight:900; text-transform:uppercase;">Corpo del messaggio</div><textarea id="email-overwrite-input" autocomplete="off" autocorrect="off" spellcheck="false" style="flex:1; border:2px solid #ddd; border-radius:6px; padding:10px; font-size:0.9rem; font-weight:700; color:#333; resize:none; font-family:inherit; line-height:1.5;">Questo testo è completamente sbagliato e va riscritto.</textarea></div></div>`;
        else if (simType === 'win_start_search') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:260px; background:white;"><div style="flex:1; background:linear-gradient(135deg,#0f5b9e,#368ee0); position:relative; overflow:hidden;"><div style="position:absolute; bottom:60px; left:0; width:260px; background:rgba(30,30,30,0.97); border-radius:0 12px 0 0; color:white; font-family:sans-serif; overflow:hidden; box-shadow:4px -4px 20px rgba(0,0,0,0.4);"><div style="padding:10px 14px; border-bottom:1px solid #333; font-weight:bold; font-size:0.85rem; color:#aaa; text-transform:uppercase; letter-spacing:1px;">Start</div><div id="start-results" style="min-height:40px; padding:8px 14px;"></div><div style="padding:8px 14px; border-top:1px solid #333; display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.05);"><span style="font-size:1rem;">🔍</span><input type="text" id="start-search-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Cerca..." style="background:transparent; border:none; outline:none; color:white; font-size:0.95rem; font-weight:700; font-family:inherit; flex:1;"></div></div></div><div class="sim-taskbar"><div class="sim-start-btn target-el" id="btn-start" style="background:#0078d4; cursor:pointer;">⊞</div><div style="color:#aaa; font-size:0.8rem; margin-left:8px; font-weight:bold;">🔍 Cerca</div></div></div>`;
        else if (simType === 'snap_layout_sim') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:260px; background:#0d47a1; position:relative; overflow:hidden;"><div style="flex:1; position:relative; padding:10px; display:flex; flex-direction:column; justify-content:flex-end;"><div class="target-el" id="win-browser" draggable="true" style="position:absolute; top:10px; left:30px; width:140px; height:100px; background:white; border:1px solid #ccc; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.3); cursor:grab; z-index:10; overflow:hidden;"><div style="background:#f1f3f4; padding:5px 8px; font-size:0.75rem; font-weight:bold; border-bottom:1px solid #ddd;">🌐 Browser</div><div style="padding:8px; font-size:0.7rem; color:#888;">google.it</div></div><div style="position:absolute; top:30px; left:60px; width:140px; height:100px; background:white; border:1px solid #ccc; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.2); overflow:hidden;"><div style="background:#217346; color:white; padding:5px 8px; font-size:0.75rem; font-weight:bold;">📊 Excel</div><div style="padding:6px; font-size:0.7rem; color:#555;">Foglio1.xlsx</div></div><div class="drop-zone" id="snap-left-zone" style="position:absolute; top:0; left:0; width:18px; height:100%; background:rgba(0,120,212,0.0); border-right:2px dashed rgba(255,255,255,0.2); transition:background 0.2s; display:flex; align-items:center; justify-content:center;"><span style="color:rgba(255,255,255,0.3); font-size:0.6rem; writing-mode:vertical-rl;">SNAP</span></div></div><div class="sim-taskbar"><div style="color:white; font-size:0.8rem; font-weight:bold; opacity:0.7;">Trascina Browser sul bordo ←</div></div></div>`;
        else if (simType === 'snap_layout_done') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:260px; background:#0d47a1; position:relative; overflow:hidden;"><div style="flex:1; display:flex; gap:3px; padding:6px;"><div style="flex:1; background:white; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column;"><div style="background:#f1f3f4; padding:5px 8px; font-size:0.75rem; font-weight:bold; border-bottom:1px solid #ddd;">🌐 Browser (Snap ←)</div><div style="flex:1; padding:8px; font-size:0.7rem; color:#888; text-align:center;">Finestra ancorata a sinistra</div></div><div style="flex:1; display:flex; flex-direction:column; gap:3px; padding:3px;"><div class="target-el" id="mini-excel" style="background:white; border-radius:4px; padding:8px; box-shadow:0 2px 6px rgba(0,0,0,0.2); cursor:pointer; display:flex; align-items:center; gap:6px; transition:background 0.15s;"><div style="font-size:1.2rem;">📊</div><div style="font-size:0.75rem; font-weight:bold;">Excel</div></div><div style="background:rgba(255,255,255,0.15); border-radius:4px; padding:8px; display:flex; align-items:center; gap:6px;"><div style="font-size:1.2rem; opacity:0.5;">📁</div><div style="font-size:0.75rem; color:rgba(255,255,255,0.6);">Altro...</div></div></div></div><div class="sim-taskbar"><div style="color:white; font-size:0.8rem; font-weight:bold; opacity:0.7;">Clicca la miniatura di Excel →</div></div></div>`;
        else if (simType === 'taskbar_pinning') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:260px;"><div style="flex:1; background:linear-gradient(135deg,#0f5b9e,#368ee0); position:relative; display:flex; align-items:flex-start; padding:15px; gap:20px;"><div class="target-el sim-icon" id="icon-browser-desktop" style="text-align:center; cursor:context-menu; width:64px; padding:6px; border-radius:6px; transition:background 0.15s;"><div style="font-size:2.5rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4));">🌐</div><div style="color:white; font-size:0.78rem; font-weight:bold; text-shadow:0 1px 2px #000;">Internet</div></div></div><div class="sim-taskbar" id="sim-taskbar-bar"><div class="sim-start-btn" style="background:#444;">⊞</div><div style="flex:1;"></div><div style="color:#aaa; font-size:0.75rem; font-weight:bold;">12:00</div></div></div>`;
        else if (simType === 'task_manager_advanced') return `<div class="sim-window" id="sim-interactive-area" style="background:#f4f4f4; height:260px; display:flex; flex-direction:column;"><div style="background:white; border-bottom:1px solid #ddd; padding:6px 12px; font-weight:bold; font-size:0.9rem; display:flex; gap:16px; color:#555;"><span style="color:#333; font-weight:900;">Gestione Attività</span><span>File</span><span>Opzioni</span><span>Visualizza</span></div><div style="display:flex; gap:0; border-bottom:1px solid #ddd; background:#f8f8f8; font-size:0.78rem; font-weight:bold; color:#777;"><div style="flex:2; padding:5px 12px;">Processo</div><div style="flex:1; padding:5px; text-align:right;">CPU</div><div style="flex:1; padding:5px; text-align:right;">Memoria</div></div><div style="flex:1; overflow:auto;"><div style="display:flex; background:#fff0f0; border-bottom:1px solid #ffd6d6; font-size:0.85rem; padding:6px 12px; align-items:center;"><div style="flex:2; font-weight:bold; color:#c0392b; display:flex; align-items:center; gap:8px;"><span>⚠️</span><span>Programma Pesante</span></div><div style="flex:1; text-align:right; font-weight:900; color:#c0392b;">99%</div><div style="flex:1; text-align:right; font-weight:bold; color:#888;">1.2 GB</div></div><div style="display:flex; background:white; border-bottom:1px solid #eee; font-size:0.85rem; padding:6px 12px;"><div style="flex:2; color:#555; font-weight:bold;">Sistema</div><div style="flex:1; text-align:right; color:#555;">2%</div><div style="flex:1; text-align:right; color:#555;">450 MB</div></div><div style="display:flex; background:white; border-bottom:1px solid #eee; font-size:0.85rem; padding:6px 12px;"><div style="flex:2; color:#555; font-weight:bold;">Browser</div><div style="flex:1; text-align:right; color:#555;">1%</div><div style="flex:1; text-align:right; color:#555;">320 MB</div></div></div><div style="border-top:1px solid #ddd; padding:8px 12px; background:white; display:flex; justify-content:flex-end;"><button class="btn-primary target-el" id="btn-end-task-adv" style="width:auto; padding:6px 18px; font-size:0.85rem; border-radius:4px;">Termina attività</button></div></div>`;
        else if (simType === 'win_taskbar_search') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:260px; background:white;"><div style="flex:1; background:linear-gradient(135deg,#0f5b9e,#368ee0);"></div><div class="sim-taskbar"><div class="sim-start-btn" style="background:#444;">⊞</div><div style="background:#222; border:1px solid #444; border-radius:6px; padding:4px 10px; display:flex; align-items:center; gap:6px; flex:1; max-width:220px; cursor:text;"><span style="color:#888;">🔍</span><input type="text" id="start-search-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Cerca..." style="background:transparent; border:none; outline:none; color:white; font-size:0.85rem; font-weight:700; font-family:inherit; flex:1;"></div></div></div>`;
        else if (simType === 'desktop_show_btn') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:260px;"><div style="flex:1; background:linear-gradient(135deg,#0f5b9e,#368ee0); padding:10px; display:flex; flex-wrap:wrap; gap:10px; align-content:flex-start;"><div style="text-align:center; width:64px;"><div style="font-size:2.2rem;">📁</div><div style="color:white; font-size:0.72rem; font-weight:bold; text-shadow:0 1px 2px #000;">Lavoro</div></div><div style="text-align:center; width:64px;"><div style="font-size:2.2rem;">🌐</div><div style="color:white; font-size:0.72rem; font-weight:bold; text-shadow:0 1px 2px #000;">Internet</div></div></div><div class="sim-taskbar"><div class="sim-start-btn" style="background:#444;">⊞</div><div style="flex:1;"></div><div class="target-el" id="btn-show-desktop" style="width:6px; height:100%; background:rgba(255,255,255,0.15); margin-left:4px; cursor:pointer; border-left:1px solid #555;" title="Mostra Desktop"></div></div></div>`;
        else if (simType === 'snap_layout_with_show_btn') return `<div class="sim-window" style="display:flex; flex-direction:column; height:260px; background:#0d47a1;"><div style="flex:1; display:flex; gap:3px; padding:6px;"><div style="flex:1; background:white; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column;"><div style="background:#f1f3f4; padding:5px 8px; font-size:0.75rem; font-weight:bold; border-bottom:1px solid #ddd;">🌐 Browser (Snap ←)</div><div style="flex:1; padding:8px; font-size:0.7rem; color:#888; text-align:center; display:flex; align-items:center; justify-content:center;">Finestra ancorata a sinistra</div></div><div style="flex:1; background:white; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.3); overflow:hidden; display:flex; flex-direction:column;"><div style="background:#217346; color:white; padding:5px 8px; font-size:0.75rem; font-weight:bold;">📊 Excel (Snap →)</div><div style="flex:1; padding:8px; font-size:0.7rem; color:#555; display:flex; align-items:center; justify-content:center;">Foglio1.xlsx</div></div></div><div id="sim-interactive-area" class="sim-taskbar"><div class="sim-start-btn" style="background:#444;">⊞</div><div style="flex:1;"></div><div class="target-el" id="btn-show-desktop" style="width:8px; height:100%; background:rgba(255,255,255,0.18); margin-left:4px; cursor:pointer; border-left:1px solid #666;" title="Mostra Desktop"></div></div></div>`;
        else if (simType === 'popup_fake_x') return `<div class="sim-window" style="display:flex;flex-direction:column;min-height:400px;"><div class="sim-browser-top" style="position:relative;z-index:35;display:flex;align-items:center;gap:8px;"><div class="sim-nav-btn">⬅</div><div class="sim-nav-btn">➡</div><div class="sim-nav-btn">↻</div><div class="sim-url-bar" style="flex:1;"><span style="color:#888;margin-right:4px;">🔒</span><span style="font-size:0.85rem;font-weight:700;color:#333;">www.aggiornamento-sicuro.it</span></div><button class="browser-real-close target-el" id="browser-real-close-x" title="Chiudi il browser">✕</button></div><div style="flex:1;position:relative;"><div style="padding:14px;font-size:0.85rem;color:#666;font-weight:700;"><h4 style="margin:0 0 6px;color:#333;">Notizie del giorno</h4><p style="margin:0;line-height:1.5;">Leggi le ultime notizie...</p></div><div class="popup-overlay" style="z-index:30;"><div class="popup-box" style="position:relative;"><button class="target-el" id="popup-small-real-x" style="position:absolute; top:6px; right:8px; background:none; border:none; color:#bbb; font-size:12px; font-weight:bold; cursor:pointer;" title="Chiudi popup">✕</button><button class="popup-fake-big-x target-el" id="popup-big-fake-x" title="Forse questa chiude?">✕</button><div class="popup-icon">⚠️</div><div class="popup-title">Aggiornamento Browser Richiesto!</div><div class="popup-msg" style="font-size:0.82rem;">Il tuo browser è obsoleto e non sicuro. Aggiorna ora per proteggere i tuoi dati.</div><div class="popup-btns" style="margin-top:10px;"><button class="popup-fake-btn target-el" id="popup-fake-update" style="width:100%;">🔄 Aggiorna Ora — Gratis!</button></div></div></div></div></div>`;
        else if (simType === 'popup_scareware_task') return `<div class="sim-window" id="sim-interactive-area" style="display:flex;flex-direction:column;min-height:400px;"><div style="flex:1;position:relative;overflow:hidden;"><div class="scareware-overlay" style="position:absolute;inset:0;background:#c0392b;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;padding:20px;pointer-events:none;"><div style="font-size:3.5rem;filter:drop-shadow(0 0 8px rgba(255,0,0,0.8));">🚨</div><div style="color:white;font-size:1.2rem;font-weight:900;text-align:center;font-family:sans-serif;">ACCESSO NON AUTORIZZATO</div><div style="color:#ffcccc;font-size:0.85rem;text-align:center;font-weight:700;max-width:240px;">Il sistema è stato bloccato per attività sospette. Contattare subito il supporto tecnico.</div><button style="margin-top:8px;background:#ff6b6b;color:white;border:2px solid rgba(255,255,255,0.5);border-radius:8px;padding:10px 18px;font-size:0.95rem;font-weight:900;pointer-events:none;cursor:default;">📞 Chiama Supporto (€9.99/min)</button></div></div><div class="sim-taskbar target-el" id="sim-taskbar" style="display:flex; width:100%; align-items:center; gap:10px; cursor:context-menu;"><div class="sim-start-btn" style="background:#333;pointer-events:none;">⊞</div><div style="flex:1;color:#aaa;font-size:0.75rem;font-weight:bold;pointer-events:none;">Clic DESTRO sulla Taskbar per il menu</div><div style="color:#aaa;font-size:0.75rem;pointer-events:none;">12:00</div></div></div></div>`;
        else if (simType === 'task_manager_scareware') return `<div class="sim-window" id="sim-interactive-area" style="background:#f4f4f4;min-height:400px;display:flex;flex-direction:column;"><div style="background:white;border-bottom:1px solid #ddd;padding:6px 12px;font-weight:bold;font-size:0.9rem;display:flex;gap:16px;color:#555;"><span style="color:#333;font-weight:900;">Gestione Attività</span><span>File</span><span>Opzioni</span><span>Visualizza</span></div><div style="display:flex;border-bottom:1px solid #ddd;background:#f8f8f8;font-size:0.78rem;font-weight:bold;color:#777;"><div style="flex:2;padding:5px 12px;">Processo</div><div style="flex:1;padding:5px;text-align:right;">CPU</div><div style="flex:1;padding:5px;text-align:right;">Memoria</div></div><div style="flex:1;overflow:auto;"><div class="target-el" id="row-browser" style="display:flex;background:#fff0f0;border-bottom:1px solid #ffd6d6;font-size:0.85rem;padding:6px 12px;align-items:center;cursor:pointer;transition:background 0.2s, border-left 0.2s;"><div style="flex:2;font-weight:bold;color:#c0392b;display:flex;align-items:center;gap:8px;"><span>⚠️</span><span>Browser (bloccato)</span></div><div style="flex:1;text-align:right;font-weight:900;color:#c0392b;">98%</div><div style="flex:1;text-align:right;color:#888;font-weight:bold;">890 MB</div></div><div style="display:flex;background:white;border-bottom:1px solid #eee;font-size:0.85rem;padding:6px 12px;"><div style="flex:2;color:#555;font-weight:bold;">Sistema</div><div style="flex:1;text-align:right;color:#555;">1%</div><div style="flex:1;text-align:right;color:#555;">320 MB</div></div></div><div style="border-top:1px solid #ddd;padding:8px 12px;background:white;display:flex;justify-content:flex-end;"><button class="btn-primary target-el" id="btn-end-task" style="width:auto;padding:6px 18px;font-size:0.85rem;border-radius:4px;">Termina attività</button></div></div>`;
        else if (simType === 'phishing_url_check') return `<div class="sim-window" id="sim-interactive-area" style="display:flex;flex-direction:column;min-height:400px;"><div class="sim-tabs-bar"><div class="sim-tab"><span style="font-size:0.85rem;">🏛️ Poste Italiane — Area Riservata</span><button class="sim-tab-x target-el" id="tab-close-x" title="Chiudi questa scheda">✕</button></div></div><div class="sim-browser-top" style="display:flex;align-items:center;gap:8px;"><div class="sim-nav-btn">⬅</div><div class="sim-nav-btn">➡</div><div class="sim-url-bar" style="flex:1;border-color:#e74c3c;background:#fff5f5;gap:6px;"><span style="font-size:0.85rem;">⚠️</span><span style="font-family:Consolas,monospace;font-weight:900;color:#c0392b;font-size:0.9rem;letter-spacing:0.5px;">www.p0ste.it</span><span style="font-size:0.72rem;color:#e74c3c;margin-left:4px;font-weight:900;">Non sicuro</span></div></div><div style="flex:1;background:white;padding:16px;"><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eee;"><span style="font-size:2rem;">📮</span><div><div style="font-weight:900;color:#004080;font-size:1rem;">Poste Italiane</div><div style="font-size:0.72rem;color:#888;">Area Clienti</div></div></div><div style="background:#f0f4ff;border:1px solid #c8d8f0;border-radius:8px;padding:14px;"><div style="font-size:0.85rem;font-weight:900;margin-bottom:10px;color:#333;">Accedi al tuo conto BancoPosta</div><div style="margin-bottom:8px;"><label style="font-size:0.75rem;font-weight:900;color:#555;display:block;margin-bottom:3px;">Codice fiscale</label><div style="background:white;border:1px solid #ccc;border-radius:4px;padding:7px 10px;font-size:0.85rem;color:#aaa;">Inserisci il tuo codice fiscale</div></div><div><label style="font-size:0.75rem;font-weight:900;color:#555;display:block;margin-bottom:3px;">Password</label><div style="background:white;border:1px solid #ccc;border-radius:4px;padding:7px 10px;font-size:0.85rem;color:#aaa;">••••••••</div></div><div style="margin-top:10px;background:#004080;color:white;border-radius:6px;padding:8px;text-align:center;font-weight:bold;font-size:0.85rem;">ACCEDI</div></div></div></div>`;
        else if (simType === 'popup_infinite_escape') return `<div class="sim-window" style="display:flex;flex-direction:column;min-height:400px;"><div class="system-chrome"><span style="font-size:0.9rem;">🌐</span><span class="system-chrome-title">Browser — Avviso di Sicurezza</span><button class="system-chrome-btn" style="pointer-events:none;">—</button><button class="system-chrome-btn" style="pointer-events:none;">□</button><button class="system-chrome-btn close target-el" id="system-close-x">✕</button></div><div class="escape-content" id="escape-content-area" style="flex:1;position:relative;overflow:hidden;background:#e8e8e8;"><div style="padding:14px;font-size:0.8rem;color:#888;font-weight:700;">www.tecnico-veloce.it — Analisi del sistema in corso...</div><div id="escape-popup" style="position:absolute;top:60px;left:30px;background:white;border:2px solid #e74c3c;border-radius:8px;padding:16px;width:200px;box-shadow:0 4px 16px rgba(0,0,0,0.3);text-align:center;transition:left 0.15s,top 0.15s;"><div style="font-size:1.5rem;margin-bottom:6px;">🛡️</div><div style="font-weight:900;font-size:0.85rem;color:#e74c3c;margin-bottom:4px;">VIRUS RILEVATO!</div><div style="font-size:0.75rem;color:#555;margin-bottom:10px;">Chiama il supporto certificato Microsoft</div><button class="target-el" id="btn-call-tech" style="background:#e74c3c;color:white;border:none;border-radius:6px;padding:7px 12px;font-size:0.8rem;font-weight:900;cursor:pointer;width:100%;margin-bottom:6px;">📞 Chiama Tecnico (€15/min)</button><button id="escape-fake-close" style="background:none;border:1px solid #ccc;border-radius:6px;padding:5px 12px;font-size:0.75rem;cursor:pointer;width:100%;color:#888;">Ignora (non consigliato)</button></div></div></div>`;
        
        else if (simType === 'browser_frozen') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex; flex-direction:column;"><div style="flex:1; background:linear-gradient(135deg, #0f5b9e, #368ee0); padding:20px;"><div style="background:white; opacity:0.7; height:120px; border:1px solid #ccc; box-shadow:0 2px 10px rgba(0,0,0,0.3); pointer-events:none;"><div style="background:#eee; padding:5px; border-bottom:1px solid #ccc; font-weight:bold; color:#777;">Browser (Non risponde)</div><div style="padding:20px; text-align:center;">Caricamento in corso...</div></div></div><div class="sim-taskbar target-el" id="sim-taskbar" style="cursor:context-menu; justify-content:flex-start; padding-left:15px; color:#aaa; font-weight:bold;">⊞ Start &nbsp;&nbsp;|&nbsp;&nbsp; 📁 &nbsp;&nbsp;|&nbsp;&nbsp; 🌐</div></div>`;
        else if (simType === 'desktop_wifi_dino') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex; flex-direction:column; background:white;"><div class="sim-browser-top"><div class="sim-url-bar"><span style="color:#333; font-weight:bold;">www.google.it</span></div></div><div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;"><div style="font-size:3rem; margin-bottom:10px;">🦖</div><h3 style="margin-bottom:5px; color:#555;">Nessuna connessione a Internet</h3></div><div class="sim-taskbar" style="background:#111;"><div style="flex:1;"></div><div class="target-el" id="icon-wifi" style="color:white; font-size:1.2rem; cursor:pointer; padding:5px; background:rgba(255,255,255,0.1); border-radius:4px;">🌐✖️</div></div></div>`;
        else if (simType === 'health_sim_multi') return `<div class="sim-window" id="sim-interactive-area" style="background:white; height:100%; display:flex; flex-direction:column;"><div style="background:#0055aa; color:white; padding:10px; font-weight:bold; font-family:var(--font-heading);">✚ Fascicolo Sanitario</div><div style="padding:15px; overflow-y:auto;"><div style="border:1px solid #eee; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; background:#fafafa;"><div><strong style="color:#777;">Ricetta_vecchia.pdf</strong></div><button class="target-el" id="btn-wrong-1" style="background:#ccc; border:none; padding:6px 10px; border-radius:4px; font-weight:bold;">Scarica</button></div><div style="border:1px solid #eee; border-left:4px solid #28a745; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; background:#e9fce9;"><div><strong style="color:#333;">Analisi_Sangue.pdf</strong></div><button class="target-el" id="btn-dl-analisi" style="background:#28a745; color:white; border:none; padding:6px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">Scarica</button></div><div style="border:1px solid #eee; padding:10px; display:flex; justify-content:space-between; align-items:center; background:#fafafa;"><div><strong style="color:#777;">Visita_Oculistica.pdf</strong></div><button class="target-el" id="btn-wrong-2" style="background:#ccc; border:none; padding:6px 10px; border-radius:4px; font-weight:bold;">Scarica</button></div></div></div>`;
        else if (simType === 'email_zip') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:300px; background:white;"><div class="sim-header" style="background:#ea4335; color:white;">✉️ M-Mail</div><div style="padding:20px;"><h2 style="font-size:1.2rem; margin-bottom:10px;">Spese Aziendali</h2><p style="font-size:0.9rem; margin-bottom:15px;">Ciao, in allegato l'archivio con le spese. Estrai i file e calcola il totale. Buon lavoro!</p><div style="background:#f4f5f7; border:1px solid #ccc; padding:10px; border-radius:8px; display:inline-flex; align-items:center; gap:10px;"><span>🤐 <strong>Spese.zip</strong></span><button class="btn-primary target-el" id="btn-dl-zip" style="width:auto; padding:6px 12px; font-size:0.8rem;">Scarica</button></div></div></div>`;
        else if (simType === 'explorer_docs_extract') return `<div class="sim-window" id="sim-interactive-area"><div class="sim-header">📁 Esplora File</div><div class="explorer-chrome"><div class="explorer-path">💻 Questo PC › <strong id="path-text">Documenti</strong></div></div><div class="explorer-body"><div class="explorer-sidebar"><div class="sidebar-item">🖥️ Desktop</div><div class="sidebar-item target-el" id="side-docs" style="background:#E8F5E9; color:var(--clr-green-shadow)">📄 Documenti</div></div><div class="files-area"><div class="file-item target-el" id="file-spese-zip"><div class="file-icon">🤐</div><div class="file-name">Spese.zip</div></div></div></div></div>`;
        else if (simType === 'explorer_extracted') return `<div class="sim-window" id="sim-interactive-area"><div class="sim-header">📁 Esplora File</div><div class="explorer-chrome"><div class="explorer-path">💻 Questo PC › Documenti › <strong>Spese</strong></div></div><div class="explorer-body"><div class="explorer-sidebar"><div class="sidebar-item">🖥️ Desktop</div><div class="sidebar-item" style="background:#E8F5E9; color:var(--clr-green-shadow)">📄 Documenti</div></div><div class="files-area"><div class="file-item target-el" id="file-pdf-fattura"><div class="file-icon">📄</div><div class="file-name">Fattura.pdf</div></div><div class="file-item target-el" id="file-excel-bilancio"><div class="file-icon">📊</div><div class="file-name">Bilancio.xlsx</div></div></div></div></div>`;
        else if (simType === 'snap_pdf_excel') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; flex-direction:column; height:260px; background:#0d47a1; position:relative; overflow:hidden;"><div style="flex:1; position:relative; padding:10px; display:flex; flex-direction:column; justify-content:flex-end;"><div class="target-el" id="win-pdf" draggable="true" style="position:absolute; top:20px; left:40px; width:140px; height:100px; background:white; border:1px solid #ccc; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.3); cursor:grab; z-index:10;"><div style="background:#c0392b; color:white; padding:5px 8px; font-size:0.75rem; font-weight:bold;">📄 Fattura.pdf</div></div><div class="drop-zone" id="snap-left-zone" style="position:absolute; top:0; left:0; width:20px; height:100%; background:rgba(0,120,212,0.0); border-right:2px dashed rgba(255,255,255,0.4);"></div></div></div>`;
        else if (simType === 'pdf_excel_workspace') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; height:260px; background:#ccc;"><div style="flex:1; background:white; border-right:2px solid #666; display:flex; flex-direction:column;"><div style="background:#c0392b; color:white; padding:5px; font-size:0.7rem; font-weight:bold;">📄 Fattura.pdf</div><div style="padding:15px; font-size:0.8rem; font-family:monospace;">TOTALE DA PAGARE:<br><br><span class="target-el" id="pdf-amount" style="font-size:1.2rem; background:#fff0f0; padding:2px; font-weight:bold; cursor:text; user-select:text;">150,00</span> €</div></div><div style="flex:1; background:white; display:flex; flex-direction:column;"><div style="background:#217346; color:white; padding:5px; font-size:0.7rem; font-weight:bold; display:flex; justify-content:space-between;">📊 Bilancio.xlsx <button class="target-el" id="btn-autosum" style="background:white; color:#217346; border:none; padding:2px 5px; font-size:0.6rem; font-weight:bold; cursor:pointer;">Σ Somma</button></div><div style="padding:10px;"><div style="display:flex; border-bottom:1px solid #ccc; padding:4px; font-size:0.75rem;"><div style="flex:1;">Forniture</div><div style="flex:1; text-align:right;">300,00</div></div><div style="display:flex; border-bottom:1px solid #ccc; padding:4px; font-size:0.75rem; background:#e3f2fd;"><div style="flex:1;">Nuova Spesa</div><input type="text" id="sim-typing-field" autocomplete="off" style="width:60px; text-align:right; border:1px solid #0078d4; font-size:0.75rem;"></div><div style="display:flex; padding:4px; font-size:0.75rem; font-weight:bold;"><div style="flex:1;">TOTALE</div><div class="target-el" id="excel-total" style="flex:1; text-align:right; color:#777;">?</div></div></div></div></div>`;
        else if (simType === 'browser_bancadeiladri') return `<div class="sim-window" id="sim-interactive-area" style="display:flex;flex-direction:column;min-height:300px;"><div class="sim-tabs-bar"><div class="sim-tab" style="background:#fff; border-top:2px solid #e74c3c;"><span style="font-size:0.8rem;">🏦 Area Sicura</span><button class="sim-tab-x target-el" id="tab-close-x" title="Chiudi">✕</button></div></div><div class="sim-browser-top"><div class="sim-nav-btn">⬅</div><div class="sim-url-bar" style="border-color:#e74c3c; background:#fff5f5;"><span style="font-family:monospace; font-weight:bold; color:#c0392b;">www.bancadeiladri.it/login</span></div></div><div style="flex:1; padding:30px; text-align:center;"><h2 style="color:#333;">Accedi al tuo conto</h2><input type="text" placeholder="Utente" style="padding:8px; margin:10px;"><br><input type="password" placeholder="Password" style="padding:8px; margin:10px;"><br><button style="background:#0066cc; color:white; padding:10px 20px; border:none; border-radius:4px;">Entra</button></div></div>`;
        else if (simType === 'defender_desktop') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; display:flex; flex-direction:column;"><div class="sim-desktop" style="flex:1;"><div class="sim-icon target-el" id="icon-defender"><div class="sim-icon-emoji">🛡️</div><div class="sim-icon-label">Sicurezza</div></div></div></div>`;
        else if (simType === 'pagopa_multa') return `<div class="sim-window" id="sim-interactive-area" style="background:#525659; height:250px; display:flex; justify-content:center; padding:15px;"><div style="background:white; width:80%; padding:20px; font-family:sans-serif; text-align:center;"><h3 style="color:#0066CC; margin:0 0 10px 0;">pagoPA - Multa</h3><p style="font-size:0.8rem;">Importo: 50,00 €</p><div style="margin-top:15px; background:#f4f9ff; border:1px dashed #0066CC; padding:10px;"><div style="font-size:0.7rem; color:#555; font-weight:bold;">Codice Avviso (IUV)</div><div class="target-el" id="iuv-code" style="font-family:monospace; font-size:1.1rem; font-weight:bold; cursor:text; user-select:text;">098765432109876543</div></div></div></div>`;
        else if (simType === 'pagopa_form_tab') return `<div class="sim-window" id="sim-interactive-area" style="background:#f8f9fa; height:300px; padding:20px; overflow-y:auto;"><h3 style="color:#333; margin-top:0;">Portale Pagamenti</h3><div style="display:flex; flex-direction:column; gap:10px; margin-top:15px;"><input type="text" class="form-field-input" placeholder="Nome" style="padding:8px; border:1px solid #ccc;"><input type="text" class="form-field-input" placeholder="Cognome" style="padding:8px; border:1px solid #ccc;"><input type="text" class="form-field-input" placeholder="Email" style="padding:8px; border:1px solid #ccc;"><input type="text" class="form-field-input" id="sim-typing-field" placeholder="Incolla Codice IUV" style="padding:8px; border:2px solid #0066CC; font-family:monospace;"><button class="btn-primary target-el" id="btn-paga" style="padding:10px;">Paga Ora</button></div></div>`;
        else if (simType === 'download_ricevuta') return `<div class="sim-window" id="sim-interactive-area" style="background:white; height:250px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;"><div style="font-size:3rem; color:#28a745;">✅</div><h2 style="color:#333;">Pagamento Riuscito</h2><button class="btn-primary target-el" id="btn-dl-ricevuta" style="margin-top:20px; width:auto; padding:10px 20px;">Scarica Ricevuta</button></div>`;
        else if (simType === 'side_by_side_drive') return `<div class="sim-window" id="sim-interactive-area" style="display:flex; height:260px; background:#0d47a1; padding:5px; gap:5px;"><div style="flex:1; background:white; border-radius:4px; display:flex; flex-direction:column;"><div style="background:#f1f3f4; padding:5px; font-size:0.7rem; font-weight:bold; border-bottom:1px solid #ccc;">📁 Documenti</div><div style="flex:1; padding:10px;"><div class="target-el" id="file-ricevuta-drag" draggable="true" style="display:inline-flex; flex-direction:column; align-items:center; cursor:grab; padding:5px;"><div style="font-size:2rem;">🧾</div><div style="font-size:0.65rem; font-weight:bold;">Ricevuta.pdf</div></div></div></div><div style="flex:1; background:white; border-radius:4px; display:flex; flex-direction:column;"><div style="background:#e8f4ff; color:#1a73e8; padding:5px; font-size:0.7rem; font-weight:bold; border-bottom:1px solid #ccc;">☁️ Google Drive</div><div class="drop-zone target-el" id="drive-drop-zone" style="flex:1; margin:10px; border:2px dashed #1a73e8; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#1a73e8; font-size:0.8rem; font-weight:bold; text-align:center;">Trascina file<br>per il backup</div></div></div>`;
        else if (simType === 'desktop_multa_recycle') return `<div class="sim-window" id="sim-interactive-area" style="height:250px; background:linear-gradient(135deg, #0f5b9e, #368ee0); position:relative;"><div class="target-el" id="file-multa-desk" draggable="true" style="position:absolute; top:20px; left:20px; text-align:center; cursor:grab; width:60px;"><div style="font-size:2rem;">📄</div><div style="color:white; font-size:0.7rem; font-weight:bold;">Multa.pdf</div></div><div class="target-el drop-zone" id="icon-trash" style="position:absolute; bottom:20px; right:20px; text-align:center; width:60px; padding:10px; border-radius:8px;"><div style="font-size:2.5rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🗑️</div><div style="color:white; font-size:0.7rem; font-weight:bold;">Cestino</div></div></div>`;

        return '';
    }

    function buildSimClickNode(ex) {
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div></div>${generateSimulationHTML(ex.simType)}`;
        DOM.btnMain.style.display = 'none'; 
        const simArea = document.getElementById('sim-interactive-area') || document.querySelector('.sim-window');
        let clickCount = 0; let clickTimer;
        simArea.addEventListener('click', (e) => {
            if (session.isAnswered) return;
            const clickedEl = e.target.closest('.target-el');
            if (!clickedEl) { handleError(ex.tip); return; }
            if (ex.isDoubleClick) {
                clickCount++;
                if (clickCount === 1) {
                    clickedEl.classList.add('active');
                    clickTimer = setTimeout(() => { clickCount = 0; clickedEl.classList.remove('active'); handleError("Devi fare due clic VELOCI, riprova!"); }, 500);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    if (clickedEl.id === ex.targetId) handleSuccess("Perfetto! Hai eseguito un doppio clic corretto.");
                    else { handleError("Hai fatto doppio clic, ma sull'elemento sbagliato!"); clickCount = 0; }
                }
            } else {
                if (clickedEl.id === ex.targetId) { clickedEl.classList.add('active'); handleSuccess("Perfetto! Clic singolo eseguito."); }
                else { handleError("Hai cliccato l'elemento sbagliato!"); }
            }
        });
    }

    function buildSimTypeNode(ex) {
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div></div>${generateSimulationHTML(ex.simType)}`;
        DOM.btnMain.style.display = 'block'; DOM.btnMain.disabled = false; DOM.btnMain.innerText = 'Verifica';
        const simInput = document.getElementById('sim-typing-field');
        const checkLogic = () => {
            if (session.isAnswered) return;
            const typedValue = simInput ? simInput.value.trim().toLowerCase() : '';
            if (typedValue === ex.expectedText.trim().toLowerCase()) {
                if (simInput) simInput.style.borderColor = 'var(--clr-green)';
                if (typeof ex.onComplete === 'function') ex.onComplete();
                handleSuccess("Ottimo lavoro! Testo inserito correttamente.");
            } else { handleError("Il testo non corrisponde. Ricontrolla gli spazi e la punteggiatura."); }
        };
        DOM.btnMain.onclick = checkLogic;
        if (simInput) {
            simInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkLogic(); });
            setTimeout(() => simInput.focus(), 100);
        }
    }

    function buildSimDragNode(ex) {
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div></div>${generateSimulationHTML(ex.simType)}`;
        DOM.btnMain.style.display = 'none';
        const simArea = document.getElementById('sim-interactive-area'); let draggedEl = null;
        simArea.querySelectorAll('[draggable="true"]').forEach(d => {
            d.addEventListener('dragstart', () => { if (session.isAnswered) return; draggedEl = d; setTimeout(() => d.style.opacity = '0.5', 0); });
            d.addEventListener('dragend', () => { d.style.opacity = '1'; draggedEl = null; });
        });
        simArea.querySelectorAll('.drop-zone').forEach(dz => {
            dz.addEventListener('dragover', e => { e.preventDefault(); if (!session.isAnswered) dz.classList.add('active'); });
            dz.addEventListener('dragleave', () => dz.classList.remove('active'));
            dz.addEventListener('drop', e => {
                e.preventDefault(); dz.classList.remove('active');
                if (session.isAnswered || !draggedEl) return;
                if (draggedEl.id === ex.dragId && dz.id === ex.dropId) {
                    if (typeof ex.onComplete === 'function') ex.onComplete();
                    if (!ex.preventAppend) dz.appendChild(draggedEl);
                    handleSuccess("Perfetto! Hai spostato il file correttamente.");
                } else { handleError("Hai spostato l'elemento sbagliato o nel posto sbagliato."); }
            });
        });
    }

    function buildSimStepsNode(ex) {
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div></div>${generateSimulationHTML(ex.simType)}`;
        DOM.btnMain.style.display = 'none';
        const simArea = document.getElementById('sim-interactive-area');
        simArea.addEventListener('contextmenu', (e) => {
            e.preventDefault(); if (session.isAnswered) return;
            const targetEl = e.target.closest('.target-el');
            if (targetEl && targetEl.id === ex.targetId) {
                document.querySelectorAll('.ctx-menu').forEach(m => m.remove());
                const menu = document.createElement('div'); menu.className = 'ctx-menu';
                // Posiziona rispetto alla viewport su document.body per evitare
                // il clipping di sim-window (overflow:hidden)
                menu.style.position = 'fixed';
                menu.style.left = e.clientX + 'px';
                menu.style.top  = e.clientY + 'px';
                menu.style.zIndex = '9999';
                ex.menuOptions.forEach(opt => {
                    const item = document.createElement('div'); item.className = 'ctx-item'; item.innerHTML = opt.label;
                    item.onclick = (clickEvent) => {
                        clickEvent.stopPropagation(); menu.remove();
                        if (opt.isCorrect) handleSuccess("Esatto! Hai selezionato l'azione giusta.");
                        else handleError("Hai cliccato l'opzione sbagliata nel menu.");
                    };
                    menu.appendChild(item);
                });
                document.body.appendChild(menu);
                // Flip: se il menu esce dal bordo inferiore/destro dello schermo, aprilo verso l'alto/sinistra
                requestAnimationFrame(() => {
                    const mh = menu.offsetHeight, mw = menu.offsetWidth;
                    if (e.clientY + mh > window.innerHeight) menu.style.top  = Math.max(0, e.clientY - mh) + 'px';
                    if (e.clientX + mw > window.innerWidth)  menu.style.left = Math.max(0, e.clientX - mw) + 'px';
                });
            } else { handleError("Devi fare clic col tasto DESTRO sull'elemento corretto!"); }
        });
        document.addEventListener('click', () => document.querySelectorAll('.ctx-menu').forEach(m => m.remove()), { once: true });
    }

    function evaluateAnswer(isCorrect, explanation, btnNodes, correctIdx) {
        session.isAnswered = true; DOM.btnMain.disabled = true;
        btnNodes.forEach(b => b.classList.add('locked'));
        if (isCorrect) {
            if(correctIdx !== undefined) btnNodes[correctIdx].classList.add('correct');
            handleSuccess(explanation || "Esatto!");
        } else {
            btnNodes.forEach((b, i) => { if (b.classList.contains('selected')) b.classList.add('wrong'); });
            handleError("Risposta errata! Riprova per scoprire la soluzione.");
        }
    }

    function handleSuccess(msg) {
        session.isAnswered = true; setMascot('felice'); SFX.correct.currentTime = 0; SFX.correct.play().catch(()=>{}); showFeedback(true, "Corretto!", msg);
        DOM.drwBtn.onclick = () => { session.exIdx++; loadCurrentExercise(); };
    }

    function handleError(msg) {
        session.errors++; session.lives--; updateLivesUI(); SFX.wrong.currentTime = 0; SFX.wrong.play().catch(()=>{});
        if (session.lives <= 0) triggerGameOver();
        else {
            setMascot('arrabbiato'); showFeedback(false, "Attenzione!", msg);
            DOM.drwBtn.onclick = () => {
                hideFeedback(); session.isAnswered = false; DOM.btnMain.disabled = true;
                DOM.exArea.querySelectorAll('.option-btn').forEach(b => b.classList.remove('locked', 'selected', 'wrong'));
            };
        }
    }

    function showFeedback(isSuccess, title, msg) {
        DOM.drawer.className = `bottom-drawer show ${isSuccess ? 'success' : 'error'}`;
        DOM.drwIcon.innerText = isSuccess ? '✔' : '✖';
        DOM.drwTitle.innerText = title; DOM.drwMsg.innerText = msg;
    }
    function hideFeedback() { DOM.drawer.classList.remove('show', 'success', 'error'); }

    function launchConfetti() {
        const colors = ['#58CC02', '#FF9600', '#1CB0F6', '#CE82FF', '#FFC800', '#FF4B4B'];
        for(let i=0; i<70; i++) {
            setTimeout(() => {
                const el = document.createElement('div'); el.className = 'confetti';
                el.style.left = (Math.random() * 100) + 'vw';
                el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                el.style.width = el.style.height = (Math.random() * 8 + 6) + 'px';
                el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
                el.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 4000);
            }, i * 40);
        }
    }

    
    function playVictorySound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            const playTone = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                // 'square' produce un suono a 8-bit stile Gameboy
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, startTime);
                
                // Volume e sfumatura
                gain.gain.setValueAtTime(0.05, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            
            // Suona 4 note: Do - Mi - Sol - Do alto
            const now = ctx.currentTime;
            playTone(523.25, now, 0.15);
            playTone(659.25, now + 0.15, 0.15);
            playTone(783.99, now + 0.30, 0.15);
            playTone(1046.50, now + 0.45, 0.40);
        } catch(e) { console.log("Audio non supportato", e); }
    }

    function triggerVictory(mis) {
        const stars = session.errors === 0 ? 3 : (session.errors <= 2 ? 2 : 1);
        state.xp += mis.xpReward;
        if (!state.completedMissions[mis.id] || state.completedMissions[mis.id].stars < stars) state.completedMissions[mis.id] = { stars: stars };
        saveState();
        document.getElementById('victory-mission-name').innerText = mis.title;
        document.getElementById('victory-xp').innerText = `+${mis.xpReward}`;
        document.getElementById('victory-errors').innerText = session.errors;
        document.getElementById('victory-stars').innerText = '⭐'.repeat(stars) + '🤍'.repeat(3-stars);
        
        
        playVictorySound();
        launchConfetti();
        
        // --- Regia Moneta Volante ---
        window.holdCoinUpdate = true; // Congela il counter in alto
        setTimeout(() => {
            // Crea la moneta fantasma
            const coin = document.createElement('div');
            coin.innerText = '🪙';
            coin.className = 'flying-coin';
            document.body.appendChild(coin);
            
            // Quando il volo finisce (dopo 1 secondo)
            setTimeout(() => {
                coin.remove();
                window.holdCoinUpdate = false;
                updateTopBar(); // Scatta il nuovo numero
                
                // Innesca il rimbalzo visivo
                DOM.streak.classList.remove('bump-anim');
                void DOM.streak.offsetWidth; // Forza il reflow del browser
                DOM.streak.classList.add('bump-anim');
            }, 1000);
        }, 500); // Parte 0.5s dopo i coriandoli
        // -----------------------------
        navigateTo('view-victory');
    }

    function triggerGameOver() {
        hideFeedback(); DOM.overlayGO.classList.remove('hidden'); SFX.gameover.play().catch(()=>{});
        state.penaltyUnlockTime = Date.now() + 60000; saveState(); startPenaltyTimer();
    }

    function checkPenaltyState() {
        if (state.penaltyUnlockTime > Date.now()) { DOM.overlayGO.classList.remove('hidden'); startPenaltyTimer(); }
        else { DOM.overlayGO.classList.add('hidden'); renderHome(); }
    }

    function startPenaltyTimer() {
        clearInterval(penaltyInterval);
        penaltyInterval = setInterval(() => {
            const remaining = Math.ceil((state.penaltyUnlockTime - Date.now()) / 1000);
            if (remaining <= 0) { clearInterval(penaltyInterval); state.penaltyUnlockTime = 0; saveState(); DOM.overlayGO.classList.add('hidden'); renderHome(); }
            else { DOM.timerGO.innerText = remaining; }
        }, 1000);
    }

    function bindGlobalEvents() {
        document.getElementById('btn-back-home').addEventListener('click', renderHome);
        document.getElementById('btn-victory-continue').addEventListener('click', renderHome);
        document.getElementById('btn-quit-exercise').addEventListener('click', () => { if(confirm("Vuoi uscire? I progressi di questa lezione andranno persi.")) renderHome(); });
    }

    // ============================================================
    //  sim_keyboard — digitazione con feedback carattere per carattere
    // ============================================================
    function buildSimKeyboardNode(ex) {
        DOM.btnMain.style.display = 'block';
        DOM.btnMain.innerText = 'Verifica';
        DOM.btnMain.disabled = true;
        const target = ex.expectedText || '';
        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="ex-text">${ex.instruction}</div>
                ${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}
            </div>
            <div class="kb-challenge">
                <div class="kb-label">Testo da scrivere:</div>
                <div class="kb-target">${escapeHtml(target)}</div>
                <div class="kb-preview" id="kb-preview">
                    ${target.split('').map(c => `<span class="kb-char kb-pending">${escapeHtml(c)}</span>`).join('')}
                </div>
                <input type="text" class="kb-input" id="kb-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Scrivi qui...">
            </div>`;
        const input  = document.getElementById('kb-input');
        const preview = document.getElementById('kb-preview');
        input.addEventListener('input', () => {
            const typed = input.value;
            const spans = preview.querySelectorAll('.kb-char');
            spans.forEach((span, i) => {
                span.className = 'kb-char';
                if (i < typed.length) {
                    span.classList.add(typed[i].toLowerCase() === target[i].toLowerCase() ? 'kb-ok' : 'kb-err');
                } else {
                    span.classList.add('kb-pending');
                }
            });
            DOM.btnMain.disabled = typed.trim().length === 0;
        });
        const verify = () => {
            if (session.isAnswered) return;
            if (input.value.trim().toLowerCase() === target.trim().toLowerCase()) {
                handleSuccess(ex.successMsg || 'Perfetto! Testo scritto correttamente.');
            } else {
                handleError('Il testo non corrisponde esattamente. Controlla spazi, punti e simboli speciali.');
            }
        };
        DOM.btnMain.onclick = verify;
        input.addEventListener('keydown', e => { if (e.key === 'Enter') verify(); });
        setTimeout(() => input.focus(), 150);
    }

    // ============================================================
    //  sim_shortcut — riconosci e premi la scorciatoia corretta
    // ============================================================
    function buildSimShortcutNode(ex) {
        DOM.btnMain.style.display = 'none';
        // ex.keys: array di e.key lowercase  es. ['control','z']
        // ex.displayKeys: array di etichette  es. ['Ctrl','Z']
        const required = ex.keys.map(k => k.toLowerCase());
        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="ex-text">${ex.instruction}</div>
            </div>
            <div class="sc-challenge">
                <div class="sc-keys">
                    ${ex.displayKeys.map((k,i) =>
                        `<div class="key-cap" id="keycap-${i}">${escapeHtml(k)}</div>${i < ex.displayKeys.length-1 ? '<span class="key-plus">+</span>' : ''}`
                    ).join('')}
                </div>
                <div class="sc-hint" id="sc-hint">⌨️ Premi i tasti sulla tastiera reale!</div>
                <div class="sc-feedback" id="sc-feedback"></div>
            </div>`;
        const hintEl     = document.getElementById('sc-hint');
        const feedbackEl = document.getElementById('sc-feedback');
        const pressed    = new Set();
        const onKeyDown = e => {
            if (session.isAnswered) return;
            // Prevent default for safe combinations
            if (['s','z','a','p','n','f','c','v','x'].includes(e.key.toLowerCase()) && (e.ctrlKey || e.metaKey)) e.preventDefault();
            pressed.add(e.key.toLowerCase());
            // Highlight matching keycaps
            ex.keys.forEach((k, i) => {
                const cap = document.getElementById(`keycap-${i}`);
                if (cap) cap.classList.toggle('active', pressed.has(k.toLowerCase()));
            });
            feedbackEl.textContent = [...pressed].filter(k => k !== 'dead').map(k => k.length === 1 ? k.toUpperCase() : k).join(' + ');
            const allOk = required.every(k => pressed.has(k));
            if (allOk) {
                cleanupKeyHandlers();
                handleSuccess(ex.successMsg || 'Scorciatoia eseguita! Hai trovato un comando segreto del PC.');
            }
        };
        const onKeyUp = e => {
            pressed.delete(e.key.toLowerCase());
            ex.keys.forEach((k, i) => {
                const cap = document.getElementById(`keycap-${i}`);
                if (cap) cap.classList.remove('active');
            });
            if (pressed.size === 0) feedbackEl.textContent = '';
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup',   onKeyUp);
        activeKeyHandlers.push(onKeyDown);
        // keyup non va in activeKeyHandlers ma lo rimuoviamo manualmente quando avanza
        DOM.drwBtn.addEventListener('click', () => document.removeEventListener('keyup', onKeyUp), { once: true });
    }

    // ============================================================
    //  sim_game — mini-gioco riflessi: clicca i bersagli
    // ============================================================
    function buildSimGameNode(ex) {
        DOM.btnMain.style.display = 'none';
        const needed   = ex.neededHits || 8;
        const duration = ex.duration   || 30;
        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="ex-text">${ex.instruction}</div>
            </div>
            <div class="game-wrap">
                <div class="game-hud">
                    <div class="game-stat">⏱️ <span id="g-timer">${duration}</span>s</div>
                    <div class="game-stat">🎯 <span id="g-score">0</span> / ${needed}</div>
                </div>
                <div class="game-field" id="game-field">
                    <div class="game-start-screen" id="game-start">
                        <div style="font-size:3rem">🎯</div>
                        <p style="font-weight:900;color:var(--clr-blue);margin:10px 0 5px;">Clicca i cerchi colorati!</p>
                        <p style="font-size:0.85rem;color:var(--clr-text-muted);">Spariscono in 1.8 secondi — sii veloce!</p>
                        <button class="btn-primary" id="btn-game-start" style="width:auto;padding:0 30px;margin-top:15px;">▶ Inizia!</button>
                    </div>
                </div>
            </div>`;
        document.getElementById('btn-game-start').onclick = () => runGame(needed, duration, ex.opts || {});
    }

    function runGame(needed, duration, opts = {}) {
        const field   = document.getElementById('game-field');
        const timerEl = document.getElementById('g-timer');
        const scoreEl = document.getElementById('g-score');
        document.getElementById('game-start').remove();
        let score = 0, timeLeft = duration, active = true;
        const colors  = ['#FF4B4B','#58CC02','#1CB0F6','#FF9600','#CE82FF','#FFC800','#FF6B9D'];
        const emojis  = ['⭐','🎯','💎','🌟','❤️','🍀','🎪','🔥'];
        const clockInterval = setInterval(() => {
            if (!active) return;
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) { active = false; clearInterval(clockInterval); clearInterval(spawnInterval); endGame(score >= needed); }
        }, 1000);
        const spawnOne = () => {
            if (!active) return;
            const size = 52 + Math.random() * 24;
            const maxX = Math.max(0, field.offsetWidth  - size - 8);
            const maxY = Math.max(0, field.offsetHeight - size - 8);
            const el = document.createElement('div');
            el.className = 'game-target';
            el.style.cssText = `left:${Math.random()*maxX}px;top:${Math.random()*maxY}px;width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};font-size:${size*.44}px;`;
            el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
            el.clicksNeeded = 1;
            
            // Logica per le opzioni avanzate
            if (opts.armored && (!opts.mix || Math.random() > 0.5)) {
                el.classList.add('armored');
                el.clicksNeeded = 2;
                el.textContent = '🔒';
            }
            if (opts.moving && (!opts.mix || Math.random() > 0.4)) {
                el.classList.add('moving');
                if (opts.speed) {
                    const animDur = Math.max(0.5, 2.5 - (opts.speed * 0.4));
                    el.style.animationDuration = animDur + 's';
                }
            }

            field.appendChild(el);
            requestAnimationFrame(() => el.classList.add('visible'));
            const autoRemove = setTimeout(() => { el.classList.remove('visible'); setTimeout(() => el.remove(), 250); }, 1800 + (el.clicksNeeded === 2 ? 600 : 0));
            el.onclick = () => {
                if (!active) return;
                if (el.clicksNeeded > 1) {
                    el.clicksNeeded--;
                    el.style.transform = 'scale(0.8)';
                    el.style.filter = 'brightness(2)';
                    setTimeout(() => { el.style.transform = 'scale(1)'; el.style.filter = ''; }, 100);
                    return;
                }
                clearTimeout(autoRemove);
                el.classList.add('hit');
                SFX.correct.currentTime = 0; SFX.correct.play().catch(()=>{});
                score++; scoreEl.textContent = score;
                setTimeout(() => el.remove(), 280);
                if (score >= needed) { active = false; clearInterval(clockInterval); clearInterval(spawnInterval); setTimeout(() => endGame(true), 400); }
            };
        };
        const spawnInterval = setInterval(spawnOne, 750);
        spawnOne();
    }

    function endGame(won) {
        document.querySelectorAll('.game-target').forEach(t => t.remove());
        if (won) handleSuccess('Riflessi eccellenti! Il tuo occhio e la tua mano si stanno allenando alla grande! 🏆');
        else      handleError('Tempo scaduto! Non arrenderti — riprova e vedrai che migliori ogni volta.');
    }

    // ============================================================
    //  sim_popup — individua e chiudi il popup nel modo corretto
    // ============================================================
    function buildSimPopupNode(ex) {
        DOM.btnMain.style.display = 'none';
        const fakeButtons = ex.fakeButtons || ['OK, Chiudi', 'Rimuovi Virus'];
        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="ex-text">${ex.instruction}</div>
                ${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}
            </div>
            <div class="sim-window" style="position:relative;overflow:hidden;min-height:260px;background:#fff;">
                <div class="sim-browser-top">
                    <div class="sim-nav-btn">⬅</div><div class="sim-nav-btn">➡</div>
                    <div class="sim-url-bar"><span id="browser-lock" class="target-el" style="cursor:pointer;">🔒</span><span style="font-size:.85rem;color:#333;font-weight:700;">${ex.url||'www.notizie.it'}</span></div>
                </div>
                <div style="padding:18px;">
                    <h3 style="font-family:var(--font-heading);margin-bottom:6px;">${ex.pageTitle||'Ultime Notizie'}</h3>
                    <p style="font-size:.88rem;font-weight:700;color:#666;line-height:1.5;">${ex.pageContent||'Leggi le ultime notizie...'}</p>
                </div>
                <!-- IL POPUP TRAPPOLA -->
                <div class="popup-overlay" id="sim-popup-overlay">
                    <div class="popup-box" id="sim-popup-box">
                        <button class="popup-real-x target-el" id="popup-real-x" title="Questa è la X giusta">✕</button>
                        <div class="popup-icon">${ex.popupIcon||'⚠️'}</div>
                        <div class="popup-title">${ex.popupTitle||'ATTENZIONE!'}</div>
                        <div class="popup-msg">${ex.popupMsg||'Il tuo PC ha rilevato un problema!'}</div>
                        <div class="popup-btns">
                            ${fakeButtons.map((b,i)=>`<button class="popup-fake-btn target-el" id="popup-fake-${i}">${escapeHtml(b)}</button>`).join('')}
                        </div>
                        <div class="popup-trap-link target-el" id="popup-trap-link">× Chiudi questo avviso</div>
                    </div>
                </div>
            </div>`;
        // La X vera — piccola, in cima a destra del box
        document.getElementById('popup-real-x').onclick = () => {
            if (session.isAnswered) return;
            document.getElementById('sim-popup-overlay').style.display = 'none';
            handleSuccess(ex.successMsg || 'Bravissimo! Hai chiuso il popup dalla X corretta, senza toccare i pulsanti trappola.');
        };
        // Tutti i pulsanti falsi
        fakeButtons.forEach((_,i) => {
            const el = document.getElementById(`popup-fake-${i}`);
            if (el) el.onclick = () => {
                if (session.isAnswered) return;
                handleError(ex.errorMsg || 'Trappola! Quel pulsante potrebbe installare qualcosa di pericoloso. La X piccola in alto a destra del popup è l\'unico pulsante sicuro.');
            };
        });
        const trapLink = document.getElementById('popup-trap-link');
        if (trapLink) trapLink.onclick = () => {
            if (session.isAnswered) return;
            handleError(ex.errorMsg || 'Anche questo link è una trappola! Usa sempre la piccola ✕ nell\'angolo in alto a destra del riquadro popup.');
        };
    }

    // ============================================================
    //  sim_multistep — scenario completo multi-tipo e multi-sim
    // ============================================================
    function buildSimMultistepNode(ex) {
        DOM.btnMain.style.display = 'none';
        let currentStep = 0;
        const steps = ex.steps;
        let lastSimType = null;

        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="multistep-badge" id="multi-badge"></div>
                <div class="ex-text" id="multi-text"></div>
            </div>
            <div id="multi-sim-container"></div>`;

        function renderStep(idx) {
            if (idx >= steps.length) { handleSuccess(ex.successMsg || 'Scenario completato!'); return; }
            const step = steps[idx];
            cleanupKeyHandlers();
            DOM.btnMain.style.display = 'none';
            DOM.btnMain.disabled = true;
            DOM.exProgress.style.width = `${(idx / steps.length) * 100}%`;
            
            document.getElementById('multi-badge').innerText = `Passo ${idx+1} di ${steps.length}`;
            document.getElementById('multi-text').innerHTML = step.instruction;

            if (step.simType !== lastSimType) {
                document.getElementById('multi-sim-container').innerHTML = generateSimulationHTML(step.simType);
                lastSimType = step.simType;
            }

            const simArea = document.getElementById('sim-interactive-area') || document.querySelector('.sim-window');
            const advance = () => {
                if (typeof step.onComplete === 'function') step.onComplete();
                setMascot('felice');
                SFX.correct.currentTime = 0; SFX.correct.play().catch(()=>{});
                setTimeout(() => { setMascot('base'); renderStep(idx + 1); }, 600);
            };

            if (step.type === 'click') {
                let cc = 0, ct;
                simArea.addEventListener('click', function h(e) {
                    const el = e.target.closest('.target-el');
                    if (!el) return;
                    if (step.isDoubleClick) {
                        cc++;
                        if (cc === 1) { ct = setTimeout(() => { cc = 0; handleError('Doppio clic: premi due volte velocemente!'); }, 500); }
                        else if (cc >= 2) { clearTimeout(ct); cc = 0; if (el.id === step.targetId) { simArea.removeEventListener('click', h); advance(); } else handleError('Elemento sbagliato!'); }
                    } else {
                        if (el.id === step.targetId) { simArea.removeEventListener('click', h); advance(); }
                        else handleError('Elemento sbagliato! Rileggi le istruzioni.');
                    }
                });
            } else if (step.type === 'type') {
                DOM.btnMain.style.display = 'block';
                DOM.btnMain.disabled = false;
                DOM.btnMain.innerText = 'Verifica';
                const inp = simArea.querySelector('input[type="text"]');
                const check = () => {
                    if (!inp) return;
                    if (inp.value.trim().toLowerCase() === step.expectedText.trim().toLowerCase()) {
                        DOM.btnMain.style.display = 'none';
                        advance();
                    } else { handleError('Testo non corretto, riprova.'); }
                };
                DOM.btnMain.onclick = check;
                if (inp) { inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }); setTimeout(() => inp.focus(), 100); }
            } else if (step.type === 'drag') {
                // Drag step: listen for dragend on draggableId over dropZoneId
                const dragEl   = document.getElementById(step.draggableId);
                const dropEl   = document.getElementById(step.dropZoneId);
                if (dragEl && dropEl) {
                    dragEl.addEventListener('dragstart', () => { dragEl.style.opacity = '0.5'; });
                    dragEl.addEventListener('dragend', () => { dragEl.style.opacity = '1'; });
                    dropEl.addEventListener('dragover', e => { e.preventDefault(); dropEl.style.background = 'rgba(0,120,212,0.3)'; });
                    dropEl.addEventListener('dragleave', () => { dropEl.style.background = ''; });
                    dropEl.addEventListener('drop', e => { e.preventDefault(); dropEl.style.background = ''; advance(); });
                } else {
                    // Fallback: auto-advance after 500ms if elements not found
                    setTimeout(advance, 800);
                }
            } else if (step.type === 'shortcut') {
                DOM.btnMain.style.display = 'none';
                const required = step.keys.map(k => k.toLowerCase());
                const pressed = new Set();
                const onKeyDown = e => {
                    if (session.isAnswered) return;
                    if (['c','v','a','z','s','p'].includes(e.key.toLowerCase()) && (e.ctrlKey || e.metaKey)) e.preventDefault();
                    pressed.add(e.key.toLowerCase());
                    if (required.every(k => pressed.has(k))) {
                        document.removeEventListener('keydown', onKeyDown);
                        document.removeEventListener('keyup', onKeyUp);
                        advance();
                    }
                };
                const onKeyUp = e => pressed.delete(e.key.toLowerCase());
                document.addEventListener('keydown', onKeyDown);
                document.addEventListener('keyup', onKeyUp);
                activeKeyHandlers.push(onKeyDown);
            } else if (step.type === 'steps') {
                const h = (e) => {
                    e.preventDefault();
                    if (session.isAnswered) return;
                    
                    const el = e.target.closest('.target-el');
                    if (el && el.id === step.targetId) {
                        document.querySelectorAll('.ctx-menu').forEach(m => m.remove());
                        const menu = document.createElement('div'); menu.className = 'ctx-menu';
                        menu.style.position = 'fixed';
                        menu.style.left = e.clientX + 'px';
                        menu.style.top  = e.clientY + 'px';
                        menu.style.zIndex = '9999';
                        
                        step.menuOptions.forEach(opt => {
                            const item = document.createElement('div'); item.className = 'ctx-item'; item.innerHTML = opt.label;
                            item.onclick = (clickEvent) => {
                                clickEvent.stopPropagation(); 
                                menu.remove();
                                if (opt.isCorrect) {
                                    simArea.removeEventListener('contextmenu', h);
                                    advance();
                                } else {
                                    handleError("Hai cliccato l'opzione sbagliata nel menu.");
                                }
                            };
                            menu.appendChild(item);
                        });
                        
                        document.body.appendChild(menu);
                        
                        // Posizionamento intelligente
                        requestAnimationFrame(() => {
                            const mh = menu.offsetHeight, mw = menu.offsetWidth;
                            if (e.clientY + mh > window.innerHeight) menu.style.top  = Math.max(0, e.clientY - mh) + 'px';
                            if (e.clientX + mw > window.innerWidth)  menu.style.left = Math.max(0, e.clientX - mw) + 'px';
                        });
                        
                        // CHIUSURA SICURA: ritardo di 50ms per bypassare i "click fantasma" dell'hardware
                        setTimeout(() => {
                            const closeHandler = () => {
                                document.querySelectorAll('.ctx-menu').forEach(m => m.remove());
                                document.removeEventListener('click', closeHandler);
                            };
                            document.addEventListener('click', closeHandler);
                        }, 50);

                    } else {
                        handleError("Devi fare clic col tasto DESTRO sull'elemento corretto!");
                    }
                };
                simArea.addEventListener('contextmenu', h);
            }

            if (typeof step.onSetup === 'function') step.onSetup();
        }
        renderStep(0);
    }


    function buildSimTabFormNode(ex) {
        DOM.btnMain.style.display = 'block';
        DOM.btnMain.innerText = 'Verifica';
        DOM.btnMain.disabled = true;
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div>${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}</div>${generateSimulationHTML(ex.simType || 'form_registration')}`;
        const fields = DOM.exArea.querySelectorAll('.form-field-input');
        fields.forEach((field, i) => {
            field.addEventListener('focus', () => { field.style.borderColor = '#0078d4'; field.style.boxShadow = '0 0 0 3px rgba(0,120,212,0.15)'; });
            field.addEventListener('blur',  () => { field.style.borderColor = field.value ? '#28a745' : '#ddd'; field.style.boxShadow = 'none'; });
            field.addEventListener('keydown', e => {
                if (e.key === 'Tab') { e.preventDefault(); const next = fields[i + 1]; if (next) next.focus(); else verifyForm(); }
                else if (e.key === 'Enter') { e.preventDefault(); verifyForm(); }
            });
            field.addEventListener('input', () => { DOM.btnMain.disabled = ![...fields].every(f => f.value.trim().length > 0); });
        });
        const verifyForm = () => {
            if (session.isAnswered) return;
            if ([...fields].every(f => f.value.trim().length > 0)) handleSuccess(ex.successMsg || 'Modulo compilato correttamente!');
            else handleError("Devi compilare tutti i campi. Usa TAB per passare da un campo all'altro.");
        };
        DOM.btnMain.onclick = verifyForm;
        if (fields.length > 0) setTimeout(() => fields[0].focus(), 150);
    }

    function buildSimDeleteFixNode(ex) {
        DOM.btnMain.style.display = 'block';
        DOM.btnMain.innerText = 'Verifica';
        DOM.btnMain.disabled = false;
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div>${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}</div>${generateSimulationHTML(ex.simType || 'text_editor_fix')}`;
        const input = DOM.exArea.querySelector('#text-fix-input');
        if (input) {
            input.value = ex.startText || '';
            const cp = ex.cursorPos !== undefined ? ex.cursorPos : (ex.startText || '').length;
            setTimeout(() => { input.focus(); input.setSelectionRange(cp, cp); }, 150);
        }
        const verify = () => {
            if (session.isAnswered) return;
            if (input && input.value === ex.expectedText) handleSuccess(ex.successMsg || 'Testo corretto perfettamente!');
            else handleError(`Non ancora giusto. Il risultato deve essere: "${ex.expectedText}". Usa ← → per posizionarti, poi CANC per cancellare a destra.`);
        };
        DOM.btnMain.onclick = verify;
        if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') verify(); });
    }

    function buildSimSelectOverwriteNode(ex) {
        DOM.btnMain.style.display = 'block';
        DOM.btnMain.innerText = 'Verifica';
        DOM.btnMain.disabled = false;
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div>${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}</div>${generateSimulationHTML(ex.simType || 'email_overwrite')}`;
        const textarea = DOM.exArea.querySelector('#email-overwrite-input');
        if (textarea) {
            textarea.addEventListener('keydown', e => {
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                    setTimeout(() => { if (textarea.selectionStart === 0 && textarea.selectionEnd === textarea.value.length) { textarea.style.background = '#dbeafe'; textarea.style.borderColor = '#2563eb'; } }, 30);
                }
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); verify(); }
            });
            textarea.addEventListener('input', () => { textarea.style.background = '#fff'; textarea.style.borderColor = '#ddd'; DOM.btnMain.disabled = textarea.value.trim().length === 0; });
            setTimeout(() => textarea.focus(), 150);
        }
        const verify = () => {
            if (session.isAnswered) return;
            if (textarea && textarea.value.trim().toLowerCase() === (ex.expectedText || '').trim().toLowerCase()) handleSuccess(ex.successMsg || 'Perfetto! Ctrl+A poi digita.');
            else handleError(`Testo non corretto. Premi Ctrl+A per selezionare tutto, poi scrivi "${ex.expectedText}".`);
        };
        DOM.btnMain.onclick = verify;
    }


    // ============================================================
    //  sim_search_click — digita nella ricerca Start, clicca risultato
    // ============================================================
    function buildSimSearchClickNode(ex) {
        DOM.btnMain.style.display = 'none';
        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="ex-text">${ex.instruction}</div>
                ${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}
            </div>
            ${generateSimulationHTML(ex.simType || 'win_start_search')}`;
        const searchInput = DOM.exArea.querySelector('#start-search-input');
        const resultsEl   = DOM.exArea.querySelector('#start-results');
        const searchText  = (ex.searchText || 'calc').toLowerCase();
        let resultShown = false;
        if (searchInput && resultsEl) {
            setTimeout(() => searchInput.focus(), 150);
            searchInput.addEventListener('input', () => {
                const val = searchInput.value.toLowerCase();
                if (!resultShown && val.includes(searchText)) {
                    resultShown = true;
                    resultsEl.innerHTML = `
                        <div class="target-el" id="search-result-app"
                             style="display:flex; align-items:center; gap:10px; padding:8px 6px;
                                    border-radius:6px; cursor:pointer; transition:background 0.15s;"
                             onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                             onmouseout="this.style.background='transparent'">
                            <span style="font-size:1.4rem;">${ex.resultIcon || '🖩'}</span>
                            <div>
                                <div style="font-weight:bold; font-size:0.9rem;">${ex.resultLabel || 'Calcolatrice'}</div>
                                <div style="font-size:0.75rem; color:#aaa;">App</div>
                            </div>
                        </div>`;
                    const resultEl = DOM.exArea.querySelector('#search-result-app');
                    if (resultEl) {
                        resultEl.addEventListener('click', () => {
                            if (session.isAnswered) return;
                            handleSuccess(ex.successMsg || 'Applicazione trovata e aperta dalla ricerca!');
                        });
                    }
                } else if (val.length === 0) {
                    resultsEl.innerHTML = '';
                    resultShown = false;
                }
            });
            searchInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && resultShown && !session.isAnswered)
                    handleSuccess(ex.successMsg || 'Applicazione trovata e aperta dalla ricerca!');
            });
        }
    }

    // ============================================================
    //  sim_pinning — clic destro icona → aggiungi → click taskbar
    // ============================================================
    function buildSimPinningNode(ex) {
        DOM.btnMain.style.display = 'none';
        DOM.exArea.innerHTML = `
            <div class="ex-bubble">
                <div class="ex-text">${ex.instruction}</div>
                ${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}
            </div>
            ${generateSimulationHTML(ex.simType || 'taskbar_pinning')}`;
        const taskbar = DOM.exArea.querySelector('#sim-taskbar-bar');
        let phase = 'rightclick';

        // Intercept contextmenu anywhere in the exercise area
        DOM.exArea.addEventListener('contextmenu', e => {
            e.preventDefault();
            if (session.isAnswered || phase !== 'rightclick') return;
            const tgt = e.target.closest('#icon-browser-desktop');
            if (!tgt) { handleError('Clic destro sull\'icona 🌐 Internet sul Desktop.'); return; }

            document.querySelectorAll('.ctx-menu').forEach(m => m.remove());
            const menu = document.createElement('div');
            menu.className = 'ctx-menu';
            menu.style.cssText = 'position:fixed; z-index:9999;';
            menu.style.left = e.clientX + 'px';
            menu.style.top  = e.clientY + 'px';

            [
                { label: '📌 Aggiungi alla barra delle applicazioni', correct: true },
                { label: '🔗 Crea collegamento', correct: false },
                { label: '🗑️ Elimina', correct: false }
            ].forEach(opt => {
                const item = document.createElement('div');
                item.className = 'ctx-item';
                item.innerHTML = opt.label;
                item.onclick = ev => {
                    ev.stopPropagation();
                    menu.remove();
                    if (opt.correct) {
                        phase = 'pinned';
                        if (taskbar) {
                            const pinned = document.createElement('div');
                            pinned.id = 'taskbar-pinned-browser';
                            pinned.className = 'target-el';
                            pinned.style.cssText = 'font-size:1.2rem; padding:4px 8px; cursor:pointer; background:rgba(255,255,255,0.1); border-radius:4px; border:1px solid rgba(255,255,255,0.2);';
                            pinned.textContent = '🌐';
                            const clock = taskbar.querySelector('[style*="12:00"]');
                            taskbar.insertBefore(pinned, clock || null);
                        }
                        // Update instruction
                        const txt = DOM.exArea.querySelector('.ex-text');
                        if (txt) txt.innerHTML = ex.instructionStep2 || 'Icona fissata! Ora clicca 🌐 nella Taskbar in basso.';
                    } else {
                        handleError('Scelta sbagliata. Scegli "Aggiungi alla barra delle applicazioni".');
                    }
                };
                menu.appendChild(item);
            });
            document.body.appendChild(menu);
            requestAnimationFrame(() => {
                const mh = menu.offsetHeight, mw = menu.offsetWidth;
                if (e.clientY + mh > window.innerHeight) menu.style.top  = Math.max(0, e.clientY - mh) + 'px';
                if (e.clientX + mw > window.innerWidth)  menu.style.left = Math.max(0, e.clientX - mw) + 'px';
            });
        });

        // Phase 2: click pinned icon
        DOM.exArea.addEventListener('click', e => {
            document.querySelectorAll('.ctx-menu').forEach(m => m.remove());
            if (session.isAnswered || phase !== 'pinned') return;
            if (e.target.closest('#taskbar-pinned-browser'))
                handleSuccess(ex.successMsg || 'Perfetto! Icona fissata e programma aperto.');
        });
    }

    
    function buildSimFakeXNode(ex) {
        DOM.btnMain.style.display = 'none';
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div>${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}</div>${generateSimulationHTML(ex.simType || 'popup_fake_x')}`;
        
        const simArea = document.getElementById('sim-interactive-area') || document.querySelector('.sim-window');
        simArea.addEventListener('click', (e) => {
            if (session.isAnswered) return;
            
            // X grigia piccola (Corretto)
            if (e.target.closest('#popup-small-real-x')) {
                handleSuccess(ex.successMsg || "Esatto! Hai usato la X di sistema.");
            } 
            // X gigante o pulsanti finti (Errore)
            else if (e.target.closest('#popup-big-fake-x')) {
                handleError(ex.errorFakeX || "Sbagliato! Hai cliccato la X finta.");
            } else if (e.target.closest('#popup-fake-update')) {
                handleError(ex.errorFakeBtn || "Sbagliato! Mai cliccare pulsanti nei popup.");
            }
        });
    }

    function buildSimEscapeNode(ex) {
        DOM.btnMain.style.display = 'none';
        DOM.exArea.innerHTML = `<div class="ex-bubble"><div class="ex-text">${ex.instruction}</div>${ex.tip ? `<div class="ex-tip">💡 ${ex.tip}</div>` : ''}</div>${generateSimulationHTML(ex.simType || 'popup_infinite_escape')}`;
        
        const simArea = document.getElementById('sim-interactive-area') || document.querySelector('.sim-window');
        const popup = document.getElementById('escape-popup');
        
        // Simula il comportamento "Escape" del popup
        if (popup) {
            popup.addEventListener('mouseenter', () => {
                if(session.isAnswered) return;
                popup.style.top = (Math.random() * 50 + 10) + '%';
                popup.style.left = (Math.random() * 50 + 10) + '%';
            });
        }

        simArea.addEventListener('click', (e) => {
            if (session.isAnswered) return;
            
            // Chiusura di sistema
            if (e.target.closest('#system-close-x')) {
                handleSuccess(ex.successMsg || "Eccellente! Hai forzato la chiusura esterna.");
            } 
            // Trappole
            else if (e.target.closest('#btn-call-tech')) {
                handleError(ex.errorTech || "Attenzione! È una truffa telefonica.");
            } else if (e.target.closest('#escape-fake-close')) {
                handleError(ex.errorFakeClose || "Pulsante ingannevole!");
            }
        });
    }

    return { init };
})();

window.addEventListener('DOMContentLoaded', () => AppEngine.init());
