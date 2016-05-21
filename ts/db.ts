/// <reference path="lib/firebase.d.ts"/>
/// <reference path="interfaces.ts"/>

class GlobalDB {
    static dataRef: Firebase = new Firebase('https://project-4810418174258671406.firebaseio.com/')
    static curPlayer: Player;
}

class PlayerAuthDB implements PlayerAuth {
    playerRef: Firebase = GlobalDB.dataRef.child("Players");
    
    public login(name:string, callback: (success : boolean) => void) {
        this.playerRef.once("value", function(snapshot) {
            var playersData = snapshot;
            if (playersData)
            {
                playersData.forEach( function(i) {
                    var player = new Player();
                    player.name = i.key();
                    player.status = i.val().Status;
                });
            }
        });
        
        GlobalDB.dataRef.child('Rooms').limit(1).once("value", function(snapshot) {
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
    
    public logout() : void {
        
    }
}

var reader1 = new PlayerAuthDB();
//reader1.login();
