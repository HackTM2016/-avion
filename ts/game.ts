/// <reference path="interfaces.ts"/>

const PLANE_WIDTH: number = 160;
const PLANE_HEIGHT: number = 160;

// Used for scaling and positioning
var originalTileSize = 32;
var theoreticalTileSize = 16;
var tileSize = theoreticalTileSize;

var boardSize = { x: 10, y: 10 }

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

function ResizeGame(): void {
    if (globalGame) {
        tileSize = Math.min(window.innerWidth / (100 * boardSize.x / 90), window.innerHeight / (100 * boardSize.y / 60))

        globalGame.canvasLayer0.width = tileSize * boardSize.x
        globalGame.canvasLayer0.height = tileSize * boardSize.y

        globalGame.canvasLayer0.style.left = (window.innerWidth - globalGame.canvasLayer0.width) / 2 + "px"

        globalGame.canvasLayer1.width = tileSize * boardSize.x
        globalGame.canvasLayer1.height = tileSize * boardSize.y

        globalGame.canvasLayer1.style.left = (window.innerWidth - globalGame.canvasLayer0.width) / 2 + "px"

        globalGame.drawGrid();
    }
}

class Game {

    canvasLayer0: HTMLCanvasElement;
    canvasLayer1: HTMLCanvasElement;
    contextLayer0: CanvasRenderingContext2D;
    contextLayer1: CanvasRenderingContext2D;
    gameStatusElem: HTMLElement;

    bgImage: HTMLImageElement
    hoverGridImage: HTMLImageElement
    airplaneImage: HTMLImageElement
    killX: HTMLImageElement
    missX: HTMLImageElement
    hitX: HTMLImageElement
    enemyMissX: HTMLImageElement
    enemyHitX: HTMLImageElement

    airplanePosition: any = { x: 0, y: 0 };
    airplaneOrientation: AirplaneOrientation = AirplaneOrientation.Up
    gamePlayerState: GamePlayerState = GamePlayerState.Initial;

    info: Lobby
    gameEvents: GameEvents = new GameEventsMock

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
        game.gameStatusElem = document.getElementById('status');

        game.bgImage = new Image();
        game.airplaneImage = new Image();
        game.hoverGridImage = new Image();

        game.killX = new Image();
        game.missX = new Image();
        game.hitX = new Image();
        game.enemyMissX = new Image();
        game.enemyHitX = new Image();

        game.gamePlayerState = GamePlayerState.Initial;

        game.bgImage.src = 'img/dot.png';
        game.airplaneImage.src = AirplanesSrcs[AirplaneOrientation.Up];
        game.hoverGridImage.src = 'img/dot-hover.png';

        game.killX.src = 'img/plane-kill.png';
        game.missX.src = 'img/gray-x.png';
        game.hitX.src = 'img/plane-hit.png';
        game.enemyMissX.src = 'img/enemy-hit.png';
        game.enemyHitX.src = 'img/enemy-damage.png';

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

