var GameEventType;
(function (GameEventType) {
    GameEventType[GameEventType["Miss"] = 0] = "Miss";
    GameEventType[GameEventType["Hit"] = 1] = "Hit";
    GameEventType[GameEventType["Kill"] = 2] = "Kill";
})(GameEventType || (GameEventType = {}));
var GameStatusType;
(function (GameStatusType) {
    GameStatusType[GameStatusType["Playing"] = 0] = "Playing";
    GameStatusType[GameStatusType["OverSuccess"] = 1] = "OverSuccess";
    GameStatusType[GameStatusType["OverLost"] = 2] = "OverLost";
    GameStatusType[GameStatusType["Disconnected"] = 3] = "Disconnected";
})(GameStatusType || (GameStatusType = {}));
var LobbyStatusType;
(function (LobbyStatusType) {
    LobbyStatusType[LobbyStatusType["Open"] = 0] = "Open";
    LobbyStatusType[LobbyStatusType["Setup"] = 1] = "Setup";
    LobbyStatusType[LobbyStatusType["Closed"] = 2] = "Closed";
})(LobbyStatusType || (LobbyStatusType = {}));
var vec2 = (function () {
    function vec2() {
        this.x = 0;
        this.y = 0;
    }
    return vec2;
}());
var Player = (function () {
    function Player() {
    }
    return Player;
}());
var Lobby = (function () {
    function Lobby() {
        this.name = "newLoby";
        this.status = LobbyStatusType.Open;
        this.maxNoPlayers = 2;
        this.planesPerPlayer = 1;
        this.mapSize = { x: 10, y: 10 };
    }
    return Lobby;
}());
//# sourceMappingURL=interfaces.js.map