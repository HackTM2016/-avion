/// <reference path="lib/firebase.d.ts"/>
/// <reference path="Room.ts"/>
/// <reference path="vec2.ts"/>
/// <reference path="Player.ts"/>

class Global {
    static players:Player[];
    static rooms:Room[];
}

class Reader {
    dataRef: Firebase;
    public main() {
        this.dataRef = new Firebase('https://project-4810418174258671406.firebaseio.com/');
        var playerRef = new Firebase('https://project-4810418174258671406.firebaseio.com/Players');
        playerRef.once("value", function(snapshot) {
            var playersData = snapshot;
            if (playersData)
            {
                playersData.forEach( function(i) {
                    var player = new Player();
                    player.name = i.key();
                    player.status = i.val().Status;
                    Global.players.push(player);
                });
            }
        });
        
        this.dataRef.child('Rooms').limit(1).once("value", function(snapshot) {
            var roomsData = snapshot;
            var alertstring: string = "Init:";
            if (!roomsData)
                alertstring+="None";
            else
                roomsData.forEach( function(i) {
                    alertstring+=i.key() + ": " + i.val().Status;
                });
            alert(alertstring.toString()); 
        });
    }
}

var reader1 = new Reader();
reader1.main();
