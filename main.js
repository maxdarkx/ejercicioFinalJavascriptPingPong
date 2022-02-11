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
        let elements = this.bars.map(function(bar){return bar;});
        elements.push(this.ball);
        return elements;
    }
}

class Bar
{
    constructor(x, y, width, height, board)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
    }

    down()
    {

    }

    up()
    {

    }
}


class BoardView
{
    //TODO: Mover la clase Board a un archivo .js separado por comodidad
    constructor(canvas, board)
    {
        this.canvas = canvas;
        this.board = board;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.context = canvas.getContext("2d");

    }

    drawBoard()
    {
        for(var i = this.board.elements.length - 1; i >= 0; i--)
        {
            var elementToDraw = this.board.elements[i];
            this.drawElement(this.context, elementToDraw);
        }
    }

    drawElement(context, element)
    {
        if(element != null){
            switch(element.kind)
            {
                case "rectangle":
                    
                    context.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
        }

    }
}


window.addEventListener("load", main);

function main()
{
    var canvas = document.getElementById('canvas');
    var board = new Board(800, 400);
    var bar1 = new Bar(20, 100, 40, 100, board);
    var bar2 = new Bar(740, 100, 40, 100, board);
    var boardView = new BoardView(canvas, board);
    boardView.drawBoard();
}