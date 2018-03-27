--DOMIANS
CREATE DOMAIN t_mail VARCHAR(50) NOT NULL CONSTRAINT CHK_t_mail CHECK (VALUE SIMILAR TO '[A-z]%@[A-z]%.[A-z]%');

--TABLES
CREATE TABLE players
(
	playerID    SERIAL      NOT NULL  UNIQUE,
	mail        t_mail      NOT NULL,
	playerName  VARCHAR(50) NOT NULL,
	playerLevel INT         NOT NULL,
	image	    VARCHAR(50) NOT NULL,
	state       BOOLEAN     NOT NULL  DEFAULT FALSE,
	CONSTRAINT PK_mail_playerID PRIMARY KEY (mail,playerID)	
);

CREATE TABLE sessions
(
	sessionID        SERIAL      NOT NULL,
	state	         BOOLEAN     NOT NULL, 
	playerOneID      INT         NOT NULL,
	playerTwoID      INT         NOT NULL,
	actualPlayerID   INT         NOT NULL,
	boardSize        INT         NOT NULL,
	board            INTEGER[]   NOT NULL, 
	colorPlayer1     VARCHAR(30) NOT NULL,
	colorPlayer2     VARCHAR(30) NOT NULL,
	levelPlayerOne   INT         NOT NULL,
	levelPlayerTwo   INT         NOT NULL,
	amountPassTurn   INT         NOT NULL,
	CONSTRAINT PK_sessionID PRIMARY KEY (sessionID),
	CONSTRAINT FK_playerOneID_players FOREIGN KEY (playerOneID) REFERENCES players(playerID),
	CONSTRAINT FK_playerTwoID_players FOREIGN KEY (playerTwoID) REFERENCES players(playerID)	
);

CREATE TABLE sessionStadistics
(
	sessionID        INT  NOT NULL  UNIQUE,
	winsPlayer1      INT  NOT NULL,
	winsPlayer2      INT  NOT NULL,
	ties             INT  NOT NULL,
	amountGames      INT  NOT NULL,
	numberActualGame INT  NOT NULL,
	CONSTRAINT FK_sessionID_sessions FOREIGN KEY (sessionID) REFERENCES sessions 
);

CREATE TABLE messages 
(
	messageID      SERIAL  NOT NULL,
	sessionID      INT     NOT NULL, 
	transmitterID  INT     NOT NULL,
	receiverID     INT     NOT NULL,
	messageContent TEXT    NOT NULL,
	CONSTRAINT PK_messageID PRIMARY KEY (messageID),
	CONSTRAINT FK_sessionID_sessions FOREIGN KEY (sessionID) REFERENCES sessions,
	CONSTRAINT FK_receiverID_players FOREIGN KEY (receiverID) REFERENCES players(playerID)	
);

CREATE TABLE notifications
(
	notificationID      SERIAL  NOT NULL,
	playerID  	    INT     NOT NULL,
	notificationContent TEXT    NOT NULL,
	CONSTRAINT PK_notificationID PRIMARY KEY (notificationID),
	CONSTRAINT FK_playerID_players FOREIGN KEY (playerID) REFERENCES players(playerID)
);

CREATE TABLE invitations
(
	invitationID  SERIAL  NOT NULL,
	transmitterID INT     NOT NULL, 
	receiverID    INT     NOT NULL,
	boardSize     INT     NOT NULL,
	amountGames   INT     NOT NULL,
	CONSTRAINT PK_invitationID PRIMARY KEY (invitationID),
	CONSTRAINT FK_transmitterID_players FOREIGN KEY (transmitterID) REFERENCES players(playerID),
	CONSTRAINT FK_receiverID_players FOREIGN KEY (receiverID) REFERENCES players(playerID)	
);




/* 
* Allows get the player to log in
*
* Receive: 
* i_mail   t_mail
* i_playerName varchar
* i_image  varchar
*
* Return:
* playerID int
*/
CREATE OR REPLACE FUNCTION mg_get_player
(
	IN i_mail t_mail, 
	IN i_playerName VARCHAR(50), 
	IN i_image VARCHAR(50)
)
RETURNS INT AS
$body$
BEGIN 	
	IF ((SELECT COUNT(playerID) FROM players WHERE mail = i_mail) > 0) THEN
		IF ((SELECT image FROM players WHERE mail = i_mail) != i_image) THEN
			UPDATE players SET image = i_image WHERE mail = i_mail;
		END IF;
	ELSE
		INSERT INTO players (mail, playerName, playerLevel, image) VALUES (i_mail, i_playerName, 1, i_image);
	END IF;
	UPDATE players SET state = TRUE WHERE mail = i_mail;
	RETURN (SELECT playerID FROM players WHERE mail = i_mail);
		
END;	
$body$
LANGUAGE plpgsql;





