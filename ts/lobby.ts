/// <reference path="player.ts"/>
type PlayerList = Array<string>

class vec2
{
    x : number = 0;
    y : number = 0;    
}

class Lobby{
    name : string = "newLoby";
    status : string = "open";
    maxNoPlayers : number = 2;
    planesPerPlayer : number = 1;
    mapSize : vec2 = {x:10,y:10};
}

class GameInfo extends Lobby
{
    curNoPlayers : number = 0;
    players : PlayerList = [];
}

interface JoinGame
{
    init(numberOfLobbies : number, 
         onAdd: (item : GameInfo) => void, 
         onRemove: (name : string) => void) : void
    join(name : string, 
         onJoin: (success : boolean) => void, onStartGame: (game : GameInfo) => void) : void
}

interface CreateGame
{
    create(board : GameInfo, 
           callback: (success : boolean) => void)
}

interface LobbyController
{
    
}

interface LobbyView
{
    
}

class TestLobbyModel implements JoinGame
{
    init(numberOfGames : number, onAdd: (item : GameInfo) => void, onRemove: (name: string) => void) : void {
        
    }
    join(name : string, joined: (success : boolean) => void, startGame: (game : GameInfo) /*(players included)*/ => void) : void {
        
    }
}

function InitLobby() {
    var lobbyModel : JoinGame = new TestLobbyModel()
    
}
