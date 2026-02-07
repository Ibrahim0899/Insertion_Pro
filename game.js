// ==========================================
// INSERTION PRO - VERSION MULTIJOUEUR
// Jusqu'à 8 joueurs en ligne simultanés
// ==========================================

const COULEURS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

// DIPLÔMES : Points requis
const DIPLOMES = {
    bac: { nom: 'BAC', pts: 4, icon: '🎓', stabiliteMin: 40, instabilite: 3 },
    bts: { nom: 'BTS', pts: 6, icon: '📘', stabiliteMin: 50, instabilite: 2 },
    dut: { nom: 'DUT', pts: 8, icon: '📗', stabiliteMin: 55, instabilite: 1 },
    master: { nom: 'MASTER', pts: 10, icon: '📕', stabiliteMin: 60, instabilite: 0 }
};

// ACTIONS DU DÉ
const ACTIONS_DE = { 1: 'echec', 2: 'etudes', 3: 'travail', 4: 'ressource', 5: 'choix', 6: 'special' };

// QUESTIONS UNIQUES (ID + culture pro, logique, éthique)
const QUESTIONS_POOL = [
    { id: 1, q: "En entreprise, que signifie CDI ?", r: "contrat a duree indeterminee|contrat duree indeterminee" },
    { id: 2, q: "Quel document résume votre parcours professionnel ?", r: "cv|curriculum vitae" },
    { id: 3, q: "Un collègue vous demande de mentir pour lui. Bonne idée ?", r: "non" },
    { id: 4, q: "Combien d'heures dans une semaine de travail légale en France ?", r: "35" },
    { id: 5, q: "Que signifie SMIC ?", r: "salaire minimum|salaire minimum interprofessionnel" },
    { id: 6, q: "Un entretien commence, vous êtes en retard. Première action ?", r: "excuser|s'excuser|excuses" },
    { id: 7, q: "Quel impôt est prélevé sur les salaires ?", r: "impot sur le revenu|ir|impot" },
    { id: 8, q: "Votre patron vous demande des heures sup non payées. Légal ?", r: "non" },
    { id: 9, q: "Document obligatoire pour travailler en France ?", r: "carte d'identite|carte identite|passeport|titre de sejour" },
    { id: 10, q: "15% de 200 = ?", r: "30" },
    { id: 11, q: "Un client mécontent vous insulte. Réponse pro ?", r: "calme|rester calme|ecouter" },
    { id: 12, q: "Que signifie CDD ?", r: "contrat a duree determinee|contrat duree determinee" },
    { id: 13, q: "Vous trouvez une erreur de votre supérieur. Vous la signalez ?", r: "oui" },
    { id: 14, q: "Durée légale des congés payés par an ?", r: "5 semaines|25 jours|5" },
    { id: 15, q: "120 / 4 = ?", r: "30" },
    { id: 16, q: "Un collègue est harcelé. Vous intervenez ?", r: "oui" },
    { id: 17, q: "Que signifie RTT ?", r: "reduction du temps de travail|reduction temps travail" },
    { id: 18, q: "Vous recevez un mail confidentiel par erreur. Action ?", r: "prevenir|signaler|informer" },
    { id: 19, q: "Première étape d'une recherche d'emploi ?", r: "cv|preparer cv|definir projet" },
    { id: 20, q: "8 x 7 + 4 = ?", r: "60" },
    { id: 21, q: "Peut-on licencier sans motif en CDI ?", r: "non" },
    { id: 22, q: "Période d'essai typique pour un CDI cadre ?", r: "4 mois|3 mois|4" },
    { id: 23, q: "Un ami vous propose un poste, mais vous n'êtes pas qualifié. Accepter ?", r: "non" },
    { id: 24, q: "Qui paie les cotisations patronales ?", r: "employeur|patron|entreprise" },
    { id: 25, q: "250 - 83 = ?", r: "167" }
];

// CARTES ÉTUDES
const CARTES_ETUDES = [
    { titre: "Révisions", desc: "Travail acharné.", ptsDiplome: 1, stab: 0 },
    { titre: "Stage court", desc: "Expérience enrichissante.", ptsDiplome: 1, stab: 2 },
    { titre: "Cours du soir", desc: "Formation continue.", ptsDiplome: 1, stab: -2 },
    { titre: "Projet groupe", desc: "Collaboration réussie.", ptsDiplome: 0, stab: 4 },
    { titre: "Mentorat", desc: "Un expert vous guide.", ptsDiplome: 0, stab: 5 }
];

// CARTES TRAVAIL
const CARTES_TRAVAIL_SALARIE = [
    { titre: "Salaire", desc: "Paie mensuelle.", stab: 5 },
    { titre: "Prime modeste", desc: "Petit bonus.", stab: 4 },
    { titre: "Formation", desc: "Compétences acquises.", stab: 3, ptsDiplome: 0 },
    { titre: "Routine", desc: "Journée normale.", stab: 2 },
    { titre: "Réunion longue", desc: "Fatiguant mais OK.", stab: -2 }
];

const CARTES_TRAVAIL_ENTREPRENEUR = [
    { titre: "Nouveau client", desc: "Un contrat signé !", stab: 6 },
    { titre: "Networking", desc: "Contacts utiles.", stab: 4 },
    { titre: "Charges", desc: "Factures à payer.", stab: -4 },
    { titre: "Innovation", desc: "Bonne idée !", stab: 5 },
    { titre: "Concurrence", desc: "Marché difficile.", stab: -3 }
];

// CARTES RESSOURCES
const CARTES_RESSOURCES = [
    { type: 'stabilite', nom: 'Économies', icon: '💰', effet: '+5 stabilité', action: (j) => { j.stabilite += 5; } },
    { type: 'stabilite', nom: 'Soutien', icon: '🤝', effet: '+4 stabilité', action: (j) => { j.stabilite += 4; } },
    { type: 'protection', nom: 'Assurance', icon: '🛡️', effet: 'Réduit prochaine perte', action: null },
    { type: 'reseau', nom: 'Contact', icon: '📞', effet: '+3 stabilité', action: (j) => { j.stabilite += 3; } },
    { type: 'chance', nom: 'Coup de pouce', icon: '🍀', effet: '+2 stabilité', action: (j) => { j.stabilite += 2; } }
];

