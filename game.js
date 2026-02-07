// ==========================================
// INSERTION PRO - VERSION ÉQUILIBRÉE
// Ajustements gameplay par game designer senior
// ==========================================

const COULEURS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'];

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

// CARTES ÉTUDES (équilibrées +2 à +6 stab, max +1 diplôme)
const CARTES_ETUDES = [
    { titre: "Révisions", desc: "Travail acharné.", ptsDiplome: 1, stab: 0 },
    { titre: "Stage court", desc: "Expérience enrichissante.", ptsDiplome: 1, stab: 2 },
    { titre: "Cours du soir", desc: "Formation continue.", ptsDiplome: 1, stab: -2 },
    { titre: "Projet groupe", desc: "Collaboration réussie.", ptsDiplome: 0, stab: 4 },
    { titre: "Mentorat", desc: "Un expert vous guide.", ptsDiplome: 0, stab: 5 }
];

// CARTES TRAVAIL (équilibrées)
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

// CARTES RESSOURCES (rééquilibrées - moins de +diplôme)
const CARTES_RESSOURCES = [
    { type: 'stabilite', nom: 'Économies', icon: '💰', effet: '+5 stabilité', action: (j) => { j.stabilite += 5; } },
    { type: 'stabilite', nom: 'Soutien', icon: '🤝', effet: '+4 stabilité', action: (j) => { j.stabilite += 4; } },
    { type: 'protection', nom: 'Assurance', icon: '🛡️', effet: 'Réduit prochaine perte', action: null },
    { type: 'reseau', nom: 'Contact', icon: '📞', effet: '+3 stabilité', action: (j) => { j.stabilite += 3; } },
    { type: 'chance', nom: 'Coup de pouce', icon: '🍀', effet: '+2 stabilité', action: (j) => { j.stabilite += 2; } }
];

// CARTES CHOIX (conséquences CACHÉES)
const CARTES_CHOIX = [
    { titre: "Opportunité risquée", desc: "On vous propose un projet ambitieux mais incertain.", oui: { stab: 6, label: 'Accepter' }, non: { stab: -2, label: 'Refuser' } },
    { titre: "Heures sup ?", desc: "Travail supplémentaire demandé.", oui: { stab: 4, label: 'Accepter' }, non: { stab: -3, label: 'Refuser' } },
    { titre: "Aider un collègue", desc: "Il a besoin d'aide urgente.", oui: { stab: 3, differe: true, label: 'Aider' }, non: { stab: -4, label: 'Ignorer' } },
    { titre: "Avouer une erreur", desc: "Vous avez fait une faute.", oui: { stab: 5, label: 'Avouer' }, non: { stab: -6, label: 'Cacher' } },
    { titre: "Formation weekend", desc: "Améliorer vos compétences ?", oui: { stab: -2, ptsDiplome: 1, label: 'Y aller' }, non: { stab: 2, label: 'Repos' } },
    { titre: "Déménagement", desc: "Emploi mieux payé, mais loin.", oui: { stab: 4, label: 'Partir' }, non: { stab: -2, label: 'Rester' } }
];

// CARTES SPÉCIALES (rares, effets modérés)
const CARTES_SPECIAL_SALARIE = [
    { titre: "Promotion", desc: "Montée en grade !", stab: 6 },
    { titre: "Burn-out léger", desc: "Fatigue accumulée.", stab: -5 }
];

const CARTES_SPECIAL_ENTREPRENEUR = [
    { titre: "Gros contrat", desc: "Un client majeur !", stab: 8 },
    { titre: "Projet échoué", desc: "Un investissement perdu.", stab: -6 }
];

// CARTES ÉCHEC (modérées)
const CARTES_ECHEC = [
    { titre: "Procrastination", desc: "Temps perdu.", stab: -2 },
    { titre: "Imprévu", desc: "Journée perturbée.", stab: -3 },
    { titre: "Fatigue", desc: "Vous êtes épuisé.", stab: -2 }
];

