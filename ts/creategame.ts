/// <reference path="interfaces.ts"/>
/// <reference path="gameutils.ts"/>

class GameInfoModel
{
    GetGameInfo(info){
        
    }
    
    SetGameInfo(){
        
    }

}

class GameCreationController
{
    model: GameInfoModel;
    
    constructor(public gameModel){
        this.model = gameModel;
    }
    AddNewGame(){
        var info = new Lobby
        var name = (<HTMLInputElement>document.getElementsByName("gameName").item(0)).value
        var planesPerPlayer = (<HTMLInputElement>document.getElementsByName("planesCount").item(0)).value
        var maxPlayerCount = (<HTMLInputElement>document.getElementsByName("maxPlayerCount").item(0)).value
        
        SetInvisibleDiv("gameCreationForm")
        InitGame(info)
    }
    
}


function GameCreationMain() {
    var creationForm = <HTMLElement>document.getElementById("gameCreationForm")
    var model = new GameInfoModel()
    var controller = new GameCreationController(model)
    var addGame = <HTMLButtonElement>document.getElementsByName("addGame").item(0)
    
    SetVisibleDiv("gameCreationForm")
    
    addGame.onclick = function() { controller.AddNewGame() }   
}

