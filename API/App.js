/**
 * Date: 05-03-2018
 * Last update: 09-03-2018
 * @author: Julio Adán Montano Hernandez 
 * @summary: this is the
 *  server definitions for the othello emulator API. 
*/

var pg = require('pg');
var conString = "postgres://postgres:12345@localhost:5432/devesa_app";
var client;
var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var cn = {host: 'localhost', port: 5432, database: 'otelloDB', user: 'postgres', password: '12345'};
var db = pgp(cn);
var http =  require('http');




app.use(function(req, res, next) 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST");
    next();
});

app.get('/sessionPlayersName', function(req, res) 
{ 
	db.func('mg_get_session_playersName',[req.query.idSesion])    
    .then(data => 
    {        	        
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })   
});	


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
        console.log(data);
        console.log(req.query);
        if(data=== null | data[0].o_actualplayerid !== req.query.idPlayer*1)
        {            
            console.log("Cancelado por que no existe la sesion o porque el id del jugador no es el correcto o no esta en su turno");
            res.end(JSON.stringify(false));
            return;
        }             
        var originalBoard = data[0].o_board;          
        var matrixSize = Math.sqrt(originalBoard.length);        

        //2. Verify if the actual position is empty 
        if(originalBoard[getIndex(req.query.row, req.query.column, matrixSize)] !== -1)
        {
            console.log("Cancelado porque el campo esta ocupado");
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
       
        // 4. Update the board in the DB      
        printMatrix(originalBoard, matrixSize);
        console.log(afectedIndices)  ;
        if(afectedIndices.length===1)
        {            
            console.log("Cancelado por que no existe jugada valida para esta posicion");
            res.end(JSON.stringify(false));  
            return;    
        }          
        else
        {            
            for(i=0; i<afectedIndices.length; i++)
            {
                originalBoard[afectedIndices[i]] = parseInt(req.query.idPlayer);
            }            
            var band = false;    
            db.func('mg_update_board',[req.query.idSesion, req.query.idPlayer, originalBoard])
            .then(data2 => 
            {                                                 
                // Posible posicion para llamar a un metodo que haga la jugada actual.
                console.log("Retornando al cliente");
                console.log(data2[0].mg_update_board);
                console.log(data[0].o_playertwoid);
                res.end(JSON.stringify(data2[0].mg_update_board)); 
                if(data2[0].mg_update_board && data[0].o_playertwoid===0)
                {
    					console.log("Haciendo jugada aunomatica");
                    	calculateAutomaticMove(req.query.idSesion);                    
                }             
                                               
            })
            .catch(error=> 
            {    	    	                         
                res.end(JSON.stringify(false));                 
            });                      
        }                              
    })
    .catch(error=> 
    {    	    	         
        res.end(JSON.stringify(false));                
    });         
});



