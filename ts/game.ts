/// <reference path="interfaces.ts"/>

const PLANE_WIDTH: number = 160;
const PLANE_HEIGHT: number = 127;

// Used for scaling and positioning
var originalTileSize = 32;
var theoreticalTileSize = 16;
var tileSize = theoreticalTileSize;

var boardSize = { x: 19, y: 19 }

var globalGame = null

enum GamePlayerState {
    Initial,
    Alive,
    Dead
}

var AirplanesSrcs = ['img/avion-up.png', 'img/avion-down.png', 'img/avion-left.png', 'img/avion-right.png']

enum AirplaneOrientation {
    Up,
    Down,
    Left,
    Right
}

function InitGame(info: Lobby) : void {
    var game = new Game
    game.info = info
    game.Init()
}
    
function ResizeGame() : void {
    if (globalGame) {
        tileSize = Math.min(window.innerWidth / (100 * boardSize.x / 90), window.innerHeight / (100 * boardSize.y / 60))
        
        globalGame.canvasLayer0.width = tileSize * boardSize.x
        globalGame.canvasLayer0.height = tileSize * boardSize.y
        
        globalGame.canvasLayer0.style.left = (window.innerWidth - globalGame.canvasLayer0.width) / 2  + "px"
        
        globalGame.canvasLayer1.width = tileSize * boardSize.x
        globalGame.canvasLayer1.height = tileSize * boardSize.y
        
        globalGame.canvasLayer1.style.left = (window.innerWidth - globalGame.canvasLayer0.width) / 2  + "px"
        
        globalGame.drawGrid();
    }
}

class Game {

    canvasLayer0: HTMLCanvasElement;
    canvasLayer1: HTMLCanvasElement;
    contextLayer0: CanvasRenderingContext2D;
    contextLayer1: CanvasRenderingContext2D;

    bgImage: HTMLImageElement
    hoverGridImage: HTMLImageElement
    airplaneImage: HTMLImageElement
    redX: HTMLImageElement
    grayX: HTMLImageElement
    greenX: HTMLImageElement

    airplanePosition: any = { x: 0, y: 0 };
    airplaneOrientation: AirplaneOrientation = AirplaneOrientation.Up
    gamePlayerState: GamePlayerState = GamePlayerState.Initial;

    info : Lobby
    gameEvents : GameEvents = new GameEventsMock

