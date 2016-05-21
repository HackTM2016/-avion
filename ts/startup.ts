/// <reference path="interfaces.ts"/>
/// <reference path="creategame.ts"/>
/// <reference path="joinGame.ts"/>

/// <reference path="interfacesMock.ts"/>

class Startup
{
    playerName: string = ""
    playerAuth: PlayerAuth = new PlayerAuthMock
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
        this.playerAuth.login(
            this.playerName,
            (s: boolean)=>{ this.createSelector(s, GameCreationMain) })
    }
    
    joinGame(elem: HTMLButtonElement) : void {
        this.playerAuth.login(
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