// CARTES CHOIX
const CARTES_CHOIX = [
    { titre: "Opportunité risquée", desc: "On vous propose un projet ambitieux mais incertain.", oui: { stab: 6, label: 'Accepter' }, non: { stab: -2, label: 'Refuser' } },
    { titre: "Heures sup ?", desc: "Travail supplémentaire demandé.", oui: { stab: 4, label: 'Accepter' }, non: { stab: -3, label: 'Refuser' } },
    { titre: "Aider un collègue", desc: "Il a besoin d'aide urgente.", oui: { stab: 3, differe: true, label: 'Aider' }, non: { stab: -4, label: 'Ignorer' } },
    { titre: "Avouer une erreur", desc: "Vous avez fait une faute.", oui: { stab: 5, label: 'Avouer' }, non: { stab: -6, label: 'Cacher' } },
    { titre: "Formation weekend", desc: "Améliorer vos compétences ?", oui: { stab: -2, ptsDiplome: 1, label: 'Y aller' }, non: { stab: 2, label: 'Repos' } },
    { titre: "Déménagement", desc: "Emploi mieux payé, mais loin.", oui: { stab: 4, label: 'Partir' }, non: { stab: -2, label: 'Rester' } }
];

// CARTES SPÉCIALES
const CARTES_SPECIAL_SALARIE = [
    { titre: "Promotion", desc: "Montée en grade !", stab: 6 },
    { titre: "Burn-out léger", desc: "Fatigue accumulée.", stab: -5 }
];

const CARTES_SPECIAL_ENTREPRENEUR = [
    { titre: "Gros contrat", desc: "Un client majeur !", stab: 8 },
    { titre: "Projet échoué", desc: "Un investissement perdu.", stab: -6 }
];

// CARTES ÉCHEC
const CARTES_ECHEC = [
    { titre: "Procrastination", desc: "Temps perdu.", stab: -2 },
    { titre: "Imprévu", desc: "Journée perturbée.", stab: -3 },
    { titre: "Fatigue", desc: "Vous êtes épuisé.", stab: -2 }
];

// ÉTAT DU JEU
let jeu = {
    mode: 'local', // 'local' ou 'online'
    joueurs: [],
    joueurActif: 0,
    tour: 1,
    maxTours: 30,
    phase: 'accueil',
    deBloque: true,
    questionsUtilisees: [],
    effetsDifferes: []
};

// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Mode selection
    document.getElementById('btn-local').addEventListener('click', () => showModeConfig('local'));
    document.getElementById('btn-online').addEventListener('click', () => showModeConfig('online'));
    document.getElementById('btn-back-mode')?.addEventListener('click', hideModeConfig);

    // Local mode
    document.querySelectorAll('.btn-nb').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-nb').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            genererJoueurs(parseInt(btn.dataset.nb));
        });
    });

    document.getElementById('btn-commencer').addEventListener('click', demarrerPreparation);
    document.getElementById('btn-rejouer').addEventListener('click', () => location.reload());

    // Online mode
    document.getElementById('btn-create-room')?.addEventListener('click', createOnlineRoom);
    document.getElementById('btn-join-room')?.addEventListener('click', joinOnlineRoom);
    document.getElementById('btn-copy-code')?.addEventListener('click', copyRoomCode);
    document.getElementById('btn-leave-room')?.addEventListener('click', leaveRoom);
    document.getElementById('btn-start-online')?.addEventListener('click', startOnlineGame);

    // Room code input - uppercase
    document.getElementById('room-code')?.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });

    // Online player count selector
    document.querySelectorAll('.online-joueurs .btn-nb').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.online-joueurs .btn-nb').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    genererJoueurs(2);
});

function showModeConfig(mode) {
    document.getElementById('config-local').classList.add('hidden');
    document.getElementById('config-online').classList.add('hidden');
    document.querySelector('.mode-selection').classList.add('hidden');

    if (mode === 'local') {
        document.getElementById('config-local').classList.remove('hidden');
    } else {
        document.getElementById('config-online').classList.remove('hidden');
    }
}

function hideModeConfig() {
    document.getElementById('config-local').classList.add('hidden');
    document.getElementById('config-online').classList.add('hidden');
    document.querySelector('.mode-selection').classList.remove('hidden');
}

function genererJoueurs(nb) {
    const container = document.getElementById('liste-joueurs');
    container.innerHTML = '';
    for (let i = 0; i < nb; i++) {
        container.innerHTML += `
            <div class="joueur-item">
                <div class="joueur-couleur" style="background:${COULEURS[i]}"></div>
                <input type="text" id="nom-${i}" value="Joueur ${i + 1}">
            </div>`;
    }
}

// ==========================================
// MODE EN LIGNE - GESTION DES SALLES
// ==========================================

async function createOnlineRoom() {
    const playerName = document.getElementById('player-name').value.trim() || 'Joueur';

    // Get selected max players from online selector
    const selectedBtn = document.querySelector('.online-joueurs .btn-nb.active');
    const maxPlayers = selectedBtn ? parseInt(selectedBtn.dataset.nb) : 8;

    const btn = document.getElementById('btn-create-room');
    btn.disabled = true;
    btn.textContent = 'Création...';

    const result = await RoomManager.createRoom(playerName, maxPlayers);

    if (result.success) {
        jeu.mode = 'online';
        jeu.maxPlayersOnline = maxPlayers;
        showLobby(result.room.code);
    } else {
        alert('Erreur: ' + result.error);
        btn.disabled = false;
        btn.innerHTML = '<span>➕</span> Créer une salle';
    }
}

