/// <reference path="lib/firebase.d.ts"/>
/// <reference path="lib/lodash.d.ts"/>
/// <reference path="interfaces.ts"/>
// Septi DB: https://project-4810418174258671406.firebaseio.com/
var GlobalFB = (function () {
    function GlobalFB() {
    }
    GlobalFB.dataRef = new Firebase('https://project-4810418174258671406.firebaseio.com/');
    GlobalFB.curPlayer = null;
    GlobalFB.curLobby = null;
    GlobalFB.lobbyRef = null;
    GlobalFB.playerRef = null;
    return GlobalFB;
}());
var PlayerAuthFB = (function () {
    function PlayerAuthFB() {
        this.callback = null;
    }
    PlayerAuthFB.prototype.login = function (name, callback) {
        var _this = this;
        if (GlobalFB.curPlayer != null) {
            // Already logged in or in logging process, return error.
            if (callback)
                callback(false);
            return;
        }
        GlobalFB.curPlayer = new Player();
        GlobalFB.curPlayer = { name: name, status: PlayerStatus.new, room: null };
        GlobalFB.playerRef = GlobalFB.dataRef.child("Players").child(name);
        this.callback = callback;
        GlobalFB.playerRef.transaction(function (old_snapshot) {
            // If user does not exist, add it
            if (old_snapshot === null) {
                return { hit: { x: 0, y: 0 }, status: PlayerStatus.new };
            }
            else {
                // Otherwise return to fail the transaction
                return;
            }
        }, function (err, commited, snapshot) { return (_this.onCommit(err, commited, snapshot)); });
    };
    PlayerAuthFB.prototype.logout = function () {
        // If not logged in, simply return
        if (!GlobalFB.curPlayer)
            return;
        // Go offline to break all connections
        // Create new connection to start all over (goOnline it will recreate all observers)
        GlobalFB.curPlayer = null;
        GlobalFB.playerRef.remove();
    };
    PlayerAuthFB.prototype.onCommit = function (err, commited, snapshot) {
        if (err || !commited) {
            GlobalFB.curPlayer = null;
            GlobalFB.playerRef = null;
            if (this.callback) {
                this.callback(false);
            }
        }
        else {
            // Weird error, no global player found, remove FB entry and fail
            if (GlobalFB.playerRef == null ||
                GlobalFB.curPlayer == null) {
                GlobalFB.dataRef.child(snapshot.key()).remove();
                if (this.callback) {
                    this.callback(false);
                }
            }
            else {
                // All OK. Set onDisconect directive and callback true
                GlobalFB.playerRef.onDisconnect().remove();
                if (this.callback) {
                    this.callback(true);
                }
            }
        }
    };
    return PlayerAuthFB;
}());
var CreateGameFB = (function () {
    function CreateGameFB() {
        this.callback = null;
    }
    CreateGameFB.prototype.create = function (board, callback) {
        var _this = this;
        GlobalFB.lobbyRef = GlobalFB.dataRef.child("Rooms").child(board.name);
        GlobalFB.curLobby = board;
        this.callback = callback;
        GlobalFB.lobbyRef.transaction(function (old_snapshot) {
            // If room does not exist, add it
            if (old_snapshot === null) {
                return { Status: LobbyStatusType.Open,
                    MaxNrPlayer: GlobalFB.curLobby.maxNoPlayers,
                    PlainsPerPlayer: GlobalFB.curLobby.planesPerPlayer,
                    MapSize: GlobalFB.curLobby.mapSize };
            }
            else {
                // Otherwise return to fail the transaction
                return;
            }
        }, function (err, commited, snapshot) { return (_this.onCommit(err, commited, snapshot)); });
    };
    CreateGameFB.prototype.onCommit = function (err, commited, snapshot) {
        if (err || !commited) {
            GlobalFB.curLobby = null;
            GlobalFB.lobbyRef = null;
            if (this.callback) {
                this.callback(false);
            }
        }
        else {
            // Weird error, no global lobby/player found, remove FB entry and fail
            if (GlobalFB.lobbyRef == null ||
                GlobalFB.curLobby == null ||
                GlobalFB.playerRef == null) {
                GlobalFB.dataRef.child("Rooms").child(snapshot.key()).remove();
                if (this.callback) {
                    this.callback(false);
                }
            }
            else {
                // add current lobby as the current players joined room
                // no protection as we should not have other sessions with current player
                GlobalFB.playerRef.child("Room").set(GlobalFB.curLobby.name);
                // All OK. Set onDisconect directive and callback true
                GlobalFB.playerRef.child("Room").onDisconnect().remove();
                /* or disconnect lobby if leader leaves:
                 this.lobbyRef.onDisconnect().remove() */
                if (this.callback) {
                    this.callback(true);
                }
            }
        }
    };
    return CreateGameFB;
}());
var JoinGameFB = (function () {
    function JoinGameFB() {
        this.startGame = null;
        this.joined = null;
    }
    JoinGameFB.prototype.parseSnapshot = function (snapShot) {
        var lobby = new Lobby();
        lobby.status = snapShot.val().CurNrPlayer;
        lobby.maxNoPlayers = snapShot.val().MaxNrPlayer;
        lobby.mapSize.x = snapShot.val().MapSize.x;
        lobby.mapSize.y = snapShot.val().MapSize.y;
        lobby.name = snapShot.key();
        return lobby;
    };
    JoinGameFB.prototype.init = function (numberOfGames, onAdd, onRemove) {
        this.maxNumberOfGames = numberOfGames;
        this.addCallback = onAdd;
        this.removeCallback = onRemove;
        var roomsRef = GlobalFB.dataRef.child('Rooms');
        roomsRef.on("child_added", function (childSnapshot, prevChildKey) {
            if (this.curNumberOfGames < this.maxNumberOfGames) {
                var gameInfo = this.parseSnapshot(childSnapshot);
                this.addCallback(gameInfo);
                this.maxNumberOfGames++;
            }
        });
        roomsRef.on("child_removed", function (childSnapshot, prevChildKey) {
            if (childSnapshot) {
                this.removeCallback(childSnapshot.key());
            }
        });
        roomsRef.on("child_changed", function (snapshot) {
            if (snapshot) {
                this.removeCallback(snapshot.key());
                this.addCallback(this.parseSnapshot(snapshot));
            }
        });
    };
    JoinGameFB.prototype.join = function (name, joined) {
        GlobalFB.playerRef.update({ 'Status': PlayerStatus.inRoom, 'Room': name }, function (error) {
            if (error) {
                joined(false);
            }
            else {
                GlobalFB.curPlayer.room = name;
                joined(true);
            }
        });
    };
    return JoinGameFB;
}());
var SetupGameFB = (function () {
    function SetupGameFB() {
        this.roomPlayers = new Array();
        this.addPlayerToRoom = function (snapshot) {
            var player = new Player();
            player.name = snapshot.val().Name;
            player.room = snapshot.val().Room;
            player.status = snapshot.val().Status;
            this.roomPlayers.push(player);
            this.checkIfAllReady();
        };
        this.removePlayerFromRoom = function (snapshot) {
            var player = new Player();
            for (var i = 0; i < this.roomPlayers; i++) {
                if (this.roomPlayers[i].name == snapshot.key()) {
                    this.roomPlayers.splice(i, 1);
                    break;
                }
            }
            this.checkIfAllReady();
        };
        this.changePlayerFromRoom = function (snapshot) {
            var player = new Player();
            for (var i = 0; i < this.roomPlayers; i++) {
                if (this.roomPlayers[i].name == snapshot.key()) {
                    if (this.roomPlayers[i].status = snapshot.val().Status) {
                        break;
                    }
                }
            }
            this.onStartGame();
            this.checkIfAllReady();
        };
    }
    SetupGameFB.prototype.init = function (onAdd, onRemove, onUpdate) {
        this.onAdd = onAdd;
        this.onRemove = onRemove;
        this.onUpdate = onUpdate;
    };
    SetupGameFB.prototype.checkIfAllReady = function () {
        if (this.roomPlayers.length > 0) {
            for (var i = 0; this.roomPlayers.length > i; i++) {
                var player = this.roomPlayers[i];
                if (player.status != PlayerStatus.ready) {
                    return false;
                }
            }
        }
        this.onStartGame();
        return true;
    };
    SetupGameFB.prototype.ready = function (callback, onStartGame) {
        var _this = this;
        this.onStartGame = onStartGame;
        GlobalFB.playerRef.update({ 'Status': PlayerStatus.ready }, function (error) {
            if (error) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
        var playersRef = GlobalFB.dataRef.child('Players');
        playersRef.orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_added", function (snapshot) { _this.addPlayerToRoom(snapshot); });
        playersRef.orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_removed", function (snapshot) { _this.removePlayerFromRoom(snapshot); });
        playersRef.orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_changed", function (snapshot) { _this.changePlayerFromRoom(snapshot); });
    };
    return SetupGameFB;
}());
var GameEventsFB = (function () {
    function GameEventsFB() {
        this.onAttack = null;
        this.onPlayerDrop = null;
        this.onGameChange = null;
        this.onEvent = null;
    }
    GameEventsFB.prototype.init = function (onAttack, onPlayerDrop, onGameChange) {
        var _this = this;
        this.onAttack = onAttack;
        this.onPlayerDrop = onPlayerDrop;
        this.onGameChange = onGameChange;
        GlobalFB.dataRef.child("Shot").on("child_changed", function (snapshot) { return (_this.onShot(snapshot)); });
        GlobalFB.dataRef.child("Players").orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_changed", function (snapshot) { return (_this.playerDataChange(snapshot)); });
        GlobalFB.dataRef.child("Players").orderByChild("Room").equalTo(GlobalFB.curPlayer.room).on("child_removed", function (snapshot) { return (_this.playerDrop(snapshot)); });
    };
    GameEventsFB.prototype.shoot = function (pos, effect) {
        this.onEvent = effect;
        GlobalFB.dataRef.child("Shot").set({ who: GlobalFB.curPlayer.name, room: GlobalFB.curLobby.name, x: pos.x, y: pos.y });
    };
    GameEventsFB.prototype.onShot = function (snapshot) {
        var shotData = snapshot.val();
        if (shotData.room == GlobalFB.curLobby.name &&
            shotData.player != GlobalFB.curPlayer.name) {
            var resp = this.onAttack({ x: shotData.x, y: shotData.y }, shotData.who);
            GlobalFB.playerRef.update({ Hit: { x: shotData.x, y: shotData.y, who: shotData.player, type: resp } });
        }
    };
    GameEventsFB.prototype.playerDataChange = function (snapshot) {
        var playerName = snapshot.key();
        var playerData = snapshot.val();
        if (playerData.room == GlobalFB.curLobby.name) {
            this.onEvent({ x: playerData.Hit.x, y: playerData.Hit.y }, playerData.Hit.type, playerName);
        }
    };
    GameEventsFB.prototype.playerDrop = function (snapshot) {
        var playerName = snapshot.key();
        var playerData = snapshot.val();
        if (playerData.room == GlobalFB.curLobby.name) {
            this.onPlayerDrop(playerName);
        }
    };
    return GameEventsFB;
}());
//
//  For testing only !!!
//
var TestFB = (function () {
    function TestFB() {
    }
    TestFB.onLoginCommit = function (ok) {
        if (ok) {
            console.log("Login success!");
        }
        else {
            console.log("Login failed!");
        }
        TestFB.CreateTest();
    };
    TestFB.onCreateCommit = function (ok) {
        if (ok) {
            console.log("Lobby create success!");
        }
        else {
            console.log("Lobby create failed!");
        }
    };
    TestFB.CreateTest = function () {
        for (var i = 0; i < 10000; i++) {
            i = i + 1;
        }
        var plLobby = new CreateGameFB();
        var lb1 = new Lobby();
        lb1.name = "testLobby5"; //leave the rest default
        console.log("Attempt create testLobby5 - expect ok");
        plLobby.create(lb1, TestFB.onCreateCommit);
        /*lb1.maxNoPlayers = 6; //leave the rest default
        console.log("Attempt create testLobby5 - expect fail")
        plLobby.create(lb1, TestFB.onCreateCommit)*/
    };
    TestFB.LoginTest = function () {
        var plAuth = new PlayerAuthFB();
        console.log("Attempt login with Mihai2 - expect ok");
        plAuth.login("Mihai2", TestFB.onLoginCommit);
        /*console.log("Attempt login with Mumu - expect fail")
        plAuth.login("Mumu2", this.onLoginCommit)*/
        //console.log("Logoff from Mihai")
        //plAuth.logout()
        /*GlobalFB.curPlayer=null
         console.log("Attempt login with Mumu - expect ok")
         plAuth.login("Mumu", TestFB.onLoginCommit)
         GlobalFB.curPlayer = pl1*/
    };
    TestFB.PlayTest = function () {
        for (var i = 0; i < 10000; i++) {
            i = i + 1;
        }
    };
    TestFB.prototype.run = function () {
        TestFB.LoginTest();
        setTimeout(TestFB.CreateTest, 5000);
        setTimeout(TestFB.PlayTest, 5000);
    };
    return TestFB;
}());
var SeptiTestFB = (function () {
    function SeptiTestFB() {
    }
    SeptiTestFB.onLoginCommit = function (ok) {
        if (ok) {
            console.log("Login success!");
        }
        else {
            console.log("Login failed!");
        }
        TestFB.CreateTest();
    };
    SeptiTestFB.onCreateCommit = function (ok) {
        if (ok) {
            console.log("Lobby create success!");
        }
        else {
            console.log("Lobby create failed!");
        }
    };
    SeptiTestFB.CreateTest = function () {
        var plLobby = new CreateGameFB();
        var lb1 = new Lobby();
        lb1.name = "testLobby5"; //leave the rest default
        console.log("Attempt create testLobby5 - expect ok");
        plLobby.create(lb1, TestFB.onCreateCommit);
        /*lb1.maxNoPlayers = 6; //leave the rest default
        console.log("Attempt create testLobby5 - expect fail")
        plLobby.create(lb1, TestFB.onCreateCommit)*/
    };
    SeptiTestFB.prototype.LoginTest = function () {
        var plAuth = new PlayerAuthFB();
        console.log("Attempt login with Lemmer - expect ok");
        plAuth.login("Lemmer", function (success) {
            if (success) {
                console.log("Septi: Login Lemmer");
                var joinGame = new JoinGameFB();
                joinGame.init(10, function (lobby) {
                    console.log("Septi added lobby name: " + lobby.name);
                }, function (lobbyName) {
                    console.log("Septi removed lobby name: " + lobbyName);
                });
                joinGame.join("Battle of Britain", function (success) {
                    if (success) {
                        console.log("Septi: Join successfull");
                        console.log("Septi: setupGame");
                        var setupGame = new SetupGameFB();
                        setupGame.init(function (player) {
                            console.log("New Player: " + player.name);
                        }, function (player) {
                            console.log("Remove Player: " + player);
                        }, function (player) {
                            console.log("Update Player: " + player.name);
                        });
                        setupGame.ready(function (succes) {
                            if (success) {
                                console.log("Ready successfull");
                            }
                            else {
                                console.log("Ready not successfull");
                            }
                        }, function () {
                            console.log("Start Game");
                        });
                    }
                    else {
                        console.log("Join not successfull");
                    }
                });
            }
            else {
                console.log("Septi: Login Failed");
            }
        });
    };
    SeptiTestFB.prototype.run = function () {
        this.LoginTest();
    };
    return SeptiTestFB;
}());
//var autoTest = new TestFB()
//autoTest.run()
//# sourceMappingURL=db.js.map