--DOMIANS
CREATE DOMAIN t_mail VARCHAR(50) NOT NULL CONSTRAINT CHK_t_mail CHECK (VALUE SIMILAR TO '[A-z]%@[A-z]%.[A-z]%');

--TABLES
CREATE TABLE players
(
	playerID    SERIAL      NOT NULL  UNIQUE,
	mail        t_mail      NOT NULL,
	playerName  VARCHAR(50) NOT NULL,
	playerLevel INT         NOT NULL,
	image	    TEXT NOT NULL,
	state       BOOLEAN     NOT NULL  DEFAULT FALSE,
	CONSTRAINT PK_mail_playerID PRIMARY KEY (mail,playerID)
);

CREATE TABLE sessions
(
	sessionID        SERIAL      NOT NULL,
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
	creationDate     TIMESTAMP   NOT NULL  DEFAULT CURRENT_TIMESTAMP,
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
	messageID      SERIAL    NOT NULL,
	sessionID      INT       NOT NULL,
	transmitterID  INT       NOT NULL,
	receiverID     INT       NOT NULL,
	messageContent TEXT      NOT NULL,
	shippingDate   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PK_messageID PRIMARY KEY (messageID),
	CONSTRAINT FK_sessionID_sessions FOREIGN KEY (sessionID) REFERENCES sessions,
	CONSTRAINT FK_receiverID_players FOREIGN KEY (receiverID) REFERENCES players(playerID)
);

CREATE TABLE notifications
(
	notificationID      SERIAL      NOT NULL,
	playerID  	    INT         NOT NULL,
	notificationContent TEXT        NOT NULL,
	creationDate        TIMESTAMP   NOT NULL  DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PK_notificationID PRIMARY KEY (notificationID),
	CONSTRAINT FK_playerID_players FOREIGN KEY (playerID) REFERENCES players(playerID)
);

CREATE TABLE invitations
(
	invitationID  SERIAL      NOT NULL,
	transmitterID INT         NOT NULL,
	receiverID    INT         NOT NULL,
	boardSize     INT         NOT NULL,
	amountGames   INT         NOT NULL,
	creationDate  TIMESTAMP   NOT NULL  DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PK_invitationID PRIMARY KEY (invitationID),
	CONSTRAINT FK_transmitterID_players FOREIGN KEY (transmitterID) REFERENCES players(playerID),
	CONSTRAINT FK_receiverID_players FOREIGN KEY (receiverID) REFERENCES players(playerID)
);

--PROCEDURES

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
CREATE OR REPLACE FUNCTION mg_get_player(
IN i_mail t_mail,
IN i_playerName VARCHAR(50),
IN i_image TEXT,
OUT o_playerId INT,
OUT o_playerLevel INT)
RETURNS
SETOF RECORD AS
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
RETURN query
(SELECT playerID, playerLevel FROM players WHERE mail = i_mail);

END;
$body$
LANGUAGE plpgsql;

/*
* Allows get all the active players
*
* Receive:
*
* Return:
* playerID int
* playerName varchar
* image varchar
*/
CREATE OR REPLACE FUNCTION mg_get_activePlayers(
IN i_playerID INT,
OUT o_playerID INT,
OUT o_playerName VARCHAR(50),
OUT o_playerImage TEXT,
OUT o_playerLevel INT)
RETURNS
SETOF RECORD AS
$body$
BEGIN
RETURN query
(SELECT playerID, playerName, image, playerLevel FROM players WHERE state = TRUE AND playerID != i_playerID);
END;
$body$
LANGUAGE plpgsql;

