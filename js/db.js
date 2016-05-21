/// <reference path="lib/firebase.d.ts"/>
/// <reference path="lib/lodash.d.ts"/>
/// <reference path="Room.ts"/>
/// <reference path="vec2.ts"/>
/// <reference path="Player.ts"/>
var Global = (function () {
    function Global() {
    }
    Global.players = [];
    Global.rooms = [];
    return Global;
}());
var Reader = (function () {
    function Reader() {
    }
    Reader.prototype.main = function () {
        this.dataRef = new Firebase('https://project-4810418174258671406.firebaseio.com/');
        var playerRef = new Firebase('https://project-4810418174258671406.firebaseio.com/Players');
        playerRef.once("value", function (snapshot) {
            var playersData = snapshot;
            if (playersData) {
                playersData.forEach(function (i) {
                    var player = new Player();
                    player.name = i.key();
                    player.status = i.val().Status;
                    player.toString();
                    Global.players.push(player);
                });
            }
        });
        this.dataRef.child('Rooms').limit(1).once("value", function (snapshot) {
            var roomsData = snapshot;
            var alertstring = "Init:";
            if (roomsData) {
                roomsData.forEach(function (i) {
                    var room = new Room();
                    room.name = i.key();
                    room.status = i.val().Status;
                    room.curNrPlayers = i.val().CurNrPlayers;
                    room.curNrPlayers = i.val().CurNrPlayers;
                    //room.mapSize.x = i.val().MapSize.val().x;
                    //room.mapSize.y = i.val().MapSize.val().y;
                    room.maxNrPlayers = i.val().MaxNrPlayer;
                    console.log("Sert");
                    console.log(i.val().Players);
                    console.log("Mert");
                    //console.log(i.val());
                });
                _.each(roomsData, function (room) {
                    console.log('Room details: ' + JSON.stringify(room, null, 2));
                });
            }
            alert(alertstring.toString());
        });
    };
    return Reader;
}());
var reader1 = new Reader();
reader1.main();
//# sourceMappingURL=db.js.map