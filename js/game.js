/// <reference path="interfaces.ts"/>
var PLANE_WIDTH = 160;
var PLANE_HEIGHT = 160;
// Used for scaling and positioning
var originalTileSize = 32;
var theoreticalTileSize = 16;
var tileSize = theoreticalTileSize;
var boardSize = { x: 10, y: 10 };
var globalGame = null;
var GamePlayerState;
(function (GamePlayerState) {
    GamePlayerState[GamePlayerState["Initial"] = 0] = "Initial";
    GamePlayerState[GamePlayerState["Alive"] = 1] = "Alive";
    GamePlayerState[GamePlayerState["Dead"] = 2] = "Dead";
})(GamePlayerState || (GamePlayerState = {}));
var AirplanesSrcs = ['img/avion-up.png', 'img/avion-down.png', 'img/avion-left.png', 'img/avion-right.png'];
var AirplaneOrientation;
(function (AirplaneOrientation) {
    AirplaneOrientation[AirplaneOrientation["Up"] = 0] = "Up";
    AirplaneOrientation[AirplaneOrientation["Down"] = 1] = "Down";
    AirplaneOrientation[AirplaneOrientation["Left"] = 2] = "Left";
    AirplaneOrientation[AirplaneOrientation["Right"] = 3] = "Right";
})(AirplaneOrientation || (AirplaneOrientation = {}));
function InitGame(info) {
    var game = new Game;
    game.info = info;
    game.Init();
}
function ResizeGame() {
    if (globalGame) {
        tileSize = Math.min(window.innerWidth / (100 * boardSize.x / 90), window.innerHeight / (100 * boardSize.y / 60));
        globalGame.canvasLayer0.width = tileSize * boardSize.x;
        globalGame.canvasLayer0.height = tileSize * boardSize.y;
        globalGame.canvasLayer0.style.left = (window.innerWidth - globalGame.canvasLayer0.width) / 2 + "px";
        globalGame.canvasLayer1.width = tileSize * boardSize.x;
        globalGame.canvasLayer1.height = tileSize * boardSize.y;
        globalGame.canvasLayer1.style.left = (window.innerWidth - globalGame.canvasLayer0.width) / 2 + "px";
        globalGame.drawGrid();
    }
}
var Game = (function () {
    function Game() {
        this.airplanePosition = { x: 0, y: 0 };
        this.airplaneOrientation = AirplaneOrientation.Up;
        this.gamePlayerState = GamePlayerState.Initial;
        this.gameEvents = new GameEventsMock;
        this.status = GameStatusType.Playing;
    }
    Game.prototype.Init = function () {
        var game = this;
        globalGame = this;
        game.gameEvents.init(function (c, p) { return game.onAttack(c, p); }, function (p) { game.onPlayerDrop(p); }, function (s) { game.onGameChange(s); });
        SetVisibleDiv("canvasesForm");
        var body = document.getElementById("body");
        body.bgColor = "#29B6F6";
        //
        game.canvasLayer0 = document.getElementById('canvasLayer0');
        game.canvasLayer1 = document.getElementById('canvasLayer1');
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
            ResizeGame();
        };
        game.canvasLayer1.addEventListener('mousemove', function (evt) {
            var gridPos = game.GetGridPos({ x: evt.clientX, y: evt.clientY });
            // Clear
            game.contextLayer0.clearRect(0, 0, game.canvasLayer0.width, game.canvasLayer0.height);
            // Draw grid again 
            game.drawGrid();
            // Draw yellow (highlited) grid dot
            game.drawTileImage(game.contextLayer0, game.hoverGridImage, gridPos);
        }, false);
        game.canvasLayer1.addEventListener('mouseup', function (evt) {
            var gridClick = game.GetGridPos({ x: evt.clientX, y: evt.clientY });
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
                game.airplanePosition.x * tileSize, game.airplanePosition.y * tileSize, // canvasOffsetX, canvasOffsetY
                PLANE_WIDTH * tileSize / originalTileSize, PLANE_HEIGHT * tileSize / originalTileSize); // canvasWidth, canvasHeight
            }
            else if (game.gamePlayerState == GamePlayerState.Alive) {
                // Do "Shoot"
                game.gameEvents.shoot(gridClick, function (c, t, p) { game.shotResponse(c, t, p); });
            }
            else {
            }
        }, false);
        document.addEventListener('keyup', function (evt) {
            var key = evt.keyCode;
            if (game.gamePlayerState == GamePlayerState.Initial && key == 82) {
                if (game.airplaneOrientation == AirplaneOrientation.Up) {
                    game.airplaneOrientation = AirplaneOrientation.Left;
                }
                else if (game.airplaneOrientation == AirplaneOrientation.Left) {
                    game.airplaneOrientation = AirplaneOrientation.Down;
                }
                else if (game.airplaneOrientation == AirplaneOrientation.Down) {
                    game.airplaneOrientation = AirplaneOrientation.Right;
                }
                else if (game.airplaneOrientation == AirplaneOrientation.Right) {
                    game.airplaneOrientation = AirplaneOrientation.Up;
                }
            }
            game.airplaneImage = new Image();
            game.airplaneImage.src = AirplanesSrcs[game.airplaneOrientation];
        }, false);
    };
    Game.prototype.GetGridPos = function (mousePos) {
        // Position relative to canvas top-left corner
        var canvasRect = this.canvasLayer0.getBoundingClientRect();
        mousePos.x -= canvasRect.left;
        mousePos.y -= canvasRect.top;
        // Convert to tileSize steps
        var gridPos = { x: Math.floor(mousePos.x / tileSize), y: Math.floor(mousePos.y / tileSize) };
        return gridPos;
    };
    Game.prototype.drawGrid = function () {
        if (globalGame.bgImage) {
            for (var i = 0; i < this.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < this.canvasLayer0.height / tileSize; j++) {
                    this.contextLayer0.drawImage(this.bgImage, 0, 0, originalTileSize, originalTileSize, tileSize * i, tileSize * j, tileSize, tileSize);
                }
            }
        }
    };
    Game.prototype.drawTileImage = function (context, image, gridPos) {
        if (image) {
            context.drawImage(image, 0, 0, originalTileSize, originalTileSize, tileSize * gridPos.x, tileSize * gridPos.y, tileSize, tileSize);
        }
    };
    Game.prototype.shotResponse = function (coord, type, playerName) {
        if (type == GameEventType.Hit) {
            this.drawTileImage(this.contextLayer1, this.hitX, coord);
        }
        else if (type == GameEventType.Kill) {
            this.drawTileImage(this.contextLayer1, this.killX, coord);
        }
        else {
            this.drawTileImage(this.contextLayer1, this.missX, coord);
        }
    };
    Game.prototype.onAttack = function (coord, playerName) {
        var type = JudgeHit(coord, this.airplanePosition, this.airplaneOrientation);
        switch (type) {
            case GameEventType.Kill:
                this.drawTileImage(this.contextLayer1, this.enemyHitX, coord);
                this.gamePlayerState = GamePlayerState.Dead;
                this.status = GameStatusType.OverLost;
                this.endGame();
                break;
            case GameEventType.Hit:
                this.drawTileImage(this.contextLayer1, this.enemyHitX, coord);
                break;
            case GameEventType.Miss:
                this.drawTileImage(this.contextLayer1, this.enemyMissX, coord);
            default:
                break;
        }
        return type;
    };
    Game.prototype.onPlayerDrop = function (playerName) {
    };
    Game.prototype.onGameChange = function (status) {
        this.gamePlayerState = GamePlayerState.Dead;
        this.endGame();
    };
    Game.prototype.endGame = function () {
        if (this.status == GameStatusType.OverSuccess || this.status == GameStatusType.Playing) {
            alert("You win!");
        }
        else if (this.status == GameStatusType.OverLost) {
            alert("Game Over!");
        }
        else if (this.status == GameStatusType.Disconnected) {
            alert("Disconnected!");
        }
    };
    return Game;
}());
//# sourceMappingURL=game.js.map