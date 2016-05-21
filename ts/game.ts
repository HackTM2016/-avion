var globalGame;

const PLANE_WIDTH: number = 160;
const PLANE_HEIGHT: number = 127;

class Game {

    canvasLayer0: HTMLCanvasElement;
    canvasLayer1: HTMLCanvasElement;
    contextLayer0: CanvasRenderingContext2D;
    contextLayer1: CanvasRenderingContext2D;
    bgImage: any;
    airplane: any;

    Init() {
        var game = this;
        var globalGame = game;

        game.canvasLayer0 = <HTMLCanvasElement>document.getElementById('canvasLayer0');
        game.canvasLayer1 = <HTMLCanvasElement>document.getElementById('canvasLayer1');
        game.contextLayer0 = game.canvasLayer0.getContext('2d');
        game.contextLayer1 = game.canvasLayer1.getContext('2d');

        game.bgImage = new Image();
        game.airplane = new Image();

        game.bgImage.onload = function () {
//            var pattern: CanvasPattern = <CanvasPattern>game.contextLayer0.createPattern(game.bgImage, 'repeat');
//            game.contextLayer0.rect(0, 0, game.canvasLayer0.width, game.canvasLayer0.height);
//            game.contextLayer0.fillStyle = pattern;
//            game.contextLayer0.fill();

            var originalTileSize = 32;
            var tileSize = 16;

            for (var i = 0; i < game.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < game.canvasLayer0.height / tileSize; j++) {
                    game.contextLayer0.drawImage(game.bgImage, 0, 0,
                        originalTileSize, originalTileSize,
                        tileSize * i, tileSize * j,
                        tileSize, tileSize);
                }
            }

            game.contextLayer1.drawImage(game.airplane, 0, 0, // image, offsetX, offsetY
                PLANE_WIDTH, PLANE_HEIGHT, // width, height
                0, 0,                // canvasOffsetX, canvasOffsetY
                PLANE_WIDTH / 2, PLANE_HEIGHT / 2); // canvasWidth, canvasHeight


        }

        game.bgImage.src = 'img/dot.png';
        game.airplane.src = 'img/avion.png';

    }
}