/// <reference path="lib/firebase.d.ts"/>
/// <reference path="interfaces.ts"/>
var GlobalDB = (function () {
    function GlobalDB() {
    }
    GlobalDB.dataRef = new Firebase('https://project-4810418174258671406.firebaseio.com/');
    return GlobalDB;
}());
var PlayerAuthDB = (function () {
    function PlayerAuthDB() {
        this.playerRef = GlobalDB.dataRef.child("Players");
    }
    PlayerAuthDB.prototype.login = function (name, callback) {
        this.playerRef.once("value", function (snapshot) {
            var playersData = snapshot;
            if (playersData) {
                playersData.forEach(function (i) {
                    var player = new Player();
                    player.name = i.key();
                    player.status = i.val().Status;
                });
            }
        });
        GlobalDB.dataRef.child('Rooms').limit(1).once("value", function (snapshot) {
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
    PlayerAuthDB.prototype.logout = function () {
    };
    return PlayerAuthDB;
}());
var reader1 = new PlayerAuthDB();
//reader1.login();
//# sourceMappingURL=db.js.map