async function joinOnlineRoom() {
    const code = document.getElementById('room-code').value.trim().toUpperCase();
    const playerName = document.getElementById('player-name').value.trim() || 'Joueur';

    if (code.length !== 6) {
        alert('Le code doit contenir 6 caractères');
        return;
    }

    const btn = document.getElementById('btn-join-room');
    btn.disabled = true;
    btn.textContent = 'Connexion...';

    const result = await RoomManager.joinRoom(code, playerName);

    if (result.success) {
        jeu.mode = 'online';
        showLobby(code);
        if (result.reconnected) {
            document.getElementById('lobby-status').textContent = '🔄 Reconnecté !';
        }
    } else {
        alert('Erreur: ' + result.error);
        btn.disabled = false;
        btn.textContent = 'Rejoindre';
    }
}

function showLobby(code) {
    document.getElementById('ecran-accueil').classList.add('hidden');
    document.getElementById('ecran-lobby').classList.remove('hidden');
    document.getElementById('display-room-code').textContent = code;

    // Show start button for host
    if (RoomManager.isHost()) {
        document.getElementById('btn-start-online').classList.remove('hidden');
    }

    // Load players
    refreshLobbyPlayers();
}

async function refreshLobbyPlayers() {
    const players = await RoomManager.getPlayers();
    const container = document.getElementById('lobby-players-list');
    const countEl = document.getElementById('player-count');
    const maxPlayers = RoomManager.currentRoom?.max_players || 8;

    countEl.textContent = `(${players.length}/${maxPlayers})`;

    container.innerHTML = players.map((p, i) => `
        <div class="lobby-player ${p.is_connected ? '' : 'disconnected'} ${p.player_id === RoomManager.currentPlayer?.player_id ? 'you' : ''}">
            <div class="player-avatar" style="background: ${p.color}">${p.player_name.charAt(0).toUpperCase()}</div>
            <div class="player-info">
                <span class="player-name">${p.player_name}</span>
                ${RoomManager.currentRoom?.host_id === p.player_id ? '<span class="host-badge">Hôte</span>' : ''}
            </div>
            <div class="player-status">${p.is_connected ? '●' : '○'}</div>
        </div>
    `).join('');

    // Auto-start when target player count reached
    const connectedPlayers = players.filter(p => p.is_connected).length;
    if (connectedPlayers >= maxPlayers && RoomManager.isHost()) {
        document.getElementById('lobby-status').textContent = 'Nombre de joueurs atteint ! Lancement...';
        setTimeout(() => startOnlineGame(), 2000);
        return;
    }

    // Update status text
    if (connectedPlayers < maxPlayers) {
        document.getElementById('lobby-status').textContent = `En attente de joueurs... (${maxPlayers - connectedPlayers} restant(s))`;
    }

    // Show start button for host (can start early if min 1 player for solo or 2+ for multi)
    if (RoomManager.isHost()) {
        const minPlayers = maxPlayers === 1 ? 1 : 1;
        document.getElementById('btn-start-online').disabled = connectedPlayers < minPlayers;
    }
}

function copyRoomCode() {
    const code = document.getElementById('display-room-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('btn-copy-code');
        btn.textContent = 'Copié !';
        setTimeout(() => btn.textContent = 'Copier', 2000);
    });
}

async function leaveRoom() {
    await RoomManager.leaveRoom();
    location.reload();
}

async function startOnlineGame() {
    if (!RoomManager.isHost()) return;

    const players = await RoomManager.getPlayers();
    const maxPlayers = RoomManager.currentRoom?.max_players || 8;
    const minPlayers = maxPlayers === 1 ? 1 : 1; // Allow solo or multiplayer

    if (players.length < minPlayers) {
        alert(`Il faut au moins ${minPlayers} joueur(s) pour commencer`);
        return;
    }

    // Initialize game state
    const diplomesKeys = Object.keys(DIPLOMES);
    shuffleArray(QUESTIONS_POOL);

    const gameState = {
        phase: 'preparation',
        tour: 1,
        joueurActif: 0,
        questionsUtilisees: [],
        effetsDifferes: [],
        prepIndex: 0
    };

    // Assign diplomas to all players
    for (const player of players) {
        const diplomeAleatoire = diplomesKeys[Math.floor(Math.random() * diplomesKeys.length)];
        await supabaseClient.from('room_players').update({
            diplome_objectif: diplomeAleatoire,
            stabilite: 50,
            pts_diplome: 0
        }).eq('id', player.id);
    }

    await RoomManager.updateRoom({
        status: 'preparation',
        game_state: gameState,
        questions_utilisees: []
    });
}

// Realtime callbacks
function onRoomUpdate(room) {
    if (room.status === 'preparation' && jeu.phase !== 'preparation') {
        demarrerPreparationOnline();
    } else if (room.status === 'playing' && jeu.phase !== 'jeu') {
        lancerJeuOnline();
    } else if (room.status === 'playing') {
        // Sync game state
        const state = room.game_state;
        jeu.tour = state.tour || jeu.tour;
        jeu.joueurActif = state.joueurActif ?? jeu.joueurActif;
        jeu.deBloque = !isMyTurn();
        majInterface();
    }
}

function onPlayersUpdate(players) {
    if (jeu.phase === 'accueil' || jeu.phase === 'lobby') {
        refreshLobbyPlayers();
    } else {
        // Sync player states
        jeu.joueurs = players.map(p => ({
            id: p.player_index,
            oderId: p.id,
            oderId: p.id,
            oderId: p.id,
            playerId: p.player_id,
            nom: p.player_name,
            couleur: p.color,
            stabilite: p.stabilite,
            diplomeObjectif: p.diplome_objectif,
            ptsDiplome: p.pts_diplome,
            role: p.role,
            ressources: p.ressources || [],
            elimine: false,
            diplomeValide: p.diplome_valide,
            protectionActive: p.protection_active,
            diplomeRefuse: p.diplome_refuse
        }));
        majInterface();
    }
}

