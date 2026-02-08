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

// ACTIONS DU DÉ (Conforme aux règles officielles)
// 1 = Malus, 2-5 = Chance, 6 = Bonus
const ACTIONS_DE = { 1: 'malus', 2: 'chance', 3: 'chance', 4: 'chance', 5: 'chance', 6: 'bonus' };

// QUESTIONS avec niveaux de difficulté
const CARTES_QUESTIONS = [
    // Facile (+1 point) - 8 questions
    { id: 1, difficulte: 'facile', bonus: 1, q: "En entreprise, que signifie CDI ?", r: "contrat a duree indeterminee|contrat duree indeterminee" },
    { id: 2, difficulte: 'facile', bonus: 1, q: "Quel document résume votre parcours professionnel ?", r: "cv|curriculum vitae" },
    { id: 3, difficulte: 'facile', bonus: 1, q: "Combien d'heures dans une semaine de travail légale en France ?", r: "35" },
    { id: 4, difficulte: 'facile', bonus: 1, q: "Que signifie CDD ?", r: "contrat a duree determinee|contrat duree determinee" },
    { id: 5, difficulte: 'facile', bonus: 1, q: "120 / 4 = ?", r: "30" },
    { id: 6, difficulte: 'facile', bonus: 1, q: "8 x 7 + 4 = ?", r: "60" },
    { id: 7, difficulte: 'facile', bonus: 1, q: "15% de 200 = ?", r: "30" },
    { id: 8, difficulte: 'facile', bonus: 1, q: "250 - 83 = ?", r: "167" },
    // Moyen (+2 points) - 8 questions
    { id: 9, difficulte: 'moyen', bonus: 2, q: "Que signifie SMIC ?", r: "salaire minimum|salaire minimum interprofessionnel" },
    { id: 10, difficulte: 'moyen', bonus: 2, q: "Quel impôt est prélevé sur les salaires ?", r: "impot sur le revenu|ir|impot" },
    { id: 11, difficulte: 'moyen', bonus: 2, q: "Que signifie RTT ?", r: "reduction du temps de travail|reduction temps travail" },
    { id: 12, difficulte: 'moyen', bonus: 2, q: "Durée légale des congés payés par an ?", r: "5 semaines|25 jours|5" },
    { id: 13, difficulte: 'moyen', bonus: 2, q: "Période d'essai typique pour un CDI cadre ?", r: "4 mois|3 mois|4" },
    { id: 14, difficulte: 'moyen', bonus: 2, q: "Qui paie les cotisations patronales ?", r: "employeur|patron|entreprise" },
    { id: 15, difficulte: 'moyen', bonus: 2, q: "Document obligatoire pour travailler en France ?", r: "carte d'identite|carte identite|passeport|titre de sejour" },
    { id: 16, difficulte: 'moyen', bonus: 2, q: "Première étape d'une recherche d'emploi ?", r: "cv|preparer cv|definir projet" },
    // Difficile (+3 points) - 8 questions éthiques/situationnelles
    { id: 17, difficulte: 'difficile', bonus: 3, q: "Un collègue vous demande de mentir pour lui. Bonne idée ?", r: "non" },
    { id: 18, difficulte: 'difficile', bonus: 3, q: "Votre patron vous demande des heures sup non payées. Légal ?", r: "non" },
    { id: 19, difficulte: 'difficile', bonus: 3, q: "Un client mécontent vous insulte. Réponse pro ?", r: "calme|rester calme|ecouter" },
    { id: 20, difficulte: 'difficile', bonus: 3, q: "Vous trouvez une erreur de votre supérieur. Vous la signalez ?", r: "oui" },
    { id: 21, difficulte: 'difficile', bonus: 3, q: "Un collègue est harcelé. Vous intervenez ?", r: "oui" },
    { id: 22, difficulte: 'difficile', bonus: 3, q: "Vous recevez un mail confidentiel par erreur. Action ?", r: "prevenir|signaler|informer" },
    { id: 23, difficulte: 'difficile', bonus: 3, q: "Peut-on licencier sans motif en CDI ?", r: "non" },
    { id: 24, difficulte: 'difficile', bonus: 3, q: "Un ami vous propose un poste, mais vous n'êtes pas qualifié. Accepter ?", r: "non" }
];

