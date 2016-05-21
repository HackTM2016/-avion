/// <reference path="gameInfo.ts"/>

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
        var info = new GameInfo
        var name = (<HTMLInputElement>document.getElementsByName("gameName").item(0)).value
        var planesPerPlayer = (<HTMLInputElement>document.getElementsByName("planesCount").item(0)).value
    }
    
}

function GameCreationMain() {
    var creationForm = <HTMLElement>document.getElementById("gameCreationForm")
    var model = new GameInfoModel()
    var controller = new GameCreationController(model)
    var addGame = <HTMLButtonElement>document.getElementsByName("addGame").item(0)
    creationForm.style.display = "block"
    addGame.onclick = function() { controller.AddNewGame() }   
}