app.get('/getBoard',function(req, res)
{        
    db.func('mg_get_board',[req.query.idSesion])    
    .then(data => 
    {        	        
        printMatrix(data[0].o_board, data[0].o_boardsize);
        res.end(JSON.stringify(data));
        if(data[0].o_playertwoid===0 && data[0].o_actualplayerid===0)  //calculate automatic machine move
                {
    					console.log("Haciendo jugada aunomatica");
                    	calculateAutomaticMove(req.query.idSesion);                    
                } 
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});

app.get('/getSessionStadistics',function(req, res)
{        
    db.func('mg_get_session_stadistic',[req.query.idSesion])    
    .then(data => 
    {        	   
        console.log(data);
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});

app.get('/passTurn',function(req, res)
{        
    db.func('mg_passTurn',[req.query.idSesion])    
    .then(data => 
    {        	                
        res.end(JSON.stringify(data));

    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});

/**
 * Allows 
 */
app.get('/surrender',function(req, res)
{        
    db.func('mg_finishSesion',[req.query.idSesion])    
    .then(data => 
    {        	              
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
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
    var index = getIndex(row, column, matrixSize);         
    var lista = [];     
    while(board[index] !== (player*1) && board[index]!==-1 && (row*1)!==-1 && (column*1)!==-1 && column*1<matrixSize && row*1<matrixSize)
    {                
        lista.push(index);                        
        row = row*1 + verticalMov*1;            
        column = column*1 + horisontalMov*1;                
        index = getIndex(row, column, matrixSize);        
    }    
    if(board[index] === player*1)
    {                    
        return lista;
    }
    else
    {        
        return [];
    }
}

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
 * @param {number} length the length of the matrix 
 * @returns {Array} a list that contains the board 
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


/**
 * Allows calculate an automatic movement 
 * @param {number} idSesion 
 * @param {number} machineLevel 
 * @returns {number}  -2 when the machine does't have plaays / (0,1,....n) when have plays 
 */
function calculateAutomaticMove(idSesion)
{
    console.log("Calculando jugada automatica");
    // 1. Obtain the actual board 
    db.func('mg_get_board',[idSesion])    
    .then(data => 
    {        	       
        if(data===null)
        {
            return;
        }         
        var originalBoard = data[0].o_board;        
        var matrixSize = Math.sqrt(originalBoard.length);
        var machineLevel = data[0].o_levelPlayerTwo;
        printMatrix(originalBoard, matrixSize);        
        
        //1.Search the positions and validate if this position .....                 
        var posiblePlays =[];

        // Search all marks and evaluate if this marks are valid for a new play.
        for(i=0;i<originalBoard.length; i++)
        {
            if(originalBoard[i]===0)
            {                
                var afectedIndices = [];             
                var coordinates = getCoordinates(i, matrixSize);
                var row = coordinates[0];
                var column = coordinates[1];            
    
                var rigth= auxiliarCalculate(row,  column+1, matrixSize,originalBoard,0*1,1*1);
                var left = auxiliarCalculate(row,  column-1, matrixSize,originalBoard, 0,-1);         
                var up =   auxiliarCalculate(row-1,column, matrixSize,originalBoard,-1, 0);
                var down = auxiliarCalculate(row+1,column, matrixSize,originalBoard, 1, 0); 
    
                var rigthDown = auxiliarCalculate(row+1,column+1, matrixSize,originalBoard,  1, 1);                  
                var leftDown =  auxiliarCalculate(row+1,column-1, matrixSize,originalBoard,  1,-1);                
                var rightUP =   auxiliarCalculate(row-1,column+1, matrixSize,originalBoard, -1, 1);  
                var leftUp =    auxiliarCalculate(row-1,column-1, matrixSize,originalBoard, -1,-1);     
    
                afectedIndices = afectedIndices.concat(up).concat(down).concat(left).concat(rigth).concat(leftUp).concat(rightUP).concat(leftDown).concat(rigthDown);                
                if(afectedIndices.length>=1)
                {
                    posiblePlays = posiblePlays.concat(afectedIndices);                
                }   
            }        
        }         
        //3. Calculate the afected indices of each element in posiblePlay list  and save the afected indices in playsAfectedIndexes
        var playsAfectedIndexes = []; 
        for(i=0; i<posiblePlays.length;i++)
        {
            var afectedIndices = [posiblePlays[i]]; 
            var coordinates = getCoordinates(posiblePlays[i], matrixSize);
            var row = coordinates[0];
            var column = coordinates[1];            

            var rigth = check(row, column*1+1, matrixSize,originalBoard,0*1, 0*1,1*1);
            var left = check(row, column*1-1, matrixSize,originalBoard,0*1, 0*1,-1*1); 
            var up =  check(row*1-1, column, matrixSize,originalBoard,0*1, -1*1,0*1);
            var down = check(row*1+1, column, matrixSize,originalBoard,0*1, 1*1,0*1);
    
            var leftUp = check(row*1-1, column*1-1, matrixSize,originalBoard,0*1, -1*1,-1*1);    
            var rightUP = check(row*1-1, column*1+1, matrixSize,originalBoard,0*1, -1*1,1*1);    
            var leftDown = check(row*1+1, column*1-1, matrixSize,originalBoard,0*1, 1*1,-1*1);    
            var rigthDown = check(row*1+1, column*1+1, matrixSize,originalBoard,0*1, 1*1,1*1); 
            afectedIndices = afectedIndices.concat(up).concat(down).concat(left).concat(rigth).concat(leftUp).concat(rightUP).concat(leftDown).concat(rigthDown);
            playsAfectedIndexes.push(afectedIndices);
        }
        var response = machineSelection(machineLevel, playsAfectedIndexes, posiblePlays);
        var coordinates = getCoordinates(response, matrixSize);     
        var urlLink="http://localhost:8081/checkMovement?row="+coordinates[0]+"&column="+coordinates[1]+"&idPlayer="+0+"&idSesion="+idSesion;  
        
        setTimeout(function () {
    					console.log("Haciendo jugada aunomatica");
                    	autoRequest(urlLink);  
  					}, 2000);
  
    })
    .catch(error=> 
    {    	    	 
        console.log(error);                     
    });    
}

/**
 * Verify if a coordinate is valid play
 * 
 *  @param row
 *  @param column
 *  @param matrixSize
 *  @param board
 *  @param verticalMov
 *  @param horisontalMov  
 */
function auxiliarCalculate(row, column,matrixSize, board,verticalMov,horisontalMov)
{                         
    var lista = [ ];                 
    var index = getIndex(row, column, matrixSize);

    while(board[index] !== 0 && board[index]!==-1 && row!==-1 && column!==-1 && column<matrixSize && row<matrixSize)
    {        
        lista.push(index);                 
        row = row + verticalMov;            
        column = column + horisontalMov;                
        index = getIndex(row, column, matrixSize);                
    }
    lista.push(index);
    if(board[index] === -1 && lista.length>1)
    {                
        console.log("Jugada valida="+ index);                
        return [index];
    }
    else
    {        
        return [];
    }
}

/**
 * Select a respective indice 
 * 
 * @param {number} machineLevel 
 * @param {List[number]} playsAfectedIndexes 
 * @param {List[number]} playIndices 
 */
function machineSelection(machineLevel, playsAfectedIndexes, playIndices)
{
    if(playIndices===[])
    {
        return -2;
    }
    console.log(machineLevel);
    var length = playsAfectedIndexes.length; 
    // Selects the worst option 
    if(machineLevel===1)
    {
        var auxiliar = playsAfectedIndexes[0].length;
        var index = -1;
        for(i=0; i<length; i++)
        {
            if(playsAfectedIndexes[i].length <= auxiliar)
            {
                auxiliar = playsAfectedIndexes[i].length;
                index = playIndices[i];
            }
        }
        return index;
    }
    // Select a ramdom option
    else if(machineLevel===2)
    {
        var length = playsAfectedIndexes.length;
        return playIndices[Math.floor((Math.random() * length) + 0)];
    }
    // Select the best option 
    else
    {
        var auxiliar = playsAfectedIndexes[0].length;
        var index = -1;

        for(i=0; i<length; i++)
        {
            if(playsAfectedIndexes[i].length <= auxiliar)
            {
                auxiliar = playsAfectedIndexes[i].length;
                index = playIndices[i];
            }
        }
        return index;
    }    
}



// Extra funtions 
function printMatrix(lista , tam)
{
    console.log("\n***********************\n");
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


function autoRequest(url)
{
    http.get(url, (resp)=>
    {
        let data = '';
 
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => 
        {
          data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => 
        {
            console.log("autoRequest");
            console.log(data);
        });
       
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
}



var server = app.listen(8081, function ()
{                        
	var host = server.address().address;
	var port = server.address().port;
    console.log("Esta corriendo en %s:%s", host, port);   
});







