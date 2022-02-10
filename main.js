class Board
{
    //TODO: Mover la clase Board a un archivo .js separado por comodidad
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.gameOver = false;
        this.bars = [];
        this.ball = null;
    }

    get elements()
    {
        var elements = this.bars;
        elements.push(ball);
        return elements;
    }
}

class BoardView
{
    //TODO: Mover la clase Board a un archivo .js separado por comodidad
    constructor(canvas, board)
    {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.context = canvas.getContext("2d");

    }
}


window.addEventListener("load", main);

function main()
{
    var board = new Board(800, 400);
    var canvas = document.getElementById('canvas');
    var boardView = new BoardView(canvas, board);
}