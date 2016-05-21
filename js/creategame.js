/// <reference path="gameInfo.ts"/>
var GameInfoModel = (function () {
    function GameInfoModel() {
    }
    GameInfoModel.prototype.GetGameInfo = function (info) {
    };
    GameInfoModel.prototype.SetGameInfo = function () {
    };
    return GameInfoModel;
}());
var GameCreationController = (function () {
    function GameCreationController(gameModel) {
        this.gameModel = gameModel;
        this.model = gameModel;
    }
    GameCreationController.prototype.AddNewGame = function () {
        var info = new GameInfo;
        var name = document.getElementsByName("gameName").item(0).value;
        var planesPerPlayer = document.getElementsByName("planesCount").item(0).value;
    };
    return GameCreationController;
}());
function GameCreationMain() {
    var creationForm = document.getElementById("gameCreationForm");
    var model = new GameInfoModel();
    var controller = new GameCreationController(model);
    var addGame = document.getElementsByName("addGame").item(0);
    creationForm.style.display = "block";
    addGame.onclick = function () { controller.AddNewGame(); };
}
//# sourceMappingURL=creategame.js.map