function isMyTurn() {
    if (jeu.mode !== 'online') return true;
    const myIndex = RoomManager.currentPlayer?.player_index;
    return myIndex === jeu.joueurActif;
}

// ==========================================
// PRÉPARATION
// ==========================================

function demarrerPreparation() {
    jeu.mode = 'local';
    const nb = parseInt(document.querySelector('.btn-nb.active').dataset.nb);
    const diplomesKeys = Object.keys(DIPLOMES);

    jeu.questionsUtilisees = [];
    shuffleArray(QUESTIONS_POOL);

    jeu.joueurs = [];
    for (let i = 0; i < nb; i++) {
        const diplomeAleatoire = diplomesKeys[Math.floor(Math.random() * diplomesKeys.length)];

        jeu.joueurs.push({
            id: i,
            nom: document.getElementById(`nom-${i}`).value || `Joueur ${i + 1}`,
            couleur: COULEURS[i],
            stabilite: 50,
            diplomeObjectif: diplomeAleatoire,
            ptsDiplome: 0,
            role: null,
            ressources: [],
            elimine: false,
            diplomeValide: false,
            protectionActive: false,
            diplomeRefuse: false
        });
    }

    jeu.joueurActif = 0;
    jeu.phase = 'preparation';

    document.getElementById('ecran-accueil').classList.add('hidden');
    document.getElementById('ecran-preparation').classList.remove('hidden');

    afficherPreparation();
}

async function demarrerPreparationOnline() {
    jeu.phase = 'preparation';

    // Load players from database
    const players = await RoomManager.getPlayers();
    jeu.joueurs = players.map(p => ({
        id: p.player_index,
        oderId: p.id,
        playerId: p.player_id,
        nom: p.player_name,
        couleur: p.color,
        stabilite: p.stabilite,
        diplomeObjectif: p.diplome_objectif,
        ptsDiplome: p.pts_diplome || 0,
        role: p.role,
        ressources: p.ressources || [],
        elimine: false,
        diplomeValide: p.diplome_valide || false,
        protectionActive: p.protection_active || false,
        diplomeRefuse: p.diplome_refuse || false
    }));

    // Find my player index
    const myPlayer = players.find(p => p.player_id === getPlayerId());
    jeu.joueurActif = myPlayer ? myPlayer.player_index : 0;

    document.getElementById('ecran-lobby').classList.add('hidden');
    document.getElementById('ecran-preparation').classList.remove('hidden');

    afficherPreparationOnline();
}

function afficherPreparationOnline() {
    const myPlayer = jeu.joueurs.find(j => j.playerId === getPlayerId());
    if (!myPlayer) return;

    const diplome = DIPLOMES[myPlayer.diplomeObjectif];

    document.querySelector('.prep-pion').style.background = myPlayer.couleur;
    document.querySelector('.prep-nom').textContent = myPlayer.nom;

    document.getElementById('etape-diplome-attribue').classList.remove('hidden');
    document.getElementById('etape-role').classList.add('hidden');
    document.getElementById('etape-attente').classList.add('hidden');

    document.querySelector('.diplome-icon').textContent = diplome.icon;
    document.querySelector('.diplome-nom').textContent = diplome.nom;
    document.querySelector('.diplome-pts').textContent = `${diplome.pts} points requis`;

    document.getElementById('btn-continuer-role').innerHTML = `
        <button class="btn-principal" style="margin-right:10px" onclick="accepterDiplomeOnline()">Accepter le défi</button>
        <button class="btn-secondaire" onclick="refuserDiplomeOnline()">Refuser (pas de malus)</button>
    `;
}

async function accepterDiplomeOnline() {
    // Simplified for online - skip questions, go to role
    passerAuRoleOnline();
}

async function refuserDiplomeOnline() {
    await RoomManager.updatePlayer({ diplome_refuse: true });
    passerAuRoleOnline();
}

function passerAuRoleOnline() {
    document.getElementById('etape-diplome-attribue').classList.add('hidden');
    document.getElementById('etape-role').classList.remove('hidden');

    document.querySelectorAll('.btn-role').forEach(btn => {
        btn.onclick = () => choisirRoleOnline(btn.dataset.role);
    });
}

async function choisirRoleOnline(role) {
    const updates = { role: role };
    if (role === 'salarie') {
        updates.stabilite = 55; // 50 + 5 bonus
    }
    updates.is_ready = true;

    await RoomManager.updatePlayer(updates);

    // Show waiting screen
    document.getElementById('etape-role').classList.add('hidden');
    document.getElementById('etape-attente').classList.remove('hidden');

    // Check if all players ready
    checkAllPlayersReady();
}

