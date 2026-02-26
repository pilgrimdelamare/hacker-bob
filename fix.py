import os

def applica_patch_moneta():
    print("🪙 Inizio implementazione della Moneta Volante...")

    # ==========================================
    # 1. PATCH INDEX.HTML
    # ==========================================
    html_path = 'index.html'
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            html_code = f.read()

        # Sostituiamo la fiammella con la moneta
        vecchio_badge = '<div class="stat-badge flame">🔥 <span id="val-streak">0</span></div>'
        nuovo_badge = '<div class="stat-badge coin" title="Missioni Completate">🪙 <span id="val-streak" style="display:inline-block;">0</span></div>'
        
        if vecchio_badge in html_code:
            html_code = html_code.replace(vecchio_badge, nuovo_badge)
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_code)
            print("✅ index.html aggiornato (Nuovo badge Moneta).")

    # ==========================================
    # 2. PATCH STYLES.CSS
    # ==========================================
    css_path = 'styles.css'
    if os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            css_code = f.read()

        nuovo_css = """
/* --- Animazione Moneta Volante --- */
.flying-coin {
    position: fixed;
    font-size: 3rem;
    z-index: 9999;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    animation: coinFly 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes coinFly {
    0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; }
    30% { top: 40%; left: 50%; transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
    100% { top: 30px; left: calc(100% - 100px); transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
}

.bump-anim {
    animation: coinBump 0.4s ease-out;
}

@keyframes coinBump {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.5); color: #FFD700; text-shadow: 0 0 10px rgba(255,215,0,0.8); }
}
"""
        if '.flying-coin' not in css_code:
            with open(css_path, 'a', encoding='utf-8') as f:
                f.write(nuovo_css)
            print("✅ styles.css aggiornato (Keyframes e classi animazione aggiunti).")

    # ==========================================
    # 3. PATCH ENGINE.JS
    # ==========================================
    engine_path = 'engine.js'
    if os.path.exists(engine_path):
        with open(engine_path, 'r', encoding='utf-8') as f:
            engine_code = f.read()

        # A. Sganciamo il counter dal vecchio streak e lo leghiamo alle missioni completate,
        # inserendo una variabile "holdCoinUpdate" per congelare il numeretto finché la moneta non atterra.
        vecchio_update = """function updateTopBar() {
        DOM.xp.innerText = state.xp;
        DOM.streak.innerText = state.streak;
    }"""
        nuovo_update = """function updateTopBar() {
        DOM.xp.innerText = state.xp;
        if (!window.holdCoinUpdate) {
            DOM.streak.innerText = Object.keys(state.completedMissions).length;
        }
    }"""
        
        # B. Inseriamo la regia dell'animazione nella schermata di vittoria
        vecchio_victory = """playVictorySound();
        launchConfetti();"""
        
        nuova_regia_moneta = """playVictorySound();
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
        // -----------------------------"""

        modificato = False
        if vecchio_update in engine_code:
            engine_code = engine_code.replace(vecchio_update, nuovo_update)
            modificato = True
        
        if 'window.holdCoinUpdate = true;' not in engine_code and vecchio_victory in engine_code:
            engine_code = engine_code.replace(vecchio_victory, nuova_regia_moneta)
            modificato = True

        if modificato:
            with open(engine_path, 'w', encoding='utf-8') as f:
                f.write(engine_code)
            print("✅ engine.js aggiornato (Logica moneta e timer inseriti).")

    print("🚀 PATCH APPLICATA CON SUCCESSO!")

if __name__ == '__main__':
    applica_patch_moneta()