/* 
* Allows get the board of a session
*
* Receive: 
* i_sessionID  int
* i_board []
* i_colorPlayer1
* i_colorPlayer2
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_get_startSession
(
	IN i_sessionID INT, 
	IN o_board INTEGER[], 
	IN o_colorPlayer1 VARCHAR(30), 
	IN o_colorPlayer2 VARCHAR(30)
)
RETURNS BOOLEAN AS
$body$
BEGIN 	
	UPDATE sessions SET (board, colorPlayer1, colorPlayer2) = (i_board, i_colorPlayer1, i_colorPlayer2) WHERE sessionID = i_sessionID;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows get the board of a session
*
* Receive: 
* i_sessionID  int
*
* Return:
* o_playerOneID int
* o_playerTwoID int
* o_boardSize int
* o_board int[]
* o_colorPlayer1 varchar
* o_colorPlayer2 varchar
*/
CREATE OR REPLACE FUNCTION mg_get_board
(
	IN i_sessionID INT, 
	OUT o_playerOneID INT, 
	OUT o_playerTwoID INT,
	OUT o_actualPlayerID INT, 
	OUT o_boardSize INT, 
	OUT o_board INTEGER[], 
	OUT o_colorPlayer1 VARCHAR(30), 
	OUT o_colorPlayer2 VARCHAR(30)
)
RETURNS
SETOF RECORD AS 
$body$
BEGIN 	
	RETURN query 
	SELECT playerOneID, playerTwoID, actualPlayerID, boardSize, board, colorPlayer1, colorPlayer2 FROM sessions where sessionID = i_sessionID;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows update the board of a session
*
* Receive: 
* i_sessionID  int
* i_actualPlayerID
* i_board
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_update_board
(
	IN i_sessionID INT, 
	IN i_actualPlayerID INT, 
	IN i_board INTEGER[]
)
RETURNS BOOLEAN AS
$body$
BEGIN 	
	IF i_actualPlayerID = (SELECT actualPlayerID FROM sessions WHERE sessionID = i_sessionID) THEN
		UPDATE sessions SET board = i_board WHERE sessionID = i_sessionID;
		IF i_actualPlayerID = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) THEN UPDATE sessions SET actualPlayerID = (SELECT playerTwoID FROM sessions WHERE sessionID = i_sessionID) WHERE sessionID = i_sessionID;
		ELSE UPDATE sessions SET actualPlayerID = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) WHERE sessionID = i_sessionID;
		END IF;
		UPDATE sessions SET amountPassTurn = 0 WHERE sessionID = i_sessionID;
		RETURN TRUE;
	END IF;
	RETURN FALSE;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows record each turn step in a game
*
* Receive: 
* i_sessionID  int
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_passTurn
(
	IN i_sessionID INT
)
RETURNS BOOLEAN AS
$body$
DECLARE
	currentPlayer INT;
	playerTurn INT;
	playerOneId INT;
	playerTwoId INT;
	
BEGIN 	
	UPDATE sessions SET amountPassTurn = amountPassTurn + 1 WHERE sessionID = i_sessionID;
	SELECT s.playerOneId,s.playerTwoId,s.actualPlayerId INTO playerOneId,playerTwoId,currentPlayer FROM sessions AS s WHERE sessionID=i_sessionID;

	IF currentPlayer = playerOneId THEN
		playerTurn = playerTwoId;
	ELSE
		playerTurn = playerOneId;
	END IF;

	UPDATE sessions SET actualPlayerId = playerTurn WHERE sessionID = i_sessionID;	
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows finish a game
*
* Receive: 
* i_sessionID  int
* i_winers int
* i_board int[]
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_finishGame
(
	IN i_sessionID INT, 
	IN i_winers INT, 
	IN i_board INT[]
)
RETURNS BOOLEAN AS
$body$
BEGIN 	
	IF i_winers = 2 
		THEN 
			UPDATE sessionStadistics SET ties = ties + 1 WHERE sessionID = i_sessionID;		
	ELSIF i_winers = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) 
		THEN
			UPDATE sessionStadistics SET winsPlayer1 = winsPlayer1 + 1 WHERE sessionID = i_sessionID;
	ELSE
			UPDATE sessionStadistics SET winsPlayer2 = winsPlayer2 + 1 WHERE sessionID = i_sessionID;
	END IF;

	UPDATE sessionStadistics SET numberActualGame = numberActualGame + 1 WHERE sessionID = i_sessionID;
	UPDATE sessions SET amountPassTurn = 0 WHERE sessionID = i_sessionID;
	UPDATE sessions SET board = i_board WHERE sessionID = i_sessionID;	
	RETURN TRUE;	
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows finish a session
*
* Receive: 
* i_sessionID  int
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_finishSession
(
	IN i_sessionID INT
)
RETURNS BOOLEAN AS
$body$
BEGIN 	
	IF (SELECT winsPlayer1 FROM sessionStadistics WHERE sessionID = i_sessionID) > (SELECT winsPlayer2 FROM sessionStadistics WHERE sessionID = i_sessionID) THEN 
		UPDATE players SET playerLevel = playerLevel + 1 WHERE playerID = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID);	
			
	ELSIF (SELECT winsPlayer1 FROM sessionStadistics WHERE sessionID = i_sessionID) < (SELECT winsPlayer2 FROM sessionStadistics WHERE sessionID = i_sessionID) THEN
		UPDATE players SET playerLevel = playerLevel + 1 WHERE playerID = (SELECT playerTwoID FROM sessions WHERE sessionID = i_sessionID);
	ELSE
		UPDATE players SET playerLevel = playerLevel + 1 WHERE playerID = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID);
		UPDATE players SET playerLevel = playerLevel + 1 WHERE playerID = (SELECT playerTwoID FROM sessions WHERE sessionID = i_sessionID);
	END IF;	
	DELETE FROM messages WHERE sessionID = i_sessionID;
	DELETE FROM sessionStadistics WHERE sessionID = i_sessionID;
	DELETE FROM sessions WHERE sessionID = i_sessionID;
	RETURN TRUE;	
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows get the stadistics of a session
*
* Receive: 
* i_sessionID  int
*
* Return:
* o_winsPlayer1 int
* o_winsPlayer2 int
* o_ties
* o_amountGames
* o_numbersActualGame
*/
CREATE OR REPLACE FUNCTION mg_get_session_stadistic 
(
	IN i_sessionID    INT, 
	OUT o_winsPlayer1 INT, 
	OUT o_winsPlayer2 INT, 
	OUT o_ties INT, 
	OUT o_amountGames INT, 
	OUT o_numberActualgame INT
)
RETURNS
SETOF RECORD AS 
$body$
BEGIN 	
	RETURN query 
	SELECT winsPlayer1, winsPlayer2, ties, amountGames, numberActualGame FROM sessionStadistics WHERE sessionID = i_sessionID;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows get the players of a session
