/// <reference path="lib/firebase.d.ts"/>
/// <reference path="lobby.ts"/>
/// <reference path="player.ts"/>
var Global = (function () {
    function Global() {
    }
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
                    Global.players.push(player);
                });
            }
        });
        this.dataRef.child('Rooms').limit(1).once("value", function (snapshot) {
            var roomsData = snapshot;
            var alertstring = "Init:";
            if (!roomsData)
                alertstring += "None";
            else
                roomsData.forEach(function (i) {
                    alertstring += i.key() + ": " + i.val().Status;
                });
            alert(alertstring.toString());
        });
    };
    return Reader;
}());
var reader1 = new Reader();
reader1.main();
//# sourceMappingURL=db.js.map