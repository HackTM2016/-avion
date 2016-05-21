/// <reference path="gameInfo.ts"/>

class GameInfoModel
{
    constructor(public info){
        
    }
    
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
        this.model.SetGameInfo
    }
    
}

interface GameCreationView
{
    
}


