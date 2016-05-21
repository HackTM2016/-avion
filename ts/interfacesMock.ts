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
