/// <reference path="interfaces.ts"/>
var PLANE_WIDTH = 160;
var PLANE_HEIGHT = 127;
// Used for scaling and positioning
var originalTileSize = 32;
var theoreticalTileSize = 16;
var tileSize = theoreticalTileSize;
var boardSize = { x: 19, y: 19 };
var globalGame = null;
var GamePlayerState;
(function (GamePlayerState) {
    GamePlayerState[GamePlayerState["Initial"] = 0] = "Initial";
    GamePlayerState[GamePlayerState["Alive"] = 1] = "Alive";
    GamePlayerState[GamePlayerState["Dead"] = 2] = "Dead";
})(GamePlayerState || (GamePlayerState = {}));
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
        this.gamePlayerState = GamePlayerState.Initial;
        this.gameEvents = new GameEventsMock;
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
        game.bgImage = new Image();
        game.airplaneImage = new Image();
        game.hoverGridImage = new Image();
        game.redX = new Image();
        game.grayX = new Image();
        game.greenX = new Image();
        game.gamePlayerState = GamePlayerState.Initial;
        game.bgImage.src = 'img/dot.png';
        game.airplaneImage.src = 'img/avion.png';
        game.hoverGridImage.src = 'img/dot-hover.png';
        game.redX.src = 'img/red-x.png';
        game.grayX.src = 'img/gray-x.png';
        game.greenX.src = 'img/green-x.png';
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
        game.canvasLayer1.addEventListener('click', function (evt) {
            var gridClick = game.GetGridPos({ x: evt.clientX, y: evt.clientY });
            if (game.gamePlayerState == GamePlayerState.Initial) {
                // First click, set plane position
                game.gamePlayerState = GamePlayerState.Alive;
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
                // Player is dead, do nothing?
                alert("Game Over");
            }
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
            this.drawTileImage(this.contextLayer1, this.greenX, coord);
        }
        else if (type == GameEventType.Kill) {
            this.drawTileImage(this.contextLayer1, this.redX, coord);
        }
        else {
            this.drawTileImage(this.contextLayer1, this.grayX, coord);
        }
    };
    Game.prototype.onAttack = function (coord, playerName) {
        this.drawTileImage(this.contextLayer1, this.grayX, coord);
        return GameEventType.Miss;
    };
    Game.prototype.onPlayerDrop = function (playerName) {
    };
    Game.prototype.onGameChange = function (status) {
        this.gamePlayerState = GamePlayerState.Dead;
    };
    return Game;
}());
//# sourceMappingURL=game.js.map