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
        this.speed = 10;
    }

    down()
    {
        this.y += this.speed;
    }

    up()
    {
        this.y -= this.speed;
    }

    toString()
    {
        return "x: "+this.x +" y:"+this.y;
    }
}

class Ball
{
    constructor(x, y, radius, board)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedY = 0;
        this.speedX = 3;
        this.board = board;
        board.ball = this;
        this.kind = "circle";
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
        switch(element.kind)
        {
            case "rectangle":
                
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                context.arc(element.x, element.y, element.radius, 0, 7);
                context.fill();
                context.closePath();
                break;
        }
    }

    clearScreen()
    {
        this.context.clearRect(0,0,this.board.width, this.board.height);
    }

    play()
    {
        this.clearScreen();
        this.drawBoard();
    }
}

function eventoPresionarTecla(bar1, bar2)
{
    document.addEventListener("keypress", function(event){
        //console.log(event.code);
        if(event.code == "KeyW")
        {
            console.log("barra1 arriba: "+bar1.toString());
            event.preventDefault();
            bar1.up();
        }
        else if(event.code == "KeyS")
        {
            console.log("barra1 abajo: "+bar1.toString());
            event.preventDefault();
            bar1.down();
        }
        else if(event.code == "Numpad8")
        {
            console.log("barra2 arriba: "+bar2.toString());
            event.preventDefault();
            bar2.up();
        }
        else if(event.code == "Numpad2")
        {
            console.log("barra2 abajo: "+bar2.toString());
            event.preventDefault();
            bar2.down();
        }
    });
    
}


window.addEventListener("load", main);
var canvas = document.getElementById('canvas');
var board = new Board(800, 400);
var bar1 = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(740, 100, 40, 100, board);
var ball = new Ball(350, 100, 10, board);
var boardView = new BoardView(canvas, board);


function controller()
{
    boardView.play();
    window.requestAnimationFrame(controller);
}

function main()
{
//    console.log(bar1.toString());
//    console.log(bar2.toString());
    eventoPresionarTecla(bar1, bar2)
    controller();
}