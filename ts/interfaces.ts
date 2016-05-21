enum GameEventType {
    Miss,
    Hit,
    Kill,
}

enum GameStatusType {
    Playing,
    OverSuccess,
    OverLost,
    Disconnected
}

enum LobbyStatusType {
    Open,
    Setup,
    Closed
}

enum PlayerStatusType {
    Online,
    Setup,
    Ready,
    Offline
}

class vec2
{
    x : number = 0;
    y : number = 0;    
}

class Player {
    name:string;
    status:PlayerStatusType;
}

interface PlayerAuth
{
    login(name:string, callback: (success : boolean) => void);
    logout() : void;
}

class Lobby {
    name : string = "newLoby";
    status : LobbyStatusType = LobbyStatusType.Open;
    maxNoPlayers : number = 2;
    planesPerPlayer : number = 1;
    mapSize : vec2 = {x:10,y:10};
}

interface JoinGame
{
    init(numberOfLobbies : number, 
         onAdd: (item : Lobby) => void, 
         onRemove: (name : string) => void) : void
    join(name : string, 
         callback: (success : boolean) => void) : void
}

interface CreateGame
{
    create(board : Lobby, 
           callback: (success : boolean) => void) 
}

interface SetupGame
{
    init(onAdd: (player : Player) => void, 
         onRemove: (name : string) => void,
         onUpdate: (player : Player) => void) : void
    ready(callback: (success : boolean) => void, 
          onStartGame: () => void) : void
}

interface GameEvents {
    init(onAttack: (coord:vec2, playerName : string) => GameEventType, 
         onPlayerDrop: (playerName:string) => void, 
         onGameChange: (status:GameStatusType) => void)
    shoot(pos:vec2, effect: (coord:vec2, type: GameEventType, playerName : string) => void)
}