async function checkAllPlayersReady() {
    const players = await RoomManager.getPlayers();
    const allReady = players.every(p => p.is_ready);

    if (allReady && RoomManager.isHost()) {
        // Start game
        await RoomManager.updateRoom({
            status: 'playing',
            game_state: {
                phase: 'jeu',
                tour: 1,
                joueurActif: 0,
                questionsUtilisees: [],
                effetsDifferes: []
            }
        });
    }

    // Update progress display
    const readyCount = players.filter(p => p.is_ready).length;
    document.getElementById('prep-progress').innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${(readyCount / players.length) * 100}%"></div>
        </div>
        <span>${readyCount}/${players.length} joueurs prêts</span>
    `;
}

function afficherPreparation() {
    const j = jeu.joueurs[jeu.joueurActif];
    const diplome = DIPLOMES[j.diplomeObjectif];

    document.querySelector('.prep-pion').style.background = j.couleur;
    document.querySelector('.prep-nom').textContent = j.nom;

    document.getElementById('etape-diplome-attribue').classList.remove('hidden');
    document.getElementById('etape-role').classList.add('hidden');

    document.querySelector('.diplome-icon').textContent = diplome.icon;
    document.querySelector('.diplome-nom').textContent = diplome.nom;
    document.querySelector('.diplome-pts').textContent = `${diplome.pts} points requis`;

    document.getElementById('btn-continuer-role').innerHTML = `
        <button class="btn-principal" style="margin-right:10px" onclick="accepterDiplome()">Accepter le défi</button>
        <button class="btn-secondaire" onclick="refuserDiplome()">Refuser (pas de malus)</button>
    `;
}

function accepterDiplome() {
    const j = jeu.joueurs[jeu.joueurActif];
    const nbQuestions = 1 + Math.floor(Math.random() * 3);
    jeu.prepQuestions = nbQuestions;
    jeu.prepBonnesReponses = 0;
    jeu.prepQuestionActuelle = 0;

    afficherQuestionPrep();
}

function afficherQuestionPrep() {
    const q = getQuestionUnique();
    if (!q) {
        finirPreparationDiplome();
        return;
    }

    jeu.currentQuestion = q;

    document.querySelector('.diplome-attribue').innerHTML = `
        <span class="diplome-icon">❓</span>
        <span class="diplome-nom">Question ${jeu.prepQuestionActuelle + 1}/${jeu.prepQuestions}</span>
        <p style="margin:15px 0;font-size:1.1rem">${q.q}</p>
        <input type="text" id="reponse-prep" placeholder="Votre réponse..." style="padding:12px;font-size:1rem;border-radius:8px;border:2px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.3);color:#fff;width:80%">
        <button class="btn-principal" style="margin-top:15px" onclick="validerQuestionPrep()">Valider</button>
    `;

    setTimeout(() => {
        const input = document.getElementById('reponse-prep');
        if (input) {
            input.focus();
            input.onkeypress = (e) => { if (e.key === 'Enter') validerQuestionPrep(); };
        }
    }, 100);
}

function validerQuestionPrep() {
    const reponse = document.getElementById('reponse-prep').value.toLowerCase().trim();
    const bonnes = jeu.currentQuestion.r.split('|').map(r => r.toLowerCase().trim());

    if (bonnes.some(b => reponse.includes(b) || b.includes(reponse))) {
        jeu.prepBonnesReponses++;
    }

    jeu.prepQuestionActuelle++;

    if (jeu.prepQuestionActuelle < jeu.prepQuestions) {
        afficherQuestionPrep();
    } else {
        finirPreparationDiplome();
    }
}

function finirPreparationDiplome() {
    const j = jeu.joueurs[jeu.joueurActif];
    const diplome = DIPLOMES[j.diplomeObjectif];

    if (jeu.prepBonnesReponses < jeu.prepQuestions) {
        const malus = 1 + Math.floor(Math.random() * 5);
        j.stabilite -= malus;
        j.diplomeRefuse = true;

        document.querySelector('.diplome-attribue').innerHTML = `
            <span class="diplome-icon">😓</span>
            <span class="diplome-nom">Échec partiel</span>
            <p style="color:rgba(255,255,255,0.7)">${jeu.prepBonnesReponses}/${jeu.prepQuestions} bonnes réponses</p>
            <p style="color:#f87171">-${malus} stabilité de départ</p>
        `;
    } else {
        document.querySelector('.diplome-attribue').innerHTML = `
            <span class="diplome-icon">✅</span>
            <span class="diplome-nom">Prêt !</span>
            <p style="color:#4ade80">Toutes les réponses correctes !</p>
        `;
    }

    setTimeout(passerAuRole, 1500);
}

function refuserDiplome() {
    const j = jeu.joueurs[jeu.joueurActif];
    j.diplomeRefuse = true;
    passerAuRole();
}

function passerAuRole() {
    document.getElementById('etape-diplome-attribue').classList.add('hidden');
    document.getElementById('etape-role').classList.remove('hidden');

    document.querySelectorAll('.btn-role').forEach(btn => {
        btn.onclick = () => choisirRole(btn.dataset.role);
    });
}

function choisirRole(role) {
    const j = jeu.joueurs[jeu.joueurActif];
    j.role = role;

    if (role === 'salarie') j.stabilite += 5;

    jeu.joueurActif++;
    if (jeu.joueurActif < jeu.joueurs.length) {
        afficherPreparation();
    } else {
        lancerJeu();
    }
}

// ==========================================
// PHASE JEU
// ==========================================

function lancerJeu() {
    jeu.phase = 'jeu';
    jeu.joueurActif = 0;
    jeu.tour = 1;
    jeu.deBloque = false;

    document.getElementById('ecran-preparation').classList.add('hidden');
    document.getElementById('ecran-jeu').classList.remove('hidden');

    document.getElementById('de-scene').addEventListener('click', lancerDe);

    majInterface();
}

async function lancerJeuOnline() {
    jeu.phase = 'jeu';
    jeu.tour = 1;
    jeu.joueurActif = 0;
    jeu.deBloque = !isMyTurn();

    // Load players
    const players = await RoomManager.getPlayers();
    jeu.joueurs = players.map(p => ({
        id: p.player_index,
        oderId: p.id,
        playerId: p.player_id,
        nom: p.player_name,
        couleur: p.color,
        stabilite: p.stabilite,
        diplomeObjectif: p.diplome_objectif,
        ptsDiplome: p.pts_diplome || 0,
        role: p.role,
        ressources: p.ressources || [],
        elimine: false,
        diplomeValide: p.diplome_valide || false,
        protectionActive: p.protection_active || false,
        diplomeRefuse: p.diplome_refuse || false
    }));

    document.getElementById('ecran-preparation').classList.add('hidden');
    document.getElementById('ecran-jeu').classList.remove('hidden');
    document.getElementById('online-indicator').classList.remove('hidden');

    document.getElementById('de-scene').addEventListener('click', lancerDe);

    majInterface();
}

function majInterface() {
    const j = jeu.joueurs[jeu.joueurActif];
    if (!j) return;

    const diplome = DIPLOMES[j.diplomeObjectif];

    document.getElementById('tour-num').textContent = jeu.tour;
    document.getElementById('tour-max').textContent = jeu.maxTours;

    document.getElementById('obj-diplome-nom').textContent = diplome.nom;
    document.getElementById('obj-progress-text').textContent = `${j.ptsDiplome}/${diplome.pts}`;
    document.getElementById('obj-progress-fill').style.width = `${(j.ptsDiplome / diplome.pts) * 100}%`;

    const liste = document.getElementById('joueurs-liste');
    liste.innerHTML = '';
    jeu.joueurs.forEach((p, i) => {
        const roleIcon = p.role === 'salarie' ? '💼' : '🚀';
        const stabAffichee = Math.max(-50, p.stabilite);
        const stabPct = Math.max(0, Math.min(100, (p.stabilite + 50) / 1.5));
        liste.innerHTML += `
            <div class="joueur-card ${i === jeu.joueurActif ? 'actif' : ''}">
                <div class="joueur-card-header">
                    <div class="jc-pion" style="background:${p.couleur}"></div>
                    <span class="jc-nom">${p.nom}</span>
                    <span class="jc-role">${roleIcon}</span>
                </div>
                <div class="jc-stabilite">
                    <div class="jc-barre"><div class="jc-fill" style="width:${stabPct}%"></div></div>
                    <span class="jc-val">${stabAffichee}</span>
                </div>
            </div>`;
    });

    // Resources - show for current player in local, or for my player in online
    let myPlayer = j;
    if (jeu.mode === 'online') {
        myPlayer = jeu.joueurs.find(p => p.playerId === getPlayerId()) || j;
    }

    const slots = document.getElementById('slots-ressources');
    slots.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const res = myPlayer.ressources[i];
        if (res) {
            slots.innerHTML += `
                <div class="slot-ressource plein" onclick="utiliserRessource(${i})">
                    <span class="slot-icon">${res.icon}</span>
                    <span class="slot-nom">${res.nom}</span>
                </div>`;
        } else {
            slots.innerHTML += `<div class="slot-ressource"><span>Vide</span></div>`;
        }
    }

    document.getElementById('ja-pion').style.background = j.couleur;
    document.getElementById('ja-nom').textContent = j.nom;
    document.getElementById('ja-role').textContent = j.role === 'salarie' ? '💼 Salarié' : '🚀 Entrepreneur';

    const deCube = document.getElementById('de-3d');
    const canPlay = jeu.mode === 'local' || isMyTurn();
    deCube.classList.toggle('disabled', jeu.deBloque || !canPlay);

    let instruction = 'Cliquez sur le dé';
    if (jeu.deBloque) {
        instruction = "Terminez l'action";
    } else if (!canPlay) {
        instruction = `C'est le tour de ${j.nom}`;
    }
    document.getElementById('de-instruction').textContent = instruction;
}

