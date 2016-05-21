/// <reference path="gameInfo.ts"/>
/// <reference path="gameInfoMock.ts"/>
/// <reference path="creategame.ts"/>
/// <reference path="joinGame.ts"/>
var Startup = (function () {
    function Startup() {
        this.playerName = "";
        this.playerDefinition = new PlayerDefinitionModelMock;
    }
    Startup.init = function () {
        var startup = document.getElementById("startup");
        startup.hidden = false;
        var controller = new Startup;
        controller.div = startup;
        var playerName = startup.children.namedItem("playerName");
        playerName.onclick = function () { controller.changeName(this); };
        var createGame = startup.children.namedItem("createGame");
        createGame.onclick = function () { controller.createGame(this); };
        var joinGame = startup.children.namedItem("joinGame");
        joinGame.onclick = function () { controller.joinGame(this); };
    };
    Startup.prototype.changeName = function (elem) {
        this.playerName = elem.value;
    };
    Startup.prototype.createGame = function (elem) {
        this.playerDefinition.setPlayerName(this.playerName, this.createSelector(this.moveToCreate));
    };
    Startup.prototype.joinGame = function (elem) {
        this.playerDefinition.setPlayerName(this.playerName, this.createSelector(this.moveToJoin));
    };
    Startup.prototype.createSelector = function (move) {
        var _this = this;
        return function (success) {
            if (success) {
                _this.div.hidden = true;
                move();
            }
            else {
                alert("wrong name");
            }
        };
    };
    Startup.prototype.moveToCreate = function () {
        CreateGameForm.init();
    };
    Startup.prototype.moveToJoin = function () {
        JoinGameForm.init();
    };
    return Startup;
}());
//# sourceMappingURL=startup.js.map