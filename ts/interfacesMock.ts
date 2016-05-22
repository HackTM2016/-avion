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
    
    init(onAttack: (coord:vec2, playerName : string) => GameEventType, 
         onPlayerDrop: (playerName:string) => void, 
         onGameChange: (status:GameStatusType) => void)
    {
         this.shotNumber = 40
         this.onAttack = onAttack
         this.onPlayerDrop = onPlayerDrop
         this.onGameChange = onGameChange
    }
    shoot(pos:vec2, effect: (coord:vec2, type: GameEventType, playerName : string) => void)
    {
        effect(pos, Math.floor(Math.random() * 3), "Ion")
        effect(pos, Math.floor(Math.random() * 3), "Blue")

        this.onAttack( { x : Math.floor(Math.random() * 19), y : Math.floor(Math.random() * 19) }, "Ion" )
        this.onAttack( { x : Math.floor(Math.random() * 19), y : Math.floor(Math.random() * 19) }, "Blue" )
        
        if (this.shotNumber == 20) {
            this.onPlayerDrop("Ion")
        }
        if (this.shotNumber == 0) {
            this.onGameChange(Math.floor(Math.random() * 3))
        }
        this.shotNumber -= 1;
    }
}

