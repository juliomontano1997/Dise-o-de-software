/**
 * Date: 05-03-2018
 * Last update: 09-03-2018
 * @author: Julio Adán Montano Hernandez 
 * @summary: this is the
 *  server definitions for the othello emulator API. 
*/
// ****************************  HEADER SECTION  *******************************
var pg = require('pg');
var conString = "postgres://postgres:postgresql2017@localhost:5432/devesa_app";
var client;
var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var cn = {host: 'localhost', port: 5432, database: 'othelloDB', user: 'postgres', password: 'postgresql2017'};
var db = pgp(cn);

app.use(function(req, res, next) 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST");
    next();
});



// *********************** INTERFACE CONECTIONS/END POINTS  ***********************

/**
 * Allow make and validate a movement  
 * 
 * @param {number} row
 * @param {number} column
 * @param {number} idPlayer
 * @param {number} idSesion
 * @return true/false
 */

app.get('/checkMovement', function(req, res) 
{                    
    // 1. Extract the original board from the DB 
    db.func('mg_get_board',[req.query.idSesion])    
    .then(data => 
    {        	         
        if(data=== null)
        {            
            res.end(JSON.stringify(false));
            return;
        }        
        var originalBoard = data[0].o_board;          
        var matrixSize = Math.sqrt(originalBoard.length);        
        
        console.log("matriz original");
        printMatrix(originalBoard, matrixSize);

        
        //2. Verify if the actual position 
        if(originalBoard[getIndex(req.query.row, req.query.column, matrixSize)]!==-1)
        {
            res.end(JSON.stringify(false));  
            return;        
        }          

        //3. Validate play 
        var afectedIndices = [getIndex(req.query.row, req.query.column, matrixSize)]; 
        
        var rigth = check(req.query.row, req.query.column*1+1, matrixSize,originalBoard,req.query.idPlayer, 0,1);
        var left = check(req.query.row, req.query.column*1-1, matrixSize,originalBoard,req.query.idPlayer, 0,-1); 


        var up =  check(req.query.row*1-1, req.query.column, matrixSize,originalBoard,req.query.idPlayer, -1,0);
        var down = check(req.query.row*1+1, req.query.column, matrixSize,originalBoard,req.query.idPlayer, 1,0);

 
        var leftUp = check(req.query.row*1-1, req.query.column*1-1, matrixSize,originalBoard,req.query.idPlayer, -1,-1);    
        var rightUP = check(req.query.row*1-1, req.query.column*1+1, matrixSize,originalBoard,req.query.idPlayer, -1,1);    

        var leftDown = check(req.query.row*1+1, req.query.column*1-1, matrixSize,originalBoard,req.query.idPlayer, 1,-1);    
        var rigthDown = check(req.query.row*1+1, req.query.column*1+1, matrixSize,originalBoard,req.query.idPlayer, 1,1); 

        afectedIndices = afectedIndices.concat(up).concat(down).concat(left).concat(rigth).concat(leftUp).concat(rightUP).concat(leftDown).concat(rigthDown);                                
                
        console.log("indices afectados");
        console.log(afectedIndices);
        // 4. Update the board in the DB          
        if(afectedIndices.length===1)
        {
            console.log("Se salio porque no hay jugada valida");
            res.end(JSON.stringify(false));  
            return;    
        }          
        else
        {
            console.log(afectedIndices);
            for(i=0; i<afectedIndices.length; i++)
            {
                originalBoard[afectedIndices[i]] = parseInt(req.query.idPlayer);
            }            
            var band = false;
            console.log("ultima imprecion antes de guardar");
            printMatrix(originalBoard, matrixSize);

            db.func('mg_update_board',[req.query.idSesion, req.query.idPlayer, originalBoard])
            .then(data => 
            {                                                 
                res.end(JSON.stringify(data[0].mg_update_board));                 
            })
            .catch(error=> 
            {    	    	                         
                res.end(JSON.stringify(false));                 
            });                      
        }                              
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    });         
});


/**
 * Allows check the player movement 
 * @param {number} row 
 * @param {number} column 
 * @param {number} matrixSize 
 * @param {number[]} board 
 * @param {number} player 
 * @param {number} verticalMov 
 * @param {number} horisontalMov 
 * 
 */
function check(row,column, matrixSize, board, player, verticalMov, horisontalMov)
{       
    console.log("Datos: x="+row+"y="+column);
    var index = getIndex(row, column, matrixSize);         
    var lista = []; 
    console.log(board[index]);
    while(board[index] !== (player*1) && board[index]!==-1 && (row*1)!==-1 && (column*1)!==-1 && column*1<matrixSize && row*1<matrixSize)
    {                
        lista.push(index);                        
        row = row*1 + verticalMov*1;            
        column = column*1 + horisontalMov*1;                
        index = getIndex(row, column, matrixSize);        
    }
    console.log(lista);
    if(board[index] === player*1)
    {        
    console.log("Jugada valida");
        console.log(lista);
        return lista;
    }
    else
    {        
        return [];
    }
}


 
app.get('/getBoard',function(req, res)
{        
    db.func('mg_get_board',[req.query.idSesion])    
    .then(data => 
    {        	        
        printMatrix(data[0].o_board, data[0].o_boardsize);
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});



// ******************** LOGIC AND EXTRA FUNCTIONS ********************************

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
function makeBoard(length, player1, player2)
{
    var newBoard = [];
    var finalLength = length*length;
    for (i=0; i<finalLength; i++)
    {
        newBoard.push(-1);
    }
    var x =  (length/2)-1;     
    newBoard[(x*length)+x] = 1;
    newBoard[(x*length)+x+1] = 2;
    newBoard[((x+1)*length)+x] = 2;
    newBoard[((x+1)*length)+x+1] = 1;
    printMatrix(newBoard, length);
    return newBoard;
}

function printMatrix(lista , tam)
{
    console.log("\n********************* Imprimiendo matriz *******************\n")    
    for(i=0; i<tam*1; i++)
    {        
        var cat ='';
        for(j=0; j<tam*1; j++)
        {                     
            if(lista[i*tam + j]!==-1)
            {
                cat =  cat.concat(" "+lista[i*tam + j].toString());
            }
            else
            {
                cat =  cat.concat(lista[i*tam + j].toString());
            }            
        }
        console.log(cat);
    }
}

var server = app.listen(8081, function ()
{                        
	var host = server.address().address;
	var port = server.address().port;
    console.log("Esta corriendo en %s:%s", host, port);
});

























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
