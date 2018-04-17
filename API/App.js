/**
 * Date: 05-03-2018
 * Last update: 09-03-2018
 * @author: Julio Adán Montano Hernandez 
 * @summary: this is the server definitions for the othello emulator. 
*/

var pg = require('pg');
var express = require('express');
var app = express();
var pgp = require('pg-promise')();
var cn = {host: 'localhost', port: 5432, database: 'othelloDB', user: 'postgres', password: 'postgresql2017'};
var db = pgp(cn);
var http =  require('http');

app.use(function(req, res, next) 
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE, GET, POST");
    next();
});


/** 
 * Allows registrate a user and return the id
 * @param {String} mail
 * @param {String} name 
 * @param {String} imageURL
 * @returns JSON
 * Checked
 */
app.get('/getPlayerId',function(req, res)
{    

    db.func('mg_get_player', [req.query.mail, req.query.name, req.query.imageURL])    
    .then(data => 
    {        	  
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	  
        res.end(JSON.stringify(false));                
    })      
});


/**
 * Allows finishes a session
 * @param {number} idSession
 * @return {boolean}
 */
app.get('/finishSession',function(req, res)
{    
    db.func('mg_finishSession', [req.query.idSession])    
    .then(data => 
    {        	  
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	  
        res.end(JSON.stringify(false));                
    })      
});


/**
 * Allows obtains the list of the active players 
 * @param {number} idPlayer
 * @returns Json
 * Checked
 */