/*
* Allows to close a session
*
* Receive:
* i_playerID  int
* 
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_closeSession(
  IN i_playerID INT
)
RETURNS BOOLEAN AS
$body$
BEGIN	
	UPDATE players SET state=FALSE WHERE playerID=i_playerID;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END
$body$
LANGUAGE plpgsql;

/*
* Allows start the board of a session
*
* Receive:
* i_sessionID  int
* i_board []
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_get_startSession(
IN i_sessionID INT,
IN i_board INTEGER[])
RETURNS BOOLEAN AS
$body$
BEGIN
UPDATE sessions SET board = i_board WHERE sessionID = i_sessionID;
RETURN TRUE;
EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$body$
LANGUAGE plpgsql;

/*
* Allows update the color of a player in a session
*
* Receive:
* i_sessionID  int
* i_playerID
* i_color
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_get_updateColor(
IN i_sessionID INT,
IN i_playerID INT,
IN i_color VARCHAR(20))
RETURNS BOOLEAN AS
$body$
BEGIN

	IF ((SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) = i_playerID) 
	THEN
		IF((SELECT colorPlayer2 FROM sessions WHERE sessionID = i_sessionID) != i_color) 
		THEN
			UPDATE sessions SET colorPlayer1 = i_color WHERE sessionID = i_sessionID;
			RETURN TRUE;
		ELSE
			RETURN FALSE;
		END IF;
	ELSE
		IF((SELECT colorPlayer1 FROM sessions WHERE sessionID = i_sessionID) != i_color) THEN
			UPDATE sessions SET colorPlayer2 = i_color WHERE sessionID = i_sessionID;
			RETURN TRUE;
		ELSE
			RETURN FALSE;	
		END IF;
	END IF;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;
$body$
LANGUAGE plpgsql;

/*
* Allows get the information of a session
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
CREATE OR REPLACE FUNCTION mg_get_board(
IN i_sessionID INT,
OUT o_playerOneID INT,
OUT o_playerTwoID INT,
OUT o_actualPlayerID INT,
OUT o_boardSize INT,
OUT o_board INTEGER[],
OUT o_colorPlayer1 VARCHAR(30),
OUT o_colorPlayer2 VARCHAR(30))
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
CREATE OR REPLACE FUNCTION mg_update_board(
IN i_sessionID INT,
IN i_actualPlayerID INT,
IN i_board INTEGER[])
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
CREATE OR REPLACE FUNCTION mg_passTurn(
IN i_sessionID INT)
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
CREATE OR REPLACE FUNCTION mg_finishGame(
IN i_sessionID INT,
IN i_winers INT,
IN i_board INT[])
RETURNS BOOLEAN AS
$body$
BEGIN
IF i_winers = 2 THEN
UPDATE sessionStadistics SET ties = ties + 1 WHERE sessionID = i_sessionID;
ELSIF i_winers = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) THEN
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
CREATE OR REPLACE FUNCTION mg_finishSession(
IN i_sessionID INT)
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
CREATE OR REPLACE FUNCTION mg_get_session_stadistic (
IN i_sessionID INT,
OUT o_winsPlayer1 INT,
OUT o_winsPlayer2 INT,
OUT o_ties INT,
OUT o_amountGames INT,
OUT o_numberActualgame INT)
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
CREATE OR REPLACE FUNCTION mg_get_session_playersName (
IN i_sessionID  INT,
OUT o_playerID INT,
OUT o_playerName VARCHAR(50),
OUT o_playerOneID INT)
RETURNS
SETOF RECORD AS
$body$
BEGIN
RETURN query
SELECT p.playerID, p.playerName, gameSession.playerOneID FROM (SELECT playerOneID, playerTwoID FROM sessions WHERE sessionID =1) AS gameSession
INNER JOIN Players AS p
  ON playerID = gameSession.playerOneID OR playerID = gameSession.playerTwoID;
END;
$body$
LANGUAGE plpgsql;

/*
* Allows get all active sessions of a player
*
* Receive:
* i_playerID  int
*
* Return:
* sessionID int
* boardSize int
* amountGames int
* numberActualGames int
*/
CREATE OR REPLACE FUNCTION mg_get_activeSessions(
IN i_playerID INT,
OUT o_sessionID INT,
OUT o_boardSize INT,
OUT o_amountGames INT,
OUT o_numberActualGame INT,
OUT o_enemyName VARCHAR(50),
OUT o_board INTEGER[])
RETURNS
SETOF RECORD AS
$body$
BEGIN

