$(function () {
    /*********************************************************
     *            Provided Code --- DO NOT MODIFY            *
     *********************************************************/

    var CELL_SIZE = 5, // each cell will be 10 pixels x 10 pixels
        CELL_ALIVE_COLOR = "#2ecc71",
        CELL_DEAD_COLOR  = "#e74c3c",
        GENERATION_INTERVAL = 0.5,
        NUM_COLS = 200,
        NUM_ROWS = 100,
        speed = 500,
        numRounds = 0,
        defaultColor = true,
        gameGrid = new Array(NUM_ROWS);


    // The Custom object used to represent a cell on the HTML canvas grid
    // Remember, datamembers of a JS Object are all public
    function Cell() {
        // (xPosition,yPosition) represents the top left pixel of this cell on the canvas 
        this.xPosition = 0;
        this.yPosition = 0;
        
        // represents the fillStyle that should be used when fillRect is called
        this.fillStyle = "white";

        // represents whether a cell is dead or alive
        this.dead = true;

        // represents the number of live neighbors this cell has
        this.liveNeighbors = 0;

        // represents number of times the cell is alive concecutively
        this.timesAlive = 0;

        // represents if the cell has been alive and then dead
        this.beenAlive = false;
    }

    // Requires: Nothing
    // Modifies: Nothing
    // Effects: Gets and returns the canvas context from index.html. Use this
    //          function's return value to draw on the canvas using functions
    //          like fillRect() and clearRect()
    function getCanvas() {
        var c = document.getElementById("grid");
        return c.getContext("2d");
    }


    // Requires: Nothing
    // Modifies: HTML canvas element
    // Effects: Draws the grid lines for the HTML canvas
    function drawGridLines() {
        var grid = getCanvas();

        var canvasWidth = $("#grid").width(),
            canvasHeight = $("#grid").height();
        
        // place vertical grid lines
        for (var i = 0; i < canvasWidth; i += CELL_SIZE) {
            grid.moveTo(i, 0);
            grid.lineTo(i, canvasWidth);    
        }
        // place horizontal grid lines
        for (var j = 0; j < canvasHeight; j += CELL_SIZE) {
            grid.moveTo(0, j);
            grid.lineTo(canvasWidth, j);
        }
        
        // draw grid lines
        grid.strokeStyle = "white";
        grid.stroke();
    }


    // Requires: Nothing
    // Modifies: gameGrid
    // Effects: gameGrid is initially created as an array of size NUM_ROWS, meaning
    //          we need to initalize each row as an array of size NUM_COLS
    function initArray() {
        for(var k = 0; k < NUM_ROWS; ++k)
        {
            gameGrid[k] = new Array(NUM_COLS);
        }
    }
    

    // Requires: Nothing
    // Modifies: gameGrid, HTML canvas
    // Effects: The onClick listener for the different draw buttons.  When a button
    //          is clicked, it determines which pattern is to be drawn and calls
    //          drawPattern with that value to be drawn on the HTML canvas (and 
    //          updates gameGrid to reflect that same state) at a random location on 
    //          the canvas.  In the event TEST_DRAW_PATTERN is
    //          true, it draws the pattern at row index 6 and col index 6
    $("#still-life-btn, #oscillator-btn, #spaceship-btn").click(function () {
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var pattern = $(selector).val(),
            newRow = Math.floor(Math.random() * 191829) % NUM_ROWS,
            newCol = Math.floor(Math.random() * 8103849204) % NUM_COLS;
        if (TEST_DRAW_PATTERN) {
            newRow = 0;
            newCol = 0;
        }
        drawPattern(pattern, gameGrid, newRow, newCol);
        // drawPattern overwrites grid lines, therefore need to redraw them
        drawGridLines();
    });

    $("#special-btn").click(function () {
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var pattern = $(selector).val(),
            newRow = Math.floor(Math.random() * 191829) % NUM_ROWS,
            newCol = Math.floor(Math.random() * 8103849204) % NUM_COLS;
        drawPattern(pattern, gameGrid, newRow, newCol);
        drawGridLines();
    });

    $("#color-scheme-btn").click(function () {
        var selector = $(this).attr("id");
        selector = "#" + selector.replace("btn", "select");
        var scheme = $(selector).val(),
            newRow = Math.floor(Math.random() * 191829) % NUM_ROWS,
            newCol = Math.floor(Math.random() * 8103849204) % NUM_COLS;
        setColorScheme(scheme);
    });

    var isRunning = false; // represents whether generations are still occurring
    // Requires: Nothing
    // Modifies: gameGrid, HTML canvas
    // Effects: Uses evolveStep to draw the next step of evolution on the HTML
    //          canvas (and updates gameGrid to reflect that same state).  Will
    //          continue to run the game at GENERATION_INTERVAL * 1000 milliseconds
    function runGoL() {
        if (!isRunning) {
            return;
        }
        evolveStep(gameGrid);
        // evolveStep overwrites grid lines, therefore need to redraw them
        drawGridLines();
        setTimeout(runGoL, GENERATION_INTERVAL * speed);
    }
    // onClick listener for the button to start the game
    $("#start-game").click(function() {
        isRunning = true;
        runGoL();
    });
    // onClick listener to stop the game
    $("#stop-game").click(function() {
        isRunning = false;
    });
    
    $("#clear-game").click(function(){
        isRunning = false;
        clearGameGrid(gameGrid);
    });

    $("#speed-up").click(function() {
        speed = speed - 100;
    });

    $("#slow-down").click(function() {
        speed = speed + 100;
    });



    initializeWebpage();




    /********************************************************************
     *                          YOUR CODE HERE                          *
     ********************************************************************/


    /*****************************************************************************
     *                                CORE PORTION                               *
     *    Implement the provided function stubs and any helper functions here    *
     *****************************************************************************/

     

    /*
     * Requires: row and col are integers
     * Modifies: Nothing.
     * Efects: Returns true if row and col are within
     *         bounds of the grid, returns false otherwise.
     */
    function validPosition(row, col){
        if (row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS) {
            return true;
        }
        else {
            return false;
        } 
    }


    /**
     * Requires: grid is a 2d array
     * Modifies: grid
     * Effects: Fills and populates gameGrid with default cells.  populateGameGrid
     *          also sets the xPosition and yPosition data members of each Cell
     *          object to match its x and y coordinates on the HTML canvas.
     */
    function populateGameGrid(grid) {
        for (var i = 0; i < NUM_ROWS; i += 1) {
            for (var j = 0; j < NUM_COLS; j += 1) {
                grid[i][j] = new Cell();
                grid[i][j].yPosition = i * CELL_SIZE;
                grid[i][j].xPosition = j * CELL_SIZE;
            }
        }
    }


    /** 
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects
     * Modifies: Nothing.
     * Effects: Counts the number of live neighbors for
     *          the cell at row,col in grid and returns the count.
     */
    function countLiveNeighbors(grid, row, col) {
            //Remington and Daniel think it might be grid[row + 1, col] rather than this.grid[...]
            //Also might be grid[col, row + 1] cause of the row column order
        var count = 0;
        if ((row + 1) < NUM_ROWS && grid[row + 1][col].dead === false)
        {
            count = ++count;
        }
        if ((row - 1) >= 0 && grid[row - 1][col].dead === false)
        {
            count = ++count;
        }
        if ((col + 1) < NUM_COLS && grid[row][col + 1].dead === false)
        {
            count = ++count;
        }
        if ((col - 1) >= 0 && grid[row][col - 1].dead === false)
        {
            count = ++count;
        }
        if ((row + 1) < NUM_ROWS && (col + 1) < NUM_COLS && grid[row + 1][col + 1].dead === false)
        {
            count = ++count;
        }
        if ((row - 1) >= 0 && (col + 1) < NUM_COLS && grid[row - 1][col + 1].dead === false)
        {
            count = ++count;
        }
        if ((row + 1) < NUM_ROWS && (col - 1) >= 0 && grid[row + 1][col - 1].dead === false)
        {
            count = ++count;
        }
        if ((row - 1) >= 0 && (col - 1) >= 0 && grid[row - 1][col - 1].dead === false)
        {
            count = ++count;
        }
        
        return count;
    }



    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid
     * Effects: Updates the liveNeighbors data member of each cell in grid
     */
    function updateLiveNeighbors(grid) {
        var i, j;
        for (i = 0; i < NUM_ROWS; i++)
        {
            for (j = 0; j < NUM_COLS; j++)
            {
                grid[i][j].liveNeighbors = countLiveNeighbors(grid, i, j);
            }
        }
    }

    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid, the HTML canvas
     * Effects: Changes the state of all cells in grid, according to the number of
     *          liveNeighbors each cell has, and the rules of the Game of Life.
     *          Remember, that, after updating the state of the cell in grid that
     *          you also need to draw the change to the HTML canvas using getCanvas()
     */
    function updateCells(grid) {
        updateLiveNeighbors(grid);
        for (var i = 0; i < NUM_ROWS; i++) {
            for (var j = 0; j < NUM_COLS; j++) {
                if (grid[i][j].dead === true && grid[i][j].liveNeighbors === 3) {
                    getCanvas().fillStyle = CELL_ALIVE_COLOR;
                    getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                    grid[i][j].dead = false;
                    grid[i][j].timesAlive = 0;
                }
                if (grid[i][j].dead === false && grid[i][j].liveNeighbors < 2) {
                    getCanvas().fillStyle = CELL_DEAD_COLOR;
                    getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                    grid[i][j].dead = true;
                    grid[i][j].timesAlive = 0;
                    grid[i][j].beenAlive = true;
                }
                if (grid[i][j].dead === false && grid[i][j].liveNeighbors > 3) {
                    getCanvas().fillStyle = CELL_DEAD_COLOR;
                    getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                    grid[i][j].dead = true;
                    grid[i][j].timesAlive = 0;
                    grid[i][j].beenAlive = true;
                }
                // increment timesAlive and changes color of alive cells
                if (grid[i][j].dead === false && grid[i][j].liveNeighbors === 2 || 
                    grid[i][j].liveNeighbors === 3) {
                    grid[i][j].timesAlive = ++grid[i][j].timesAlive;
                    changeLiveColor(grid[i][j]);
                }
            }
        }
    }

    /*
     * Requires: grid is a 2d array of Cell objects
     * Modifies: grid, HTML canvas
     * Effects: Changes the grid to evolve the cells to the next generation 
     *          according to the rules of the Game of Life.  In order to correctly 
     *          move forward, all cells should count the number of live neighbors 
     *          they have before proceeding to change the state of all cells.
     */
    function evolveStep(grid) {
        updateLiveNeighbors(grid);
        updateCells(grid);
        numRounds = ++numRounds;
        changeDeadColor(grid);
    }


    /* 
     * You ARE allowed to modify this global variable.  When TEST_DRAW_PATTERN
     * is set to true, drawPattern will always be called with row == 6 and col == 6,
     * otherwise it will be called with a random, valid value for row and col
     */
    var TEST_DRAW_PATTERN = false;


    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *          grid is a 2d array of Cell objects, patternName is one of the 
     *          following strings:
     *             "Block"
     *             "Beehive"
     *             "Loaf"
     *             "Boat"
     *             "Blinker"
     *             "Toad"
     *             "Beacon"
     *             "Pulsar"
     *             "Glider"
     *             "Lwss"
     * Modifies: grid, HTML canvas
     * Effects: This function is called when a user clicks on one of the HTML
     *          "Draw <pattern>" buttons.  patternName is a string containing the
     *          name of the pattern that is to be drawn on the canvas.  The
     *          row and col parameters represent the top left corner of the pattern
     *          that should be drawn.  You will use getCanvas() to update the canvas
     */
    function drawPattern(patternName, grid, row, col) {
        getCanvas().fillStyle = CELL_ALIVE_COLOR;
        if (patternName === "Block") {
             for (var i = 0; i < 2; ++i) {
                for (var j = 0; j < 2; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 0 || j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 0 || j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
        }
        else if (patternName === "Beehive") {
            //Unfinished, not sure if this works, but if does, makes rest of coding much easier.
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 4; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 1 || j === 2)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 0 || j === 3)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2) && (j === 1 || j === 2)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
        }
        else if (patternName === "Loaf") {
            for (var i = 0; i < 4; ++i) {
                for (var j = 0; j < 4; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 1 || j === 2)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 0 || j === 3)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2) && (j === 1 || j === 3)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 3) && (j === 2)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
            
        }
        else if (patternName === "Boat") {
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 0 || j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 0 || j === 2)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2) && (j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
            
        }
        else if (patternName === "Blinker") {
            for (var i = 0; i < 1; ++i) {
                for (var j = 0; j < 3; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 0 || j === 1 || j === 2)){
                        getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                        grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
            
        }
        else if (patternName === "Toad") {
            for (var i = 0; i < 2; ++i) {
                for (var j = 0; j < 4; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 1 || j === 2 || j === 3)) {
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 0 || j === 1 || j === 2)) {
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
        }
        else if (patternName === "Beacon") {
            for (var i = 0; i < 4; ++i) {
                for (var j = 0; j < 4; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0 || i === 1) && (j === 0 || j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2 || i === 3) && (j === 2 || j === 3)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
            
        }
        
        else if (patternName === "Glider") {
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 0)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 1 || j === 2)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2) && (j === 0 || j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
            
        }
        else if (patternName === "Lwss") {
            for (var i = 0; i < 4; ++i) {
                for (var j = 0; j < 5; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 0 || j === 3)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 4)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2) && (j === 0 || j === 4)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 3) && (j === 1 || j === 2 || j === 3 || j === 4)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }  
                }
            }
        }
        
        else if (patternName === "Pulsar") {
            for (var i = 0; i < 13; ++i) {
                for (var j = 0; j < 13; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0 || i === 5 || i === 7 || i === 12) && (j === 2 || j === 3 || j === 4 || j === 8 || j === 9 || j === 10)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2 || i === 3 || i === 4 || i === 8 || i === 9 || i === 10)
                            && (j === 0 || j === 5 || j === 7 || j === 12)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }
                }
            }
        }

        else if (patternName === "R-Pentomino") {
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 1 || j === 2)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 0 || j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2) && (j === 1)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }  
                }
            }
        }
        else if(patternName === "Glider-Gun") {
            for (var i = 0; i < 9; ++i) {
                for (var j = 0; j < 36; ++j) {
                    if (validPosition(row + i, col + j)) {
                        if ((i === 0) && (j === 24)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 1) && (j === 22 || j === 24)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 2) && (j === 12 || j === 13 || j === 20 || j === 21 || j === 34 || j === 35)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 3) && (j === 11 || j === 15 || j === 20 || j === 21 || j === 34 || j === 35)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 4) && (j === 0 || j === 1 || j === 10 || j === 16 || j === 20 || j === 21)) {
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 5) && (j === 0 || j === 1 || j === 10 || j === 14 || j === 16 || j === 17 || j === 22 || j === 24)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 6) && (j === 10 || j === 16 || j === 24)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 7) && (j ===11 || j === 15)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                        if ((i === 8) && (j === 12 || j === 13)){
                            getCanvas().fillRect(grid[row + i][col + j].xPosition, grid[row + i][col + j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[row + i][col + j].dead = false;
                        }
                    }  
                }
            }
        }  
    }


    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects,
     *           patternName is one of the following:
     *              "Block"
     *              "Beehive"
     *              "Loaf"
     *              "Boat"
     * Modifies: grid, HTML canvas
     * Effects: Draws patternName to the HTML canvas.  row and col represent the
     *          top left corner of the pattern that is to be drawn. This function
     *          should draw as much of the pattern as possible without going outside
     *          the boundaries of the canvas.  In other words, if row == 39 and
     *          col == 69, then the only square that would be colored is the bottom
     *          right most cell on the canvas (if that square is supposed to be
     *          colored). 
     */
    function drawStillLife(patternName, grid, row, col) {
        drawPattern(patternName, grid, row, col);
    }



    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects,
     *           patternName is one of the following:
     *              "Blinker"
     *              "Toad"
     *              "Beacon"
     *              "Pulsar"
     * Modifies: grid and the HTML canvas
     * Effects: Draws patternName to the HTML canvas.  row and col represent the
     *          top left corner of the pattern that is to be drawn. This function
     *          should draw as much of the pattern as possible without going outside
     *          the boundaries of the canvas.  In other words, if row == 39 and
     *          col == 69, then the only square that would be colored is the bottom
     *          right most cell on the canvas (if that square is supposed to be
     *          colored). 
     */
    function drawOscillator(patternName, grid, row, col) {
        drawPattern(patternName, grid, row, col);    
    }


    
    /*
     * Requires: 0 <= row && row < NUM_ROWS, 0 <= col && col < NUM_COLS,
     *           grid is a 2d array of Cell objects,
     *           patternName is one of the following:
     *              "Glider"
     *              "Lwss"
     * Modifies: grid and the HTML canvas
     * Effects: Draws patternName to the HTML canvas.  row and col represent the
     *          top left corner of the pattern that is to be drawn. This function
     *          should draw as much of the pattern as possible without going outside
     *          the boundaries of the canvas.  In other words, if row == 39 and
     *          col == 69, then the only square that would be colored is the bottom
     *          right most cell on the canvas (if that square is supposed to be
     *          colored). 
     */
    function drawSpaceship(patternName, grid, row, col) {
        drawPattern(patternName, grid, row, col);
    }





    /*****************************************************************************
     *                               REACH PORTION                               *
     *       Implement any other functions here that are part of the Reach       *
     *****************************************************************************/

    // Requires: Nothing
    // Modifies: gameGrid, HTML canvas
    // Effects: Initializes the webpage and data structures necessary to make
    //          the Game of Life operate
    function initializeWebpage() {
        drawGridLines();
        drawGridLines();
        initArray();
        populateGameGrid(gameGrid);

        // Add any necessary functionality you need for the Reach portion below here
    }

    function setColorScheme(scheme) {
        if (scheme === "Default") {
            CELL_ALIVE_COLOR = "#2ecc71";
            CELL_DEAD_COLOR  = "#e74c3c";
            defaultColor = true;
            setCellColor(gameGrid);
            drawGridLines();
        }
        else if (scheme === "Cool") {
            CELL_ALIVE_COLOR = "#0033CC";
            CELL_DEAD_COLOR = "#FFFFFF";
            defaultColor = false;
            setCellColor(gameGrid);
            drawGridLines();
        }
        else {
            CELL_ALIVE_COLOR = "#0033CC";
            CELL_DEAD_COLOR = "#FFD630";
            defaultColor = true;
            setCellColor(gameGrid);
            drawGridLines();
        }
    }

    function setCellColor(grid) {
        for (var i = 0; i < NUM_ROWS; i++) {
            for (var j = 0; j < NUM_COLS; j++) {
                if (grid[i][j].dead === true && grid[i][j].beenAlive === true) {
                    getCanvas().fillStyle = CELL_DEAD_COLOR;
                    getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                }
                else if (grid[i][j].dead === false) {
                    getCanvas().fillStyle = CELL_ALIVE_COLOR;
                    getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }

    function clearGameGrid (grid){
        getCanvas().fillStyle = "white";
        var i, j;
        for (i = 0; i < NUM_ROWS; i++) {
            for (j = 0; j < NUM_COLS; j++){
                grid[i][j].dead = true;
                grid[i][j].liveNeighbors = 0;
                grid[i][j].beenAlive = false;
            }
        }
        getCanvas().fillRect(0, 0, 1000, 500);
        clearGrid = false;
        isRunning = false;
        speed = 500;
    }

    function changeLiveColor(cell) {
        if (!defaultColor) {
            var timesAlive = cell.timesAlive % 10;
            switch (timesAlive) {
                case 2:
                    getCanvas().fillStyle = "#5CADFF";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 3:
                    getCanvas().fillStyle = "#FF6600";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 4:
                    getCanvas().fillStyle = "#009933";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 5:
                    getCanvas().fillStyle = "#FFFF00";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 6:
                    getCanvas().fillStyle = "#FF00FF";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 7:
                    getCanvas().fillStyle = "#33CCCC";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 8:
                    getCanvas().fillStyle = "#9900CC";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 9:
                    getCanvas().fillStyle = "#009999";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                case 10:
                    getCanvas().fillStyle = "#990099";
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
                default:
                    getCanvas().fillStyle = CELL_ALIVE_COLOR;
                    getCanvas().fillRect(cell.xPosition, cell.yPosition, CELL_SIZE, CELL_SIZE);
                    break;
            }
        }
    }

    function changeDeadColor(grid) {
        if (!defaultColor) {
            numRounds = numRounds % 11;
            for (var i = 0; i < NUM_ROWS; i++) {
                for (var j = 0; j < NUM_COLS; j++) {
                    if (grid[i][j].beenAlive === true && grid[i][j].dead === true) {
                        switch (numRounds) {
                            case 2:
                                getCanvas().fillStyle = "#E8E8E8";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 3:
                                getCanvas().fillStyle = "#E6E6E6";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 4:
                                getCanvas().fillStyle = "#CCCCCC";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 5:
                                getCanvas().fillStyle = "#B2B2B2";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 6:
                                getCanvas().fillStyle = "#999999";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 7:
                                getCanvas().fillStyle = "#B2B2B2";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 8:
                                getCanvas().fillStyle = "#CCCCCC";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 9:
                                getCanvas().fillStyle = "#E6E6E6";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            case 10:
                                getCanvas().fillStyle = "#E8E8E8";
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                                break;
                            default:
                                getCanvas().fillStyle = CELL_DEAD_COLOR;
                                getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                        }
                    }                
                }
            }
        }   
    }

    // implementing draw on canvas 
    document.captureEvents(Event.MOUSEMOVE);
    document.captureEvents(Event.MOUSEDOWN);
    document.captureEvents(Event.MOUSEUP);

    var drag = {x: 0, y: 0, motion: false};
    
    document.onmousemove = function (e) {
        mouseDrag(e, gameGrid);
    };
    
    document.onmousedown = function (e) {
        mouseDown(e, gameGrid);
    };

    document.onmouseup = function (e) {
        mouseUp();
    }

    var mouseClick;
    var keyClicked;

    var mouseX = 0;
    var mouseY = 0;

    function mouseUp(e) {
        return false;
    }

    function mouseDrag (e, grid) {
        mouseX = Math.round((e.pageX - document.getElementById('grid').offsetLeft) / CELL_SIZE); 
        mouseY = Math.round((e.pageY - document.getElementById('grid').offsetTop) / CELL_SIZE);
        if (drag.motion) {
            for (var i = 0; i < NUM_ROWS; i++) {
                for (var j = 0; j < NUM_COLS; j++) {
                    if (i === mouseY && j === mouseX) {
                        getCanvas().fillStyle = CELL_ALIVE_COLOR;
                        getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                        grid[i][j].dead = false;
                        drawGridLines();
                    }
                }
            }
        }
        return true;
    }

    function mouseDown(e, grid) {
        mouseX = Math.round((e.pageX - document.getElementById('grid').offsetLeft) / CELL_SIZE); 
        mouseY = Math.round((e.pageY - document.getElementById('grid').offsetTop) / CELL_SIZE);
        if(!drag.motion) {
            for (var i = 0; i < NUM_ROWS; i++) {
                for (var j = 0; j < NUM_COLS; j++) {
                    if (i === mouseY && j === mouseX) {
                        if (grid[i][j].dead === true) {
                            getCanvas().fillStyle = CELL_ALIVE_COLOR;
                            getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[i][j].dead = false;
                            drawGridLines();
                        }
                        else {
                            getCanvas().fillStyle = "#FFFFFF";
                            getCanvas().fillRect(grid[i][j].xPosition, grid[i][j].yPosition, CELL_SIZE, CELL_SIZE);
                            grid[i][j].dead = true;
                            grid[i][j].liveNeighbors = 0;
                            grid[i][j].beenAlive = false;
                        }
                    }
                }
            }
            drag.x = e.pageX;
            drag.y = e.pageY;
            drag.motion = true;
        }
    }

    function mouseUp() {
        drag.motion = false;
    }
        

});