app.get('/getActivePlayers',function(req, res)
{        
    db.func('mg_get_activePlayers', [req.query.idPlayer])    
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

/**
 * Allows to close the player session
 * @param {number} idPlayer
 * @returns Json
 * Checked
 */
app.get('/getCloseSession',function(req, res)
{        
    db.func('mg_closeSession', [req.query.idPlayer])    

    .then(data => 
    {                         
        console.log(data);
        res.end(JSON.stringify({"data":data[0].mg_closesession}));
    })
    .catch(error=> 
    {                
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});

/**
 * Allows start a new session, the method initialice the board
 * @param {number} idSession
 * @returns Json
 * Checked
 */
app.get('/startSession',function(req, res)
{        

    db.func ('mg_get_board', [req.query.idSession])
    .then(data =>
    {        
        var newBoard;
        try {
            newBoard = makeBoard(data[0].o_boardsize,data[0].o_playeroneid,data[0].o_playertwoid);
            
            db.func('mg_get_startSession', [req.query.idSession, newBoard])    
            .then(data => {res.end(JSON.stringify(data));})
            .catch(error=> {console.log(error);res.end(JSON.stringify(false));                
            });
        }  
        catch(err)
        {
            res.end(JSON.stringify(false));            
        }                     
    })
    .catch(error=>
    {
        console.log(error);
        res.end(JSON.stringify(false));   
    });   
});


/**
 * Allows update the color of a player.
 * 
 * @param idSession 
 * @param idPlayer
 * @param color
 * Checked
 */
app.get('/updateColor',function(req, res)
{        
    db.func('mg_get_updateColor', [req.query.idSession, req.query.idPlayer,"#"+req.query.color])    
    .then(data => 
    {        	
       
        res.end(JSON.stringify({"data":data[0].mg_get_updatecolor}));

    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});


/**
 * Allows obtais the board information
 * @param {number} idSession 
 * @returns  true, false or other Json with all the board information.  
 */
app.get('/getBoard',function(req, res)
{            
    db.func('mg_get_board',[req.query.idSession])    
    .then(data => 
    {                                             
        var scores = verifyFullBoard(data[0].o_board, data[0].o_playeroneid);                
        if(scores!=false) // Ends the game if the board is full 
        {            
            var winner = -2;
            var newBoard = makeBoard(data[0].o_boardsize,data[0].o_playeroneid,data[0].o_playertwoid);
            if(scores[0]> scores[1])            
            {                   
                winner = data[0].o_playeroneid;
            }
            else if (scores[0]<scores[1])
            {
                winner = data[0].o_playertwoid;
            }
            db.func('mg_finishgame', [req.query.idSession, winner, newBoard])
            .then(data=>
            {                                             
                var urlLink="http://localhost:8081/startSession?idSession="+req.query.idSession;              
                autoRequest(urlLink);                                                                                           
                res.end(JSON.stringify({"data":data[0].mg_finishgame}));                                                                                                
            })
            .catch(error => {res.end(JSON.stringify(false));});                              
        }        
        else if (data[0].o_amountpassturn >= 2) // Ends the game if the pass turn amount is higher than 2
        {
            scores = countPieces(data[0].o_board, data.o_playeroneid);
            var winner = -2;
            var newBoard = makeBoard(data[0].o_boardsize,data[0].o_playeroneid,data[0].o_playertwoid);
            if(scores[0]> scores[1])            
            {                   
                winner = data[0].o_playeroneid;
            }
            else if (scores[0]<scores[1])
            {
                winner = data[0].o_playertwoid;
            }

            db.func('mg_finishgame', [req.query.idSession, winner, newBoard])
            .then(data=>
            {                                              
                var urlLink="http://localhost:8081/startSession?idSession="+req.query.idSession;              
                autoRequest(urlLink);                                      
                res.end(JSON.stringify({"data":data[0].mg_finishgame}));                                                                                                
            })
            .catch(error => {
                res.end(JSON.stringify(false));
            });                              
        }
        else
        {           
            res.end(JSON.stringify(data));
            if(data[0].o_playertwoid===0 && data[0].o_actualplayerid===0) 
            {    					            
                calculateAutomaticMove(req.query.idSession);                    
            } 
        }        
    })
    .catch(error=> {res.end(JSON.stringify(false));})      
});

/**
 * Allow make and validate a movement  
 * @param {number} row
 * @param {number} column
 * @param {number} idPlayer
 * @param {number} idSession
 * @returns Json
 */
app.get('/checkMovement', function(req, res) 
{                    
    db.func('mg_get_board',[req.query.idSession])    
    .then(data => 
    {        	                     
        if(data=== null | data[0].o_actualplayerid !== req.query.idPlayer*1)
        {                                    
            res.end(JSON.stringify(false));
            return;
        }             
        var originalBoard = data[0].o_board;          
        var matrixSize = Math.sqrt(originalBoard.length);        
        //2. Verify if the actual position is empty 
        if(originalBoard[getIndex(req.query.row, req.query.column, matrixSize)] !== -1)
        {                        
            res.end(JSON.stringify(false));  
            return;        
        }                  
        //3. Validate play 
        var afectedIndices = [getIndex(req.query.row, req.query.column, matrixSize)];                 
        var row = req.query.row*1;
        var column = req.query.column*1;
        var idPlayer = req.query.idPlayer*1;

        var rigth = check(row, column+1, matrixSize,originalBoard,idPlayer, 0,1);
        var left = check(row, column-1, matrixSize,originalBoard,idPlayer, 0,-1); 
        var up =  check(row-1, column, matrixSize,originalBoard,idPlayer, -1,0);
        var down = check(row+1, column, matrixSize,originalBoard,idPlayer,1, 0);                    

        var leftUp = check(row-1, column-1, matrixSize,originalBoard,idPlayer, -1,-1);    
        var rightUP = check(row-1, column+1, matrixSize,originalBoard,idPlayer, -1,1);    
        var leftDown = check(row+1, column-1, matrixSize,originalBoard,idPlayer, 1,-1);    
        var rigthDown = check(row+1, column+1, matrixSize,originalBoard,idPlayer, 1,1); 
        afectedIndices = afectedIndices.concat(up).concat(down).concat(left).concat(rigth).concat(leftUp).concat(rightUP).concat(leftDown).concat(rigthDown);                                
       
        // 4. Update the board in the DB      
        printMatrix(originalBoard, matrixSize);        
        if(afectedIndices.length===1)
        {                            
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
            db.func('mg_update_board',[req.query.idSession, req.query.idPlayer, originalBoard])
            .then(data2 => 
            {                                                                               
                res.end(JSON.stringify(data2[0].mg_update_board));                                                        
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

/**
 * Allows pass turn 
 * @param {number} idSession
 * @returns Json
 */
app.get('/passTurn',function(req, res)
{            
    db.func('mg_passTurn',[req.query.idSession, req.query.idPlayer])    
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
 * Allows surrender and start a new game or set 
 * @param {number} idSession
 * @param {number} idPlayer
 * @param {number} currentGame
 * @param {number} amountGames
 * @returns Json
 * 
 * Note: 
 *      if resp is 1 the session is terminated
 *      if resp is true, the game is end but the session continue.
 */
app.get('/surrender',function(req, res)
{           
    var newBoard;
    db.func('mg_give_up',[req.query.idPlayer,req.query.idSession])  
    .then(data => 
    {             
        var urlLink="http://localhost:8081/startSession?idSession="+req.query.idSession;              
        autoRequest(urlLink);  
        res.end(JSON.stringify({"data":data[0].mg_give_up}));                             
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    });            
});

/**
 *Allows obtains the session's estadistics
 *@param {number} idSession 
 *@returns Json
 */
app.get('/getSessionStadistics',function(req, res)
{         
    db.func('mg_get_session_stadistic',[req.query.idSession])    
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
 * Allows obtain the player's names.
 * @param {number} idSession 
 */
app.get('/sessionPlayersName', function(req, res) 
{ 
	db.func('mg_get_session_playersName',[req.query.idSession])    
    .then(data => 
    {        	        
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	         
        res.end(JSON.stringify(false));                
    })   
});	

/**
 * Allows obtatains the list of active sessions 
 * @param {number} idPlayer
 * @requires Json
 */
app.get('/getActiveSessions', function(req, res) 
{ 
	db.func('mg_get_activeSessions',[req.query.idPlayer])    
    .then(data => 
    {        	  
        console.log(data);      
        res.end(JSON.stringify(data));
    })
    .catch(error=> 
    {    	    	         
        res.end(JSON.stringify(false));                
    })   
});	


/**
 * Allows obtains all the notifications of a player.
 * @param {number} idPlayer 
 * @returns Json
 */
app.get('/getNotifications',function(req, res)
{        
    db.func('mg_get_notifications', [req.query.idPlayer])    
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
 * Allows obtains the list of  received invitations
 * @param {number} idPlayer
 * @returns Json
 */
app.get('/getInvitations',function(req, res)
{        
    db.func('mg_get_invitations', [req.query.idPlayer])    
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
 * Allows delete one element of the list of notifications 
 * @param {number} idNotification
 */
app.get('/deleteNotifications',function(req, res)
{        
    db.func('mg_erase_notifications', [req.query.idNotification])    
    .then(data => 
    {        	              
        res.end(JSON.stringify({"data":data[0].mg_erase_notifications}));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});

/**
 * Allows create a new invitation 
 * @param {number} idPlayer
 * @param {number} idRival
 * @param {number} boardSize
 * @param {number} amountGames
 */
app.get('/newInvitation',function(req, res)
{        
    console.log("new invitation");
    console.log("by someone");
    db.func('mg_create_invitation', [req.query.idPlayer, req.query.idRival,req.query.boardSize, req.query.amountGames])    
    .then(data => 
    {        	              
        res.end(JSON.stringify({"data":data[0].mg_create_invitation}));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});

/**
 * Allows create a session against the computer IA
 * @param {number} idPlayer 
 * @param {number} boardSize
 * @param {number} amountGames
 * @param {number} machineLevel
 */
app.get('/inviteMachine',function(req, res)
{        
    db.func('mg_invite_machine', [req.query.idPlayer, req.query.boardSize,req.query.amountGames, req.query.machineLevel])    
    .then(data => 
    {        	              
        res.end(JSON.stringify({"data":data[0].mg_invite_machine}));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});


/**
 * Allows regect or acept an invitation 
 * 
 * @param {number} idInvitation 
 * @param {number} decision   
 * */
app.get('/decideInvitation',function(req, res)
{        
    db.func('mg_handling_invitations',[req.query.idInvitation, req.query.decision])    
    .then(data => 
    {              	              
        res.end(JSON.stringify({"data":data[0].mg_handling_invitations}));
    })
    .catch(error=> 
    {    	    	 
        console.log(error);
        res.end(JSON.stringify(false));                
    })      
});




/**
 * Allows get the loist og messajes of a session.
 * @param {number} idSession   
 * */
app.get('/getMessages',function(req, res)
{        
    db.func('mg_get_messages',[req.query.idSession])    
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
 * Allows set a messaje 
 * @param {number} idSession
 * @param {number} idPlayer
 * @param {String}  content
 * */
app.get('/sendMessage',function(req, res)
{                            
    db.func('mg_send_messages',[req.query.idSession,req.query.idPlayer,req.query.content])    
    .then(data => 
    {                                                              	              
        res.end(JSON.stringify({"data":data[0].mg_send_messages}));
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
    if(row===-1 | column===-1  | row>=matrixSize | column>=matrixSize)
    {              
        return [];
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
 * @returns {number} 
 */
function getIndex(row, column,lengt)
{    
    return (lengt*row+column*1) ; 
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
 * Allows make a board with a specific length 
 * 
 * @param {number} length the length of the matrix 
 * @param {number} player1
 * @param {number} player2
 * @returns {Array} a list that contains the board 
 * Note: this method can't be used with odd numbers  
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
    newBoard[(x*length)+x] = player1;
    newBoard[(x*length)+x+1] = player2;
    newBoard[((x+1)*length)+x] = player2;
    newBoard[((x+1)*length)+x+1] = player1;
    printMatrix(newBoard, length);
    return newBoard;
}

/**
 * Allows calculate an automatic movement 
 * @param {number} idSession 
 * @param {number} machineLevel 
 * @returns {number}  -2 when the machine does't have plaays / (0,1,....n) when have plays 
 */
function calculateAutomaticMove(idSession)
{
    // 1. Obtain the actual board 
    db.func('mg_get_board',[idSession])    
    .then(data => 
    {        	       
        if(data===null || data==[])
        {
            return;
        }         
        var originalBoard = data[0].o_board;        
        var matrixSize = Math.sqrt(originalBoard.length);
        var machineLevel = data[0].o_levelplayertwo;
        printMatrix(originalBoard, matrixSize);                             
        var posiblePlays = [];

        // Search all marks and evaluate if this marks are valid for a new play.
        for(i=0;i<originalBoard.length; i++)
        {
            if(originalBoard[i]===0)
            {                
                var afectedIndices = [];   // Son los indices con los cuales se puede jugar          
                var coordinates = getCoordinates(i, matrixSize);
                var row = coordinates[0]*1;
                var column = coordinates[1]*1;            
    
                var rigth= auxiliarCalculate(row,  column+1, matrixSize,originalBoard,0,1);
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

        console.log("Posibles puntos para jugar: "+posiblePlays);
        //3. Calculate the afected indices of each element in posiblePlay list  and save the afected indices in playsAfectedIndexes


        if(posiblePlays.length == 0 || posiblePlays==undefined )
        {
            var urlLink="http://localhost:8081/passTurn?idSession="+idSession;  
        
            console.log(urlLink);
            setTimeout(function () {
                            console.log("La maquina no tiene movimientos");
                            autoRequest(urlLink);  
                          }, 2000);
            return;
        }

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
        var urlLink="http://localhost:8081/checkMovement?row="+coordinates[0]+"&column="+coordinates[1]+"&idPlayer="+0+"&idSession="+idSession;  
        
        console.log(urlLink);
        setTimeout(function () {console.log("Haciendo jugada automatica");autoRequest(urlLink);  }, 2000);
  
    })
    .catch(error=> 
    {    	    	 
        console.log(error);                     
    });    
}

/**
 * Verify if a coordinate is valid
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
    verticalMov = verticalMov*1;
    horisontalMov = horisontalMov *1;    
    matrixSize = matrixSize*1;  
    
    var lista = [];                 
    var index = getIndex(row, column, matrixSize);        
    while(board[index] !== 0 && board[index]!==-1 && row!==-1 && column!==-1  && row<matrixSize && column<matrixSize)
    {        
        lista.push(index);                 
        row = row + verticalMov;            
        column = column + horisontalMov;                
        index = getIndex(row, column, matrixSize);                      
    }

    console.log("UTLYI row="+row + " Colim="+ column +" in="+index + "ta amm="+matrixSize);  
    if(row===-1 | column===-1  | row>=matrixSize | column>=matrixSize)
    {      
        
        return [];
    }
    else
    {
        lista.push(index);
        if(board[index] === -1 && lista.length>1)
        {                                    
            return [index];
        }
        else
        {        
            return [];
        }
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
        var len = playsAfectedIndexes.length;
        return playIndices[Math.floor((Math.random() * len) + 0)];
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
        resp.on('data', (chunk) => 
        {
          data += chunk;
        });        
        resp.on('end', () => 
        {            
            // Aqui se verifica si la respuesta fue buena o no. 
            console.log(data);
        });
       
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
}

/**
 * Allows verify if the board is filled. It needs the player 1 to veryfi the winner.
 * 
 * @param {number} board
 * @param {number} player1
 */
function verifyFullBoard(board, player1)
{
    var marksPlayer1 =0;
    var marksPlayer2 =0;
    var length = board.length;
    for(i=0; i<length; i++)
    {
        if(board[i]==-1)
        {
            return false;
        }
        else if(board[i]==player1)
        {
            marksPlayer1++;
        }        
        else
        {
            marksPlayer2++;
        }
    }  
    return [marksPlayer1, marksPlayer2];
}

function countPieces(board, player1)
{
    var marksPlayer1 =0;
    var marksPlayer2 =0;
    var length = board.length;
    for(i=0; i<length; i++)
    {
        if(board[i]==-1)
        {

        }
        else if(board[i]==player1)
        {
            marksPlayer1++;
        }        
        else
        {
            marksPlayer2++;
        }
    }  
    return [marksPlayer1, marksPlayer2];
}



var server = app.listen(8081, function ()
{                        
	var host = server.address().address;
    var port = server.address().port;
    console.log("Esta corriendo en %s:%s", host, port);   
});