    Init() {
        var game = this
        globalGame = this
        
        game.gameEvents.init(
            (c, p) => { return game.onAttack(c, p) }, 
            (p) => { game.onPlayerDrop(p) }, 
            (s) => { game.onGameChange(s) })
        
        SetVisibleDiv("canvasesForm");
        var body = <HTMLBodyElement>document.getElementById("body")
        body.bgColor = "#29B6F6"
        
        //
        game.canvasLayer0 = <HTMLCanvasElement>document.getElementById('canvasLayer0');
        game.canvasLayer1 = <HTMLCanvasElement>document.getElementById('canvasLayer1');
        game.contextLayer0 = game.canvasLayer0.getContext('2d');
        game.contextLayer1 = game.canvasLayer1.getContext('2d');

        game.bgImage = new Image();
        game.airplaneImage = new Image();
        game.hoverGridImage = new Image();

        game.redX = new Image();
        game.grayX = new Image();
        game.greenX = new Image();
        
        game.gamePlayerState = GamePlayerState.Initial;
        
        game.bgImage.src = 'img/dot.png';
        game.airplaneImage.src = AirplanesSrcs[AirplaneOrientation.Up];
        game.hoverGridImage.src = 'img/dot-hover.png';

        game.redX.src = 'img/red-x.png';
        game.grayX.src = 'img/gray-x.png';
        game.greenX.src = 'img/green-x.png';
        

// Handlers
        game.bgImage.onload = function () {
            // Draw grid manually (needs to be done manually for scaling)
            ResizeGame()
        }
        
        game.canvasLayer1.addEventListener('mousemove', function (evt) {
            var gridPos = game.GetGridPos({ x: evt.clientX, y: evt.clientY });

            // Clear
            game.contextLayer0.clearRect(0, 0, game.canvasLayer0.width, game.canvasLayer0.height);

            // Draw grid again 
            game.drawGrid()
            
            // Draw yellow (highlited) grid dot
            game.drawTileImage(game.contextLayer0, game.hoverGridImage, gridPos)
        }, false)

        game.canvasLayer1.addEventListener('click', function (evt) {

            var gridClick = game.GetGridPos({ x: evt.clientX, y: evt.clientY });
            
            if (game.gamePlayerState == GamePlayerState.Initial) {
                // First click, set plane position
                game.gamePlayerState = GamePlayerState.Alive;
                
                // TO DO: Check if position is legal
                game.airplanePosition = gridClick;

                // Clear, forgot why I added this
                game.contextLayer1.clearRect(0, 0, game.canvasLayer1.width, game.canvasLayer1.height);

                game.airplaneImage.src = AirplanesSrcs[game.airplaneOrientation]
                
                game.contextLayer1.drawImage(game.airplaneImage, 0, 0, // image, offsetX, offsetY
                    PLANE_WIDTH, PLANE_HEIGHT, // width, height
                    game.airplanePosition.x * tileSize, game.airplanePosition.y * tileSize,   // canvasOffsetX, canvasOffsetY
                    PLANE_WIDTH * tileSize / originalTileSize, PLANE_HEIGHT * tileSize / originalTileSize); // canvasWidth, canvasHeight
            }
            else if(game.gamePlayerState == GamePlayerState.Alive) {
                // Do "Shoot"
                game.gameEvents.shoot(gridClick, function(c, t, p) { game.shotResponse(c, t, p) })
            }
            else {
                // Player is dead, do nothing?
                alert("Game Over");
            }
            
        }, false);
        
        document.addEventListener('keyup', function (evt) {
            var key = evt.keyCode;
            if (game.gamePlayerState == GamePlayerState.Initial && key == 82) {
                if(game.airplaneOrientation == AirplaneOrientation.Up){
                    game.airplaneOrientation = AirplaneOrientation.Down
                }else if(game.airplaneOrientation == AirplaneOrientation.Down){
                    game.airplaneOrientation = AirplaneOrientation.Left
                }else if(game.airplaneOrientation == AirplaneOrientation.Left){
                    game.airplaneOrientation = AirplaneOrientation.Right
                }else if(game.airplaneOrientation == AirplaneOrientation.Right){
                    game.airplaneOrientation = AirplaneOrientation.Up
                }
            }
        }, false)

    }

    GetGridPos(mousePos) {
        // Position relative to canvas top-left corner
        var canvasRect = this.canvasLayer0.getBoundingClientRect();
        mousePos.x -= canvasRect.left;
        mousePos.y -= canvasRect.top;
        
        // Convert to tileSize steps
        var gridPos = { x: Math.floor(mousePos.x / tileSize), y: Math.floor(mousePos.y / tileSize) };

        return gridPos;
    }
    
    drawGrid() : void {
        if (globalGame.bgImage) {
            for (var i = 0; i < this.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < this.canvasLayer0.height / tileSize; j++) {
                    this.contextLayer0.drawImage(this.bgImage, 0, 0,
                        originalTileSize, originalTileSize,
                        tileSize * i, tileSize * j,
                        tileSize, tileSize);
                }
            }
        }
    }
    
    drawTileImage(context: CanvasRenderingContext2D, image: HTMLImageElement, gridPos: vec2) {
        if (image) {
            context.drawImage(image, 0, 0,
                originalTileSize, originalTileSize,
                tileSize * gridPos.x, tileSize * gridPos.y,
                tileSize, tileSize);
        }
    }
    
    shotResponse(coord:vec2, type: GameEventType, playerName : string) : void {
        if (type == GameEventType.Hit) {
            this.drawTileImage(this.contextLayer1, this.greenX, coord)
        }
        else if (type == GameEventType.Kill) {
            this.drawTileImage(this.contextLayer1, this.redX, coord)
        }
        else {
            this.drawTileImage(this.contextLayer1, this.grayX, coord)
        }
    }
    onAttack(coord: vec2, playerName: string):  GameEventType {
        this.drawTileImage(this.contextLayer1, this.grayX, coord)
        return GameEventType.Miss;
    }
    onPlayerDrop(playerName:string) : void {
        
    } 
    onGameChange(status:GameStatusType) : void {
        this.gamePlayerState = GamePlayerState.Dead
    }
}
