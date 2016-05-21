/// <reference path="lib/firebase.d.ts"/>
/// <reference path="lib/lodash.d.ts"/>

class GlobalDB {
    static dataRef: Firebase = new Firebase('https://project-4810418174258671406.firebaseio.com/')
    static curPlayer: Player = null
    static playerRef : Firebase = null;
}

class PlayerAuthDB implements PlayerAuth {
    playerRef: Firebase = GlobalDB.dataRef.child("Players");
    callback: (success : boolean) => void
    
    public login(name:string, callback: (success : boolean) => void) {
        this.callback = callback
        this.playerRef.transaction({name:name, status:PlayerStatusType.Online}, function(snapshot) {
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

class LobbyModel implements JoinGame
{
    private maxNumberOfGames : number;
    private curNumberOfGames : number;
    private addCallback : (name: Lobby) => void;
    private removeCallback : (name: string) => void;
    private startGame: (game : Lobby) => void = null;
    public static joined: (success : boolean) => void = null;
    
    private parseSnapshot(snapShot : FirebaseDataSnapshot) : Lobby {
        var lobby = new Lobby();
        lobby.status = snapShot.val().CurNrPlayer;
        lobby.maxNoPlayers = snapShot.val().MaxNrPlayer;
        lobby.mapSize.x = snapShot.val().MapSize.x;
        lobby.mapSize.y = snapShot.val().MapSize.y;
        lobby.name = snapShot.key();
        
        return lobby;
    }
    
    init(numberOfGames : number, onAdd: (item : Lobby) => void, onRemove: (name: string) => void) : void {
        this.maxNumberOfGames = numberOfGames;
        this.addCallback = onAdd;
        this.removeCallback = onRemove;
        
        var roomsRef = GlobalDB.dataRef.child('Rooms');
        roomsRef.on("child_added", function(childSnapshot, prevChildKey) {
           if (this.curNumberOfGames < this.maxNumberOfGames) {
               var gameInfo = this.parseSnapshot(childSnapshot);
               this.addCallback(gameInfo);
               this.maxNumberOfGames++;
           }
        });
        roomsRef.on("child_removed", function(childSnapshot, prevChildKey) {
           if (childSnapshot) {
               this.removeCallback(childSnapshot.key());
           }           
        });
        
        roomsRef.on("child_changed", function(snapshot) {
           if (snapshot) {
               this.removeCallback(snapshot.key());
               this.addCallback(this.parseSnapshot(snapshot));
           }           
        });               
    }
    
    join(name : string, joined: (success : boolean) => void) : void {
        var roomsRef = GlobalDB.dataRef.child('Rooms');
        var joiningRoomRef = roomsRef.child(name);
        if (joiningRoomRef) {
            var roomPlayersRef = joiningRoomRef.child("Players");
            joiningRoomRef.limitToFirst(1).once("child_added", function(snapshot) {
                roomPlayersRef.push({'Name':GlobalDB.curPlayer.name});
                joiningRoomRef.update({'CurNrPlayer':(snapshot.val().CurNrPlayer)});
                GlobalDB.playerRef.limitToFirst(1).once("child_added", function(snapshot) {
                    GlobalDB.playerRef.update({'Status':'joined'});
                });
            });
        }                
    }  

}

var reader1 = new PlayerAuthDB();
//reader1.login();
