var PLANE_WIDTH = 160;
var PLANE_HEIGHT = 127;
// Used for scaling and positioning
var originalTileSize = 32;
var tileSize = 16;
var GamePlayerState;
(function (GamePlayerState) {
    GamePlayerState[GamePlayerState["Initial"] = 0] = "Initial";
    GamePlayerState[GamePlayerState["Alive"] = 1] = "Alive";
    GamePlayerState[GamePlayerState["Dead"] = 2] = "Dead";
})(GamePlayerState || (GamePlayerState = {}));
var Game = (function () {
    function Game() {
        this.airplanePosition = { x: 0, y: 0 };
        this.gamePlayerState = GamePlayerState.Initial;
    }
    Game.prototype.Init = function () {
        var game = this;
        var div = document.getElementById("canvases");
        div.style.display = "block";
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
        game.gamePlayerState = GamePlayerState.Initial;
        game.bgImage.src = 'img/dot.png';
        game.airplaneImage.src = 'img/avion.png';
        game.hoverGridImage.src = 'img/dot-hover.png';
        // Handlers
        game.bgImage.onload = function () {
            // Draw grid manually (needs to be done manually for scaling)
            for (var i = 0; i < game.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < game.canvasLayer0.height / tileSize; j++) {
                    game.contextLayer0.drawImage(game.bgImage, 0, 0, originalTileSize, originalTileSize, tileSize * i, tileSize * j, tileSize, tileSize);
                }
            }
        };
        game.canvasLayer1.addEventListener('mousemove', function (evt) {
            var gridPos = game.GetGridPos(game, { x: evt.clientX, y: evt.clientY });
            // Clear
            game.contextLayer0.clearRect(0, 0, game.canvasLayer0.width, game.canvasLayer0.height);
            // Draw grid again 
            // TO DO: move to separate function
            for (var i = 0; i < game.canvasLayer0.width / tileSize; i++) {
                for (var j = 0; j < game.canvasLayer0.height / tileSize; j++) {
                    game.contextLayer0.drawImage(game.bgImage, 0, 0, originalTileSize, originalTileSize, tileSize * i, tileSize * j, tileSize, tileSize);
                }
            }
            // Draw yellow (highlited) grid dot
            game.contextLayer0.drawImage(game.hoverGridImage, 0, 0, originalTileSize, originalTileSize, tileSize * gridPos.x, tileSize * gridPos.y, tileSize, tileSize);
        }, false);
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
                game.airplanePosition.x * tileSize, game.airplanePosition.y * tileSize, // canvasOffsetX, canvasOffsetY
                PLANE_WIDTH / 2, PLANE_HEIGHT / 2); // canvasWidth, canvasHeight
            }
            else if (game.gamePlayerState == GamePlayerState.Alive) {
            }
            else {
            }
        }, false);
    };
    Game.prototype.GetGridPos = function (game, mousePos) {
        // Position relative to canvas top-left corner
        var canvasRect = game.canvasLayer0.getBoundingClientRect();
        mousePos.x -= canvasRect.left;
        mousePos.y -= canvasRect.top;
        // Convert to tileSize steps
        var gridPos = { x: Math.floor(mousePos.x / tileSize), y: Math.floor(mousePos.y / tileSize) };
        return gridPos;
    };
    return Game;
}());
//# sourceMappingURL=game.js.map