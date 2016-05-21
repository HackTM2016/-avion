/// <reference path="interfaces.ts"/>
var PlayerAuthMock = (function () {
    function PlayerAuthMock() {
    }
    PlayerAuthMock.prototype.login = function (name, callback) {
        callback(true);
    };
    PlayerAuthMock.prototype.logout = function () { };
    return PlayerAuthMock;
}());
var JoinGameMock = (function () {
    function JoinGameMock() {
    }
    JoinGameMock.prototype.init = function (numberOfLobbies, onAdd, onRemove) {
        this.n = numberOfLobbies;
        this.addGame = onAdd;
        this.removeGame = onRemove;
    };
    JoinGameMock.prototype.join = function (name, callback) {
        callback(true);
    };
    return JoinGameMock;
}());
var CreateGameMock = (function () {
    function CreateGameMock() {
    }
    CreateGameMock.prototype.create = function (board, callback) {
        callback(true);
    };
    return CreateGameMock;
}());
//# sourceMappingURL=interfacesMock.js.map