RETURN query
SELECT sessionData.sessionID, sessionData.boardSize, sessionData.amountGames, sessionData.numberActualGame , p.playerName, sessionData.board FROM (
SELECT s.*,t.amountGames ,t.numberActualGame FROM (SELECT s.sessionID,s.boardSize,s.board,s.playerOneId,s.playerTwoId FROM sessions s
WHERE playerOneID = i_playerID OR playerTwoID = i_playerID) AS s INNER JOIN sessionStadistics AS t
ON s.sessionID= t.sessionID) AS sessionData
INNER JOIN players AS p ON ((p.playerID = sessionData.playerOneId AND p.playerID != i_playerID) OR (p.playerID = sessionData.playerTwoId AND p.playerID != i_playerID));

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
CREATE OR REPLACE FUNCTION mg_get_notifications(
IN i_playerID INT,
OUT o_ID INT,
OUT o_Content TEXT)
RETURNS
SETOF RECORD AS
$body$
BEGIN
RETURN query
SELECT notificationID "ID", notificationContent FROM notifications WHERE playerID = i_playerID ORDER BY creationDate DESC;

END;
$body$
LANGUAGE plpgsql;

/*
* Allows get all the invitations of a player
*
* Receive:
* i_playerID  int
*
* Return:
* ID int
* content text
*/
CREATE OR REPLACE FUNCTION mg_get_invitations(
IN i_playerID INT,
OUT o_ID INT,
OUT o_Content TEXT)
RETURNS
SETOF RECORD AS
$body$
BEGIN
RETURN query
SELECT invitationID "ID", ((SELECT playerName FROM players WHERE playerID = transmitterID) || ' te ha invitado a jugar' || chr(10) ||' Caracteristicas del juego: '
	|| chr(10) ||' Tamaño del tablero: '|| boardSize || chr(10) ||'Cantidad partidas: ' || amountGames || chr(10) ||'Nivel de tu oponente: ' || 
	(SELECT playerLevel FROM players WHERE playerID = transmitterID) ) "content"
FROM invitations WHERE receiverID = i_playerID ORDER BY creationDate DESC;

END;
$body$
LANGUAGE plpgsql;

/*
* Allows erase a notifications of a player
*
* Receive:
* i_notificationID  int
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_erase_notifications(
IN i_notificationID INT)
RETURNS BOOLEAN AS
$body$
BEGIN
DELETE FROM notifications WHERE notificationID = i_notificationID;
RETURN TRUE;
EXCEPTION WHEN OTHERS THEN RETURN FALSE;

END;
$body$
LANGUAGE plpgsql;

/*
* Allows create an invitation to play
*
* Receive:
* i_notificationID  int
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_create_invitation(
IN i_transmitterID INT,
IN i_receiverID INT,
IN i_boardSize INT,
IN i_amountGames INT)
RETURNS BOOLEAN AS
$body$
DECLARE
sessionExists INT;

BEGIN
SELECT count(*) INTO sessionExists FROM sessions WHERE (playerOneID = i_transmitterID AND playerTwoID = i_receiverID) OR (playerOneID = i_receiverID AND playerTwoID = i_transmitterID);

IF (sessionExists = 0) THEN
	INSERT INTO invitations (transmitterID, receiverID, boardSize, amountGames) VALUES
	(i_transmitterID, i_receiverID, i_boardSize, i_amountGames);
	INSERT INTO notifications(playerID,notificationContent,creationDate) VALUES(i_transmitterID,'Has invitado a ' || (SELECT playerName FROM players WHERE playerID=i_receiverID) || ' para que juegue contigo',current_timestamp);
	RETURN TRUE;
ELSE
RETURN FALSE;
END IF;

--EXCEPTION WHEN OTHERS THEN RETURN FALSE;

END;
$body$
LANGUAGE plpgsql;

/*
* Allows invite the machine play
*
* Receive:
* i_playerID int
* i_boardSize int
* i_amountGames int
* i_machineLevel int
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_invite_machine(
IN i_playerID INT,
IN i_boardSize INT,
IN i_amountGames INT,
IN machineLevel INT)
RETURNS BOOLEAN AS
$body$
DECLARE
sessionExists INT;
newSessionID INT;
BEGIN
sessionExists := (SELECT count(*) FROM sessions WHERE playerOneID = i_playerID AND playerTwoID = 0);

IF (sessionExists = 0) THEN

	INSERT INTO sessions (playerOneID, playerTwoID, actualPlayerID, boardSize, board, colorPlayer1, colorPlayer2, levelPlayerOne, levelPlayerTwo, amountPassTurn) VALUES
	(i_playerID, 0, i_playerID, i_boardSize,'{}','red','blue',(SELECT playerLevel FROM players WHERE playerID = i_playerID),machineLevel,0);

	newSessionID = (SELECT currval('sessions_sessionid_seq'));
	INSERT INTO sessionStadistics (sessionID, winsPlayer1, winsPlayer2, ties, amountGames, numberActualGame) VALUES (newSessionID, 0, 0, 0, i_amountGames, 1);
	INSERT INTO notifications(playerID,notificationContent,creationDate) VALUES(i_playerID,'Ahora tienes una sesión de juego con la máquina',current_timestamp);
	RETURN TRUE;
ELSE
RETURN FALSE;

END IF;


--EXCEPTION WHEN OTHERS THEN RETURN FALSE;

END;
$body$
LANGUAGE plpgsql;

select * from notifications
/*
* Allows the handling of a player's invitations
*
* Receive:
* i_playerID  int
*
* Return:
* boolean
*/
CREATE OR REPLACE FUNCTION mg_handling_invitations(
IN i_invitationID INT,
IN i_decision BOOLEAN)
RETURNS BOOLEAN AS
$body$
DECLARE
	ID1 INT;
	ID2 INT;
	BS  INT;
	AG  INT;
	newSessionID INT;
