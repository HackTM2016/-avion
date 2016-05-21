var globalGame;

const PLANE_WIDTH: number = 160;
const PLANE_HEIGHT: number = 127;

// Used for scaling and positioning
var originalTileSize = 32;
var tileSize = 16;

enum GamePlayerState {
    Initial,
    Alive,
    Dead
}

class Game {

    canvasLayer0: HTMLCanvasElement;
    canvasLayer1: HTMLCanvasElement;
    contextLayer0: CanvasRenderingContext2D;
    contextLayer1: CanvasRenderingContext2D;

    bgImage: any;
    hoverGridImage: any;
    airplaneImage: any;

    airplanePosition: any = { x: 0, y: 0 };
    gamePlayerState: GamePlayerState = GamePlayerState.Initial;

    Init() {
        var game = this;
        var globalGame = this;
        
        //
        game.canvasLayer0 = <HTMLCanvasElement>document.getElementById('canvasLayer0');
        game.canvasLayer1 = <HTMLCanvasElement>document.getElementById('canvasLayer1');
        game.contextLayer0 = game.canvasLayer0.getContext('2d');
        game.contextLayer1 = game.canvasLayer1.getContext('2d');

        game.bgImage = new Image();
        game.airplaneImage = new Image();
        game.hoverGridImage = new Image();
        
        game.gamePlayerState = GamePlayerState.Initial;
        
        game.bgImage.src = 'img/dot.png';
        game.airplaneImage.src = 'img/avion.png';
        game.hoverGridImage.src = 'img/dot-hover.png';


// Handlers
        game.bgImage.onload = function () {

            // Draw grid manually (needs to be done manually for scaling)
            for (var i = 0; i < game.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < game.canvasLayer0.height / tileSize; j++) {
                    game.contextLayer0.drawImage(game.bgImage, 0, 0,
                        originalTileSize, originalTileSize,
                        tileSize * i, tileSize * j,
                        tileSize, tileSize);
                }
            }
        }
        
        game.canvasLayer0.addEventListener('mousemove', function (evt) {
            var gridPos = game.GetGridPos(game, { x: evt.clientX, y: evt.clientY });

            // Clear
            game.contextLayer0.clearRect(0, 0, game.canvasLayer0.width, game.canvasLayer0.height);

            // Draw grid again 
            // TO DO: move to separate function
            for (var i = 0; i < game.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < game.canvasLayer0.height / tileSize; j++) {
                    game.contextLayer0.drawImage(game.bgImage, 0, 0,
                        originalTileSize, originalTileSize,
                        tileSize * i, tileSize * j,
                        tileSize, tileSize);
                }
            }
            
            // Draw yellow (highlited) grid dot
            game.contextLayer0.drawImage(game.hoverGridImage, 0, 0,
                originalTileSize, originalTileSize,
                tileSize * gridPos.x, tileSize * gridPos.y,
                tileSize, tileSize);

        }, false)

        game.canvasLayer1.addEventListener('click', function (evt) {

            var gridClick = game.GetGridPos(game, { x: evt.clientX, y: evt.clientY });
            
            if (game.gamePlayerState == GamePlayerState.Initial) {
                // First click, set plane position
                game.gamePlayerState = GamePlayerState.Alive;
                
                // TO DO: Check if position is legal
                game.airplanePosition = gridClick;

                // Clear, forgot why I added this
                game.contextLayer1.clearRect(0, 0, game.canvasLayer1.width, game.canvasLayer1.height);

                game.contextLayer1.drawImage(game.airplaneImage, 0, 0, // image, offsetX, offsetY
                    PLANE_WIDTH, PLANE_HEIGHT, // width, height
                    game.airplanePosition.x * tileSize, game.airplanePosition.y * tileSize,   // canvasOffsetX, canvasOffsetY
                    PLANE_WIDTH / 2, PLANE_HEIGHT / 2); // canvasWidth, canvasHeight
            }
            else if(game.gamePlayerState == GamePlayerState.Alive) {
                // Do "Shoot"
            }
            else {
                // Player is dead, do nothing?
            }
            
        }, false);

    }

    GetGridPos(game, mousePos) {
        // Position relative to canvas top-left corner
        var canvasRect = game.canvasLayer0.getBoundingClientRect();
        mousePos.x -= canvasRect.left;
        mousePos.y -= canvasRect.top;
        
        // Convert to tileSize steps
        var gridPos = { x: Math.floor(mousePos.x / tileSize), y: Math.floor(mousePos.y / tileSize) };

        return gridPos;
    }
}