function getQuestionUnique() {
    for (let q of QUESTIONS_POOL) {
        if (!jeu.questionsUtilisees.includes(q.id)) {
            jeu.questionsUtilisees.push(q.id);
            return q;
        }
    }
    return null;
}

function utiliserRessource(index) {
    const j = jeu.joueurs[jeu.joueurActif];
    const res = j.ressources[index];
    if (!res) return;

    if (res.type === 'protection') {
        j.protectionActive = true;
        j.ressources.splice(index, 1);
        afficherResultat('RESSOURCE', `${res.icon} ${res.nom}`, 'Protection activée !', 'Prochaine perte réduite', 'positif');
    } else if (res.action) {
        res.action(j);
        j.ressources.splice(index, 1);
        afficherResultat('RESSOURCE', `${res.icon} ${res.nom}`, 'Ressource utilisée !', res.effet, 'positif');
    }

    syncPlayerStateOnline();
    majInterface();
}

// ==========================================
// DÉ
// ==========================================

function lancerDe() {
    if (jeu.deBloque) return;
    if (jeu.mode === 'online' && !isMyTurn()) return;

    jeu.deBloque = true;
    const deCube = document.getElementById('de-3d');
    deCube.classList.add('rolling', 'disabled');

    document.getElementById('de-resultat').classList.add('hidden');
    document.getElementById('carte-piochee').classList.add('hidden');
    document.getElementById('carte-piochee').classList.remove('flip', 'gain', 'perte');

    setTimeout(() => {
        deCube.classList.remove('rolling');
        const resultat = Math.floor(Math.random() * 6) + 1;

        document.getElementById('de-resultat').textContent = `${resultat}`;
        document.getElementById('de-resultat').classList.remove('hidden');

        setTimeout(() => traiterAction(resultat), 500);
    }, 1200);
}

function traiterAction(resultat) {
    const j = jeu.joueurs[jeu.joueurActif];
    const action = ACTIONS_DE[resultat];

    if (j.role === 'salarie') j.stabilite += 2;

    appliquerEffetsDifferes();

    const diplome = DIPLOMES[j.diplomeObjectif];
    if (diplome.instabilite > 0 && Math.random() < 0.15) {
        j.stabilite -= diplome.instabilite;
    }

    switch (action) {
        case 'echec': carteEchec(); break;
        case 'etudes': carteEtudes(); break;
        case 'travail': carteTravail(); break;
        case 'ressource': carteRessource(); break;
        case 'choix': carteChoix(); break;
        case 'special': carteSpecial(); break;
    }
}

function appliquerEffetsDifferes() {
    const effets = jeu.effetsDifferes.filter(e => e.joueur === jeu.joueurActif);
    effets.forEach(e => {
        jeu.joueurs[jeu.joueurActif].stabilite += e.stab;
    });
    jeu.effetsDifferes = jeu.effetsDifferes.filter(e => e.joueur !== jeu.joueurActif);
}

// ==========================================
// CARTES
// ==========================================

