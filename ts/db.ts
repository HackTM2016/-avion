/// <reference path="lib/firebase.d.ts"/>
/// <reference path="lib/lodash.d.ts"/>
/// <reference path="interfaces.ts"/>

// Septi DB: https://project-4810418174258671406.firebaseio.com/

class GlobalFB {
    static dataRef: Firebase = new Firebase('https://incandescent-fire-3223.firebaseio.com/avion/')
    static curPlayer: Player = null;
    static curLobby: Lobby = null;
    static lobbyRef: Firebase = null;
    static playerRef: Firebase = null;
}

class PlayerAuthFB implements PlayerAuth {
    callback: (success : boolean) => void = null;
    
    public login(name:string, callback: (success : boolean) => void) : void {
        
        if (GlobalFB.curPlayer != null) {
            // Already logged in or in logging process, return error.
            if (callback) callback(false);
            return;
        }
        
        GlobalFB.curPlayer = new Player();
        GlobalFB.curPlayer = {name:name, status:PlayerStatus.new, room:null}
        GlobalFB.playerRef = GlobalFB.dataRef.child("Players").child(name);

        this.callback = callback;

        GlobalFB.playerRef.transaction(
            function(old_snapshot) {
                // If user does not exist, add it
                if (old_snapshot === null) {
                    return {hit:{x:0,y:0},status:PlayerStatus.new};
                } else {
                    // Otherwise return to fail the transaction
                    return;
                }
            },
            (err, commited, snapshot)=>(this.onCommit(err, commited, snapshot)))
    }
    
    public logout() : void {
        // If not logged in, simply return
        if (!GlobalFB.curPlayer) return;
        // Go offline to break all connections
        // Create new connection to start all over (goOnline it will recreate all observers)
        GlobalFB.curPlayer = null;
        GlobalFB.playerRef.remove();
    }
    
   private onCommit(err, commited, snapshot) : void {
        if (err || !commited) {
            GlobalFB.curPlayer = null;
            GlobalFB.playerRef = null;
            if (this.callback) {
                this.callback(false)
            }
        } else {
            // Weird error, no global player found, remove FB entry and fail
            if (GlobalFB.playerRef == null ||
                GlobalFB.curPlayer == null) {
                GlobalFB.dataRef.child(snapshot.key()).remove();
                if (this.callback) {
                    this.callback(false);
                }
            } else {
                // All OK. Set onDisconect directive and callback true
                GlobalFB.playerRef.onDisconnect().remove();
                if (this.callback) {
                    this.callback(true);
                }
            }
        }
    }  
}

class CreateGameFB implements CreateGame {
    callback: (success : boolean) => void = null;
    
    public create(board : Lobby, callback: (success : boolean) => void) : void {
        GlobalFB.lobbyRef = GlobalFB.dataRef.child("Rooms").child(board.name);
        GlobalFB.curLobby = board;
        this.callback = callback;

        GlobalFB.lobbyRef.transaction(
            function(old_snapshot) {
                // If room does not exist, add it
                if (old_snapshot === null) {
                    return {Status: LobbyStatusType.Open,
                            MaxNrPlayer: GlobalFB.curLobby.maxNoPlayers,
                            PlainsPerPlayer: GlobalFB.curLobby.planesPerPlayer,
                            MapSize:GlobalFB.curLobby.mapSize}
                } else {
                    // Otherwise return to fail the transaction
                    return;
                }
            },
            (err, commited, snapshot)=>(this.onCommit(err, commited, snapshot)))
    }
    
   private onCommit(err, commited, snapshot) : void {
        if (err || !commited) {
            GlobalFB.curLobby = null;
            GlobalFB.lobbyRef = null;
            if (this.callback) {
                this.callback(false)
            }
        } else {
            // Weird error, no global lobby/player found, remove FB entry and fail
            if (GlobalFB.lobbyRef == null ||
                GlobalFB.curLobby == null ||
                GlobalFB.playerRef == null) {
                GlobalFB.dataRef.child("Rooms").child(snapshot.key()).remove()
                if (this.callback) {
                    this.callback(false)
                }
            } else {
                // add current lobby as the current players joined room
                // no protection as we should not have other sessions with current player
                GlobalFB.playerRef.child("room").set(GlobalFB.curLobby.name);

                // All OK. Set onDisconect directive and callback true
                GlobalFB.playerRef.child("room").onDisconnect().remove();
                /* or disconnect lobby if leader leaves:
                 this.lobbyRef.onDisconnect().remove() */

                if (this.callback) {
                    this.callback(true);
                }
            }
        }
    }  
}

class JoinGameFB implements JoinGame
{
    private maxNumberOfGames : number;
    private curNumberOfGames : number;
    private addCallback : (name: Lobby) => void;
    private removeCallback : (name: string) => void;
    private startGame: (game : Lobby) => void = null;
    private joined: (success : boolean) => void = null;
    
    private parseSnapshot(snapShot : FirebaseDataSnapshot) : Lobby {
        var lobby = new Lobby();
        lobby.status = snapShot.val().CurNrPlayer;
        lobby.maxNoPlayers = snapShot.val().MaxNrPlayer;
        lobby.mapSize.x = snapShot.val().MapSize.x;
        lobby.mapSize.y = snapShot.val().MapSize.y;
        lobby.name = snapShot.key();
        
        return lobby;
    }
    
    init(numberOfGames : number, 
         onAdd: (item : Lobby) => void, 
         onRemove: (name: string) => void) : void 
    {
        this.maxNumberOfGames = numberOfGames;
        this.addCallback = onAdd;
        this.removeCallback = onRemove;
        
        var roomsRef = GlobalFB.dataRef.child('Rooms');
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
        GlobalFB.playerRef.update({'Status':PlayerStatus.inRoom, 'Room':name}, function(error) {
            if (error) {
                joined(false);
            } else {
                joined(true);
            }
        });                
    }
}

