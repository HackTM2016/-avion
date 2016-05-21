var globalGame;

const PLANE_WIDTH: number = 160;
const PLANE_HEIGHT: number = 127;


var originalTileSize = 32;
var tileSize = 16;

class Game {

    canvasLayer0: HTMLCanvasElement;
    canvasLayer1: HTMLCanvasElement;
    contextLayer0: CanvasRenderingContext2D;
    contextLayer1: CanvasRenderingContext2D;
    bgImage: any;
    hoverGridImage: any;
    airplane: any;

    Init() {
        var game = this;
        var globalGame = this;

        game.canvasLayer0 = <HTMLCanvasElement>document.getElementById('canvasLayer0');
        game.canvasLayer1 = <HTMLCanvasElement>document.getElementById('canvasLayer1');
        game.contextLayer0 = game.canvasLayer0.getContext('2d');
        game.contextLayer1 = game.canvasLayer1.getContext('2d');

        game.bgImage = new Image();
        game.airplane = new Image();
        game.hoverGridImage = new Image();

        game.bgImage.onload = function () {

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
        game.hoverGridImage.src = 'img/dot-hover.png';

        game.canvasLayer1.addEventListener('mousemove', function (evt) {
            var gridPos = game.GetGridPos(game, { x: evt.clientX, y: evt.clientY });

            game.contextLayer0.clearRect(0, 0, game.canvasLayer0.width, game.canvasLayer0.height);

            for (var i = 0; i < game.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < game.canvasLayer0.height / tileSize; j++) {
                    game.contextLayer0.drawImage(game.bgImage, 0, 0,
                        originalTileSize, originalTileSize,
                        tileSize * i, tileSize * j,
                        tileSize, tileSize);
                }
            }

            game.contextLayer0.drawImage(game.hoverGridImage, 0, 0,
                originalTileSize, originalTileSize,
                tileSize * gridPos.x, tileSize * gridPos.y,
                tileSize, tileSize);

        }, false)

    }

    GetGridPos(game, mousePos) {
        var canvasRect = game.canvasLayer0.getBoundingClientRect();
        mousePos.x -= canvasRect.left;
        mousePos.y -= canvasRect.top;
        var gridPos = { x: Math.floor(mousePos.x / tileSize), y: Math.floor(mousePos.y / tileSize) };

        return gridPos;
    }
}