/// <reference path="lobby.ts"/>
/// <reference path="player.ts"/>

interface GameEvents {
    init(onAttack: (coord:vec2, type:string, playerName : string) => void, 
         onPlayerDrop: (playerName:string) => void, 
         onGameChange: (status:string) => void)
    shoot(pos:vec2, effect: (coord:vec2, type:string, playerName : string) => void) 
}

class Game {
    canvasLayer0: HTMLCanvasElement;
    contextLayer0: CanvasRenderingContext2D;
    bgImage: any;

    Init() {
        var game = this;

        game.canvasLayer0 = <HTMLCanvasElement>document.getElementById('canvasLayer0');
        game.contextLayer0 = game.canvasLayer0.getContext('2d');

        game.bgImage = new Image();
        game.bgImage.onload = function () {
            var pattern = game.contextLayer0.createPattern(game.bgImage, 'repeat');
            game.contextLayer0.rect(0, 0, game.canvasLayer0.width, game.canvasLayer0.height);
            game.contextLayer0.fillStyle = pattern;
            game.contextLayer0.fill();
        }

        game.bgImage.src = 'img/dots.png';
    }
}