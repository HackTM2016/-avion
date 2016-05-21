
class StartupModel
{
    playerName : string
}

class StartupController
{
    createGame() : void {
        
    }
    
    joinGame() : void {
        
    }

}

class StartupView
{
    
}

function Startup() {
    var startup = <HTMLElement>document.getElementById("startup")
    //startup.hidden = false
    
    var controller = new StartupController
    
    var createGame = <HTMLButtonElement>startup.children.namedItem("createGame")
    createGame.onclick = function() { controller.createGame() }
    
    var joinGame = <HTMLButtonElement>startup.children.namedItem("joinGame")
    joinGame.onclick = controller.joinGame
    
    
}
