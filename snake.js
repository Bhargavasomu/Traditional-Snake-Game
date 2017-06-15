// Fetching required Canvas Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvas_width = $(canvas).width();
var canvas_height = $(canvas).height();

// Painting the Canvas
ctx.fillStyle = "white";                        // fills the canvas with white color
ctx.fillRect(0,0,canvas_width,canvas_height);
ctx.strokeStyle = "black";                      // to draw the border of canvas
ctx.strokeRect(0,0,canvas_width,canvas_height);

// Grid Variables
var grid = [];
var box_dim = 20;
var num_rows = Math.floor(canvas_height/box_dim);
var num_cols = Math.floor(canvas_width/box_dim);

// Values present in the grid
var EMPTY = 0;
var SNAKE_FILLED = 1;
var FRUIT = 2;

function init_grid()
{
    for(var i=0;i<num_rows;i++)
    {
        grid.push([]);
        for(var j=0;j<num_cols;j++)
        {
            grid[i][j] = EMPTY;
        }
    }
}
init_grid();

// Defining the Directions for Snake Movement
var LEFT = 0;
var UP = 1;
var RIGHT = 2;
var DOWN = 3;

// Global Variable Score
var SCORE = 0;
document.getElementById('score_value').innerHTML = SCORE;

var snake_init_length = 5;
var snake_queue;
var direction = RIGHT;
function init_snake()
{
    snake_queue = [];
    for(var i=snake_init_length-1;i>=0;i--)     // head at (4,0) and for our datastructure need it to be at start of array for unshift function
    {
        snake_queue.push({x:0,y:i});
    }
}
init_snake();

var fruit_cell;
function init_fruit()
{
    var empty_cells = [];
    for(var i=0;i<num_rows;i++)
    {
        for(var j=0;j<num_cols;j++)
        {
            if(grid[i][j]==EMPTY)
            {
                empty_cells.push({x:i,y:j});
            }
        }
    }
    var rand_empty_cell = empty_cells[Math.floor(Math.random()*(empty_cells.length))];
    fruit_cell = rand_empty_cell;
}
init_fruit();

//Lets add the keyboard controls now
$(document).keydown(function(e)
{
	var key = e.which;
	//We will add another clause to prevent reverse gear
	if((key == "37") && (direction != RIGHT))
    {
        direction = LEFT;
    }
	else if((key == "38") && (direction != DOWN))
    {
        direction = UP;
    }
	else if((key == "39") && (direction != LEFT))
    {
        direction = RIGHT;
    }
	else if((key == "40") && (direction != UP))
    {
        direction = DOWN;
    }
});

