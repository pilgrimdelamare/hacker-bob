var AppCurriculum = [
    {
        id: "mod_desktop", title: "Il Desktop", desc: "Scopri le basi del computer.", icon: "🖥️",
        missions: [
            {
                id: "l1_m1", title: "Il Tocco Magico", desc: "Clic e Doppio Clic", xpReward: 100,
                exercises: [
                    { type: "info", title: "1. Il Clic Singolo", text: "Il tasto sinistro serve per 'indicare'.\nPremilo UNA SOLA VOLTA per SELEZIONARE un file." },
                    { type: "sim_click", instruction: "Seleziona 'Documenti' con un CLIC SINGOLO.", targetId: "icon-docs", simType: "desktop", isDoubleClick: false },
                    { type: "info", title: "2. Il Doppio Clic", text: "Per APRIRE un programma, premi il tasto sinistro DUE VOLTE VELOCEMENTE." },
                    { type: "sim_click", instruction: "Apri il 'Cestino' con un DOPPIO CLIC.", targetId: "icon-trash", simType: "desktop", isDoubleClick: true },
                    { type: "quiz", q: "A cosa serve il doppio clic?", options: ["A cancellare", "Ad aprire programmi", "A cambiare colore"], correctIdx: 1, explanation: "Esatto! Serve per avviare le applicazioni." },
                    {
                        type: "sim_multistep",
                        instruction: "🌟 <strong>Sfida finale</strong>: Seleziona e Apri.",
                        successMsg: "Ottimo! Hai padroneggiato la differenza tra selezionare e aprire.",
                        steps: [
                            { type: "click", simType: "explorer", targetId: "file-contratto", isDoubleClick: false, instruction: "1. Fai un <strong>clic singolo</strong> su <strong>Lettera.docx</strong> per selezionarlo." },
                            { type: "click", simType: "explorer", targetId: "file-contratto", isDoubleClick: true, instruction: "2. Ora fai <strong>doppio clic</strong> sullo stesso file per aprirlo." }
                        ]
                    }
                ]
            },
            {
                id: "mis_zip_2", title: "Estrarre i File", desc: "Svuotare la valigia dopo il viaggio", xpReward: 130,
                exercises: [
                    { type: "info", title: "📌 Aprire la Valigia", text: "Quando ricevi uno ZIP, i file sono 'bloccati' dentro. \n\nPer usarli, devi 'Estrarli'. È come togliere i vestiti dalla valigia e metterli nell'armadio per poterli indossare." },
                    { type: "sim_steps", instruction: "Fai clic destro sull'archivio <strong>Foto_Vacanze.zip</strong> e seleziona <strong>📂 Estrai tutto...</strong>", simType: "explorer", targetId: "file-zip", menuOptions: [{ label: "📂 Apri", isCorrect: false }, { label: "📂 Estrai tutto...", isCorrect: true }, { label: "✂️ Taglia", isCorrect: false }] },
                    { type: "info", title: "📌 Scegliere la destinazione", text: "Il computer ti chiederà DOVE vuoi mettere i file estratti. Scegli sempre una cartella precisa, altrimenti farai disordine!" },
                    {
                        type: "sim_multistep",
                        instruction: "🌟 <strong>Sfida finale</strong>: Estrai i file nella cartella di lavoro.",
                        successMsg: "Bravissimo! Hai estratto i file in modo ordinato.",
                        steps: [
                            { type: "click", simType: "explorer", targetId: "folder-lavoro", isDoubleClick: false, instruction: "1. Clicca sulla cartella <strong>Lavoro</strong> per sceglierla come destinazione." },
                            { type: "click", simType: "explorer", targetId: "btn-extract-confirm", isDoubleClick: false, instruction: "2. Clicca sul pulsante <strong>Estrai Tutto Qui</strong> per confermare l'operazione." }
                        ]
                    }
                ]
            },
            {
                id: "mis_web_avanz_2", title: "Download e Formati", desc: "Scaricare PDF e immagini", xpReward: 140,
                exercises: [
                    { type: "info", title: "📌 Scaricare vs Aprire", text: "Quando trovi un documento online, puoi 'Aprirlo' per guardarlo o 'Scaricarlo' per tenerlo nel tuo PC. \n\nScaricare è come comprare un giornale e portarlo a casa: potrai leggerlo anche quando non sei connesso!" },
                    { type: "info", title: "📌 I Formati Comuni", text: "PDF: documenti che non cambiano mai forma (ottimi per fatture o moduli).\n\nJPG/PNG: sono le foto.\n\nOgni formato ha la sua icona specifica!" },
                    { type: "quiz", q: "Qual è il formato migliore per una ricevuta che non deve essere modificata?", options: ["Foto JPG", "Documento PDF", "Sito Web"], correctIdx: 1, explanation: "Giusto! Il PDF è lo standard per i documenti ufficiali perché mantiene l'aspetto originale su ogni computer." },
                    {
                        type: "sim_multistep",
                        instruction: "🌟 <strong>Sfida finale</strong>: Scarica e trova il modulo.",
                        successMsg: "Perfetto! Hai scaricato e recuperato il file con successo.",
                        steps: [
                            { type: "click", simType: "download_page", targetId: "btn-dl-pdf", isDoubleClick: false, instruction: "1. Nel browser, clicca su <strong>Scarica PDF</strong>." },
                            { type: "click", simType: "desktop", targetId: "icon-docs", isDoubleClick: true, instruction: "2. Torna al Desktop e fai <strong>doppio clic</strong> su <strong>Documenti</strong> per trovare il file." }
                        ]
                    }
                ]
            },
            {
                id: "mis_foto_2", title: "Archivio e Screenshot", desc: "Catturare lo schermo e ordinare", xpReward: 140,
                exercises: [
                    { type: "info", title: "📌 Ordinare i File", text: "Non lasciare i file tutti insieme! Crea cartelle specifiche. \n\nÈ come dividere i documenti in cassetti diversi per non fare confusione." },
                    { type: "sim_drag", instruction: "Fai ordine: trascina fisicamente <strong>Foto.jpg</strong> dentro la cartella <strong>Lavoro</strong> per archiviarla.", simType: "explorer", dragId: "file-foto", dropId: "folder-lavoro" },
                    { type: "info", title: "📌 Trovare gli Screenshot", text: "Quando 'fotografi' lo schermo (ad esempio premendo il tasto Stamp o la combinazione Win+Maiusc+S), il computer salva l'immagine in automatico.\n\nMa dove finiscono? Semplice: il PC li mette nella cartella 'Screenshot' dentro la tua raccolta di Immagini." },
                    {
                        type: "sim_multistep",
                        instruction: "🌟 <strong>Sfida finale</strong>: Vai a cercare l'ultimo screenshot salvato dal PC.",
                        successMsg: "Perfetto! Ora sai sempre dove ritrovare le tue catture dello schermo.",
                        steps: [
                            { type: "click", simType: "desktop", targetId: "icon-docs", isDoubleClick: true, instruction: "1. Apri <strong>Documenti</strong> dal Desktop per entrare nell'Esplora File." },
                            { type: "click", simType: "explorer", targetId: "side-gallery", isDoubleClick: false, instruction: "2. Nella barra a sinistra, fai un clic su <strong>🖼️ Immagini</strong>." },
                            { type: "click", simType: "explorer", targetId: "folder-screen", isDoubleClick: true, instruction: "3. Fai <strong>doppio clic</strong> sulla cartella <strong>Screenshot</strong>." }
                        ]
                    }
                ]
            },
            {
                id: "mis_yt_2", title: "Volume e Schermo Intero", desc: "Migliorare la visione", xpReward: 140,
                exercises: [
                    { type: "info", title: "📌 Controllare il Volume", text: "Il volume generale del PC si controlla in basso a destra, nella barra delle applicazioni.\n\nCerca l'icona dell'altoparlante 🔊 e cliccala per alzare o abbassare l'audio." },
                    { type: "sim_click", instruction: "Clicca sull'icona del <strong>Volume 🔊</strong> in basso a destra per regolare l'audio.", tip: "Cerca in basso a destra.", simType: "desktop", targetId: "icon-volume", isDoubleClick: false },
                    { type: "info", title: "📌 Schermo Intero", text: "Stai leggendo un documento o guardando un video su Internet? \n\nPremi il tasto F11 sulla tastiera per far sparire le barre degli strumenti e goderti lo schermo intero (ripremilo per tornare indietro).\n\n💡 Nota: Su alcuni portatili, i tasti 'F' controllano volume o luminosità. Se F11 non funziona, tieni premuto il tasto speciale Fn e poi premi F11." },
                    { type: "sim_shortcut", instruction: "Premi il tasto <strong>F11</strong> per attivare lo schermo intero. (Se non succede nulla, prova con <strong>Fn + F11</strong>).", keys: ["f11"], displayKeys: ["F11"], successMsg: "Schermo intero attivato! Ora non hai più distrazioni." },
                    { type: "quiz", q: "Cosa succede se premi F11 nel browser?", options: ["Il computer si spegne", "La pagina si espande a schermo intero nascondendo le barre", "Il volume si alza al massimo"], correctIdx: 1, explanation: "Esatto! F11 è utilissimo per leggere o guardare video senza distrazioni." }
                ]
            },
            {
                id: "mis_ama_2", title: "Sicurezza e Resi", desc: "Pagare e cambiare idea", xpReward: 150,
                exercises: [
                    { type: "info", title: "📌 Pagare in Sicurezza", text: "Quando decidi di comprare, assicurati che ci sia il LUCCHETTO 🔒 in alto nella barra degli indirizzi: significa che i tuoi dati viaggiano protetti." },
                    { type: "quiz", q: "Cosa indica il lucchetto 🔒 accanto all'indirizzo del sito?", options: ["Che il sito è bloccato e non funziona", "Che la connessione è sicura e i tuoi dati sono protetti", "Che devi cambiare password"], correctIdx: 1, explanation: "Esatto! Il lucchetto è fondamentale quando inserisci dati sensibili." },
                    {
                        type: "sim_multistep",
                        instruction: "Trova la ricevuta del tuo acquisto.",
                        successMsg: "Perfetto! Hai aperto la ricevuta corretta.",
                        steps: [
                            { type: "click", simType: "desktop", targetId: "icon-docs", isDoubleClick: true, instruction: "1. Apri <strong>Documenti</strong> dal Desktop." },
                            { type: "click", simType: "explorer", targetId: "file-ricevuta", isDoubleClick: true, instruction: "2. Fai <strong>doppio clic</strong> su <strong>Ricevuta_Amazon.pdf</strong> per leggerla." }
                        ]
                    },
                    { type: "info", title: "📌 Pulire le Vecchie Fatture", text: "Per fare spazio e ordine, le fatture vecchie vanno eliminate trascinandole nel Cestino." },
                    { type: "sim_drag", instruction: "Prendi <strong>Ricevuta_Vecchia.pdf</strong> e trascinala nel <strong>Cestino</strong> per eliminarla.", simType: "explorer", dragId: "file-vecchio", dropId: "recycle-bin" }
                ]
            },
            {
                id: "mis_word_2", title: "Stampare e PDF", desc: "Dal monitor alla carta", xpReward: 140,
                exercises: [
                    { type: "info", title: "📌 Selezionare da stampare", text: "Prima di stampare un documento, devi trovarlo e aprirlo." },
                    {
                        type: "sim_multistep",
                        instruction: "Prepara il file per la stampa.",
                        successMsg: "Hai aperto il file corretto.",
                        steps: [
                            { type: "click", simType: "desktop", targetId: "icon-docs", isDoubleClick: true, instruction: "1. Fai <strong>doppio clic</strong> su <strong>Documenti</strong>." },
                            { type: "click", simType: "explorer", targetId: "file-contratto", isDoubleClick: true, instruction: "2. Fai <strong>doppio clic</strong> su <strong>Lettera.docx</strong> per aprirla." }
                        ]
                    },
                    { type: "info", title: "📌 Anteprima di Stampa", text: "Per stampare, si va sul menu 'File' in alto a sinistra, poi si sceglie 'Stampa'. Questo ti mostrerà un'anteprima su come verrà il foglio di carta." },
                    {
                        type: "sim_multistep",
                        instruction: "Simula la stampa del documento.",
                        successMsg: "Bravissimo! Hai aperto l'anteprima di stampa in modo corretto.",
                        steps: [
                            { type: "click", simType: "word_sim", targetId: "btn-file", isDoubleClick: false, instruction: "1. Clicca sul menu <strong>File</strong> in alto." },
                            { type: "click", simType: "word_sim", targetId: "btn-print", isDoubleClick: false, instruction: "2. Clicca sulla voce <strong>Stampa</strong>." }
                        ]
                    },
                    {
                        type: "sim_multistep",
                        instruction: "🌟 <strong>Sfida finale</strong>: Allega la Lettera e inviala via email.",
                        successMsg: "Perfetto! Hai eseguito l'invio di un allegato proprio come nella vita reale.",
                        steps: [
                            { type: "click", simType: "email_compose", targetId: "btn-attach", isDoubleClick: false, instruction: "1. Clicca su <strong>📎 Allega</strong>." },
                            { type: "click", simType: "explorer", targetId: "file-pdf", isDoubleClick: true, instruction: "2. Fai <strong>doppio clic</strong> su <strong>Lettera.pdf</strong> per sceglierla." },
                            { type: "click", simType: "email_compose", targetId: "btn-send", isDoubleClick: false, instruction: "3. Clicca su <strong>Invia</strong> per spedire il messaggio." }
                        ]
                    }
                ]
            }
        ]
    },
            {
        id: "mod_18_excel", title: "Excel: Tabelle", desc: "Gestisci conti e liste facilmente.", icon: "📊",
        missions: [
            {
                id: "mis_excel_1", title: "Celle e Colonne", desc: "Scrivere e fare spazio", xpReward: 130,
                exercises: [
                    { type: "info", title: "📌 La Griglia", text: "Excel è fatto di quadretti chiamati CELLE.\n\nOgni cella ha un nome: la colonna ha una lettera (A, B, C) e la riga un numero (1, 2, 3). L'incrocio in alto a sinistra è la cella A1!" },
                    { type: "sim_multistep", instruction: "Inizia aprendo il file di bilancio dal computer.", steps: [ { type: "click", simType: "desktop", targetId: "icon-docs", isDoubleClick: true, instruction: "1. Apri <strong>Documenti</strong>." }, { type: "click", simType: "explorer", targetId: "file-excel", isDoubleClick: true, instruction: "2. Fai doppio clic su <strong>Bilancio.xlsx</strong>." } ] },
                    { type: "sim_type", instruction: "Scrivi l'intestazione. Clicca sulla barra della formula in alto (fx) e digita: <strong>Spese Famiglia</strong>", tip: "Usa la barra col simbolo fx", simType: "excel_sim", expectedText: "Spese Famiglia", onComplete: function() { let a1 = document.getElementById('cell-a1'); if(a1) a1.innerText = 'Spese Famiglia'; let f = document.getElementById('sim-typing-field'); if(f) f.value = ''; } },
                    { type: "info", title: "📌 Allargare le Colonne", text: "Se scrivi una parola lunga, il testo 'esce' dalla cella o viene tagliato.\n\nPer risolvere, devi trascinare la linea di confine tra le lettere (es. tra A e B) verso destra." },
                    { type: "sim_drag", instruction: "Il testo è troppo lungo! Trascina il bordo destro della colonna <strong>A</strong> verso la colonna <strong>B</strong> per fare spazio.", simType: "excel_sim", dragId: "col-resize", dropId: "col-drop-zone", preventAppend: true, 
                      onSetup: function() { let a1 = document.getElementById('cell-a1'); if(a1) a1.innerText = 'Spese Famiglia'; },
                      onComplete: function() { ['cell-a1','cell-a2','cell-a3','cell-a4','cell-a5'].forEach(id => { let el = document.getElementById(id); if(el) el.style.width = '180px'; }); let colResize = document.getElementById('col-resize'); if(colResize) colResize.parentElement.style.width = '180px'; } 
                    }
                ]
            },
            {
                id: "mis_excel_2", title: "Somma Automatica", desc: "Il computer calcola per te", xpReward: 160,
                exercises: [
                    { type: "info", title: "📌 Somma Automatica", text: "Excel serve a non usare la calcolatrice.\n\nSe hai una lista di spese, basta selezionare la cella vuota in fondo e cliccare il pulsante 'Somma' (Σ). Il PC addizionerà tutto in un attimo!" },
                    {
                        type: "sim_multistep",
                        instruction: "Calcola il totale delle spese (Entrate e Uscite).",
                        successMsg: "Visto? Ha calcolato tutto in un decimo di secondo!",
                        steps: [
                            { type: "click", simType: "excel_sim", targetId: "cell-b5", isDoubleClick: false, instruction: "1. Clicca sulla cella vuota accanto a 'Risparmio' (B5) per dire al PC dove mettere il risultato.", 
                              onSetup: function() { 
                                  let a1 = document.getElementById('cell-a1'); if(a1) a1.innerText = 'Spese Famiglia'; 
                                  ['cell-a1','cell-a2','cell-a3','cell-a4','cell-a5'].forEach(id => { let el = document.getElementById(id); if(el) el.style.width = '180px'; }); let colResize = document.getElementById('col-resize'); if(colResize) colResize.parentElement.style.width = '180px'; 
                              },
                              onComplete: function() { document.querySelectorAll('.target-el').forEach(e => { if(e.id && e.id.startsWith('cell-')) e.style.background = ''; }); let cb = document.getElementById('cell-b5'); if(cb) cb.style.background = '#e3f2fd'; } 
                            },
                            { type: "click", simType: "excel_sim", targetId: "btn-autosum", isDoubleClick: false, instruction: "2. Clicca sul pulsante <strong>Σ Somma</strong> nella barra in alto.", 
                              onComplete: function() { let cb = document.getElementById('cell-b5'); if(cb){ cb.innerText = '600'; cb.style.fontWeight = 'bold'; cb.style.color = '#107c41'; cb.style.background = ''; } } 
                            }
                        ]
                    }
                ]
            },
            {
                id: "mis_excel_3", title: "Le Formule", desc: "Il segno Uguale", xpReward: 160,
                exercises: [
                    { type: "info", title: "📌 La Regola d'Oro", text: "Per fare una sottrazione (es. Entrate meno Uscite), la regola d'oro è: iniziare sempre scrivendo il segno Uguale ( = ).\n\nInoltre non si scrivono i numeri, ma le coordinate! Es: =B2-B3" },
                    { type: "sim_type", instruction: "Calcoliamo il risparmio reale. Clicca sulla barra della formula e digita la formula esatta: <strong>=B2-B3</strong>", tip: "Non dimenticare l'uguale!", simType: "excel_sim", expectedText: "=B2-B3", 
                      onSetup: function() { 
                          let a1 = document.getElementById('cell-a1'); if(a1) a1.innerText = 'Spese Famiglia'; 
                          ['cell-a1','cell-a2','cell-a3','cell-a4','cell-a5'].forEach(id => { let el = document.getElementById(id); if(el) el.style.width = '180px'; }); let colResize = document.getElementById('col-resize'); if(colResize) colResize.parentElement.style.width = '180px';
                          let cb5 = document.getElementById('cell-b5'); if(cb5){ cb5.innerText = '600'; cb5.style.fontWeight = 'bold'; cb5.style.color = '#107c41'; }
                      },
                      onComplete: function() { let cb = document.getElementById('cell-b5'); if(cb) cb.innerText = '600'; let tf = document.getElementById('sim-typing-field'); if(tf) tf.value = ''; } 
                    },
                    { type: "quiz", q: "Perché nelle formule si scrivono i nomi delle celle (es. B2) e non i numeri (es. 1500)?", options: ["Perché i numeri non funzionano sulla tastiera", "Perché se un domani cambi il numero in B2, il risultato si aggiornerà da solo", "Perché è più bello da vedere"], correctIdx: 1, explanation: "Esatto! È questa la vera magia di Excel: i calcoli si aggiornano in automatico se modifichi i dati." }
                ]
            },
            {
                id: "mis_excel_4", title: "Formato e Aspetto", desc: "Valuta e Grassetto", xpReward: 150,
                exercises: [
                    { type: "info", title: "📌 I Numeri non sono tutti uguali", text: "Excel non sa se '1500' sono patate o euro.\n\nUsando il tasto Valuta (€), Excel aggiungerà automaticamente zeri e virgole. Usiamo anche il Grassetto (G) per evidenziare le parole importanti." },
                    {
                        type: "sim_multistep",
                        instruction: "Rendi la tabella professionale.",
                        successMsg: "Perfetto! Ora la tabella è chiarissima e formattata a regola d'arte.",
                        steps: [
                            { type: "click", simType: "excel_sim", targetId: "cell-b2", isDoubleClick: false, instruction: "1. Clicca sulla cella delle Entrate (B2).", 
                              onSetup: function() { 
                                  let a1 = document.getElementById('cell-a1'); if(a1) a1.innerText = 'Spese Famiglia'; 
                                  ['cell-a1','cell-a2','cell-a3','cell-a4','cell-a5'].forEach(id => { let el = document.getElementById(id); if(el) el.style.width = '180px'; }); let colResize = document.getElementById('col-resize'); if(colResize) colResize.parentElement.style.width = '180px';
                                  let cb5 = document.getElementById('cell-b5'); if(cb5){ cb5.innerText = '600'; cb5.style.fontWeight = 'bold'; cb5.style.color = '#107c41'; }
                              },
                              onComplete: function() { document.querySelectorAll('.target-el').forEach(e => { if(e.id && e.id.startsWith('cell-')) e.style.background = ''; }); let cb = document.getElementById('cell-b2'); if(cb) cb.style.background = '#e3f2fd'; } 
                            },
                            { type: "click", simType: "excel_sim", targetId: "btn-currency", isDoubleClick: false, instruction: "2. Clicca sul pulsante <strong>€</strong> per trasformarlo in Euro.", 
                              onComplete: function() { let cb = document.getElementById('cell-b2'); if(cb) { cb.innerText = '1.500,00 €'; cb.style.background = ''; } } 
                            },
                            { type: "click", simType: "excel_sim", targetId: "cell-a2", isDoubleClick: false, instruction: "3. Clicca sulla parola 'Entrate' (A2).", 
                              onComplete: function() { document.querySelectorAll('.target-el').forEach(e => { if(e.id && e.id.startsWith('cell-')) e.style.background = ''; }); let ca = document.getElementById('cell-a2'); if(ca) ca.style.background = '#e3f2fd'; } 
                            },
                            { type: "click", simType: "excel_sim", targetId: "btn-bold", isDoubleClick: false, instruction: "4. Clicca sul pulsante <strong>G</strong> (Grassetto) per farla risaltare.", 
                              onComplete: function() { let ca = document.getElementById('cell-a2'); if(ca) { ca.style.fontWeight = 'bold'; ca.style.background = ''; } } 
                            }
                        ]
                    }
                ]
            },
            {
                id: "mis_excel_5", title: "Percentuali", desc: "Sconti e IVA", xpReward: 170,
                exercises: [
                    { type: "info", title: "📌 Sconti e IVA", text: "La moltiplicazione si fa con l'asterisco ( * ).\n\nPer calcolare una percentuale, basta moltiplicare la cella per il numero col simbolo %. \nEsempio per il 22% di IVA: =B2*22%" },
                    { type: "sim_type", instruction: "Hai uno sconto del 10% sul Frigorifero (che si trova in B4). Calcolalo digitando nella barra della formula: <strong>=B4*10%</strong>", tip: "Usa l'asterisco per moltiplicare.", simType: "excel_sim", expectedText: "=B4*10%", 
                      onSetup: function() { 
                          let a1 = document.getElementById('cell-a1'); if(a1) a1.innerText = 'Spese Famiglia'; 
                          ['cell-a1','cell-a2','cell-a3','cell-a4','cell-a5'].forEach(id => { let el = document.getElementById(id); if(el) el.style.width = '180px'; }); let colResize = document.getElementById('col-resize'); if(colResize) colResize.parentElement.style.width = '180px';
                          let cb5 = document.getElementById('cell-b5'); if(cb5){ cb5.innerText = '600'; cb5.style.fontWeight = 'bold'; cb5.style.color = '#107c41'; }
                          let cb2 = document.getElementById('cell-b2'); if(cb2) cb2.innerText = '1.500,00 €'; 
                          let ca2 = document.getElementById('cell-a2'); if(ca2) ca2.style.fontWeight = 'bold';
                      },
                      onComplete: function() { let cc = document.getElementById('cell-c4'); if(cc){ cc.innerText = '- 40,00 €'; cc.style.fontWeight = 'bold'; cc.style.color = '#e74c3c'; } let tf = document.getElementById('sim-typing-field'); if(tf) tf.value = ''; } 
                    },
                    { type: "quiz", q: "Qual è il simbolo che Excel usa per fare le moltiplicazioni?", options: ["La lettera X", "L'asterisco *", "Il trattino -"], correctIdx: 1, explanation: "Giusto! L'asterisco è il segno matematico universale dei computer per la moltiplicazione." }
                ]
            }
        ]
    },
{
        id: "mod_19_spid", title: "SPID e Pratiche", desc: "La tua identità digitale.", icon: "🏛️",
        missions: [
            {
                id: "mis_spid_1", title: "Il Login SPID", desc: "La porta d'ingresso per la PA", xpReward: 140,
                exercises: [
                    { type: "info", title: "📌 Cos'è lo SPID?", text: "Lo SPID è la tua 'Chiave Universale' per entrare nei siti del Governo, dell'INPS, dell'Agenzia delle Entrate e della Sanità.\n\nInvece di avere 100 password diverse, ne usi solo una. All'inizio fa paura, ma il procedimento è sempre lo stesso!" },
                    {
                        type: "sim_multistep",
                        instruction: "Fai finta di dover controllare la pensione. Esegui l'accesso.",
                        successMsg: "Bravissimo! Hai superato lo scoglio principale. Ricorda: si sceglie il provider e si mettono i dati.",
                        steps: [
                            { type: "click", simType: "spid_sim", targetId: "btn-spid-main", isDoubleClick: false, instruction: "1. Sei sul sito INPS. Clicca sul pulsante blu <strong>Accedi con SPID</strong>.", onComplete: function(){ document.getElementById('spid-step-1').style.display='none'; document.getElementById('spid-step-2').style.display='block'; } },
                            { type: "click", simType: "spid_sim", targetId: "btn-provider-poste", isDoubleClick: false, instruction: "2. Si apre la lista di chi gestisce il tuo SPID (i Provider). Scegli <strong>PosteID</strong>.", onComplete: function(){ document.getElementById('spid-step-2').style.display='none'; document.getElementById('spid-step-3').style.display='block'; } },
                            { type: "type", simType: "spid_sim", expectedText: "mario.rossi", instruction: "3. Ora sei nel tuo provider! Clicca sulla riga Nome Utente, scrivi <strong>mario.rossi</strong> e premi Invio." }
                        ]
                    }
                ]
            },
            {
                id: "mis_spid_2", title: "Il Referto Medico", desc: "Scarica e ritrova i documenti", xpReward: 160,
                exercises: [
                    { type: "info", title: "📌 Scaricare o 'Salvare con Nome'?", text: "Quando scarichi un documento da internet (come le analisi del sangue), il computer ti chiede DOVE vuoi metterlo.\n\nQuesta finestra si chiama 'Salva con nome'. Scegli sempre una cartella facile da ritrovare, come la cartella 'Documenti'!" },
                    {
                        type: "sim_multistep",
                        instruction: "Vai a ritirare le analisi del sangue dal Fascicolo Sanitario.",
                        successMsg: "Esito aperto! (E a quanto pare devi farti una doccia 🤣)",
                        steps: [
                            { type: "click", simType: "health_sim", targetId: "btn-download-referto", isDoubleClick: false, instruction: "1. Clicca su <strong>📄 Scarica</strong> accanto alle Analisi del Sangue." },
                            { type: "click", simType: "save_as_dialog", targetId: "side-docs-save", isDoubleClick: false, instruction: "2. Il PC ti chiede dove salvare. A sinistra, clicca su <strong>📄 Documenti</strong>.", onComplete: function(){ document.getElementById('side-docs-save').style.background='#cce8ff'; document.getElementById('side-docs-save').style.fontWeight='bold'; } },
                            { type: "click", simType: "save_as_dialog", targetId: "btn-save-confirm", isDoubleClick: false, instruction: "3. Ora che hai scelto il posto, clicca sul bottone blu <strong>Salva</strong>." },
                            { type: "click", simType: "desktop", targetId: "icon-taskbar-explorer", isDoubleClick: false, instruction: "4. Bene, sei tornato sul Desktop. Apri l'<strong>Esplora File</strong> cliccando sulla Cartella Gialla in basso nella barra." },
                            { type: "click", simType: "explorer", targetId: "side-docs", isDoubleClick: false, 
                              instruction: "5. L'Esplora File si apre nella 'Home'. Clicca su <strong>📄 Documenti</strong> a sinistra per trovare il tuo referto.",
                              onSetup: function() { 
                                  let sd = document.getElementById('side-docs'); if(sd) { sd.style.background = 'transparent'; sd.style.color = '#555'; }
                                  let pt = document.getElementById('path-text'); if(pt) pt.innerText = 'Home';
                                  let files = document.querySelectorAll('.file-item, .folder-item');
                                  files.forEach(f => { if(f.id !== 'folder-lavoro') f.style.display = 'none'; });
                              },
                              onComplete: function() { 
                                  let sd = document.getElementById('side-docs'); if(sd) { sd.style.background = '#E8F5E9'; sd.style.color = 'var(--clr-green-shadow)'; }
                                  let pt = document.getElementById('path-text'); if(pt) pt.innerText = 'Documenti';
                                  let files = document.querySelectorAll('.file-item, .folder-item');
                                  files.forEach(f => f.style.display = 'flex');
                                  let fr = document.getElementById('file-referto'); 
                                  if(fr) { fr.style.display = 'flex'; fr.style.boxShadow = '0 0 12px #ffc107'; setTimeout(() => fr.style.boxShadow = 'none', 1500); }
                              } 
                            },
                            { type: "click", simType: "explorer", targetId: "file-referto", isDoubleClick: true, 
                              instruction: "6. Eccolo! Fai <strong>DOPPIO CLIC</strong> sul file <strong>Referto.pdf</strong> appena scaricato per leggere l'esito.",
                              onSetup: function() {
                                  let fr = document.getElementById('file-referto'); 
                                  if(fr) { fr.style.display = 'flex'; }
                              }
                            },
                            { type: "click", simType: "pdf_referto", targetId: "pdf-doc", isDoubleClick: false, instruction: "7. Leggi l'esito... e clicca sulla pagina per continuare!" }
                        ]
                    }
                ]
            },
            {
                id: "mis_pass_2", title: "Panico da Password", desc: "Recupero e codici sul telefono", xpReward: 150,
                exercises: [
                    { type: "info", title: "📌 Ho dimenticato la password!", text: "Succede a tutti! Invece di arrabbiarti o bloccare il conto sbagliando 10 volte, cerca sempre il bottoncino 'Hai dimenticato la password?'.\n\nTi manderanno una mail per sceglierne una nuova in modo sicuro." },
                    { type: "info", title: "📌 Il maledetto codice OTP", text: "Dopo aver messo la password, la banca ti manda un SMS sul cellulare con un codice a 6 cifre da copiare sul computer.\n\nSi chiama OTP (One Time Password). Serve per essere sicuri che oltre alla password, il ladro debba avere fisicamente in mano anche il tuo telefono per derubarti!" },
                    {
                        type: "sim_multistep",
                        instruction: "Recupera l'accesso al tuo conto bancario.",
                        successMsg: "Ce l'hai fatta! Non c'è motivo di farsi prendere dal panico per una password scordata.",
                        steps: [
                            { type: "click", simType: "bank_login", targetId: "link-forgot-pwd", isDoubleClick: false, instruction: "1. Sei sul sito della banca ma non ricordi i dati. Clicca su <strong>Hai dimenticato la password?</strong>" },
                            { type: "click", simType: "email_inbox", targetId: "email-banca", isDoubleClick: false, instruction: "2. Ora vai nella tua email. Clicca sul messaggio arrivato dalla <strong>Banca</strong> per resettarla." },
                            { type: "type", simType: "otp_sim", expectedText: "456789", instruction: "3. Password cambiata! Ora la banca ti chiede il codice OTP. <strong>Guarda il telefono a destra</strong>, copia il codice e premi Invio sul PC." }
                        ]
                    }
                ]
            },
            {
                id: "mis_pagopa", title: "Pagare con PagoPA", desc: "Usa il copia-incolla per i bollettini", xpReward: 160,
                exercises: [
                    { type: "info", title: "📌 L'incubo del Codice IUV", text: "I vecchi bollettini postali sono stati sostituiti dal PagoPA.\n\nPer pagare online devi copiare un numerone lunghissimo chiamato 'Codice Avviso' (IUV).\n\nRegola d'oro: NON riscriverlo a mano! Se sbagli un numero il pagamento fallisce. Usa sempre il <strong>Copia (Ctrl+C)</strong> e <strong>Incolla (Ctrl+V)</strong>." },
                    {
                        type: "sim_multistep",
                        instruction: "Paga la mensa o la multa copiando il codice in modo sicuro.",
                        successMsg: "Pagamento effettuato! Il copia-incolla ti salva dagli errori di battitura.",
                        steps: [
                            { type: "shortcut", simType: "pagopa_pdf", keys: ["control", "c"], instruction: "1. Hai aperto il PDF dell'avviso. Il codice è 123456789012345678. Premi <strong>Ctrl + C</strong> sulla tastiera per COPIARLO." },
                            { type: "shortcut", simType: "payment_portal", keys: ["control", "v"], instruction: "2. Ora sei sul sito dei pagamenti. Premi <strong>Ctrl + V</strong> per INCOLLARE il codice nel campo vuoto.", onComplete: function(){ document.getElementById('sim-typing-field').value = '123456789012345678'; } }
                        ]
                    }
                ]
            },
            {
                id: "mis_prenota", title: "Prenotare l'Appuntamento", desc: "Il Calendario digitale", xpReward: 150,
                exercises: [
                    { type: "info", title: "📌 Navigare un calendario", text: "Per rinnovare la carta d'identità o prenotare il medico, si usano i calendari online.\n\nIl meccanismo è sempre: scegli il giorno disponibile (di solito colorato o cliccabile) -> scegli l'orario -> clicca Conferma." },
                    {
                        type: "sim_multistep",
                        instruction: "Fissa il tuo appuntamento.",
                        successMsg: "Prenotazione confermata! Non hai più bisogno di fare la fila in segreteria.",
                        steps: [
                            { type: "click", simType: "cup_calendar", targetId: "cal-day-15", isDoubleClick: false, instruction: "1. Sul calendario, clicca sul giorno <strong>15</strong> (è l'unico verde disponibile).", onComplete: function(){ document.getElementById('cal-day-15').style.background='#28a745'; document.getElementById('cal-day-15').style.color='white'; document.getElementById('time-slots').style.display='block'; } },
                            { type: "click", simType: "cup_calendar", targetId: "time-1130", isDoubleClick: false, instruction: "2. Sono comparsi gli orari sulla destra. Clicca sull'orario delle <strong>11:30</strong>.", onComplete: function(){ document.getElementById('time-1130').style.background='#0066CC'; document.getElementById('time-1130').style.color='white'; document.getElementById('btn-confirm-container').style.display='block'; } },
                            { type: "click", simType: "cup_calendar", targetId: "btn-confirm-book", isDoubleClick: false, instruction: "3. Perfetto. Ora clicca su <strong>Conferma</strong> in basso a destra per chiudere la pratica." }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "mod_22_manutenz", title: "Manutenzione", desc: "Pronto Soccorso per il tuo PC.", icon: "🔧",
        missions: [
            {
                id: "mis_manu_1", title: "Blocchi e Riavvi", desc: "Uscire dalle emergenze", xpReward: 140,
                exercises: [
                    { type: "info", title: "📌 Si è bloccato tutto!", text: "Un programma non risponde più. L'istinto è staccare la spina della corrente: SBAGLIATO! Rischieresti di rompere il computer.\n\nUsa il clic destro sulla barra in basso (Taskbar) per aprire 'Gestione Attività' e forzare la chiusura." },
                    { type: "sim_steps", instruction: "1. Il programma è bloccato. Fai <strong>clic destro</strong> sulla barra nera in basso (Taskbar).\n2. Scegli <strong>Gestione Attività</strong> dal menu.", simType: "win_frozen", targetId: "sim-taskbar", menuOptions: [{ label: "Mostra desktop", isCorrect: false }, { label: "Gestione Attività", isCorrect: true }] },
                    { type: "sim_multistep", instruction: "Ora forziamo la chiusura e puliamo la memoria con un riavvio vero e proprio.",
                      successMsg: "Bravissimo! Ora sai come uscire da un blocco totale senza danneggiare il PC.",
                      steps: [
                        { type: "click", simType: "task_manager", targetId: "btn-end-task", isDoubleClick: false, instruction: "1. Clicca su <strong>Termina attività</strong> per abbattere il programma ribelle." },
                        { type: "click", simType: "desktop", targetId: "btn-start", isDoubleClick: false, instruction: "2. Ora facciamo un riavvio pulito. Clicca sul tasto <strong>Start (⊞)</strong> in basso a sinistra." },
                        { type: "click", simType: "win_start", targetId: "btn-power", isDoubleClick: false, instruction: "3. Clicca sull'icona di <strong>Arresta/Accendi ⏻</strong>." },
                        { type: "click", simType: "win_start", targetId: "btn-restart", isDoubleClick: false, instruction: "4. Scegli <strong>Riavvia il sistema</strong>." }
                    ]}
                ]
            },
            {
                id: "mis_manu_2", title: "Pulizia Profonda", desc: "Spazio, file e chiavette", xpReward: 160,
                exercises: [
                    { type: "info", title: "📌 La discarica dei Download", text: "Il computer è pieno? La colpa spesso è della cartella 'Scaricati'.\n\nPer cancellare decine di file vecchi in un colpo solo, premi <strong>Ctrl + A</strong> sulla tastiera per 'Selezionare Tutto', e poi buttali via." },
                    { type: "sim_shortcut", instruction: "Sei nella cartella Scaricati. Premi <strong>Ctrl + A</strong> per selezionare tutti i file.", keys: ["control", "a"], displayKeys: ["Ctrl", "A"], simType: "explorer_downloads", successMsg: "Tutto selezionato!" },
                    { type: "sim_drag", instruction: "I file sono raggruppati e blu. Trascina il gruppo nel <strong>Cestino</strong> a sinistra per fare spazio.", simType: "explorer_downloads_selected", dragId: "files-group", dropId: "side-trash", preventAppend: true },
                    { type: "sim_steps", instruction: "Hai buttato i file, ma occupano ancora spazio nel cestino! Fai <strong>clic destro</strong> sul Cestino e scegli <strong>🗑️ Svuota cestino</strong>.", simType: "desktop_recycle", targetId: "icon-trash", menuOptions: [{ label: "Apri", isCorrect: false }, { label: "🗑️ Svuota cestino", isCorrect: true }] },
                    { type: "info", title: "📌 Estrarre la Chiavetta USB", text: "Togliere la chiavetta USB di colpo può bruciarla e farti perdere le foto. Bisogna sempre dire al PC di 'Espellerla' in sicurezza prima di staccarla." },
                    { type: "sim_steps", instruction: "Fai <strong>clic destro</strong> sul disco <strong>💾 USB (E:)</strong> e scegli <strong>⏏️ Espelli</strong>.", simType: "explorer_usb", targetId: "side-usb", menuOptions: [{ label: "Apri", isCorrect: false }, { label: "Formatta...", isCorrect: false }, { label: "⏏️ Espelli", isCorrect: true }] }
                ]
            },
            {
                id: "mis_manu_3", title: "Salute del Sistema", desc: "Internet, Antivirus e Update", xpReward: 150,
                exercises: [
                    { type: "info", title: "📌 Non va Internet!", text: "Se vedi la pagina di errore del browser (quella col dinosauro), niente panico. Spesso si è solo sganciato il Wi-Fi.\n\nControlla sempre l'icona del mappamondo o delle ondine in basso a destra nella barra delle applicazioni." },
                    { type: "sim_multistep", instruction: "Risolvi il problema di connessione.",
                      successMsg: "Connesso! Non serviva chiamare il tecnico.",
                      steps: [
                        { type: "click", simType: "wifi_error", targetId: "icon-wifi", isDoubleClick: false, instruction: "1. Clicca sull'icona del <strong>Mappamondo/Wi-Fi</strong> in basso a destra." },
                        { type: "click", simType: "wifi_menu", targetId: "wifi-network", isDoubleClick: false, instruction: "2. Clicca sulla tua rete <strong>Casa-WiFi</strong> per aprirla." },
                        { type: "click", simType: "wifi_menu", targetId: "btn-wifi-connect", isDoubleClick: false, instruction: "3. Clicca sul bottone <strong>Connetti</strong>." }
                    ]},
                    { type: "info", title: "📌 Il Tagliando al PC", text: "Windows Update e l'Antivirus sono il meccanico del tuo computer. Aggiornare ripara i buchi di sicurezza, l'antivirus controlla le infezioni. Fallo senza paura!" },
                    { type: "sim_multistep", instruction: "Fai la manutenzione di sicurezza base.",
                      successMsg: "Il tuo PC ti ringrazia: è aggiornato e protetto!",
                      steps: [
                        { type: "click", simType: "win_update", targetId: "btn-check-updates", isDoubleClick: false, instruction: "1. Nelle Impostazioni, clicca su <strong>Verifica disponibilità aggiornamenti</strong>." },
                        { type: "click", simType: "win_defender", targetId: "btn-quick-scan", isDoubleClick: false, instruction: "2. Nella Sicurezza, clicca su <strong>Scansione Veloce</strong> per far partire l'Antivirus." }
                    ]}
                ]
            },
            {
                id: "mis_manu_4", title: "Stampante e Backup", desc: "Sbloccare file e salvarsi la vita", xpReward: 160,
                exercises: [
                    { type: "info", title: "📌 La Stampante è Impazzita", text: "Hai mandato in stampa 10 volte lo stesso foglio e non esce nulla? Si è bloccata la 'Coda di Stampa'.\n\nNon spegnere la stampante e non picchiarla. Devi aprire la coda e 'Annullare' il file andato in errore." },
                    { type: "sim_steps", instruction: "Ecco la coda di stampa. Vedi il file rosso in errore? Fai <strong>clic destro</strong> su di esso e scegli <strong>✖ Annulla</strong> per sbloccare l'ingorgo.", simType: "print_queue", targetId: "print-doc-error", menuOptions: [{ label: "Pausa", isCorrect: false }, { label: "Riavvia", isCorrect: false }, { label: "✖ Annulla", isCorrect: true }] },
                    { type: "info", title: "📌 Il Vero Backup", text: "Salvare le cose su chiavetta non basta, si perdono facilmente. Usiamo il Cloud (Internet)!\n\nSalvare su Google Drive è facilissimo: basta prendere una cartella dal PC e TRASCINARLA dentro la finestra del sito web." },
                    { type: "sim_drag", instruction: "Fai il backup fisico! Trascina la cartella <strong>Lavoro</strong> dal Desktop fin dentro l'area tratteggiata di <strong>Google Drive</strong>.", simType: "drive_backup", dragId: "folder-lavoro", dropId: "drive-drop-zone", preventAppend: true }
                ]
            }
        ]
    },

    // ── MODULI AVANZATI (generati Claude) ───────────────────────

// ============================================================
//  MODULO 6 — LA TASTIERA COMPLETA ⌨️
// ============================================================
{
    id: "mod_tastiera", title: "La Tastiera", desc: "Scrivere, simboli speciali e scorciatoie.", icon: "⌨️",
    missions: [

        {
            id: "mis_tast_1", title: "Lettere e Chiocciole", desc: "Coordinazione tasti speciali per email", xpReward: 110,
            exercises: [
                {
                    type: "info", title: "📌 La Chiocciola @ e l'Euro €",
                    text: "Due simboli fondamentali:\n\n📧 @ (chiocciola) → indispensabile per le email (mario@gmail.com)\n   Su Windows: tieni premuto Alt Gr + premi il tasto 2\n\n💶 € (euro) → Alt Gr + tasto E\n\n⇧ Maiuscole: tieni Shift mentre premi la lettera.\n⌫ BACKSPACE → cancella il carattere a sinistra del cursore.\n↵ INVIO → va a capo o conferma."
                },
                {
                    type: "sim_keyboard",
                    instruction: "Scrivi esattamente: <strong>mario.rossi@gmail.com</strong>",
                    tip: "La @ si fa con Alt Gr + 2. Il punto ( . ) è sul tasto in basso a destra.",
                    expectedText: "mario.rossi@gmail.com",
                    successMsg: "Ottimo! Hai scritto la @ correttamente — ora sai digitare qualsiasi indirizzo email."
                }
            ]
        },

        {
            id: "mis_tast_2", title: "Simboli e URL Complessi", desc: "Gestione punteggiatura web", xpReward: 130,
            exercises: [
                {
                    type: "info", title: "📌 Scrivere un Indirizzo Web (URL)",
                    text: "Gli indirizzi web sono pieni di simboli:\n\n: (due punti) → Shift + .\n/ (barra) → tasto dedicato vicino al punto\n? (punto interrogativo) → Shift + ,\n+ (più) → Shift + tasto +\n\nEsempio: https://www.google.it/search?q=hacker+bob\n\nVai piano, carattere per carattere: con la pratica diventa automatico!"
                },
                {
                    type: "sim_type",
                    instruction: "Digita nella barra del browser: <strong>https://www.google.it/search?q=hacker+bob</strong>",
                    tip: "Procedi a blocchi: https: → // → www.google.it → /search?q=hacker+bob",
                    simType: "browser_search",
                    expectedText: "https://www.google.it/search?q=hacker+bob",
                    successMsg: "Eccellente! Hai scritto un URL completo con tutti i simboli speciali."
                }
            ]
        },

        {
            id: "mis_tast_3", title: "L'arte di Cancellare", desc: "Frecce, BACKSPACE e tasto CANC", xpReward: 120,
            exercises: [
                {
                    type: "info", title: "📌 CANC vs BACKSPACE: due tasti diversi",
                    text: "Ci sono DUE modi di cancellare:\n\n⌫ BACKSPACE → cancella il carattere a SINISTRA del cursore\n\nCANC (Delete) → cancella il carattere a DESTRA del cursore\n\nUsa le FRECCE ← → per spostare il cursore senza cancellare nulla.\n\nEsempio: hai scritto 'CUMMMMPUTER'. Posiziona il cursore dopo la CU, poi premi CANC tre volte per eliminare le M extra."
                },
                {
                    type: "sim_delete_fix",
                    instruction: "Il Blocco Note mostra <strong>CUMMMMPUTER</strong>. Correggilo in <strong>COMPUTER!</strong><br><em>Usa le frecce per posizionare il cursore, poi CANC per eliminare le M extra, poi scrivi il !</em>",
                    tip: "Il cursore parte dopo 'CUM'. Premi CANC tre volte per eliminare le 3 M extra, poi → fino alla fine e scrivi !",
                    simType: "text_editor_fix",
                    startText: "CUMMMMPUTER",
                    expectedText: "COMPUTER!",
                    cursorPos: 3,
                    successMsg: "Bravissimo! Hai corretto il testo usando frecce e CANC come un professionista."
                }
            ]
        },

        {
            id: "mis_tast_4", title: "Navigazione Ninja", desc: "Compilare moduli senza mouse", xpReward: 140,
            exercises: [
                {
                    type: "info", title: "📌 Il tasto TAB: il segreto dei moduli",
                    text: "Il tasto TAB (⇥) si trova a sinistra della tastiera, sopra il Blocco Maiusc.\n\nNei moduli:\n\n⇥ TAB → sposta il cursore al campo SUCCESSIVO\n⇧ Shift + TAB → torna al campo PRECEDENTE\n↵ INVIO → conferma e invia\n\nPiù veloce del mouse: non devi staccare le mani dalla tastiera."
                },
                {
                    type: "sim_tab_form",
                    instruction: "Compila il modulo usando solo <strong>TAB</strong> per passare da un campo all'altro. Premi <strong>INVIO</strong> o il pulsante Verifica per confermare.",
                    tip: "Scrivi il nome → TAB → cognome → TAB → città → INVIO.",
                    simType: "form_registration",
                    successMsg: "Perfetto! Modulo compilato senza toccare il mouse."
                }
            ]
        },

        {
            id: "mis_tast_5", title: "Selezione e Sostituzione", desc: "Ctrl+A per selezionare e sovrascrivere", xpReward: 130,
            exercises: [
                {
                    type: "info", title: "📌 Ctrl+A: Seleziona Tutto in un Colpo",
                    text: "Una delle scorciatoie più potenti:\n\nCtrl + A → seleziona TUTTO il testo nel campo attivo\n\nUna volta selezionato, qualsiasi tasto che premi SOSTITUISCE il testo in un colpo solo.\n\nEsempio: hai il corpo di una email sbagliato. Clicca dentro, premi Ctrl+A (diventa blu), poi inizia a scrivere il testo corretto."
                },
                {
                    type: "sim_select_overwrite",
                    instruction: "Il corpo dell'email è sbagliato. Premi <strong>Ctrl + A</strong> per selezionare tutto (diventa blu), poi scrivi <strong>OK</strong> per sostituirlo.",
                    tip: "Prima clicca nell'area testo, poi Ctrl+A, poi digita OK.",
                    simType: "email_overwrite",
                    expectedText: "OK",
                    successMsg: "Eccellente! Ctrl+A e poi digiti: la correzione più rapida che esista."
                }
            ]
        },

        {
            id: "mis_tast_6", title: "La Sfida dell'Impiegato Velocista", desc: "Correggi, naviga e accedi — solo con la tastiera", xpReward: 200,
            exercises: [
                {
                    type: "info", title: "📌 La Sfida Finale: come un vero impiegato",
                    text: "Metti insieme tutto quello che hai imparato:\n\n1️⃣ Userai CANC e le frecce per correggere un URL sbagliato nel browser\n\n2️⃣ Userai TAB per compilare il form di login senza toccare il mouse\n\nQueste sono le due azioni che un impiegato esperto fa decine di volte al giorno. Pronti?"
                },
                {
                    type: "sim_delete_fix",
                    instruction: "Qualcuno ha digitato male l'URL! Correggilo nella barra del browser: cambia <strong>wwww</strong> in <strong>www</strong> (c'è una W di troppo).<br><em>Usa BACKSPACE o CANC per eliminarla.</em>",
                    tip: "Il cursore parte subito dopo 'https://'. Premi → per arrivare alla W extra, poi BACKSPACE per eliminarla.",
                    simType: "browser_url_fix",
                    startText: "https://wwww.comune.it/login",
                    expectedText: "https://www.comune.it/login",
                    cursorPos: 12,
                    successMsg: "URL corretto! Ora accedi al portale con le credenziali usando solo TAB."
                },
                {
                    type: "sim_tab_form",
                    instruction: "URL corretto — il portale si è aperto! Fai il login usando solo la tastiera: <strong>TAB</strong> per passare da un campo all'altro, poi <strong>INVIO</strong> per accedere.",
                    tip: "Clicca o Tab nel primo campo → scrivi qualcosa → TAB → scrivi la password → INVIO.",
                    simType: "browser_login",
                    successMsg: "🏆 Sfida completata! Hai corretto un URL, navigato con CANC e fatto il login con TAB — zero mouse, produttività massima."
                }
            ]
        }

    ]
},

// ============================================================
//  MODULO 7 — WINDOWS IN PROFONDITÀ 🪟
// ============================================================
{
    id: "mod_windows", title: "Windows in Profondità", desc: "Gestire finestre, taskbar e allenare i riflessi.", icon: "🪟",
    missions: [

        // MISSIONE 1 — La Ricerca Istantanea
        {
            id: "mis_win_1", title: "La Ricerca Istantanea", desc: "Usare Start come motore di ricerca interno", xpReward: 110,
            exercises: [
                {
                    type: "info", title: "📌 Il Menu Start: il tuo Motore di Ricerca",
                    text: "Il pulsante Start (⊞) in basso a sinistra non serve solo ad aprire programmi: è un vero motore di ricerca per tutto il tuo PC.\n\nCome usarlo come pro:\n\n1. Clicca su ⊞ oppure premi il tasto ⊞ Win sulla tastiera\n2. Inizia a digitare il nome del programma, file o impostazione che cerchi\n3. I risultati appaiono in tempo reale mentre scrivi\n4. Premi INVIO o clicca il risultato per aprirlo\n\nEsempio: premi ⊞, digita 'calc' → appare la Calcolatrice. Zero clic nel menu, zero tempo perso."
                },
                {
                    type: "sim_search_click",
                    instruction: "Il menu Start è aperto. Digita <strong>calc</strong> nella barra di ricerca per trovare la Calcolatrice, poi <strong>clicca sull'icona</strong> che appare (o premi INVIO).",
                    tip: "Basta digitare le prime lettere: il risultato appare prima che finisci di scrivere.",
                    simType: "win_start_search",
                    searchText: "calc",
                    resultIcon: "🖩",
                    resultLabel: "Calcolatrice",
                    successMsg: "Calcolatrice aperta in 2 secondi! Ricorda: Start → digita → INVIO. Funziona per qualsiasi programma, file o impostazione."
                },
                {
                    type: "quiz",
                    q: "Devi aprire il Pannello di Controllo ma non sai dove si trova nel menu. Qual è il modo più veloce?",
                    options: [
                        "Clicco Start → cerco tra tutte le cartelle una per una",
                        "Premo ⊞ Win e digito 'pannello' — appare subito nei risultati",
                        "Riavvio il computer e spero che appaia"
                    ],
                    correctIdx: 1,
                    explanation: "Esatto! La ricerca Start trova qualsiasi cosa: programmi, file, impostazioni di sistema. È il modo più veloce per aprire qualsiasi cosa in Windows."
                }
            ]
        },

        // MISSIONE 2 — Snap Layouts (L'Ufficio Ordinato)
        {
            id: "mis_win_2", title: "Snap Layouts — L'Ufficio Ordinato", desc: "Multitasking a schermo diviso", xpReward: 130,
            exercises: [
                {
                    type: "info", title: "📌 Snap: due finestre affiancate senza fatica",
                    text: "Lavorare con una sola finestra alla volta è limitante. Windows ti permette di affiancare due programmi con il sistema Snap:\n\nMetodo 1 — Trascina al bordo:\n→ Trascina la finestra verso il bordo SINISTRO o DESTRO dello schermo\n→ Quando vedi l'anteprima di aggancio, rilascia\n→ Windows ti chiede quale altra finestra affiancare a destra\n\nMetodo 2 — Scorciatoia:\n→ ⊞ Win + ← affianca a sinistra\n→ ⊞ Win + → affianca a destra\n\nRisultato: due programmi visibili e utilizzabili contemporaneamente — perfetto per copiare dati da un'app all'altra."
                },
                {
                    type: "sim_drag",
                    instruction: "Trascina la finestra del <strong>Browser</strong> verso il <strong>bordo sinistro</strong> dello schermo per agganciarla a metà schermo.",
                    tip: "Prendi la finestra Browser e trascinala verso la striscia sul bordo sinistro. Quando la zona diventa visibile, rilascia.",
                    simType: "snap_layout_sim",
                    dragId: "win-browser",
                    dropId: "snap-left-zone",
                    successMsg: "Snap eseguito! Il Browser è ancorato a sinistra. Ora puoi affiancare un'altra finestra a destra."
                },
                {
                    type: "sim_click",
                    instruction: "Browser agganciato! Ora clicca sulla miniatura di <strong>Excel</strong> per affiancarlo a destra.",
                    tip: "Clicca sulla miniatura Excel nel pannello di destra.",
                    simType: "snap_layout_done",
                    targetId: "mini-excel",
                    isDoubleClick: false
                }
            ]
        },

        // MISSIONE 3 — Pinning Strategico
        {
            id: "mis_win_3", title: "Pinning Strategico", desc: "Personalizzare l'ambiente di lavoro", xpReward: 120,
            exercises: [
                {
                    type: "info", title: "📌 Fissare i Programmi nella Taskbar",
                    text: "La Taskbar (barra in basso) può diventare il tuo pannello di controllo personalizzato.\n\nCome fissare un programma:\n\n1. Clic DESTRO sull'icona del programma (sul Desktop o nel menu Start)\n2. Seleziona 'Aggiungi alla barra delle applicazioni' (o 'Aggiungi a Taskbar')\n3. L'icona apparirà permanentemente nella Taskbar\n\nCome rimuovere:\n→ Clic destro sull'icona nella Taskbar → 'Rimuovi dalla barra'\n\nPerché è utile: i programmi che usi ogni giorno (browser, email, cartelle) sono sempre a portata di un clic."
                },
                {
                    type: "sim_pinning",
                    instruction: "Fai <strong>clic destro</strong> sull'icona 🌐 Internet sul Desktop, poi seleziona <strong>'Aggiungi alla barra delle applicazioni'</strong>.",
                    tip: "Usa il tasto destro del mouse sull'icona del Desktop.",
                    simType: "taskbar_pinning",
                    instructionStep2: "Ottimo! 🌐 è ora fissato nella Taskbar. Clicca sull'icona <strong>🌐 in basso</strong> per aprire Internet.",
                    successMsg: "Perfetto! Hai personalizzato la tua Taskbar. Ora Internet è sempre a un clic di distanza."
                }
            ]
        },

        // MISSIONE 4 — Gestione Emergenze (Troubleshooting)
        {
            id: "mis_win_4", title: "Gestione Emergenze", desc: "Risolvere blocchi e gestire le prestazioni", xpReward: 160,
            exercises: [
                {
                    type: "info", title: "📌 Gestione Attività: il Pannello di Controllo dei Processi",
                    text: "Quando il PC rallenta o un programma si blocca, la Gestione Attività è la tua prima arma.\n\nCome aprirla:\n→ Clic destro sulla Taskbar → 'Gestione attività'\n→ Oppure: Ctrl + Shift + Esc (scorciatoia diretta)\n→ Oppure: Ctrl + Alt + Canc → Gestione attività\n\nCosa mostra:\n→ Tutti i programmi aperti e quanto CPU/RAM usano\n→ I processi in esecuzione in background\n→ Le prestazioni in tempo reale\n\nQuando un programma usa il 99% della CPU, il PC diventa lentissimo. La soluzione: trovarlo e terminarlo."
                },
                {
                    type: "sim_steps",
                    instruction: "Il PC è lentissimo! Fai <strong>clic destro sulla Taskbar</strong> per aprire il menu e scegliere Gestione Attività.",
                    tip: "Clic destro sulla barra nera in basso.",
                    simType: "win_frozen",
                    targetId: "sim-taskbar",
                    menuOptions: [
                        { label: "📊 Gestione attività", isCorrect: true },
                        { label: "⚙️ Impostazioni barra delle applicazioni", isCorrect: false },
                        { label: "🔍 Cerca", isCorrect: false }
                    ]
                },
                {
                    type: "sim_click",
                    instruction: "Sei nella Gestione Attività. Clicca sul pulsante <strong>Termina attività</strong> per chiudere il 'Programma Pesante' che usa il 99% della CPU.",
                    tip: "Il processo problematico è evidenziato in rosso in alto.",
                    simType: "task_manager_advanced",
                    targetId: "btn-end-task-adv",
                    isDoubleClick: false
                },
                {
                    type: "quiz",
                    q: "Il PC è lentissimo ma non si blocca completamente. Qual è la prima cosa da fare?",
                    options: [
                        "Spegnere il PC dalla presa di corrente immediatamente",
                        "Aprire Gestione Attività (Ctrl+Shift+Esc) e cercare il processo con CPU alta",
                        "Aspettare che si risolva da solo"
                    ],
                    correctIdx: 1,
                    explanation: "Giusto! Ctrl+Shift+Esc è la scorciatoia più veloce per la Gestione Attività. Ordina i processi per colonna CPU (clic sull'intestazione) e termina il colpevole. Lo spegnimento forzato è l'ultima risorsa — rischi di perdere file aperti."
                },

                // SFIDA FINALE — Controllo Totale
                {
                    type: "sim_multistep",
                    instruction: "Sfida finale: <strong>Controllo Totale</strong>. Esegui 4 azioni da manager del sistema.",
                    successMsg: "🏆 Controllo Totale completato! Hai usato la ricerca, gestito le finestre e messo in ordine il desktop come un professionista.",
                    steps: [
                        {
                            type: "type",
                            simType: "win_taskbar_search",
                            instruction: "1 di 4 — <strong>Cerca 'Lavoro'</strong> nella barra di ricerca della Taskbar, poi premi Verifica.",
                            expectedText: "Lavoro"
                        },
                        {
                            type: "drag",
                            simType: "snap_layout_sim",
                            instruction: "2 di 4 — <strong>Trascina il Browser</strong> verso il bordo sinistro per agganciarlo a metà schermo.",
                            draggableId: "win-browser",
                            dropZoneId: "snap-left-zone"
                        },
                        {
                            type: "click",
                            simType: "snap_layout_done",
                            instruction: "3 di 4 — Affianca <strong>Excel</strong> a destra: clicca sulla sua miniatura.",
                            targetId: "mini-excel",
                            isDoubleClick: false
                        },
                        {
                            type: "click",
                            simType: "snap_layout_with_show_btn",
                            instruction: "4 di 4 — Ottimo lavoro! Le finestre sono affiancate. Clicca la <strong>striscia a destra</strong> nella Taskbar per mostrare il Desktop e mettere tutto in ordine.",
                            targetId: "btn-show-desktop",
                            isDoubleClick: false
                        }
                    ]
                }
            ]
        }

    ]
},

// ============================================================
//  MODULO 20 — SICUREZZA AVANZATA: POPUP E PHISHING 🔐
// ============================================================
{
    id: "mod_sicurezza", title: "Sicurezza: Popup e Truffe", desc: "Riconoscere e neutralizzare popup, phishing e scareware.", icon: "🛡️",
    missions: [

        // MISSIONE 1 — La X Fantasma
        {
            id: "mis_sic_1", title: "La X Fantasma", desc: "Distinguere la vera X del browser dalle trappole", xpReward: 110,
            exercises: [
                {
                    type: "info", title: "📌 Non tutte le X sono uguali",
                    text: "Sui siti truffa, i popup usano un trucco visivo: mettono una X grande e colorata DENTRO il popup per farti credere di chiuderlo. Ma quella X fa parte del sito, non del browser.\n\nLe due X che vedrai:\n\n❌ X grande e rossa DENTRO il popup → appartiene al sito, cliccarla può avviare download o altro\n\n✅ X piccola e grigia nella BARRA del browser (in alto a destra) → questa è sempre sicura, chiude la scheda\n\nRegola d'oro: ignora tutto quello che c'è nella pagina. La X del browser è sempre nell'angolo della barra degli indirizzi, non dentro il contenuto."
                },
                {
                    type: "sim_fake_x",
                    instruction: "Un popup di \'aggiornamento\' ti blocca la pagina. Questa volta il popup ha due X: una gigante e rossa (trappola) e una <strong>piccola e sbiadita, nell\'angolo in alto a destra del riquadro bianco</strong>. Trova quella piccola e cliccala.",
                    tip: "Ignora la X grande e rossa dentro il popup — è una trappola. Cerca la X discreta nella barra del browser in alto.",
                    simType: "popup_fake_x",
                    errorFakeX: "Trappola! Questa X vistosa è una finta per farti cliccare per sbaglio. Cerca la X più piccola e discreta nell\'angolo in alto a destra del riquadro bianco.",
                    errorFakeBtn: "Non cliccare mai pulsanti dentro popup sospetti! Cerca la X piccola nella barra del browser in alto.",
                    successMsg: "Esatto! La X piccola e discreta nella barra del browser è l'unica sicura al 100%. Le X vistose dentro la pagina appartengono al sito, non al tuo sistema."
                },
                {
                    type: "quiz",
                    q: "Un popup mostra una grande X rossa nell'angolo in alto a destra del riquadro colorato. Cosa fai?",
                    options: [
                        "Clicco subito quella X rossa — è ovviamente il pulsante per chiudere",
                        "Ignoro quella X e cerco la piccola X grigia nella barra del mio browser in alto",
                        "Clicco su 'OK' per chiudere il popup nel modo corretto"
                    ],
                    correctIdx: 1,
                    explanation: "Giusto! La X dentro il riquadro appartiene al sito. Quella nella barra del browser (in alto, fuori dalla pagina) è sempre sotto il tuo controllo. Tutti gli altri elementi sono del sito e potrebbero essere trappole."
                }
            ]
        },

        // MISSIONE 2 — L'Urgenza Finta (Scareware)
        {
            id: "mis_sic_2", title: "L'Urgenza Finta — Scareware", desc: "Usare il Task Manager per uscire da un popup bloccante", xpReward: 130,
            exercises: [
                {
                    type: "info", title: "📌 Scareware: la paura come arma",
                    text: "Lo scareware è un tipo di truffa che mostra popup rossi o lampeggianti con messaggi allarmanti come 'VIRUS RILEVATO' o 'ACCESSO NON AUTORIZZATO' per spaventarti e farti chiamare un numero a pagamento.\n\nCosa NON fare mai:\n→ Non chiamare numeri di supporto da un popup\n→ Non inserire dati personali\n→ Non cliccare pulsanti dentro il popup\n\nCosa fare:\n1. Non farti prendere dal panico — è solo una pagina web\n2. Clic DESTRO sulla barra delle applicazioni (Taskbar)\n3. Seleziona 'Gestione attività'\n4. Trova il processo 'Browser' e clicca 'Termina attività'"
                },
                {
                    type: "sim_steps",
                    instruction: "Lo schermo è bloccato da un popup scareware! Fai <strong>clic destro sulla Taskbar</strong> in basso per aprire il menu di sistema.",
                    tip: "Il menu si apre con il tasto DESTRO del mouse sulla barra nera in fondo.",
                    simType: "popup_scareware_task",
                    targetId: "sim-taskbar",
                    menuOptions: [
                        { label: "📊 Gestione attività", isCorrect: true },
                        { label: "⚙️ Impostazioni barra delle applicazioni", isCorrect: false },
                        { label: "🔍 Cerca", isCorrect: false }
                    ]
                },
                {
                    type: "sim_multistep",
                    instruction: "Sei nella Gestione Attività. Come nella realtà, devi prima selezionare il processo e poi terminarlo.",
                    successMsg: "Ottimo! Processo terminato. Il browser si riavvierà pulito.",
                    steps: [
                        { type: "click", simType: "task_manager_scareware", targetId: "row-browser", isDoubleClick: false, instruction: "1. Clicca sulla riga del processo <strong>Browser (bloccato)</strong> per selezionarlo.", onComplete: function(){ document.getElementById('row-browser').style.background='#cce8ff'; document.getElementById('row-browser').style.borderLeft='4px solid #0078D4'; } },
                        { type: "click", simType: "task_manager_scareware", targetId: "btn-end-task", isDoubleClick: false, instruction: "2. Ora che è selezionato, clicca sul pulsante <strong>Termina attività</strong>." }
                    ]
                }
            ]
        },

        // MISSIONE 3 — Il Link Mascherato
        {
            id: "mis_sic_3", title: "Il Link Mascherato", desc: "Analizzare l'URL per riconoscere il phishing", xpReward: 120,
            exercises: [
                {
                    type: "info", title: "📌 L'URL non mente — se sai leggerlo",
                    text: "Il phishing è una tecnica che crea siti identici a quelli reali (banche, poste, Amazon) ma con un URL leggermente diverso.\n\nCome leggere un URL:\n→ Guarda SEMPRE la barra degli indirizzi prima di inserire dati\n→ Il dominio reale è la parte PRIMA del primo / dopo il https://\n\nEsempi di URL falsi:\n❌ www.p0ste.it (zero al posto della o)\n❌ poste-italiane.security-login.com (il vero dominio è security-login.com, non poste)\n❌ amazon-sicurezza.it (amazon è solo una parola, il dominio è diverso)\n\nCosa fare quando vedi un URL sospetto:\n→ NON inserire nessun dato\n→ Chiudi la scheda immediatamente cliccando sulla X nella linguetta (tab) in alto"
                },
                {
                    type: "sim_click",
                    instruction: "Hai aperto per sbaglio un sito che si finge Poste Italiane! Nota l'URL nella barra: <strong>www.p0ste.it</strong> (con uno zero invece della O). Chiudi subito la scheda cliccando sulla <strong>X nella linguetta</strong> in alto.",
                    tip: "La X di chiusura della scheda è la piccola ✕ dentro il tab (linguetta) in cima, non nella barra del browser.",
                    simType: "phishing_url_check",
                    targetId: "tab-close-x",
                    isDoubleClick: false,
                    successMsg: "Perfetto! Hai notato la truffa nell'URL (zero al posto della O) e chiuso la scheda prima di inserire qualsiasi dato. Questo ti ha salvato da un furto di credenziali."
                },
                {
                    type: "quiz",
                    q: "Quale di questi URL è quello autentico di Poste Italiane?",
                    options: [
                        "www.p0ste.it",
                        "poste-italiane-accesso.com",
                        "www.poste.it"
                    ],
                    correctIdx: 2,
                    explanation: "Solo www.poste.it è il dominio ufficiale. 'p0ste.it' usa uno zero invece della O. 'poste-italiane-accesso.com' sembra plausibile ma il dominio reale sarebbe .it, non .com. Controlla sempre attentamente ogni carattere nell'URL prima di inserire password o dati bancari."
                }
            ]
        },

        // MISSIONE 4 — Difesa Finale (Scheda Bloccata)
        {
            id: "mis_sic_4", title: "Difesa Finale — Scheda Bloccata", desc: "Uscire da un sito che manipola il cursore", xpReward: 160,
            exercises: [
                {
                    type: "info", title: "📌 Quando il sito blocca il mouse",
                    text: "Alcuni siti malevoli usano JavaScript per rendere difficile chiudere i popup: li spostano quando ci avvicini col mouse, cambiano il cursore, o mostrano decine di alert di fila.\n\nQueste tecniche si chiamano 'cursor hijacking' e 'dialog loop'.\n\nCosa fare:\n\n1. Non farti prendere dall'ansia — nessun sito può DAVVERO bloccare il tuo PC\n2. Ignora QUALSIASI pulsante dentro la pagina\n3. Cerca la X nella cornice della finestra del browser (quella della barra del titolo del sistema operativo, in alto a destra)\n4. Se anche quella è bloccata: Ctrl+W chiude la scheda attiva, Alt+F4 chiude la finestra\n\nRicorda: la pagina può modificare solo ciò che sta dentro il browser. Il sistema operativo è sempre fuori dalla sua portata."
                },
                {
                    type: "sim_escape",
                    instruction: "Un sito malevolo mostra un popup che si sposta quando avvicini il mouse. Non cliccare nulla dentro la pagina! Chiudi il browser cliccando sulla <strong>X nella barra del titolo in cima</strong> (quella della cornice di sistema).",
                    tip: "Ignora il popup che si muove. La X che ti serve è nella barra grigia in CIMA alla finestra — fuori dalla pagina web.",
                    simType: "popup_infinite_escape",
                    errorTech: "Non chiamare mai numeri da un popup! Sono sempre truffe. La X di sistema in cima è la tua via d'uscita.",
                    errorFakeClose: "Quel pulsante non fa nulla di buono. Usa la X nella barra grigia del titolo in cima alla finestra.",
                    successMsg: "🏆 Difesa completata! Hai ignorato le trappole e usato la X di sistema — l'unica che nessun sito può bloccare. Ora sei pronto ad affrontare qualsiasi tentativo di manipolazione del browser."
                },
                {
                    type: "quiz",
                    q: "Un sito sposta il popup ogni volta che ci provi a cliccare la X. Qual è la strategia corretta?",
                    options: [
                        "Insisto a cliccare la X dentro il popup finché non ci riesco",
                        "Chiamo il numero di supporto mostrato nel popup per chiedere aiuto",
                        "Uso Ctrl+W o clicco la X nella barra del titolo del browser, fuori dalla pagina"
                    ],
                    correctIdx: 2,
                    explanation: "Esatto! Ctrl+W chiude la scheda attiva indipendentemente da quello che fa il sito. Alt+F4 chiude l'intera finestra del browser. Queste azioni avvengono a livello di sistema operativo — nessuno script web può bloccarle."
                }
            ]
        }

    ]
},

// ============================================================
//  MODULO 23 — ALLENAMENTO RIFLESSI 🎯
// ============================================================
{
    id: "mod_riflessi", title: "Allenamento Riflessi", desc: "Velocità, precisione e padronanza del mouse.", icon: "🎯",
    missions: [

        // MISSIONE 1 — Allenamento base
        {
            id: "mis_rift_1", title: "Livello Principiante", desc: "Allena l'occhio e il clic", xpReward: 80,
            exercises: [
                {
                    type: "info", title: "🎯 Perché Allenarsi col Mouse?",
                    text: "La precisione col mouse è come la calligrafia: si impara con la pratica.\n\nOgni volta che clicchi su un bersaglio piccolo e veloce, il tuo cervello costruisce un'abitudine muscolare.\n\nDopo qualche settimana di allenamento noterai:\n✅ Meno fatica a cliccare sui pulsanti giusti\n✅ Meno errori di clic (click sull'elemento sbagliato)\n✅ Più velocità nel navigare\n\nQuesta sessione ha 3 livelli di difficoltà crescente. Vai al tuo ritmo!"
                },
                {
                    type: "sim_game",
                    instruction: "🟢 <strong>Livello 1 — Facile</strong>\nI cerchi sono grandi e rimangono a lungo. Colpiscine <strong>5 in 40 secondi</strong>.",
                    neededHits: 5,
                    duration: 40,
                    successMsg: "Primo livello superato! Stai prendendo la mira."
                },
                {
                    type: "info", title: "💪 Bene! Aumentiamo la difficoltà",
                    text: "Ottimo lavoro sul primo livello!\n\nOra i cerchi saranno un po' più piccoli e dureranno meno.\n\nConsigli per migliorare:\n• Muovi il mouse lentamente verso il bersaglio anziché a scatti\n• Aspetta un attimo prima di cliccare — la precisione vale più della velocità\n• Tieni il polso appoggiato sul tavolo per un movimento più stabile\n\nPronte le dita?"
                },
                {
                    type: "sim_game",
                    instruction: "🟡 <strong>Livello 2 — Medio</strong>\nI cerchi spariscono più in fretta. Colpiscine <strong>6 in 30 secondi</strong>.",
                    neededHits: 6,
                    duration: 30,
                    successMsg: "Secondo livello superato! La tua precisione migliora."
                },
                {
                    type: "quiz", q: "Dopo aver cliccato per sbaglio sull'elemento sbagliato, cosa ti aiuta di più a migliorare?",
                    options: ["Smettere di usare il mouse per un po'", "Continuare ad allenarsi — la precisione migliora con la pratica costante", "Comprare un nuovo mouse più costoso"],
                    correctIdx: 1,
                    explanation: "Esatto! Come per qualsiasi abilità manuale, la pratica regolare è la chiave. Il tuo cervello si adatta e il movimento diventa sempre più automatico e preciso."
                },
                {
                    type: "sim_game",
                    instruction: "🔴 <strong>Livello 3 — Difficile</strong>\nI bersagli sono veloci e piccoli. Colpiscine <strong>8 in 30 secondi</strong>. Sfidati!",
                    neededHits: 8,
                    duration: 30,
                    successMsg: "Tutti e 3 i livelli completati! Sei ufficialmente promosso: riflessi da utente esperto. 🏆"
                }
            ]
        },

        // MISSIONE 2 — Allenamento avanzato
        {
            id: "mis_rift_2", title: "Campionato del Mouse", desc: "Sfida i tuoi limiti con bersagli veloci", xpReward: 150,
            exercises: [
                {
                    type: "info", title: "🏆 Campionato del Mouse",
                    text: "Questa missione è la più difficile del modulo.\n\nL'obiettivo non è solo cliccare veloce — è cliccare con PRECISIONE anche sotto pressione.\n\nTe lo proponiamo in 3 round. Tra un round e l'altro ti daremo un breve riposo.\n\nRicorda: è normale non riuscire al primo tentativo. Ogni ripetizione ti rende più bravo.\n\nForza!"
                },
                {
                    type: "sim_game",
                    instruction: "🏆 <strong>Round 1 — Riscaldamento</strong>\nColpisci <strong>7 bersagli in 30 secondi</strong>.",
                    neededHits: 7,
                    duration: 30,
                    successMsg: "Round 1 completato! Ottimo riscaldamento."
                },
                {
                    type: "sim_game",
                    instruction: "🏆 <strong>Round 2 — Sprint</strong>\nI bersagli durano solo 1.5 secondi. Colpiscine <strong>8 in 25 secondi</strong>!",
                    neededHits: 8,
                    duration: 25,
                    successMsg: "Round 2 superato! I tuoi riflessi sono in forma."
                },
                {
                    type: "quiz", q: "Quale tecnica ti aiuta di più a cliccare con precisione su elementi piccoli?",
                    options: ["Muovere il mouse velocissimo a scatti verso il bersaglio", "Avvicinarsi lentamente al bersaglio e aspettare un istante prima di cliccare", "Usare il touchpad invece del mouse"],
                    correctIdx: 1,
                    explanation: "Corretto! La velocità non è tutto — la precisione viene dall'approccio controllato. Avvicinati lentamente, stabilizza il mouse sul bersaglio, poi clicca. Il cervello impara questo pattern automaticamente con la pratica."
                },
                {
                    type: "sim_game",
                    instruction: "🏆 <strong>Round 3 — Finale del Campionato!</strong>\nL'ultima sfida: <strong>10 bersagli in 35 secondi</strong>. Ce la fai?",
                    neededHits: 10,
                    duration: 35,
                    successMsg: "🏆 CAMPIONE DEL MOUSE! Hai completato tutti e 3 i round. I tuoi riflessi sono quelli di un utente esperto. Da oggi, il mouse è una vera estensione della tua mano."
                }
            ]
        },
        {
            id: "mis_rift_3", title: "Tecniche Avanzate", desc: "Casseforti, bersagli mobili e caos.", xpReward: 180,
            exercises: [
                { type: "info", title: "Round 1: Le Casseforti 🔒", text: "Alcuni bersagli hanno un lucchetto e un bordo tratteggiato. Richiedono un DOPPIO CLIC VELOCE per essere distrutti." },
                { type: "sim_game", instruction: "Distruggi 8 casseforti in 30 secondi.", neededHits: 8, duration: 30, opts: { armored: true, mix: false }, successMsg: "Ottimo! Hai padroneggiato il doppio clic sul bersaglio." },
                { type: "info", title: "Round 2: Bersagli Sfuggenti 🛸", text: "Niente doppio clic ora. I bersagli si muovono sullo schermo. Inseguili con calma." },
                { type: "sim_game", instruction: "Colpisci 8 bersagli mobili in 30 secondi.", neededHits: 8, duration: 30, opts: { moving: true, mix: false, speed: 1 }, successMsg: "Presi tutti! Ottimo tracking." },
                { type: "info", title: "Round 3: Caos Controllato 🌪️", text: "Mettiamo tutto insieme: troverai casseforti ferme, bersagli mobili e bersagli normali. Riconoscili al volo!" },
                { type: "sim_game", instruction: "Sopravvivi al caos: 10 bersagli in 35 secondi.", neededHits: 10, duration: 35, opts: { armored: true, moving: true, mix: true, speed: 2 }, successMsg: "Incredibile. Sei pronto per il boss finale." }
            ]
        },
        {
            id: "mis_rift_4", title: "La Zanzara Corazzata", desc: "Il boss finale in 5 fasi.", xpReward: 300,
            exercises: [
                { type: "info", title: "Il Boss Finale 🦟", text: "Questa è la prova definitiva. Affronterai bersagli che SI MUOVONO e richiedono un DOPPIO CLIC. La velocità aumenterà per 5 livelli consecutivi. Buona fortuna." },
                { type: "sim_game", instruction: "Fase 1: Riscaldamento (Velocità 1). Colpisci 6 bersagli.", neededHits: 6, duration: 25, opts: { armored: true, moving: true, mix: true, speed: 1 }, successMsg: "Fase 1 completata. Troppo facile?" },
                { type: "sim_game", instruction: "Fase 2: Accelerazione (Velocità 2). Colpisci 8 bersagli.", neededHits: 8, duration: 30, opts: { armored: true, moving: true, mix: true, speed: 2 }, successMsg: "Fase 2 superata. Stiamo scaldando i motori." },
                { type: "sim_game", instruction: "Fase 3: Nervi saldi (Velocità 3). Colpisci 10 bersagli.", neededHits: 10, duration: 35, opts: { armored: true, moving: true, mix: true, speed: 3 }, successMsg: "Fase 3 andata! Riflessi eccellenti." },
                { type: "sim_game", instruction: "Fase 4: Frenesia (Velocità 4). Colpisci 12 bersagli.", neededHits: 12, duration: 40, opts: { armored: true, moving: true, mix: true, speed: 4 }, successMsg: "Fase 4 completata!! Manca solo l'ultima." },
                { type: "sim_game", instruction: "Fase 5: LA ZANZARA (Velocità Massima). Colpisci 15 bersagli.", neededHits: 15, duration: 45, opts: { armored: true, moving: true, mix: true, speed: 5 }, successMsg: "🏆 CLAMOROSO! Hai sconfitto la Zanzara Corazzata. Sei il dominatore assoluto del mouse!" }
            ]
        }
    ]
},

// ============================================================
//  MODULO 24 — SCENARIO FINALE: UNA GIORNATA AL PC 🌟
// ============================================================
{
    id: "mod_finale", title: "Il Gauntlet Digitale", desc: "Scenario finale: sopravvivi alla giornata lavorativa.", icon: "🌟",
    missions: [
        {
            id: "mis_fin_1", title: "Livello 1: Risveglio Tecnico", desc: "Gestione delle emergenze di sistema", xpReward: 100,
            exercises: [
                { type: "info", title: "Livello 1", text: "Inizia la giornata, ma il computer fa i capricci fin dal primo clic." },
                {
                    type: "sim_multistep", instruction: "Forza la chiusura del browser bloccato e ripristina la rete.", successMsg: "Emergenza rientrata! Passiamo alle pratiche.",
                    steps: [
                        { type: "steps", simType: "browser_frozen", targetId: "sim-taskbar", menuOptions: [{label:"Gestione Attività", isCorrect:true}], instruction: "1. Il browser è bloccato. Fai <strong>clic destro sulla barra in basso</strong> e apri <strong>Gestione Attività</strong>." },
                        { type: "click", simType: "task_manager", targetId: "btn-end-task", isDoubleClick: false, instruction: "2. Clicca su <strong>Termina attività</strong> per chiuderlo." },
                        { type: "click", simType: "desktop", targetId: "icon-browser", isDoubleClick: true, instruction: "3. Riapri il <strong>Browser</strong> dal Desktop con doppio clic." },
                        { type: "click", simType: "desktop_wifi_dino", targetId: "icon-wifi", isDoubleClick: false, instruction: "4. Dinosauro! Clicca l'icona del <strong>Mappamondo</strong> nella barra in basso." },
                        { type: "click", simType: "wifi_menu", targetId: "wifi-network", isDoubleClick: false, instruction: "5. Clicca sulla rete <strong>Casa-WiFi</strong>." },
                        { type: "click", simType: "wifi_menu", targetId: "btn-wifi-connect", isDoubleClick: false, instruction: "6. Clicca su <strong>Connetti</strong>." }
                    ]
                }
            ]
        },
        {
            id: "mis_fin_2", title: "Livello 2: Pratica Amministrativa", desc: "Scarica un referto senza farti distrarre", xpReward: 120,
            exercises: [
                { type: "info", title: "Livello 2", text: "Devi scaricare le tue analisi del sangue. Attento a non sbagliare file!" },
                {
                    type: "sim_multistep", instruction: "Accedi con SPID e salva il documento giusto.", successMsg: "Referto scaricato nella cartella corretta.",
                    steps: [
                        { type: "click", simType: "spid_sim", targetId: "btn-spid-main", isDoubleClick: false, instruction: "1. Clicca <strong>Accedi con SPID</strong>.", onComplete: function(){ document.getElementById('spid-step-1').style.display='none'; document.getElementById('spid-step-2').style.display='block'; } },
                        { type: "click", simType: "spid_sim", targetId: "btn-provider-poste", isDoubleClick: false, instruction: "2. Scegli il provider <strong>PosteID</strong>.", onComplete: function(){ document.getElementById('spid-step-2').style.display='none'; document.getElementById('spid-step-3').style.display='block'; } },
                        { type: "type", simType: "spid_sim", expectedText: "mario.rossi", instruction: "3. Digita il nome utente <strong>mario.rossi</strong> e premi Invio." },
                        { type: "click", simType: "health_sim_multi", targetId: "btn-dl-analisi", isDoubleClick: false, instruction: "4. Cerca bene... clicca <strong>Scarica</strong> SOLO accanto a <strong>Analisi_Sangue.pdf</strong>." },
                        { type: "click", simType: "save_as_dialog", targetId: "side-docs-save", isDoubleClick: false, instruction: "5. Seleziona la cartella <strong>Documenti</strong> a sinistra.", onComplete: function(){ document.getElementById('side-docs-save').style.background='#cce8ff'; document.getElementById('side-docs-save').style.fontWeight='bold'; } },
                        { type: "click", simType: "save_as_dialog", targetId: "btn-save-confirm", isDoubleClick: false, instruction: "6. Clicca su <strong>Salva</strong>." }
                    ]
                }
            ]
        },
        {
            id: "mis_fin_3", title: "Livello 3: L'Impiegato Multitasking", desc: "Zip, finestre affiancate e copia-incolla", xpReward: 160,
            exercises: [
                { type: "info", title: "Livello 3", text: "Flusso di lavoro completo: scarica, estrai, affianca, copia e somma." },
                {
                    type: "sim_multistep", instruction: "Gestisci l'archivio ZIP ed elabora i dati in Excel.", successMsg: "Un flusso di lavoro perfetto da vero professionista.",
                    steps: [
                        { type: "click", simType: "email_zip", targetId: "btn-dl-zip", isDoubleClick: false, instruction: "1. Scarica l'allegato <strong>Spese.zip</strong> dall'email." },
                        { type: "click", simType: "save_as_dialog", targetId: "side-docs-save", isDoubleClick: false, instruction: "2. Salvalo in <strong>Documenti</strong>.", onComplete: function(){ document.getElementById('side-docs-save').style.background='#cce8ff'; document.getElementById('side-docs-save').style.fontWeight='bold'; } },
                        { type: "click", simType: "save_as_dialog", targetId: "btn-save-confirm", isDoubleClick: false, instruction: "3. Conferma con <strong>Salva</strong>." },
                        { type: "click", simType: "desktop", targetId: "icon-taskbar-explorer", isDoubleClick: false, instruction: "4. Apri l'<strong>Esplora File</strong> dalla taskbar in basso." },
                        { type: "steps", simType: "explorer_docs_extract", targetId: "file-spese-zip", menuOptions: [{label:"Estrai tutto...", isCorrect:true}], instruction: "5. Sei in Documenti. Fai <strong>clic destro su Spese.zip</strong> e scegli <strong>Estrai tutto...</strong>" },
                        { type: "drag", simType: "snap_pdf_excel", draggableId: "win-pdf", dropZoneId: "snap-left-zone", instruction: "6. Ho aperto per te il PDF e Excel estratti. Usa lo <strong>Snap Layout</strong>: trascina il <strong>PDF contro il bordo sinistro</strong>." },
                        { type: "click", simType: "snap_layout_done", targetId: "mini-excel", isDoubleClick: false, instruction: "7. Clicca sulla miniatura di <strong>Excel</strong> per affiancarlo a destra." },
                        { type: "shortcut", simType: "pdf_excel_workspace", keys: ["control", "c"], instruction: "8. Nel PDF a sinistra, seleziona l'importo 150,00 (cliccaci) e premi <strong>Ctrl + C</strong> per copiarlo.", onComplete: function() { document.getElementById('pdf-amount').style.background='#b3d4ff'; } },
                        { type: "shortcut", simType: "pdf_excel_workspace", keys: ["control", "v"], instruction: "9. Clicca nel campo vuoto di Excel a destra e premi <strong>Ctrl + V</strong> per incollare.", onComplete: function() { document.getElementById('sim-typing-field').value = '150,00'; } },
                        { type: "click", simType: "pdf_excel_workspace", targetId: "btn-autosum", isDoubleClick: false, instruction: "10. Clicca sul tasto <strong>Σ Somma</strong> in Excel per calcolare il totale.", onComplete: function() { document.getElementById('excel-total').innerText = '450,00 €'; document.getElementById('excel-total').style.color = '#107c41'; } }
                    ]
                }
            ]
        },
        {
            id: "mis_fin_4", title: "Livello 4: Sotto Attacco", desc: "Riconoscere truffe e virus fasulli", xpReward: 140,
            exercises: [
                { type: "info", title: "Livello 4", text: "Mantenere il sangue freddo davanti a link falsi e popup spaventosi." },
                {
                    type: "sim_multistep", instruction: "Difenditi dalle minacce bloccando i pericoli sul nascere.", successMsg: "Bravissimo. Freddezza e precisione, nessun virus è entrato.",
                    steps: [
                        { type: "click", simType: "browser_bancadeiladri", targetId: "tab-close-x", isDoubleClick: false, instruction: "1. Guarda l'URL! È un finto sito della banca (bancadeiladri.it). Chiudilo subito cliccando la <strong>X della scheda</strong> in alto." },
                        { type: "click", simType: "popup_infinite_escape", targetId: "system-close-x", isDoubleClick: false, instruction: "2. Si è aperta una trappola Scareware a tutto schermo! Ignora i finti pulsanti e clicca <strong>la X di sistema in alto a destra</strong>." },
                        { type: "click", simType: "defender_desktop", targetId: "icon-defender", isDoubleClick: true, instruction: "3. Sei salvo sul desktop. Fai doppio clic sull'icona <strong>Sicurezza</strong> per un controllo." },
                        { type: "click", simType: "win_defender", targetId: "btn-quick-scan", isDoubleClick: false, instruction: "4. Lancia una <strong>Scansione Veloce</strong>." }
                    ]
                }
            ]
        },
        {
            id: "mis_fin_5", title: "Livello 5: Il Capolavoro Digitale", desc: "Pagamenti e Cloud, l'esame finale.", xpReward: 250,
            exercises: [
                { type: "info", title: "Livello 5", text: "L'ultimo ostacolo: pagare una multa, usare TAB, salvare in locale e fare il backup sul cloud. Mostra chi comanda." },
                {
                    type: "sim_multistep", instruction: "Paga la multa, scarica la ricevuta e pulisci il computer.", successMsg: "🏆 CERTIFICATO! Hai completato l'intero percorso di Hacker Bob. Da semplice utente a esperto digitale autonomo. Bob ti consegna il diploma virtuale — ora insegna ad altri! 🎉",
                    steps: [
                        { type: "shortcut", simType: "pagopa_multa", keys: ["control", "c"], instruction: "1. Apri la multa. Clicca sul lunghissimo codice IUV e premi <strong>Ctrl + C</strong> per copiarlo.", onComplete: function() { document.getElementById('iuv-code').style.background='#b3d4ff'; } },
                        { type: "shortcut", simType: "pagopa_form_tab", keys: ["control", "v"], instruction: "2. Sei sul portale pagamenti. Usa <strong>TAB</strong> per scorrere i campi Nome, Cognome, Email. Arrivato al campo Codice IUV, premi <strong>Ctrl + V</strong>.", onComplete: function() { document.getElementById('sim-typing-field').value = '098765432109876543'; } },
                        { type: "click", simType: "pagopa_form_tab", targetId: "btn-paga", isDoubleClick: false, instruction: "3. Clicca su <strong>Paga Ora</strong>." },
                        { type: "click", simType: "download_ricevuta", targetId: "btn-dl-ricevuta", isDoubleClick: false, instruction: "4. Pagamento riuscito! Clicca su <strong>Scarica Ricevuta</strong>." },
                        { type: "click", simType: "save_as_dialog", targetId: "side-docs-save", isDoubleClick: false, instruction: "5. Seleziona la cartella <strong>Documenti</strong>.", onComplete: function(){ document.getElementById('side-docs-save').style.background='#cce8ff'; document.getElementById('side-docs-save').style.fontWeight='bold'; } },
                        { type: "click", simType: "save_as_dialog", targetId: "btn-save-confirm", isDoubleClick: false, instruction: "6. Conferma il <strong>Salvataggio</strong>." },
                        { type: "drag", simType: "side_by_side_drive", draggableId: "file-ricevuta-drag", dropZoneId: "drive-drop-zone", instruction: "7. Le finestre sono già affiancate. Fai il backup: trascina la ricevuta da Documenti a <strong>Google Drive</strong>." },
                        { type: "drag", simType: "desktop_multa_recycle", draggableId: "file-multa-desk", dropZoneId: "icon-trash", instruction: "8. Quasi finito. Trascina la Multa dal Desktop nel <strong>Cestino</strong>." },
                        { type: "steps", simType: "desktop_recycle", targetId: "icon-trash", menuOptions: [{label:"🗑️ Svuota cestino", isCorrect:true}], instruction: "9. Fai <strong>clic destro sul Cestino</strong> e scegli <strong>Svuota cestino</strong> per chiudere la giornata." }
                    ]
                }
            ]
        }
    ]
}
];