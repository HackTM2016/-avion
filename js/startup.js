var StartupModel = (function () {
    function StartupModel() {
    }
    return StartupModel;
}());
var StartupController = (function () {
    function StartupController() {
    }
    StartupController.prototype.changeName = function () {
        this.model.playerName;
    };
    StartupController.prototype.createGame = function () {
    };
    StartupController.prototype.joinGame = function () {
    };
    return StartupController;
}());
var StartupView = (function () {
    function StartupView() {
    }
    return StartupView;
}());
function Startup() {
    var startup = document.getElementById("startup");
    startup.hidden = false;
    var controller = new StartupController;
    var playerName = startup.children.namedItem("playerName");
    playerName.onclick = controller.changeName;
    var createGame = startup.children.namedItem("createGame");
    createGame.onclick = controller.createGame;
    var joinGame = startup.children.namedItem("joinGame");
    joinGame.onclick = controller.joinGame;
}
Startup();
//# sourceMappingURL=startup.js.map