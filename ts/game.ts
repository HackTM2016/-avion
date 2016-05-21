class Game {
    myCanvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    bgImage:any;
    
    Init() {
        var game = this;
        
        game.myCanvas = <HTMLCanvasElement>document.getElementById('canvas');
        game.context = game.myCanvas.getContext('2d');

        game.bgImage = new Image();
        game.bgImage.onload = function () {
            var pattern = game.context.createPattern(game.bgImage, 'repeat');
            game.context.rect(0, 0, game.myCanvas.width, game.myCanvas.height);
            game.context.fillStyle = pattern;
            game.context.fill();
        }
        
        game.bgImage.src = 'img/dots.png';
    }
}