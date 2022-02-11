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
        this.initX = x;
        this.initY = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    down()
    {
        if(this.y < 300)
        {
            this.y += this.speed;
        }
    }

    up()
    {
        if(this.y > 0)
        {
            this.y -= this.speed;
        }
    }

    toString()
    {
        return "x: "+this.x +" y:"+this.y;
    }

    reset()
	{
		this.x = this.initX;
		this.y = this.initY;
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
        this.speedX = 5;
        this.speed = 5;
        this.board = board;
        this.direction = 1;
        this.directionX = 1;
        this.directionY = 1;
        board.ball = this;
        this.kind = "circle";
        this.bounceAngle = 0;
        this.maxBounceAngle = Math.PI / 12;
    }

    get width()
    {
        return this.radius * 2;
    }

    get height()
    {
        return this.radius * 2;
    }

    move()
    {
        if((this.y) > 10 && (this.y) < (this.board.height-10) )
		{
			this.x += this.speedX * this.directionX;
			this.y += this.speedY * this.directionY;
		}	
		else
		{
			this.directionY = -this.directionY;
			this.x += this.speedX * this.directionX;
			this.y += this.speedY * this.directionY;
		}
    }

    collision(bar)
    {
        //sirve para reaccionar a la colision con una barra que se recibe como parametro
        var relativeIntersectY = bar.y + ( bar.height/2 ) - this.y;
        var normalizedIntersectY = relativeIntersectY / ( bar.height/2 );
        this.bounceAngle = normalizedIntersectY * this.maxBounceAngle;
        this.speedY = this.speed * -Math.sin(this.bounceAngle);
        this.speedX = this.speed * Math.cos(this.bounceAngle);

        if(this.x > (this.board.width / 2))
        {
            this.directionX = -1;
        }
        else
        {
            this.directionX = 1;
        }
    }
    reset() 			//resetea el juego despues de que algun jugador anota un punto.
	{					//La direccion a la que se dirigira la pelota se calcula al azar
	
		var choosedir = [-1,1];
		var shuffled = choosedir.sort(() => Math.random() - 0.5);
		this.initx = this.x;
		this.inity = this.y;
		this.direction_x = shuffled[0];
		this.direction_y = 1;
		this.bounce_angle = 0;
		this.speed_x=5;
		this.speed_y=0;
		
	}

    score() 							//si la pelota toca alguno de los extremos izquierdo o derecho,
	{ 									//se verifica quien anoto el punto
	
		var who = 0;
		
		if(this.x < 10)
		{
			this.x = 400;
			this.y = 300;
			who = 1;
		}
		else if (this.x > this.board.width-10)
		{	
			this.x = 400;
			this.y = 300;
			who = 2;
		}
        //console.log("score"+who);
		return who;
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
        this.score1 = 0;
        this.score2 = 0;

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
                context.fillStyle = "#FF0000";
                context.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                context.fillStyle = "#0000FF";
                context.beginPath();
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

    checkColisions()
    {
        for(var i = this.board.bars.length -1; i >= 0; i--)
        {
            var bar = this.board.bars[i];
            if(this.hit(bar, this.board.ball))
            {
                this.board.ball.collision(bar);
            }
        }
    }

    hit(a, b)
    {
        //verifica si a colisiona con b
        var golpe = false;

        //colisiones horizontales
        if(b.x +b.width >= a.x && b.x < a.x + a.width)
        {
            //colisiones verticales
            if(b.y +b.height >= a.y && b.y < a.y + a.height)
            {
                golpe = true;
            }
        }

        //colision de a con b
        if(b.x <= a.x && b.x + b.width >= a.x + a.width)
        {
            if(b.y <= a.y && b.y +b.height >= a.y + a.height)
            {
                golpe = true;
            }
        }

        //colision de b con a
        if(a.x <= b.x && a.x + a.width >= b.x + b.width)
        {
            if(a.y <= b.y && a.y + a.height >= b.y + b.height)
            {
                golpe = true;
            }
        }
        return golpe;


    }

    play()
    {
        let playerScore = 0;
        if(this.board.playing)
        {
            this.clearScreen();
            this.drawBoard();
            this.checkColisions();
            playerScore = this.board.ball.score();
            
            if(playerScore == 0)
            {
                this.board.ball.move();
            }
            else if(playerScore == 1)
            {
                this.score1++;
                this.printScore();
                this.reset();
            }
            else if(playerScore == 2)
            {
                this.score2++;
                this.printScore();
                this.reset();
            }
            this.checkWin();
        }
    }

    printScore() 				//mensaje que muestra el marcador en el HTML
	{
		document.getElementById("score").innerHTML="<p'>Player 1: "+this.score1
										+ "</p><p>Player 2: "+this.score2+"</p>";
	}

    checkWin()
    {
        if(this.score1 >= 8)
        {
            this.board.playing = !this.board.playing;		
			document.getElementById("score").innerHTML="<p'>Player 1 WINS!</p>";
			setTimeout(function(){document.location.reload();},5000);
        }
        else if(this.score2 >= 8)
        {
            this.board.playing = !this.board.playing;		
			document.getElementById("score").innerHTML="<p'>Player 2 WINS!</p>";
			setTimeout(function(){document.location.reload();},5000);
        }
    }
    
    reset()
	{
		this.board.playing = !this.board.playing;
		this.board.bars[0].reset();
		this.board.bars[1].reset();
		this.board.ball.reset();
		this.clearScreen();
		this.drawBoard();
		//console.log(ball.toString());
	}
}

function eventoPresionarTecla(bar1, bar2)
{
    document.addEventListener("keypress", function(event){
        console.log(event.code);
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
        else if(event.code == "Space")
        {
            event.preventDefault();
            board.playing = !board.playing;
        }
    });
    
}


window.addEventListener("load", main);
/*setTimeout(function(){
    ball.direction = ball.direction*-1
},3000);*/
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
    boardView.clearScreen();
    boardView.drawBoard();
    controller();
}