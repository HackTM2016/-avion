var Game = (function () {
    function Game() {
    }
    Game.prototype.Init = function () {
        var game = this;
        game.myCanvas = document.getElementById('canvas');
        game.context = game.myCanvas.getContext('2d');
        game.bgImage = new Image();
        game.bgImage.onload = function () {
            var pattern = game.context.createPattern(game.bgImage, 'repeat');
            game.context.rect(0, 0, game.myCanvas.width, game.myCanvas.height);
            game.context.fillStyle = '#007FFF';
            game.context.fill();
            //game.context.fillStyle = pattern;
            //game.context.fill();
        };
        game.bgImage.src = 'img/dots.png';
    };
    return Game;
}());
//# sourceMappingURL=game.js.map