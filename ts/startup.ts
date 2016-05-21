/// <reference path="gameInfo.ts"/>
/// <reference path="gameInfoMock.ts"/>
/// <reference path="creategame.ts"/>
/// <reference path="joinGame.ts"/>

class Startup
{
    playerName: string = ""
    playerDefinition: PlayerDefinitionModel = new PlayerDefinitionModelMock
    div: HTMLElement

    static init() : void {
        var startup = <HTMLElement>document.getElementById("startup")
        startup.hidden = false
        
        var controller = new Startup
        controller.div = startup
        
        var playerName = <HTMLInputElement>startup.children.namedItem("playerName")
        playerName.onclick = function () { controller.changeName(this) }
        
        var createGame = <HTMLButtonElement>startup.children.namedItem("createGame")
        createGame.onclick = function () { controller.createGame(this) }
        
        var joinGame = <HTMLButtonElement>startup.children.namedItem("joinGame")
        joinGame.onclick = function () { controller.joinGame(this) }
    }
    
    changeName(elem: HTMLInputElement) : void {
        this.playerName = elem.value
    }
    
    createGame(elem: HTMLButtonElement) : void {
        this.playerDefinition.setPlayerName(
            this.playerName,
            this.createSelector(this.moveToCreate));
    }
    
    joinGame(elem: HTMLButtonElement) : void {
        this.playerDefinition.setPlayerName(
            this.playerName,
            this.createSelector(this.moveToJoin));
    }
    
    createSelector(move: () => void) : any {
        return (success: boolean) => {
            if (success) {
                this.div.hidden = true;
                move()
            }
            else {
                alert("wrong name");
            }
        }
    }
    
    moveToCreate() : void {
        CreateGameForm.init()
    }
    
    moveToJoin() : void {
        JoinGameForm.init();
    }
}