*
* Receive: 
* i_sessionID  int
*
* Return:
* o_playerID int
* o_playerName varchar
* o_playerOneID int
*/
CREATE OR REPLACE FUNCTION mg_get_session_playersName 
(
	IN i_sessionID  INT, 
	OUT o_playerID INT, 
	OUT o_playerName VARCHAR(50), 
	OUT o_playerOneID INT
)
RETURNS
SETOF RECORD AS 
$body$
BEGIN 	
	RETURN query 
	SELECT p.playerID, p.playerName, gameSession.playerOneID FROM (SELECT playerOneID, playerTwoID FROM sessions WHERE sessionID = 1) AS gameSession
	INNER JOIN Players AS p 
	ON playerID = gameSession.playerOneID OR playerID = gameSession.playerTwoID;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows get all the notifications of a player
*
* Receive: 
* i_playerID  int
*
* Return:
* ID int
* content text
*/
CREATE OR REPLACE FUNCTION mg_get_notifications
(
	IN i_playerID INT, 
	OUT O_ID INT, 
	OUT o_Content TEXT
)
RETURNS
SETOF RECORD AS
$body$
BEGIN 	
	RETURN query 
	SELECT (n.notificationID, v.invitationID) "ID" , (n.notificationContent, 
	((SELECT playerName FROM players WHERE playerID = v.transmitterID) || 'te ha invitado a jugar.\n Caracteristicas del juego:\n Tamaño del tablero: '|| v.boardSize || '\nCantidad partidas: ' || v.amountGames)) "content" 
	FROM notifications n, invitations v WHERE n.playerID = i_playerID or v.receiverID = i_playerID;
END;	
$body$
LANGUAGE plpgsql;

/* 
* Allows the handling of a player's invitations
*
* Receive: 
* i_playerID  int
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_handling_invitations
(
	IN i_invitationID INT, 
	IN i_decision BOOLEAN
)
RETURNS BOOLEAN AS
$body$
DECLARE
	ID1 INT;
	ID2 INT;
	BS  INT;
	AG  INT;
BEGIN 	 
	SELECT trasnmitterID, receiverID, boardSize, amountGames INTO ID1, ID2, BS, AG FROM invitations WHERE invitationID = i_invitationID;
	IF (i_decision = FALSE) THEN
		INSERT INTO notifications (playerID, notificationContent) VALUES (ID1, (SELECT playerName FROM players WHERE playerID = ID2)|| ' rechazó tu invitación');

		DELETE FROM invitations WHERE invitationID = i_invitationID;

		RETURN TRUE;
	ELSE
		INSERT INTO notifications (playerID, notificationContent) VALUES (ID1, (SELECT playerName FROM players WHERE playerID = ID2)|| ' aceptó tu invitación' );

		INSERT INTO sessions (state, playerOneID, playerTwoID, actualPlayerID, boardSize, board, colorPlayer1, colorPlayer2, levelPlayerOne, levelPlayerTwo, amountPassTurn) VALUES 
		(TRUE, ID1, ID2, ID1, BS,'{}','WC','WC',(SELECT playerLevel FROM players WHERE playerID = ID1),(SELECT playerLevel FROM players WHERE playerID = ID2),0);

		DELETE FROM invitations WHERE invitationID = i_invitationID;

		RETURN TRUE;
	END IF;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;	
$body$
LANGUAGE plpgsql
