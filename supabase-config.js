// Supabase Configuration for Insertion Pro Multiplayer
// Project: kaqmfqdmtunivlwzvfcv (insertion-pro)

const SUPABASE_URL = 'https://kaqmfqdmtunivlwzvfcv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcW1mcWRtdHVuaXZsd3p2ZmN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NjMxMzgsImV4cCI6MjA4NjAzOTEzOH0.S17c95-woT9N2F37uiLCoSsD3PuYfLZkLq6ekZVPw9A';

// Initialize Supabase client (using window.supabaseLib to avoid conflicts)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generate unique player ID (persisted in localStorage)
function getPlayerId() {
    let playerId = localStorage.getItem('insertion_pro_player_id');
    if (!playerId) {
        playerId = 'player_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('insertion_pro_player_id', playerId);
    }
    return playerId;
}

// Generate room code (6 uppercase letters)
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O to avoid confusion
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Room Management Functions
const RoomManager = {
    currentRoom: null,
    currentPlayer: null,
    roomSubscription: null,
    playersSubscription: null,

    // Create a new room
    async createRoom(playerName, maxPlayers = 8) {
        const playerId = getPlayerId();
        const code = generateRoomCode();

        try {
            // Create room
            const { data: room, error: roomError } = await supabaseClient
                .from('game_rooms')
                .insert({
                    code: code,
                    host_id: playerId,
                    status: 'waiting',
                    max_players: maxPlayers,
                    game_state: {}
                })
                .select()
                .single();

            if (roomError) throw roomError;

            // Add host as first player
            const { data: player, error: playerError } = await supabaseClient
                .from('room_players')
                .insert({
                    room_id: room.id,
                    player_id: playerId,
                    player_name: playerName,
                    player_index: 0,
                    color: COULEURS[0],
                    is_ready: false
                })
                .select()
                .single();

            if (playerError) throw playerError;

            this.currentRoom = room;
            this.currentPlayer = player;

            await this.subscribeToRoom(room.id);

            return { success: true, room, player };
        } catch (error) {
            console.error('Error creating room:', error);
            return { success: false, error: error.message };
        }
    },

    // Join existing room
    async joinRoom(code, playerName) {
        const playerId = getPlayerId();

        try {
            // Find room
            const { data: room, error: roomError } = await supabaseClient
                .from('game_rooms')
                .select('*')
                .eq('code', code.toUpperCase())
                .single();

            if (roomError || !room) {
                return { success: false, error: 'Salle introuvable' };
            }

            if (room.status !== 'waiting') {
                return { success: false, error: 'La partie a déjà commencé' };
            }

            // Check player count
            const { data: players, error: playersError } = await supabaseClient
                .from('room_players')
                .select('*')
                .eq('room_id', room.id);

            if (playersError) throw playersError;

            if (players.length >= room.max_players) {
                return { success: false, error: 'La salle est pleine' };
            }

            // Check if player already in room
            const existingPlayer = players.find(p => p.player_id === playerId);
            if (existingPlayer) {
                // Reconnect
                await supabaseClient
                    .from('room_players')
                    .update({ is_connected: true, player_name: playerName })
                    .eq('id', existingPlayer.id);

                this.currentRoom = room;
                this.currentPlayer = existingPlayer;
                await this.subscribeToRoom(room.id);
                return { success: true, room, player: existingPlayer, reconnected: true };
            }

            // Add new player
            const playerIndex = players.length;
            const { data: player, error: playerError } = await supabaseClient
                .from('room_players')
                .insert({
                    room_id: room.id,
                    player_id: playerId,
                    player_name: playerName,
                    player_index: playerIndex,
                    color: COULEURS[playerIndex],
                    is_ready: false
                })
                .select()
                .single();

            if (playerError) throw playerError;

            this.currentRoom = room;
            this.currentPlayer = player;

            await this.subscribeToRoom(room.id);

            return { success: true, room, player };
        } catch (error) {
            console.error('Error joining room:', error);
            return { success: false, error: error.message };
        }
    },

    // Subscribe to room updates
    async subscribeToRoom(roomId) {
        // Unsubscribe from previous
        if (this.roomSubscription) {
            this.roomSubscription.unsubscribe();
        }
        if (this.playersSubscription) {
            this.playersSubscription.unsubscribe();
        }

        // Subscribe to room changes
        this.roomSubscription = supabaseClient
            .channel(`room_${roomId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'game_rooms',
                filter: `id=eq.${roomId}`
            }, (payload) => {
                this.currentRoom = payload.new;
                if (typeof onRoomUpdate === 'function') {
                    onRoomUpdate(payload.new);
                }
            })
            .subscribe();

        // Subscribe to players changes
        this.playersSubscription = supabaseClient
            .channel(`players_${roomId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'room_players',
                filter: `room_id=eq.${roomId}`
            }, (payload) => {
                if (typeof onPlayersUpdate === 'function') {
                    this.getPlayers().then(players => {
                        onPlayersUpdate(players);
                    });
                }
            })
            .subscribe();
    },

    // Get all players in room
    async getPlayers() {
        if (!this.currentRoom) return [];

        const { data, error } = await supabaseClient
            .from('room_players')
            .select('*')
            .eq('room_id', this.currentRoom.id)
            .order('player_index');

        return error ? [] : data;
    },

    // Update player state
    async updatePlayer(updates) {
        if (!this.currentPlayer) return;

        const { error } = await supabaseClient
            .from('room_players')
            .update(updates)
            .eq('id', this.currentPlayer.id);

        if (!error) {
            Object.assign(this.currentPlayer, updates);
        }
        return !error;
    },

    // Update room state (host only)
    async updateRoom(updates) {
        if (!this.currentRoom) return;

        const { error } = await supabaseClient
            .from('game_rooms')
            .update(updates)
            .eq('id', this.currentRoom.id);

        if (!error) {
            Object.assign(this.currentRoom, updates);
        }
        return !error;
    },

    // Start game (host only)
    async startGame(gameState) {
        if (!this.isHost()) return false;

        return this.updateRoom({
            status: 'preparation',
            game_state: gameState
        });
    },

    // Check if current player is host
    isHost() {
        return this.currentRoom && this.currentPlayer &&
            this.currentRoom.host_id === getPlayerId();
    },

    // Leave room
    async leaveRoom() {
        if (this.currentPlayer) {
            await supabaseClient
                .from('room_players')
                .update({ is_connected: false })
                .eq('id', this.currentPlayer.id);
        }

        if (this.roomSubscription) {
            this.roomSubscription.unsubscribe();
        }
        if (this.playersSubscription) {
            this.playersSubscription.unsubscribe();
        }

        this.currentRoom = null;
        this.currentPlayer = null;
    },

    // Sync game state
    async syncGameState(state) {
        return this.updateRoom({ game_state: state });
    },

    // Sync player state
    async syncPlayerState(playerData) {
        return this.updatePlayer(playerData);
    }
};

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (RoomManager.currentPlayer) {
        navigator.sendBeacon && navigator.sendBeacon(
            `${SUPABASE_URL}/rest/v1/room_players?id=eq.${RoomManager.currentPlayer.id}`,
            JSON.stringify({ is_connected: false })
        );
    }
});