BEGIN
	SELECT transmitterID, receiverID, boardSize, amountGames INTO ID1, ID2, BS, AG FROM invitations WHERE invitationID = i_invitationID;
	IF (i_decision = FALSE) THEN
		INSERT INTO notifications (playerID, notificationContent) VALUES (ID1, (SELECT playerName FROM players WHERE playerID = ID2)|| ' rechazó tu invitación');

		DELETE FROM invitations WHERE invitationID = i_invitationID;

		RETURN TRUE;
	ELSE
		INSERT INTO notifications (playerID, notificationContent) VALUES (ID1, (SELECT playerName FROM players WHERE playerID = ID2)|| ' aceptó tu invitación' );

		INSERT INTO sessions (playerOneID, playerTwoID, actualPlayerID, boardSize, board, colorPlayer1, colorPlayer2, levelPlayerOne, levelPlayerTwo, amountPassTurn) VALUES
		(ID1, ID2, ID1, BS,'{}','red','blue',(SELECT playerLevel FROM players WHERE playerID = ID1),(SELECT playerLevel FROM players WHERE playerID = ID2),0);

		newSessionID = (SELECT currval('sessions_sessionid_seq'));
		INSERT INTO sessionStadistics (sessionID, winsPlayer1, winsPlayer2, ties, amountGames, numberActualGame) VALUES
		(newSessionID, 0, 0, 0, AG, 1);

		DELETE FROM invitations WHERE invitationID = i_invitationID;

		RETURN TRUE;
	END IF;

END;
$body$
LANGUAGE plpgsql;

/*
* Allows player to give up in a game
*
* Receive:
* i_playerID int
* i_sessionID int
*
* Return:
* boolean
*/

CREATE OR REPLACE FUNCTION mg_give_up(
IN i_playerID INT,
IN i_sessionID INT)
RETURNS BOOLEAN AS
$body$
BEGIN
	IF i_playerID = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) THEN
		UPDATE sessionStadistics SET winsPlayer2 = winsPlayer2 + 1 WHERE sessionID = i_sessionID;
	ELSE
		UPDATE sessionStadistics SET winsPlayer1 = winsPlayer1 + 1 WHERE sessionID = i_sessionID;
	END IF;

	UPDATE sessionStadistics SET numberActualGame = numberActualGame + 1 WHERE sessionID = i_sessionID;
	
	UPDATE sessions SET amountPassTurn = 0 WHERE sessionID = i_sessionID;
	UPDATE sessions SET board = '{}' WHERE sessionID = i_sessionID;
RETURN TRUE;
EXCEPTION WHEN OTHERS THEN RETURN FALSE;

END;
$body$
LANGUAGE plpgsql;

/**********************************
Machine image
**********************************/
--../../assets/images/machine.jpg
