/// <reference path="gameInfo.ts"/>
var PlayerDefinitionModelMock = (function () {
    function PlayerDefinitionModelMock() {
    }
    PlayerDefinitionModelMock.prototype.setPlayerName = function (name, success) {
        success(true);
    };
    return PlayerDefinitionModelMock;
}());
var GameJoinModelMock = (function () {
    function GameJoinModelMock() {
    }
    GameJoinModelMock.prototype.init = function (numberOfGames) {
        this.n = numberOfGames;
    };
    GameJoinModelMock.prototype.onAdd = function (callback) {
        this.addGame = callback;
    };
    GameJoinModelMock.prototype.onRemove = function (callback) {
        this.removeGame = callback;
    };
    GameJoinModelMock.prototype.join = function (id, success, start) {
        this.startGame = start;
        success(true);
    };
    return GameJoinModelMock;
}());
var GameCreateModelMock = (function () {
    function GameCreateModelMock() {
    }
    GameCreateModelMock.prototype.create = function (board, callback) {
        callback(true);
    };
    return GameCreateModelMock;
}());
//# sourceMappingURL=gameInfoMock.js.map