// CARTES MALUS (20 cartes) - Effets négatifs
const CARTES_MALUS = [
    { titre: "Procrastination", desc: "Temps perdu.", stab: -2 },
    { titre: "Imprévu", desc: "Journée perturbée.", stab: -3 },
    { titre: "Fatigue", desc: "Vous êtes épuisé.", stab: -2 },
    { titre: "Conflit", desc: "Dispute avec un collègue.", stab: -4 },
    { titre: "Retard", desc: "Vous arrivez en retard.", stab: -2 },
    { titre: "Erreur", desc: "Une erreur de votre part.", stab: -3 },
    { titre: "Stress", desc: "Pression intense.", stab: -2 },
    { titre: "Maladie", desc: "Petit coup de mou.", stab: -3, sauteTour: false },
    { titre: "Panne", desc: "Votre ordinateur lâche.", stab: -2 },
    { titre: "Critique", desc: "Feedback négatif.", stab: -3 },
    { titre: "Deadline ratée", desc: "Projet en retard.", stab: -4 },
    { titre: "Burnout léger", desc: "Fatigue accumulée.", stab: -5 },
    { titre: "Charges imprévues", desc: "Factures inattendues.", stab: -3 },
    { titre: "Concurrence", desc: "Un concurrent vous dépasse.", stab: -2 },
    { titre: "Refus", desc: "Votre proposition est refusée.", stab: -2 },
    { titre: "Perte de client", desc: "Un client vous quitte.", stab: -4 },
    { titre: "Mauvaise réputation", desc: "Rumeurs négatives.", stab: -3 },
    { titre: "Accident mineur", desc: "Petit pépin de santé.", stab: -2, sauteTour: true },
    { titre: "Vol", desc: "On vous a volé quelque chose.", stab: -3 },
    { titre: "Arnaque", desc: "Vous vous êtes fait avoir.", stab: -4 }
];

// CARTES BONUS (20 cartes) - Effets positifs
const CARTES_BONUS = [
    { titre: "Promotion", desc: "Montée en grade !", stab: 6 },
    { titre: "Prime", desc: "Bonus exceptionnel.", stab: 5 },
    { titre: "Reconnaissance", desc: "Votre travail est apprécié.", stab: 4 },
    { titre: "Formation réussie", desc: "Nouvelles compétences.", stab: 3, ptsObjectif: 1 },
    { titre: "Nouveau client", desc: "Contrat signé !", stab: 5 },
    { titre: "Networking", desc: "Contacts précieux.", stab: 3 },
    { titre: "Innovation", desc: "Votre idée est adoptée.", stab: 4 },
    { titre: "Mentorat", desc: "Un expert vous guide.", stab: 4, ptsObjectif: 1 },
    { titre: "Coup de pouce", desc: "Aide inattendue.", stab: 3, relance: true },
    { titre: "Économies", desc: "Bonne gestion financière.", stab: 4 },
    { titre: "Soutien familial", desc: "Votre famille vous aide.", stab: 3 },
    { titre: "Partenariat", desc: "Collaboration fructueuse.", stab: 5 },
    { titre: "Récompense", desc: "Prix pour votre travail.", stab: 4 },
    { titre: "Investissement", desc: "Placement rentable.", stab: 5 },
    { titre: "Opportunité", desc: "Offre intéressante.", stab: 4 },
    { titre: "Assurance", desc: "Protection contre les pertes.", stab: 0, annuleMalus: true },
    { titre: "Repos mérité", desc: "Vacances ressourçantes.", stab: 3 },
    { titre: "Projet réussi", desc: "Mission accomplie.", stab: 5 },
    { titre: "Contrat long terme", desc: "Stabilité assurée.", stab: 6 },
    { titre: "Héritage", desc: "Petit cadeau inattendu.", stab: 4 }
];

