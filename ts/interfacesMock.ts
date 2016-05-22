/// <reference path="interfaces.ts"/>


class PlayerAuthMock implements PlayerAuth
{
    login(name:string, callback: (success : boolean) => void) {
        callback(true);
    }
    logout() : void {}
}

class JoinGameMock implements JoinGame
{
    n : number
    addGame : (item: Lobby) => void
    removeGame : (name: string) => void
    
    init(numberOfLobbies : number, 
        onAdd: (item : Lobby) => void, 
        onRemove: (name : string) => void) : void
    {
        this.n = numberOfLobbies  
        this.addGame = onAdd; 
        this.removeGame = onRemove;
    }
    join(name : string, 
         callback: (success : boolean) => void) : void
    {
        callback(true);
    }
}

class CreateGameMock implements CreateGame
{
    create(board : Lobby, 
           callback: (success : boolean) => void) 
    {
        callback(true);
    }
}

class SetupGameMock implements SetupGame
{
    init(onAdd: (player : Player) => void, 
         onRemove: (name : string) => void,
         onUpdate: (player : Player) => void) : void
    {
        
    }
    ready(callback: (success : boolean) => void, 
          onStartGame: () => void) : void
    {
        
    }
}

class GameEventsMock implements GameEvents 
{
    shotNumber: number = 100
    onAttack: (coord:vec2, playerName : string) => GameEventType 
    onPlayerDrop: (playerName:string) => void 
    onGameChange: (status:GameStatusType) => void
    
    ionPlanePos : vec2 = { x: Math.floor(Math.random() * 14), y: Math.floor(Math.random() * 14) }
    bluePlanePos : vec2 = { x: Math.floor(Math.random() * 14), y: Math.floor(Math.random() * 14) }
    
    ionAlive : boolean = true
    blueAlive : boolean = true
    
    init(onAttack: (coord:vec2, playerName : string) => GameEventType, 
         onPlayerDrop: (playerName:string) => void, 
         onGameChange: (status:GameStatusType) => void)
    {
         this.onAttack = onAttack
         this.onPlayerDrop = onPlayerDrop
         this.onGameChange = onGameChange
    }
    shoot(pos:vec2, effect: (coord:vec2, type: GameEventType, playerName : string) => void)
    {
        var ionHit = hitPlane(this.ionPlanePos, pos)
        effect(pos, ionHit, "Ion")
        if (ionHit == GameEventType.Kill) {
            this.ionAlive = false;
        }
        var blueHit = hitPlane(this.bluePlanePos, pos)
        effect(pos, blueHit, "Blue")
        if (blueHit == GameEventType.Kill) {
            this.blueAlive = false;
        }
        
        if (this.ionAlive) {
            this.onAttack( { x : Math.floor(Math.random() * 19), y : Math.floor(Math.random() * 19) }, "Ion" )
        }
        
        if (this.blueAlive) {
            this.onAttack( { x : Math.floor(Math.random() * 19), y : Math.floor(Math.random() * 19) }, "Blue" )
        }
        
        if (!this.blueAlive && !this.ionAlive) {
            this.onGameChange(GameStatusType.OverSuccess)
        }
    }
}

function hitPlane(planePos, hitPos) : any {
    return GameEventType.Miss
}
