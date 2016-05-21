/// <reference path="player.ts"/>

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
    constructor(name:string,status:string,maxPl:number,plPerPl:number,map:vec2) {
        this.name=name;
        this.status=status;
        this.maxNoPlayers=maxPl;
        this.planesPerPlayer=plPerPl;
        this.mapSize=map;
    }
}

class GameInfo extends Lobby
{
    curNoPlayers : number = 0;
    players : Array<Player> = [];
    constructor(name:string,status:string,maxPl:number,plPerPl:number,map:vec2,curPl:number,pls:Player[]) {
        super(name,status,maxPl,plPerPl,map);
        this.curNoPlayers=curPl;
        this.players=pls;
    }
}

interface JoinGame
{
    init(numberOfLobbies : number) : void
    onAdd(callback: (item : GameInfo) => void) : void
    onRemove(callback: (name : string) => void) : void 
    join(name : string, joined: (success : boolean) => void, startGame: (game : GameInfo) => void) : void
}

interface CreateGame
{
    create(board : GameInfo, callback: (success : boolean) => void)
}

interface LobbyController
{
    
}

interface LobbyView
{
    
}

class TestLobbyModel implements JoinGame
{
    init(numberOfGames : number) : void {
        
    }
    onAdd(callback: (item : GameInfo) => void) : void {
        
    }
    onRemove(callback: (name: string) => void) : void {
        
    }
    join(name : string, joined: (success : boolean) => void, startGame: (game : GameInfo) /*(players included)*/ => void) : void {
        
    }
}

function InitLobby() {
    var lobbyModel : JoinGame = new TestLobbyModel()
    
}