function afficherCarte(type, titre, desc, effet, classe, actions) {
    const carte = document.getElementById('carte-piochee');
    carte.classList.remove('hidden', 'flip', 'gain', 'perte');

    document.getElementById('carte-bandeau').textContent = type;
    document.getElementById('carte-bandeau').className = `carte-bandeau ${type.toLowerCase().replace(/[^a-z]/g, '')}`;
    document.getElementById('carte-titre').textContent = titre;
    document.getElementById('carte-desc').textContent = desc;
    document.getElementById('carte-effet').textContent = effet;
    document.getElementById('carte-effet').className = `carte-effet ${classe}`;
    document.getElementById('carte-actions').innerHTML = actions;

    setTimeout(() => {
        carte.classList.add('flip');
        if (classe === 'positif') carte.classList.add('gain');
        if (classe === 'negatif') carte.classList.add('perte');
    }, 50);
}

function afficherResultat(type, titre, desc, effet, classe) {
    afficherCarte(type, titre, desc, effet, classe, '<button class="btn-ok" onclick="finTour()">OK</button>');
    majInterface();
}

function appliquerPerte(perte) {
    const j = jeu.joueurs[jeu.joueurActif];
    if (j.protectionActive) {
        perte = Math.ceil(perte / 2);
        j.protectionActive = false;
    }
    j.stabilite += perte;
    return perte;
}

function carteEchec() {
    const carte = CARTES_ECHEC[Math.floor(Math.random() * CARTES_ECHEC.length)];
    const perte = appliquerPerte(carte.stab);
    afficherResultat('ÉCHEC', `😓 ${carte.titre}`, carte.desc, `${perte} stabilité`, 'negatif');
}

function carteEtudes() {
    const j = jeu.joueurs[jeu.joueurActif];
    const diplome = DIPLOMES[j.diplomeObjectif];
    const carte = CARTES_ETUDES[Math.floor(Math.random() * CARTES_ETUDES.length)];

    if (carte.ptsDiplome > 0 && j.stabilite < 20) {
        j.stabilite += carte.stab || 0;
        afficherResultat('ÉTUDES', `📚 ${carte.titre}`, 'Stabilité trop basse pour progresser !', `${carte.stab >= 0 ? '+' : ''}${carte.stab || 0} stabilité`, 'neutre');
        return;
    }

    if (carte.ptsDiplome > 0) {
        const q = getQuestionUnique();
        if (!q) {
            j.stabilite += 3;
            afficherResultat('ÉTUDES', '📚 Auto-formation', 'Plus de questions disponibles', '+3 stabilité', 'positif');
            return;
        }

        jeu.currentQuestion = q;
        jeu.currentCarte = carte;

        afficherCarte('ÉTUDES', `📚 ${carte.titre}`, `${carte.desc}\n\n${q.q}`,
            'Répondez correctement', 'neutre',
            `<input type="text" id="reponse" placeholder="Réponse...">
             <button class="btn-ok" onclick="validerEtudes()">Valider</button>`);

        setTimeout(() => {
            const input = document.getElementById('reponse');
            if (input) {
                input.focus();
                input.onkeypress = (e) => { if (e.key === 'Enter') validerEtudes(); };
            }
        }, 700);
    } else {
        j.stabilite += carte.stab;
        afficherResultat('ÉTUDES', `📚 ${carte.titre}`, carte.desc, `+${carte.stab} stabilité`, 'positif');
    }
}

function validerEtudes() {
    const j = jeu.joueurs[jeu.joueurActif];
    const reponse = document.getElementById('reponse').value.toLowerCase().trim();
    const bonnes = jeu.currentQuestion.r.split('|').map(r => r.toLowerCase().trim());
    const carte = jeu.currentCarte;

    if (bonnes.some(b => reponse.includes(b) || b.includes(reponse))) {
        j.ptsDiplome += 1;
        j.stabilite += carte.stab || 0;
        verifierDiplome();
        afficherResultat('ÉTUDES', '✅ Correct !', '', '+1 pt diplôme', 'positif');
    } else {
        const perte = appliquerPerte(-3);
        afficherResultat('ÉTUDES', '❌ Incorrect', `Réponse: ${bonnes[0]}`, `${perte} stabilité`, 'negatif');
    }
}

function carteTravail() {
    const j = jeu.joueurs[jeu.joueurActif];
    const cartes = j.role === 'salarie' ? CARTES_TRAVAIL_SALARIE : CARTES_TRAVAIL_ENTREPRENEUR;
    const carte = cartes[Math.floor(Math.random() * cartes.length)];

    let effet = carte.stab;
    if (effet < 0) effet = appliquerPerte(effet);
    else j.stabilite += effet;

    const classe = effet >= 0 ? 'positif' : 'negatif';
    const texte = effet >= 0 ? `+${effet}` : effet;

    afficherResultat('TRAVAIL', `💼 ${carte.titre}`, carte.desc, `${texte} stabilité`, classe);
}

function carteRessource() {
    const j = jeu.joueurs[jeu.joueurActif];

    if (j.ressources.length >= 4) {
        afficherResultat('RESSOURCE', '📦 Inventaire plein', 'Max 4 cartes', 'Utilisez vos ressources !', 'neutre');
        return;
    }

    const carte = { ...CARTES_RESSOURCES[Math.floor(Math.random() * CARTES_RESSOURCES.length)] };
    j.ressources.push(carte);

    afficherResultat('RESSOURCE', `${carte.icon} ${carte.nom}`, 'Carte stockée !', carte.effet, 'positif');
}

function carteChoix() {
    const carte = CARTES_CHOIX[Math.floor(Math.random() * CARTES_CHOIX.length)];
    jeu.currentChoix = carte;

    afficherCarte('CHOIX', `❓ ${carte.titre}`, carte.desc,
        'Choisissez sans connaître les conséquences', 'neutre',
        `<button class="btn-oui" onclick="appliquerChoix('oui')">${carte.oui.label}</button>
         <button class="btn-non" onclick="appliquerChoix('non')">${carte.non.label}</button>`);
}

