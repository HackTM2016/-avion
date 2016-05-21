/// <reference path="gameInfo.ts"/>

interface LobbyModel
{
    init(numberOfGames : number) : void
    onAdd(callback: (item : GameInfo) => void) : void
    onRemove(callback: (id: Identifier) => void) : void
}

interface GameCreator
{
    create(board : GameInfo)
    join(id : Identifier)
}

interface LobbyController
{
    
}

interface LobbyView
{
    
}

class TestLobbyModel implements LobbyModel
{
    init(numberOfGames : number) : void {
        
    }
    onAdd(callback: (item : GameInfo) => void) : void {
        
    }
    onRemove(callback: (id: Identifier) => void) : void {
        
    }
}

function InitLobby() {
    var lobbyModel : LobbyModel = new TestLobbyModel
    
}
