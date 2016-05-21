/// <reference path="gameInfo.ts"/>
/// <reference path="gameInfoMock.ts"/>
/// <reference path="creategame.ts"/>
/// <reference path="joinGame.ts"/>
var Startup = (function () {
    function Startup() {
        this.playerName = "";
        this.playerDefinition = new PlayerDefinitionModelMock;
        this.div = document.getElementById("startup");
    }
    Startup.init = function () {
        var startup = new Startup;
        startup.div.style.display = "block";
        var playerName = startup.div.children.namedItem("playerName");
        playerName.onclick = function () { startup.changeName(this); };
        var createGame = startup.div.children.namedItem("createGame");
        createGame.onclick = function () { startup.createGame(this); };
        var joinGame = startup.div.children.namedItem("joinGame");
        joinGame.onclick = function () { startup.joinGame(this); };
    };
    Startup.prototype.changeName = function (elem) {
        this.playerName = elem.value;
    };
    Startup.prototype.createGame = function (elem) {
        var _this = this;
        this.playerDefinition.setPlayerName(this.playerName, function (s) { _this.createSelector(s, GameCreationMain); });
    };
    Startup.prototype.joinGame = function (elem) {
        var _this = this;
        this.playerDefinition.setPlayerName(this.playerName, function (s) { _this.createSelector(s, JoinGameForm.init); });
    };
    Startup.prototype.createSelector = function (success, move) {
        if (success) {
            this.div.style.display = "none";
            move();
        }
        else {
            alert("wrong name");
        }
    };
    return Startup;
}());
//# sourceMappingURL=startup.js.map