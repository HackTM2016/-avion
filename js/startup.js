/// <reference path="interfaces.ts"/>
/// <reference path="creategame.ts"/>
/// <reference path="joinGame.ts"/>
/// <reference path="interfacesMock.ts"/>
/// <reference path="game.ts"/>
var Startup = (function () {
    function Startup() {
        this.playerName = "";
        this.playerAuth = new PlayerAuthMock;
    }
    Startup.init = function () {
        var startup = new Startup;
        var div = document.getElementById("startup");
        SetVisibleDiv("startup");
        var playerName = div.children.namedItem("playerName");
        playerName.onclick = function () { startup.changeName(this); };
        var createGame = div.children.namedItem("createGame");
        createGame.onclick = function () { startup.createGame(this); };
        var joinGame = div.children.namedItem("joinGame");
        joinGame.onclick = function () { startup.joinGame(this); };
    };
    Startup.prototype.changeName = function (elem) {
        this.playerName = elem.value;
    };
    Startup.prototype.createGame = function (elem) {
        var _this = this;
        this.playerAuth.login(this.playerName, function (s) { _this.createSelector(s, GameCreationMain); });
    };
    Startup.prototype.joinGame = function (elem) {
        var _this = this;
        this.playerAuth.login(this.playerName, function (s) { _this.createSelector(s, JoinGameForm.init); });
    };
    Startup.prototype.createSelector = function (success, move) {
        if (success) {
            SetInvisibleDiv("startup");
            move();
        }
        else {
            alert("wrong name");
        }
    };
    return Startup;
}());
//# sourceMappingURL=startup.js.map