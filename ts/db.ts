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
//        this.dataRef = new Firebase('https://project-4810418174258671406.firebaseio.com/');
//        this.dataRef.child('Rooms').once("value", function(snapshot) {
//            var roomsData = snapshot.val();
//            var alertstring: string = "Init:";
//            if (!roomsData)
//                alertstring+="None";
//            else
//                roomsData.forEach(i => {
//                    alertstring+=i.Status.toString(); 
//                });
//            alert(alertstring.toString()); 
//        });
    }
}

var reader1 = new Reader();
reader1.main();