// CARTES CHANCE (20 cartes) - Effets variés (tirage au sort)
const CARTES_CHANCE = [
    { titre: "Question facile", desc: "Testez vos connaissances !", type: 'question', difficulte: 'facile' },
    { titre: "Question moyenne", desc: "Un défi modéré.", type: 'question', difficulte: 'moyen' },
    { titre: "Question difficile", desc: "Êtes-vous prêt ?", type: 'question', difficulte: 'difficile' },
    { titre: "Jour de chance", desc: "Tout va bien aujourd'hui.", stab: 3 },
    { titre: "Rencontre fortuite", desc: "Une personne utile.", stab: 2 },
    { titre: "Bonne nouvelle", desc: "Quelque chose de positif.", stab: 2 },
    { titre: "Petit imprévu", desc: "Rien de grave.", stab: -1 },
    { titre: "Journée normale", desc: "Ni bon ni mauvais.", stab: 0 },
    { titre: "Surprise", desc: "Inattendu mais agréable.", stab: 2 },
    { titre: "Question facile", desc: "Testez vos connaissances !", type: 'question', difficulte: 'facile' },
    { titre: "Question moyenne", desc: "Un défi modéré.", type: 'question', difficulte: 'moyen' },
    { titre: "Question difficile", desc: "Êtes-vous prêt ?", type: 'question', difficulte: 'difficile' },
    { titre: "Opportunité risquée", desc: "Accepter ou refuser ?", type: 'choix', oui: { stab: 4, label: 'Accepter' }, non: { stab: -2, label: 'Refuser' } },
    { titre: "Heures sup ?", desc: "Travail supplémentaire.", type: 'choix', oui: { stab: 3, label: 'Accepter' }, non: { stab: -1, label: 'Refuser' } },
    { titre: "Aider un collègue", desc: "Il a besoin d'aide.", type: 'choix', oui: { stab: 2, label: 'Aider' }, non: { stab: -2, label: 'Ignorer' } },
    { titre: "Avouer une erreur", desc: "Vous avez fait une faute.", type: 'choix', oui: { stab: 3, label: 'Avouer' }, non: { stab: -4, label: 'Cacher' } },
    { titre: "Formation weekend", desc: "Améliorer vos compétences ?", type: 'choix', oui: { stab: -1, ptsObjectif: 1, label: 'Y aller' }, non: { stab: 1, label: 'Repos' } },
    { titre: "Jour tranquille", desc: "Une journée paisible.", stab: 1 },
    { titre: "Routine", desc: "Rien de spécial.", stab: 0 },
    { titre: "Coup de pouce", desc: "Un petit coup de main.", stab: 2 }
];

