/// <reference path="interfaces.ts"/>
/// <reference path="creategame.ts"/>
/// <reference path="joinGame.ts"/>

/// <reference path="interfacesMock.ts"/>

/// <reference path="game.ts"/>

class Startup
{
    playerName: string = ""
    playerAuth: PlayerAuth = new PlayerAuthMock

    static init() : void {
        var startup = new Startup
        var div = <HTMLElement>document.getElementById("startup")
        SetVisibleDiv("startup")
        
        var playerName = <HTMLInputElement>div.children.namedItem("playerName")
        playerName.onclick = function () { startup.changeName(this) }
        
        var createGame = <HTMLButtonElement>div.children.namedItem("createGame")
        createGame.onclick = function () { startup.createGame(this) }
        
        var joinGame = <HTMLButtonElement>div.children.namedItem("joinGame")
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
            SetInvisibleDiv("startup")
            move()
        }
        else {
            alert("wrong name");
        }
    }
}