class SetupGameFB implements SetupGame {
    private onAdd: (player : Player) => void;
    private onRemove: (name : string) => void;
    private onUpdate: (player : Player) => void;
    private roomPlayers: Array<Player> = new Array<Player>();
    private onStartGame: () => void;
    
    init(onAdd: (player : Player) => void, 
         onRemove: (name : string) => void,
         onUpdate: (player : Player) => void) 
    {
        this.onAdd = onAdd;
        this.onRemove = onRemove;
        this.onUpdate = onUpdate;
    }
    
    checkIfAllReady () : boolean
    {
        if (this.roomPlayers.length > 0) {
            for (var i = 0; this.roomPlayers.length > i; i++)
            {
                var player = this.roomPlayers[i];
                if (player.status != PlayerStatus.ready) {
                    return false;
                }
            }
        }
        
        this.onStartGame();
        return true;
    }
    
    public addPlayerToRoom : (snapshot : FirebaseDataSnapshot) => void = function(snapshot) {
        var player = new Player();
        player.name = snapshot.val().Name;
        player.room = snapshot.val().Room;
        player.status = snapshot.val().Status;
        this.roomPlayers.push(player);
        this.checkIfAllReady();
    };
    
    public removePlayerFromRoom : (snapshot : FirebaseDataSnapshot) => void = function(snapshot) {
        var player = new Player();
        for (var i = 0; i < this.roomPlayers; i++)
        {
            if (this.roomPlayers[i].name == snapshot.key()) {
                this.roomPlayers.splice(i,1);
                break;
            }   
        }
        this.checkIfAllReady();
    };
    
    public changePlayerFromRoom : (snapshot : FirebaseDataSnapshot) => void = function(snapshot) {
        var player = new Player();
        for (var i = 0; i < this.roomPlayers; i++)
        {
            if (this.roomPlayers[i].name == snapshot.key()) {
                if (this.roomPlayers[i].status = snapshot.val().Status) {
                    break;
                }
            }   
        }
        
        this.onStartGame();
        this.checkIfAllReady();
    };
    
    ready(callback: (success : boolean) => void, 
          onStartGame: () => void) : void
    {
        this.onStartGame = onStartGame;
        GlobalFB.playerRef.update({'Status':PlayerStatus.ready}, function(error) {
            if (error) {
                callback(false);
            } else {
                callback(true);
            }
        });
        var playersRef = GlobalFB.dataRef.child('Players');
        playersRef.orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_added", this.addPlayerToRoom);      
        playersRef.orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_removed", this.removePlayerFromRoom);
        playersRef.orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_changed", this.changePlayerFromRoom);
    }
}

class GameEventsFB implements GameEvents {
    onAttack: (coord:vec2, playerName : string) => GameEventType = null;
    onPlayerDrop: (playerName:string) => void = null;
    onGameChange: (status:GameStatusType) => void = null;
    
    public init(onAttack: (coord:vec2, playerName : string) => GameEventType,
                onPlayerDrop: (playerName:string) => void,
                onGameChange: (status:GameStatusType) => void) {
        this.onAttack = onAttack;
        this.onPlayerDrop = onPlayerDrop;
        this.onGameChange = onGameChange;
        GlobalFB.dataRef.child("Shoot").this.
        GlobalFB.dataRef.child("Players").orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_changed", this.playerDataChange.bind(this));
        GlobalFB.dataRef.child("Players").orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_removed", this.playerDrop.bind(this));
    }

    public shoot(pos:vec2) {
        
    }
    
    private playerDataChange(snapshot) : void {
        var playerName = snapshot.key();
        var playerData = snapshot.val();
        if (playerData.room == GlobalFB.curLobby.name){
            
        }
            
    }
    
    private playerDrop(snapshot) : void {
        var playerName = snapshot.key();
        var playerData = snapshot.val();
        if (playerData.room == GlobalFB.curLobby.name){
        }
    }
    
    
}

//
//  For testing only !!!
//

class TestFB {
    static onLoginCommit(ok:boolean) : void {
        if (ok) {console.log("Login success!")}
        else {console.log("Login failed!")}
        TestFB.CreateTest();
    }
    
    static onCreateCommit(ok:boolean) : void {
        if (ok) {console.log("Lobby create success!")}
        else {console.log("Lobby create failed!")}
    }
    
    static CreateTest() : void {
        var plLobby = new CreateGameFB()

        var lb1 = new Lobby();
        lb1.name = "testLobby5" //leave the rest default
        console.log("Attempt create testLobby5 - expect ok")
        plLobby.create(lb1, TestFB.onCreateCommit)

        /*lb1.maxNoPlayers = 6; //leave the rest default
        console.log("Attempt create testLobby5 - expect fail")
        plLobby.create(lb1, TestFB.onCreateCommit)*/
    }

    static LoginTest() {
        
        var plAuth = new PlayerAuthFB()

        console.log("Attempt login with Mihai2 - expect ok")
        plAuth.login("Mihai2", TestFB.onLoginCommit)

        /*console.log("Attempt login with Mumu - expect fail")
        plAuth.login("Mumu2", this.onLoginCommit)*/

        //console.log("Logoff from Mihai")
        //plAuth.logout()

        /*GlobalFB.curPlayer=null
         console.log("Attempt login with Mumu - expect ok")
         plAuth.login("Mumu", TestFB.onLoginCommit)
         GlobalFB.curPlayer = pl1*/
    }
    
    public run() :void {
        TestFB.LoginTest();
    }
}

var autoTest = new TestFB()
autoTest.run()
