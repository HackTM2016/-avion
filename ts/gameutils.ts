/// <reference path="game.ts"/>

function SetVisibleDiv(divName){
    var divItem = <HTMLElement>document.getElementById(divName)
    divItem.style.display = "block"
}

function SetInvisibleDiv(divName){
    var divItem = <HTMLElement>document.getElementById(divName)
    divItem.style.display = "none"
}

function JudgeHit(hitCoord: vec2, planeCoord: vec2): GameEventType {

        if (hitCoord.x >= planeCoord.x && hitCoord.x < (planeCoord.x + 5) &&
            hitCoord.y >= planeCoord.y && hitCoord.y < (planeCoord.y + 4)) {

            var planeShape =   [[0, 0, 2, 0, 0],
                                [1, 1, 1, 1, 1],
                                [0, 0, 1, 0, 0],
                                [0, 1, 1, 1, 0]];

            var detailHitCoord = { x: hitCoord.x - planeCoord.x, y: hitCoord.y - planeCoord.y };
            
            return planeShape[detailHitCoord.y][detailHitCoord.x];
        }
        
        return GameEventType.Miss;
    }