// ÉTAT DU JEU
let jeu = {
    mode: 'local', // 'local' ou 'online'
    joueurs: [],
    joueurActif: 0,
    tour: 1,
    maxTours: 40, // Conforme aux règles officielles (40 tours)
    phase: 'accueil',
    deBloque: true,
    questionsUtilisees: [],
    effetsDifferes: [],
    prochainMalusAnnule: false // Pour la carte Assurance
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
    const minPlayers = maxPlayers === 1 ? 1 : 1;

    if (players.length < minPlayers) {
        alert(`Il faut au moins ${minPlayers} joueur(s) pour commencer`);
        return;
    }

    // Initialize game state - Start game directly (skip preparation)
    const diplomesKeys = Object.keys(DIPLOMES);
    const roles = ['salarie', 'entrepreneur'];
    shuffleArray(CARTES_QUESTIONS);

    // Prepare player states with random roles and objectives
    const playerStates = {};
    for (const player of players) {
        const diplomeAleatoire = diplomesKeys[Math.floor(Math.random() * diplomesKeys.length)];
        const roleAleatoire = roles[Math.floor(Math.random() * 2)];
        playerStates[player.player_id] = {
            diplome_objectif: diplomeAleatoire,
            stabilite: 50,
            pts_objectif: 0,
            objectif_accepte: true, // Auto-accept objective in online mode
            role: roleAleatoire
        };
    }

    const gameState = {
        phase: 'jeu', // Start directly in game phase
        tour: 1,
        joueurActif: 0,
        questionsUtilisees: [],
        effetsDifferes: [],
        playerStates: playerStates,
        prochainMalusAnnule: false
    };

    await RoomManager.updateRoom({
        status: 'playing', // Set to playing directly
        game_state: gameState
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
        jeu.prochainMalusAnnule = state.prochainMalusAnnule || false;
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
            playerId: p.player_id,
            nom: p.player_name,
            couleur: p.color,
            stabilite: p.stabilite,
            diplomeObjectif: p.diplome_objectif,
            ptsObjectif: p.pts_objectif || 0,
            objectifAccepte: p.objectif_accepte || false,
            role: p.role,
            ressources: p.ressources || [],
            elimine: false,
            protectionActive: p.protection_active
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
    shuffleArray(CARTES_QUESTIONS);

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
        j.objectifAccepte = true;
        j.ptsObjectif = 0;
        document.querySelector('.diplome-attribue').innerHTML = `
            <span class="diplome-icon">&#10003;</span>
            <span class="diplome-nom">Objectif accepté !</span>
            <p style="color:#4ade80">Vous pouvez gagner en remplissant votre objectif</p>
        `;
    }

    setTimeout(passerAuRole, 1500);
}

function refuserDiplome() {
    const j = jeu.joueurs[jeu.joueurActif];
    j.objectifAccepte = false;
    j.ptsObjectif = 0;
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

    // Load players and merge with game_state.playerStates
    const players = await RoomManager.getPlayers();
    const room = RoomManager.currentRoom;
    const playerStates = room?.game_state?.playerStates || {};

    jeu.joueurs = players.map(p => {
        const state = playerStates[p.player_id] || {};
        return {
            id: p.player_index,
            oderId: p.id,
            playerId: p.player_id,
            nom: p.player_name,
            couleur: p.color,
            stabilite: state.stabilite || 50,
            diplomeObjectif: state.diplome_objectif || 'dut',
            ptsObjectif: state.pts_objectif || 0,
            objectifAccepte: state.objectif_accepte || true,
            role: state.role || 'salarie',
            ressources: [],
            elimine: false,
            protectionActive: false
        };
    });

    document.getElementById('ecran-lobby').classList.add('hidden');
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

    document.getElementById('obj-diplome-nom').textContent = j.objectifAccepte ? diplome.nom : 'Aucun';
    const ptsObj = j.ptsObjectif || 0;
    document.getElementById('obj-progress-text').textContent = j.objectifAccepte ? `${ptsObj}/${diplome.pts}` : 'Non accepté';
    document.getElementById('obj-progress-fill').style.width = j.objectifAccepte ? `${(ptsObj / diplome.pts) * 100}%` : '0%';

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
    for (let q of CARTES_QUESTIONS) {
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

    // Appliquer les effets différés
    appliquerEffetsDifferes();

    // Traiter l'action selon le résultat du dé
    switch (action) {
        case 'malus': carteMalus(); break;  // Dé = 1
        case 'chance': carteChance(); break; // Dé = 2-5
        case 'bonus': carteBonus(); break;   // Dé = 6
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

function carteMalus() {
    const j = jeu.joueurs[jeu.joueurActif];

    // Vérifier si le malus est annulé
    if (jeu.prochainMalusAnnule) {
        jeu.prochainMalusAnnule = false;
        afficherResultat('MALUS', 'Malus annulé !', 'Votre protection vous a sauvé.', '+0 stabilité', 'positif');
        return;
    }

    const carte = CARTES_MALUS[Math.floor(Math.random() * CARTES_MALUS.length)];
    const perte = appliquerPerte(carte.stab);

    afficherResultat('MALUS', carte.titre, carte.desc, `${perte} stabilité`, 'negatif');
}

function carteChance() {
    const j = jeu.joueurs[jeu.joueurActif];
    const carte = CARTES_CHANCE[Math.floor(Math.random() * CARTES_CHANCE.length)];

    // Carte de type question
    if (carte.type === 'question') {
        afficherQuestionChance(carte.difficulte);
        return;
    }

    // Carte de type choix
    if (carte.type === 'choix') {
        jeu.currentChoix = carte;
        afficherCarte('CHANCE', carte.titre, carte.desc,
            'Choisissez sans connaître les conséquences', 'neutre',
            `<button class="btn-oui" onclick="appliquerChoix('oui')">${carte.oui.label}</button>
             <button class="btn-non" onclick="appliquerChoix('non')">${carte.non.label}</button>`);
        return;
    }

    // Carte avec effet direct sur la stabilité
    let effet = carte.stab || 0;
    if (effet < 0) effet = appliquerPerte(effet);
    else j.stabilite += effet;

    const classe = effet > 0 ? 'positif' : (effet < 0 ? 'negatif' : 'neutre');
    const texte = effet >= 0 ? `+${effet}` : effet;

    afficherResultat('CHANCE', carte.titre, carte.desc, `${texte} stabilité`, classe);
}

function afficherQuestionChance(difficulte) {
    const questions = CARTES_QUESTIONS.filter(q => q.difficulte === difficulte && !jeu.questionsUtilisees.includes(q.id));

    if (questions.length === 0) {
        const j = jeu.joueurs[jeu.joueurActif];
        j.stabilite += 2;
        afficherResultat('CHANCE', 'Bonus automatique', 'Plus de questions disponibles', '+2 stabilité', 'positif');
        return;
    }

    const q = questions[Math.floor(Math.random() * questions.length)];
    jeu.questionsUtilisees.push(q.id);
    jeu.currentQuestion = q;

    const niveauLabel = { facile: 'Facile (+1)', moyen: 'Moyen (+2)', difficile: 'Difficile (+3)' };

    afficherCarte('QUESTION', `${niveauLabel[difficulte]}`, q.q,
        'Répondez correctement pour gagner des points !', 'neutre',
        `<div class="input-reponse">
            <input type="text" id="reponse-chance" placeholder="Votre réponse..." autocomplete="off">
            <button class="btn-principal" onclick="validerQuestionChance()">Valider</button>
        </div>`);

    setTimeout(() => {
        const input = document.getElementById('reponse-chance');
        if (input) {
            input.focus();
            input.onkeypress = (e) => { if (e.key === 'Enter') validerQuestionChance(); };
        }
    }, 100);
}

function validerQuestionChance() {
    const input = document.getElementById('reponse-chance');
    const reponse = input.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const j = jeu.joueurs[jeu.joueurActif];
    const q = jeu.currentQuestion;

    const bonnesReponses = q.r.split('|').map(r => r.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());
    const correct = bonnesReponses.some(r => reponse.includes(r) || r.includes(reponse));

    if (correct) {
        j.stabilite += q.bonus;
        afficherResultat('QUESTION', 'Bonne réponse !', `La réponse était : ${q.r.split('|')[0]}`, `+${q.bonus} stabilité`, 'positif');
    } else {
        afficherResultat('QUESTION', 'Mauvaise réponse', `La réponse était : ${q.r.split('|')[0]}`, '+0 stabilité', 'negatif');
    }
}

function carteBonus() {
    const j = jeu.joueurs[jeu.joueurActif];
    const carte = CARTES_BONUS[Math.floor(Math.random() * CARTES_BONUS.length)];

    j.stabilite += carte.stab;

    if (carte.ptsObjectif) {
        j.ptsObjectif = (j.ptsObjectif || 0) + carte.ptsObjectif;
    }

    if (carte.annuleMalus) {
        jeu.prochainMalusAnnule = true;
    }

    let texteEffet = carte.stab > 0 ? `+${carte.stab} stabilité` : '';
    if (carte.ptsObjectif) texteEffet += ` +${carte.ptsObjectif} objectif`;
    if (carte.annuleMalus) texteEffet = 'Prochain malus annulé !';

    afficherResultat('BONUS', carte.titre, carte.desc, texteEffet, 'positif');
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

    if (effet.ptsObjectif) {
        j.ptsObjectif = (j.ptsObjectif || 0) + effet.ptsObjectif;
    }

    const classe = stab >= 0 ? 'positif' : 'negatif';
    const texte = stab >= 0 ? `+${stab}` : stab;

    afficherResultat('CHOIX', effet.label, '', `${texte} stabilité`, classe);
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
    const objectifMax = diplome ? diplome.pts : 10;

    // Victoire par stabilité maximale
    if (j.stabilite >= 100) {
        terminerPartie(j, 'Victoire par stabilité maximale !');
        return true;
    }

    // Victoire par objectif rempli (si le joueur a accepté l'objectif)
    if (j.objectifAccepte && j.ptsObjectif >= objectifMax) {
        terminerPartie(j, `Objectif atteint : ${j.ptsObjectif}/${objectifMax} points !`);
        return true;
    }

    return false;
}

async function finTour() {
    if (verifierVictoire()) return;

    // Phase 2: Lancer de dé objectif (d3) si le joueur a accepté l'objectif
    const j = jeu.joueurs[jeu.joueurActif];
    if (j.objectifAccepte) {
        lancerDeObjectif();
        return; // La suite sera appelée par finTourApresObjectif
    }

    finTourApresObjectif();
}

function lancerDeObjectif() {
    const j = jeu.joueurs[jeu.joueurActif];
    const d3 = Math.floor(Math.random() * 3) + 1; // Résultat 1, 2 ou 3

    j.ptsObjectif = (j.ptsObjectif || 0) + d3;

    const diplome = DIPLOMES[j.diplomeObjectif];
    const objectifMax = diplome ? diplome.pts : 10;

    afficherCarte('OBJECTIF', `Dé Objectif: ${d3}`,
        `Vous gagnez ${d3} point(s) d'objectif !`,
        `${j.ptsObjectif}/${objectifMax} points`, 'positif',
        '<button class="btn-ok" onclick="finTourApresObjectif()">OK</button>');

    majInterface();

    // Vérifier victoire par objectif
    if (verifierVictoire()) return;
}

async function finTourApresObjectif() {
    // Sync player state if online
    await syncPlayerStateOnline();

    // Next player
    jeu.joueurActif = (jeu.joueurActif + 1) % jeu.joueurs.length;

    if (jeu.joueurActif === 0) {
        jeu.tour++;
        if (jeu.tour > jeu.maxTours) {
            const classement = [...jeu.joueurs].sort((a, b) => {
                // Priorité: objectif rempli, puis stabilité
                const aObj = a.objectifAccepte && a.ptsObjectif >= (DIPLOMES[a.diplomeObjectif]?.pts || 10);
                const bObj = b.objectifAccepte && b.ptsObjectif >= (DIPLOMES[b.diplomeObjectif]?.pts || 10);
                if (aObj && !bObj) return -1;
                if (!aObj && bObj) return 1;
                return b.stabilite - a.stabilite;
            });
            terminerPartie(classement[0], 'Fin de la partie (40 tours) !');
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
        pts_objectif: j.ptsObjectif || 0,
        objectif_accepte: j.objectifAccepte || false,
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
