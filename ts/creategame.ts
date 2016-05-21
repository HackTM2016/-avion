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
        //info.name = document.getElementsByName("gameName").item(0).getAttribute("value")
        var input_name = <HTMLInputElement>document.getElementsByName("gameName").item(0)
        var name = input_name.getAttribute("value")
        info.numberOfPlayers = +document.getElementsByName("teamSize").item(0).getAttribute("value")
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