function appliquerChoix(choix) {
    const j = jeu.joueurs[jeu.joueurActif];
    const effet = jeu.currentChoix[choix];

    let stab = effet.stab;

    if (effet.differe) {
        jeu.effetsDifferes.push({ joueur: jeu.joueurActif, stab: stab });
        afficherResultat('CHOIX', effet.label, 'Effet appliqué au prochain tour', 'À suivre...', 'neutre');
        return;
    }

    if (stab < 0) stab = appliquerPerte(stab);
    else j.stabilite += stab;

    if (effet.ptsDiplome && j.stabilite >= 20) j.ptsDiplome += effet.ptsDiplome;

    const classe = stab >= 0 ? 'positif' : 'negatif';
    const texte = stab >= 0 ? `+${stab}` : stab;

    verifierDiplome();
    afficherResultat('CHOIX', effet.label, '', `${texte} stabilité`, classe);
}

function carteSpecial() {
    const j = jeu.joueurs[jeu.joueurActif];
    const cartes = j.role === 'salarie' ? CARTES_SPECIAL_SALARIE : CARTES_SPECIAL_ENTREPRENEUR;
    const carte = cartes[Math.floor(Math.random() * cartes.length)];

    let effet = carte.stab;
    if (effet < 0) effet = appliquerPerte(effet);
    else j.stabilite += effet;

    const classe = effet >= 0 ? 'positif' : 'negatif';
    const texte = effet >= 0 ? `+${effet}` : effet;

    afficherResultat('SPÉCIAL', `⭐ ${carte.titre}`, carte.desc, `${texte} stabilité`, classe);
}

// ==========================================
// DIPLÔME & VICTOIRE
// ==========================================

function verifierDiplome() {
    const j = jeu.joueurs[jeu.joueurActif];
    const diplome = DIPLOMES[j.diplomeObjectif];

    if (j.ptsDiplome >= diplome.pts && !j.diplomeValide) {
        j.diplomeValide = true;
        j.stabilite += 10;
    }
}

function verifierVictoire() {
    const j = jeu.joueurs[jeu.joueurActif];
    const diplome = DIPLOMES[j.diplomeObjectif];

    if (j.stabilite >= 100) {
        terminerPartie(j, 'Stabilité maximale atteinte !');
        return true;
    }

    if (j.diplomeValide && j.stabilite >= diplome.stabiliteMin) {
        terminerPartie(j, `${diplome.nom} validé avec ${j.stabilite} stabilité !`);
        return true;
    }

    return false;
}

async function finTour() {
    if (verifierVictoire()) return;

    // Sync player state if online
    await syncPlayerStateOnline();

    // Next player
    jeu.joueurActif = (jeu.joueurActif + 1) % jeu.joueurs.length;

    if (jeu.joueurActif === 0) {
        jeu.tour++;
        if (jeu.tour > jeu.maxTours) {
            const classement = [...jeu.joueurs].sort((a, b) => {
                if (a.diplomeValide && !b.diplomeValide) return -1;
                if (!a.diplomeValide && b.diplomeValide) return 1;
                return b.stabilite - a.stabilite;
            });
            terminerPartie(classement[0], 'Fin de la démo (30 tours) !');
            return;
        }
    }

    // Sync game state if online
    if (jeu.mode === 'online') {
        await RoomManager.updateRoom({
            game_state: {
                phase: 'jeu',
                tour: jeu.tour,
                joueurActif: jeu.joueurActif,
                questionsUtilisees: jeu.questionsUtilisees,
                effetsDifferes: jeu.effetsDifferes
            }
        });
    }

    jeu.deBloque = jeu.mode === 'online' ? !isMyTurn() : false;
    document.getElementById('carte-piochee').classList.add('hidden');
    document.getElementById('de-resultat').classList.add('hidden');
    majInterface();
}

async function syncPlayerStateOnline() {
    if (jeu.mode !== 'online') return;

    const j = jeu.joueurs[jeu.joueurActif];
    if (!j || j.playerId !== getPlayerId()) return;

    await RoomManager.updatePlayer({
        stabilite: j.stabilite,
        pts_diplome: j.ptsDiplome,
        diplome_valide: j.diplomeValide,
        protection_active: j.protectionActive,
        ressources: j.ressources
    });
}

function terminerPartie(gagnant, raison) {
    document.getElementById('ecran-jeu').classList.add('hidden');
    document.getElementById('ecran-fin').classList.remove('hidden');

    document.getElementById('fin-icone').textContent = gagnant ? '🏆' : '😔';
    document.getElementById('fin-titre').textContent = gagnant ? `${gagnant.nom} gagne !` : 'Partie terminée';
    document.getElementById('fin-message').textContent = raison;

    const classement = [...jeu.joueurs].sort((a, b) => {
        if (a.diplomeValide && !b.diplomeValide) return -1;
        if (!a.diplomeValide && b.diplomeValide) return 1;
        return b.stabilite - a.stabilite;
    });

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
    document.getElementById('fin-classement').innerHTML = classement.map((p, i) => `
        <div class="classement-item">
            <span class="classement-pos">${medals[i] || (i + 1)}</span>
            <div class="classement-pion" style="background:${p.couleur}"></div>
            <div class="classement-info">
                <div class="classement-nom">${p.nom} ${p.diplomeValide ? '🎓' : ''}</div>
                <div class="classement-stats">Stabilité: ${p.stabilite} | Diplôme: ${p.diplomeValide ? '✅' : `${p.ptsDiplome}/${DIPLOMES[p.diplomeObjectif].pts}`}</div>
            </div>
        </div>
    `).join('');

    // Update room status if online
    if (jeu.mode === 'online' && RoomManager.isHost()) {
        RoomManager.updateRoom({ status: 'finished' });
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
