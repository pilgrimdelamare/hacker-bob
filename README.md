# 🤖 Hacker Bob

> Simulatore web gamificato per imparare le basi dell'informatica — pensato per adulti italiani che si avvicinano al computer per la prima volta.

**[▶ Gioca ora](https://pilgrimdelamare.github.io/hacker-bob/)**

---

## Cos'è

Hacker Bob è un gioco educativo ispirato a Duolingo: si impara usando il computer attraverso missioni brevi, feedback immediato e un sistema di progressione con XP, monete e vite. Il protagonista è Bob, un assistente digitale con quattro stati d'umore che reagisce ai tuoi progressi.

L'obiettivo non è insegnare a programmare, ma costruire la confidenza necessaria per usare un computer nella vita quotidiana — gestire file, navigare il web, riconoscere email sospette, scaricare in sicurezza.

---

## Aree tematiche

| Modulo | Argomenti |
|---|---|
| 🖥️ Desktop & Sistema Operativo | Interfaccia, finestre, impostazioni, aggiornamenti |
| 📁 Gestione File | Cartelle, estensioni, copia/sposta/elimina, cestino |
| 🌐 Navigazione Web | Browser, URL, motori di ricerca, siti sicuri |
| 📧 Email & Sicurezza | Comporre, ricevere, phishing, password, allegati |
| ⬇️ Download & Reti | Scaricare file, Wi-Fi, riconoscere fonti affidabili |

---

## Come funziona

```
Mappa del percorso → Scegli una missione → Completa le sfide → Guadagna XP
```

Ogni missione è composta da una serie di interazioni simulate — clic su interfacce realistiche, domande a risposta multipla, drag & drop — che replicano scenari del mondo reale.

**Il sistema di vite** introduce un costo all'errore senza essere punitivo: Bob si esaurisce dopo troppi sbagli, ma si riprende dopo un breve riposo.

**Il progresso viene salvato automaticamente** nel browser tramite `localStorage` — nessun account richiesto.

---

## Struttura del progetto

```
hacker-bob/
├── index.html          # Shell dell'interfaccia
├── styles.css          # Tutto il layer visuale
├── engine.js           # Motore di gioco (stati, vite, XP, logica missioni)
├── curriculum.js       # Contenuti: moduli, missioni, domande, interazioni
├── base.png            # Bob — stato neutro
├── felice.png          # Bob — vittoria
├── arrabbiato.png      # Bob — errore
└── rotto.png           # Bob — game over
```

La separazione tra `engine.js` (logica) e `curriculum.js` (contenuti) è intenzionale: si possono aggiungere missioni senza mai toccare il motore di gioco.

---

## Tecnologie

- **Vanilla JavaScript** — nessun framework, nessuna dipendenza
- **HTML + CSS** — layout e animazioni native
- **localStorage** — salvataggio del progresso in locale
- **GitHub Pages** — deploy statico, zero infrastruttura

---

## Sviluppo locale

Non serve nessuna installazione. Basta clonare la repo e aprire `index.html` in un browser:

```bash
git clone https://github.com/pilgrimdelamare/hacker-bob.git
cd hacker-bob
# Apri index.html nel tuo browser
```

---

## Contribuire

Il modo più semplice per contribuire è **aggiungere missioni** modificando `curriculum.js`. La struttura dati è leggibile e non richiede conoscenza del motore.

Per bug, miglioramenti o idee apri una [Issue](https://github.com/pilgrimdelamare/hacker-bob/issues).

---

## Licenza

[Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/)

Puoi usare, modificare e distribuire questo progetto liberamente, a condizione che:
- venga mantenuta l'attribuzione all'autore originale
- non venga usato per scopi commerciali

© 2026 pilgrimdelamare