// ÉTAT DU JEU
let jeu = {
    joueurs: [],
    joueurActif: 0,
    tour: 1,
    maxTours: 30, // DÉMO 30 TOURS
    phase: 'accueil',
    deBloque: true,
    questionsUtilisees: [], // IDs des questions déjà posées
    effetsDifferes: [] // Effets pour le tour suivant
};

// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-nb').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-nb').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            genererJoueurs(parseInt(btn.dataset.nb));
        });
    });

    document.getElementById('btn-commencer').addEventListener('click', demarrerPreparation);
    document.getElementById('btn-rejouer').addEventListener('click', () => location.reload());

    genererJoueurs(2);
});

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
// PRÉPARATION : DIPLÔME ALÉATOIRE + ACCEPTER/REFUSER
// ==========================================

function demarrerPreparation() {
    const nb = parseInt(document.querySelector('.btn-nb.active').dataset.nb);
    const diplomesKeys = Object.keys(DIPLOMES);

    // Reset questions utilisées (nouvelle seed)
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

    // Bouton accepter/refuser diplôme
    document.getElementById('btn-continuer-role').innerHTML = `
        <button class="btn-principal" style="margin-right:10px" onclick="accepterDiplome()">Accepter le défi</button>
        <button class="btn-secondaire" onclick="refuserDiplome()">Refuser (pas de malus)</button>
    `;
}

function accepterDiplome() {
    const j = jeu.joueurs[jeu.joueurActif];
    // 1 à 3 questions aléatoires
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

    // Si échec aux questions : malus léger (-1 à -5)
    if (jeu.prepBonnesReponses < jeu.prepQuestions) {
        const malus = 1 + Math.floor(Math.random() * 5);
        j.stabilite -= malus;
        j.diplomeRefuse = true; // Commence sans diplôme validé

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

function majInterface() {
    const j = jeu.joueurs[jeu.joueurActif];
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
        const stabPct = Math.max(0, Math.min(100, (p.stabilite + 50) / 1.5)); // -50 à 100 mappé sur 0-100%
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

    const slots = document.getElementById('slots-ressources');
    slots.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const res = j.ressources[i];
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
    deCube.classList.toggle('disabled', jeu.deBloque);
    document.getElementById('de-instruction').textContent = jeu.deBloque ? 'Terminez l\'action' : 'Cliquez sur le dé';
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

    majInterface();
}

// ==========================================
// DÉ
// ==========================================

function lancerDe() {
    if (jeu.deBloque) return;

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

    // Bonus passif salarié (+2/tour)
    if (j.role === 'salarie') j.stabilite += 2;

    // Appliquer effets différés du tour précédent
    appliquerEffetsDifferes();

    // Instabilité des diplômes bas
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
    j.stabilite += perte; // perte est négatif
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

    // Progression bloquée si stabilité trop basse
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
        // Max +1 pt diplôme par tour
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

    // Conséquences CACHÉES
    afficherCarte('CHOIX', `❓ ${carte.titre}`, carte.desc,
        'Choisissez sans connaître les conséquences', 'neutre',
        `<button class="btn-oui" onclick="appliquerChoix('oui')">${carte.oui.label}</button>
         <button class="btn-non" onclick="appliquerChoix('non')">${carte.non.label}</button>`);
}

function appliquerChoix(choix) {
    const j = jeu.joueurs[jeu.joueurActif];
    const effet = jeu.currentChoix[choix];

    let stab = effet.stab;

    // Effet différé ?
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

    // Victoire : 100 stabilité OU diplôme + stabilité min
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

function finTour() {
    if (verifierVictoire()) return;

    // Prochain joueur
    jeu.joueurActif = (jeu.joueurActif + 1) % jeu.joueurs.length;

    // Nouveau tour ?
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

    jeu.deBloque = false;
    document.getElementById('carte-piochee').classList.add('hidden');
    document.getElementById('de-resultat').classList.add('hidden');
    majInterface();
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

    const medals = ['🥇', '🥈', '🥉', '4️⃣'];
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
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
