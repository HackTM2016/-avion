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
var SetupGameMock = (function () {
    function SetupGameMock() {
    }
    SetupGameMock.prototype.init = function (onAdd, onRemove, onUpdate) {
    };
    SetupGameMock.prototype.ready = function (callback, onStartGame) {
    };
    return SetupGameMock;
}());
var GameEventsMock = (function () {
    function GameEventsMock() {
        this.shotNumber = 100;
    }
    GameEventsMock.prototype.init = function (onAttack, onPlayerDrop, onGameChange) {
        this.shotNumber = 40;
        this.onAttack = onAttack;
        this.onPlayerDrop = onPlayerDrop;
        this.onGameChange = onGameChange;
    };
    GameEventsMock.prototype.shoot = function (pos, effect) {
        effect(pos, Math.floor(Math.random() * 3), "Ion");
        effect(pos, Math.floor(Math.random() * 3), "Blue");
        this.onAttack({ x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) }, "Ion");
        this.onAttack({ x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) }, "Blue");
        if (this.shotNumber == 20) {
            this.onPlayerDrop("Ion");
        }
        if (this.shotNumber == 0) {
            this.onGameChange(Math.floor(Math.random() * 3));
        }
        this.shotNumber -= 1;
    };
    return GameEventsMock;
}());
//# sourceMappingURL=interfacesMock.js.map