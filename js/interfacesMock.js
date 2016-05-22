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
        this.ionPlanePos = { x: Math.floor(Math.random() * 14), y: Math.floor(Math.random() * 14) };
        this.bluePlanePos = { x: Math.floor(Math.random() * 14), y: Math.floor(Math.random() * 14) };
        this.ionAlive = true;
        this.blueAlive = true;
    }
    GameEventsMock.prototype.init = function (onAttack, onPlayerDrop, onGameChange) {
        this.onAttack = onAttack;
        this.onPlayerDrop = onPlayerDrop;
        this.onGameChange = onGameChange;
    };
    GameEventsMock.prototype.shoot = function (pos, effect) {
        var ionHit = hitPlane(this.ionPlanePos, pos);
        effect(pos, ionHit, "Ion");
        if (ionHit == GameEventType.Kill) {
            this.ionAlive = false;
        }
        var blueHit = hitPlane(this.bluePlanePos, pos);
        effect(pos, blueHit, "Blue");
        if (blueHit == GameEventType.Kill) {
            this.blueAlive = false;
        }
        if (this.ionAlive) {
            this.onAttack({ x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) }, "Ion");
        }
        if (this.blueAlive) {
            this.onAttack({ x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) }, "Blue");
        }
        if (!this.blueAlive && !this.ionAlive) {
            this.onGameChange(GameStatusType.OverSuccess);
        }
    };
    return GameEventsMock;
}());
function hitPlane(planePos, hitPos) {
    return GameEventType.Miss;
}
//# sourceMappingURL=interfacesMock.js.map