function draw_on_screen()
{
    // reinitiate the canvas to white color
    ctx.fillStyle = "white";                        // fills the canvas with white color
    ctx.fillRect(0,0,canvas_width,canvas_height);
    ctx.strokeStyle = "black";                      // to draw the border of canvas
    ctx.strokeRect(0,0,canvas_width,canvas_height);

    for(var i=0;i<snake_queue.length;i++)           // drawing the snake
    {
        var c = snake_queue[i];
		// filling the positions occupied by snake with color
		ctx.fillStyle = "blue";
		ctx.fillRect(c.y*box_dim, c.x*box_dim, box_dim, box_dim);
		ctx.strokeStyle = "white";
		ctx.strokeRect(c.y*box_dim, c.x*box_dim, box_dim, box_dim);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(fruit_cell.y*box_dim, fruit_cell.x*box_dim, box_dim, box_dim);
    ctx.strokeStyle = "white";
    ctx.strokeRect(fruit_cell.y*box_dim, fruit_cell.x*box_dim, box_dim, box_dim);
}

// setInterval(draw_on_screen,500);
function move_snake()
{
    snake_queue.pop();   // pop tail
    var head = snake_queue[0];
    var new_cell_pos;
    if(direction==UP)
    {
        // add to head(r1,c1) , (r1-1,c1)
        new_cell_pos = { x:(head.x-1) , y:(head.y) };
    }
    if(direction==DOWN)
    {
        // add to head(r1,c1) , (r1+1,c1)
        new_cell_pos = { x:(head.x+1) , y:(head.y) };
    }
    if(direction==LEFT)
    {
        // add to head(r1,c1) , (r1,c1-1)
        new_cell_pos = { x:(head.x) , y:(head.y-1) };
    }
    if(direction==RIGHT)
    {
        // add to head(r1,c1) , (r1,c1+1)
        new_cell_pos = { x:(head.x) , y:(head.y+1) };
    }
    snake_queue.unshift(new_cell_pos);
    draw_on_screen();
    return
}

function check_wall_collision()
{
    // snake's head row and col should be from 0 to num_rows and 0 to num_cols
    // console.log(num_rows);
    // console.log(num_cols);
    if((snake_queue[0].x>=0)&&(snake_queue[0].x<num_rows)&&(snake_queue[0].y>=0)&&(snake_queue[0].y<num_cols))
    {
        return 0;
    }
    else
    {
        return 1;
    }
}

function refresh()
{
    // reset score to 0
    SCORE = 0;
    document.getElementById('score_value').innerHTML = SCORE;
    //reset direction to RIGHT
    direction = RIGHT;
    // reinit grid
    init_grid();
    // reinit snake
    init_snake();
    // reinit fruit_position
    init_fruit();
}

function main()
{
    // check if collision with walls, if collides, score=0, and reinitialize the game
    var collide_flag = check_wall_collision();
    if(collide_flag==1)
    {
        refresh();
    }
    else
    {
        // check if the head position and fruit position coincide
        // if they coincide, then make the new fruit position as head and do unshift,score++, add a new fruit position

        // Do the move function where the tail is removed and added to the front of head according to direction pressed by user
        if(direction==RIGHT)
        {
            if((snake_queue[0].x>=0)&&(snake_queue[0].x<num_rows)&&(snake_queue[0].y+1>=0)&&(snake_queue[0].y+1<num_cols))
            {
                move_snake();
            }
            else
            {
                refresh();
            }
        }
        else if(direction==UP)
        {
            if((snake_queue[0].x-1>=0)&&(snake_queue[0].x-1<num_rows)&&(snake_queue[0].y>=0)&&(snake_queue[0].y<num_cols))
            {
                move_snake();
            }
            else
            {
                refresh();
            }
        }
        else if(direction==DOWN)
        {
            if((snake_queue[0].x+1>=0)&&(snake_queue[0].x+1<num_rows)&&(snake_queue[0].y>=0)&&(snake_queue[0].y<num_cols))
            {
                move_snake();
            }
            else
            {
                refresh();
            }
        }
        if(direction==LEFT)
        {
            if((snake_queue[0].x>=0)&&(snake_queue[0].x<num_rows)&&(snake_queue[0].y-1>=0)&&(snake_queue[0].y-1<num_cols))
            {
                move_snake();
            }
            else
            {
                refresh();
            }
        }
    }
}

function move_snake1()
{
    var tail = snake_queue.pop();   // pop tail
    var head = snake_queue[0];
    var new_cell_pos;
    if(direction==UP)
    {
        // add to head(r1,c1) , (r1-1,c1)
        new_cell_pos = { x:(head.x-1) , y:(head.y) };
    }
    if(direction==DOWN)
    {
        // add to head(r1,c1) , (r1+1,c1)
        new_cell_pos = { x:(head.x+1) , y:(head.y) };
    }
    if(direction==LEFT)
    {
        // add to head(r1,c1) , (r1,c1-1)
        new_cell_pos = { x:(head.x) , y:(head.y-1) };
    }
    if(direction==RIGHT)
    {
        // add to head(r1,c1) , (r1,c1+1)
        new_cell_pos = { x:(head.x) , y:(head.y+1) };
    }
    // if new_cell_pos is out of walls or intersects with the snake, then gameover
    var check_collision_walls = ((new_cell_pos.x>=0)&&(new_cell_pos.x<num_rows)&&(new_cell_pos.y>=0)&&(new_cell_pos.y<num_cols));   // set if snake is inside the box
    var check_collision_snake = 0;  // no collision initially with itself
    for(var i=0;i<snake_queue.length;i++)   // checking for collision with itself
    {
        if((snake_queue[i].x==new_cell_pos.x)&&(snake_queue[i].y==new_cell_pos.y))
        {
            check_collision_snake = 1;
            break;
        }
    }
    if((check_collision_walls==1)&&(check_collision_snake==0))
    {
        // if the new_cell_pos matches with fruit, then push tail and unshift
        if((new_cell_pos.x==fruit_cell.x)&&(new_cell_pos.y==fruit_cell.y))
        {
            // make a new head instead of popping the tail
            snake_queue.push(tail);
            // make a new fruit position
            init_fruit();
            // increase the score(coming soon)
            SCORE = SCORE+1;
            document.getElementById('score_value').innerHTML = SCORE;
        }
        snake_queue.unshift(new_cell_pos);
        draw_on_screen();
    }
    else
    {
        refresh();
    }
}

setInterval(move_snake1,50);
