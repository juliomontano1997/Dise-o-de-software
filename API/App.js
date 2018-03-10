/**
 * Date: 05-03-2018
 * Last update: 09-03-2018
 * @author: Julio Adán Montano Hernandez 
 * @summary: this is the server definitions for the othello emulator API. 
*/


// ****************************  HEADER SECTION  *******************************
var pg = require('pg');
var client;
var pgp = require('pg-promise')();
var db = pgp({host: 'localhost', port: 5432, database: 'othelloDB', user: 'postgres', password: 'postgresql2017'});
var express = require('express');
var app = express();

var MAIN_BOARD; 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST");
    next();
});


// *********************** INTERFACE CONECTIONS/END POINTS  ***********************
app.get('/checkMovement', function(req, res) 
{                    
    // 1. Extract the original board from the DB 
    var originalBoard = MAIN_BOARD;    
    var matrixSize = Math.sqrt(originalBoard.length);    
    printBoard(originalBoard, matrixSize);
    
    //2. Verify the position  
    if(originalBoard[getIndex(req.query.row, req.query.column, matrixSize)]!==0)
    {
        console.log("Celda invalida");
        res.end(JSON.stringify(false));  
        return;        
    }        
    var afectedIndices = [getIndex(req.query.row, req.query.column, matrixSize)]; 
    afectedIndices.concat(check(req.query.row-1, req.query.column, matrixSize,originalBoard,req.query.player, -1, 0));
    afectedIndices.concat(check(req.query.row-1, req.query.column, matrixSize,originalBoard,req.query.player, -1,0));
    afectedIndices.concat(check(req.query.row*1+1, req.query.column, matrixSize,originalBoard,req.query.player, 1,0));
    afectedIndices.concat(check(req.query.row, req.query.column*1+1, matrixSize,originalBoard,req.query.player, 0,1));
    afectedIndices.concat(check(req.query.row, req.query.column*1-1, matrixSize,originalBoard,req.query.player, 0,-1));
    afectedIndices.concat(check(req.query.row*1-1, req.query.column*1+1, matrixSize,originalBoard,req.query.player, -1, 1));
    return updateBoard();
});
 


app.get('/getBoard',function(req, res)
{        
    res.end(JSON.stringify(getBoard(req.query.idSesion)));
});



// ************************************* LOGIC AND EXTRA FUNCTIONS *************************************************

/**
 * Receive a (y,x) coordinates of a 2d matrix and returns a index of a 1D array
 * 
 * @param {number} row 
 * @param {number} column 
 * @param {number} lengt 
 * 
 * @returns {number} 
 */
function getIndex(row, column,lengt)
{    
    return (lengt*row+column*1) ; // se hizo asi por un problema extraño
}

/**
 * Receive a array position (1D index) and returns a (y,x) coordinate. 
 * @param {number} index 
 * @param {number} lengt 
 * @returns {Array}
 */
function getCoordinates(index, lengt)
{    
    return [Math.trunc(index/lengt), index%lengt];
}

/**
 * Allows make a boar whit a specific length 
 * 
 *  @param {number} length the length of the matrix 
 * @returns {Array} a list that contains the board
 * 
 * Note: this method can't be used whit odd numbers  
 */
function makeBoard(length)
{
    var newBoard = [];
    var finalLength = length*length;
    for (i=0; i<finalLength; i++)
    {
        newBoard.push(0);
    }
    var x =  (length/2)-1;     
    newBoard[(x*length)+x] = 1;
    newBoard[(x*length)+x+1] = 2;
    newBoard[((x+1)*length)+x] = 2;
    newBoard[((x+1)*length)+x+1] = 1;
    return newBoard;
}


function check(row,column, matrixSize, board, player, verticalMov, horisontalMov)
{       
    var index = getIndex(row, column, matrixSize);         
    var lista = [];    
    while(board[index] !== (player*1) && board[index]!==0 && (row*1)!==-1 && (column*1)!==-1 && column*1<matrixSize && row*1<matrixSize)
    {        
        lista.push(index);                        
        row = row*1 + verticalMov*1;            
        column = column*1 + horisontalMov*1;                
        index = getIndex(row, column, matrixSize);         
    }
    if(board[index]=== player*1)
    {        
        return lista;
    }
    else
    {        
        return [];
    }
}




//  ***************************  DATA BASE COMUNICATIONS ********************



function updateBoard(indices,playerMark,idSesion, playerId)
{
    if(indices.lengt===1)
    {
        return false; 
    }    
    //1. Get the board (list) from DB.
    var actualBoard =  getBoard(idSesion);
    var length = actualBoard.length;    
    //2. Update the board 
    for(i=0; i<length; i++)
    {
        actualBoard[indices[i]] = player;
    }    
    //3. Update the board in the DB.     
    db.func('updateBoard',[actualBoard])
    .then(data => 
    {        	
        res.end(JSON.stringify(data));                    	
    })
    .catch(error=> 
    {    	    	 
        res.end(JSON.stringify(false));
    });
}


/*
function calculateAutomaticMove()
{
    // 1. Obtain the actual board 
    // 2. Search the posibles spaces 
    // 3. Verify the posibles spaces 
    // 4. Decide the best option according to difficulty
    // 5. Return the (x,y). 
}


*/

function getBoard(idSesion)
{
    // se necesita saber la estructura de la base de datos
    db.func('getBoard',[idSesion])
    .then(data => 
    {        	
        res.end(JSON.stringify(data));                    	
    })
    .catch(error=> 
    {    	    	 
        res.end(JSON.stringify(false));
    })
}


var server = app.listen(8081, function ()
{            
    MAIN_BOARD = makeBoard(6);
	var host = server.address().address;
	var port = server.address().port;
    console.log("Esta corriendo en %s:%s", host, port);
});

