
class StartupModel
{
    playerName : string
}

class StartupController
{
    model : StartupModel
    
    changeName() : void {
        this.model.playerName
    }
    
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
    startup.hidden = false
    
    var controller = new StartupController
    
    var playerName = <HTMLInputElement>startup.children.namedItem("playerName")
    playerName.onclick = controller.changeName
    
    var createGame = <HTMLButtonElement>startup.children.namedItem("createGame")
    createGame.onclick = controller.createGame
    
    var joinGame = <HTMLButtonElement>startup.children.namedItem("joinGame")
    joinGame.onclick = controller.joinGame
}

Startup()