        function validateDeployPosition(positionOnGrid: vec2):boolean {
            if (game.airplaneOrientation == AirplaneOrientation.Up && ((positionOnGrid.x > boardSize.x - 5) || (positionOnGrid.y > boardSize.y - 4))){
                return false
            } else 
            if (game.airplaneOrientation == AirplaneOrientation.Down && ((positionOnGrid.x > boardSize.x - 5) || (positionOnGrid.y > boardSize.y - 4))){
                return false
            } else 
            if (game.airplaneOrientation == AirplaneOrientation.Left && ((positionOnGrid.x > boardSize.x - 4) || (positionOnGrid.y > boardSize.y - 5))){
                return false
            }else 
            if (game.airplaneOrientation == AirplaneOrientation.Right && ((positionOnGrid.x > boardSize.x - 4) || (positionOnGrid.y > boardSize.y - 5))){
                return false
            }
            return true
            
        }
        game.canvasLayer1.addEventListener('mouseup', function (evt) {

            var gridClick = game.GetGridPos({ x: evt.clientX, y: evt.clientY });
            
            if(!validateDeployPosition(gridClick) && game.gamePlayerState == GamePlayerState.Initial){
                StatusMessage("Wrong position for the airplane!")
                return
            }

            if (game.gamePlayerState == GamePlayerState.Initial) {
                // First click, set plane position
                game.gamePlayerState = GamePlayerState.Alive;
                game.gameStatusElem.innerText = "Play!";

                // TO DO: Check if position is legal
                game.airplanePosition = gridClick;

                // Clear, forgot why I added this
                game.contextLayer1.clearRect(0, 0, game.canvasLayer1.width, game.canvasLayer1.height);

                
                
                game.contextLayer1.drawImage(game.airplaneImage, 0, 0, // image, offsetX, offsetY
                    PLANE_WIDTH, PLANE_HEIGHT, // width, height
                    game.airplanePosition.x * tileSize, game.airplanePosition.y * tileSize,   // canvasOffsetX, canvasOffsetY
                    PLANE_WIDTH * tileSize / originalTileSize, PLANE_HEIGHT * tileSize / originalTileSize); // canvasWidth, canvasHeight
            }
            else if (game.gamePlayerState == GamePlayerState.Alive) {
                // Do "Shoot"
                game.gameEvents.shoot(gridClick, function (c, t, p) { game.shotResponse(c, t, p) })
            }
            else {
                // Player is dead, do nothing?
            }

        }, false);
        
        document.addEventListener('keyup', function (evt) {
            var key = evt.keyCode;
            if (game.gamePlayerState == GamePlayerState.Initial && key == 82) {
                if(game.airplaneOrientation == AirplaneOrientation.Up){
                    game.airplaneOrientation = AirplaneOrientation.Left
                }else if(game.airplaneOrientation == AirplaneOrientation.Left){
                    game.airplaneOrientation = AirplaneOrientation.Down
                }else if(game.airplaneOrientation == AirplaneOrientation.Down){
                    game.airplaneOrientation = AirplaneOrientation.Right
                }else if(game.airplaneOrientation == AirplaneOrientation.Right){
                    game.airplaneOrientation = AirplaneOrientation.Up
                }
            }
            game.airplaneImage = new Image()
            game.airplaneImage.src = AirplanesSrcs[game.airplaneOrientation]
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

    drawGrid(): void {
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

    shotResponse(coord: vec2, type: GameEventType, playerName: string): void {
        if (type == GameEventType.Hit) {
            this.drawTileImage(this.contextLayer1, this.hitX, coord)
        }
        else if (type == GameEventType.Kill) {
            this.drawTileImage(this.contextLayer1, this.killX, coord)
            StatusMessage(playerName+" is out")
        }
        else {
            this.drawTileImage(this.contextLayer1, this.missX, coord)
        }
    }
    onAttack(coord: vec2, playerName: string): GameEventType {
        var type: GameEventType = JudgeHit(coord, this.airplanePosition, this.airplaneOrientation);

        switch (type) {
            case GameEventType.Kill:
                this.gamePlayerState = GamePlayerState.Dead
                this.status = GameStatusType.OverLost
                this.endGame()
            case GameEventType.Hit:
                this.drawTileImage(this.contextLayer1, this.enemyHitX, coord);
                break;
            case GameEventType.Miss:
                this.drawTileImage(this.contextLayer1, this.enemyMissX, coord);
            default:
                break;
        }

        return type;
    }
    onPlayerDrop(playerName: string): void {

    }
    status : GameStatusType = GameStatusType.Playing
    onGameChange(status: GameStatusType): void {
        this.gamePlayerState = GamePlayerState.Dead
        this.endGame()
    }
    
    endGame() : void {
        if(this.status == GameStatusType.OverSuccess || this.status == GameStatusType.Playing) {
            StatusMessage("You win!");
        }
        else if(this.status == GameStatusType.OverLost) {
            StatusMessage("Game Over!");
        }
        else if(this.status == GameStatusType.Disconnected) {
            StatusMessage("Disconnected!");
        }
    }
}
