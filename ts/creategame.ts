/// <reference path="gameInfo.ts"/>

class GameInfoModel
{
    constructor(public info){
        
    }

}


interface CreateGameController
{
    
}

interface CreateGameView
{
    
}


class CreateGameForm
{
    static init() : void {
        var createGameForm = <HTMLElement>document.getElementById("gameCreationForm")
        createGameForm.hidden = false
    }
}

