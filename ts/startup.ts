/// <reference path="gameInfo.ts"/>
/// <reference path="gameInfoMock.ts"/>
/// <reference path="creategame.ts"/>
/// <reference path="joinGame.ts"/>

class Startup
{
    playerName: string = ""
    playerDefinition: PlayerDefinitionModel = new PlayerDefinitionModelMock
    div: HTMLElement = <HTMLElement>document.getElementById("startup")

    static init() : void {
        var startup = new Startup
        startup.div.style.display = "block";
        
        var playerName = <HTMLInputElement>startup.div.children.namedItem("playerName")
        playerName.onclick = function () { startup.changeName(this) }
        
        var createGame = <HTMLButtonElement>startup.div.children.namedItem("createGame")
        createGame.onclick = function () { startup.createGame(this) }
        
        var joinGame = <HTMLButtonElement>startup.div.children.namedItem("joinGame")
        joinGame.onclick = function () { startup.joinGame(this) }
    }
    
    changeName(elem: HTMLInputElement) : void {
        this.playerName = elem.value
    }
    
    createGame(elem: HTMLButtonElement) : void {
        this.playerDefinition.setPlayerName(
            this.playerName,
            (s: boolean)=>{ this.createSelector(s, CreateGameForm.init) })
    }
    
    joinGame(elem: HTMLButtonElement) : void {
        this.playerDefinition.setPlayerName(
            this.playerName,
            (s: boolean)=>{ this.createSelector(s, JoinGameForm.init) })
    }
    
    createSelector(success: boolean, move: () => void) : any {
        if (success) {
            this.div.style.display = "none";
            move()
        }
        else {
            alert("wrong name");
        }
    }
}

