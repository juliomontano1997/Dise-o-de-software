--DOMIANS
CREATE DOMAIN t_mail VARCHAR(50) NOT NULL CONSTRAINT CHK_t_mail CHECK (VALUE SIMILAR TO '[A-z]%@[A-z]%.[A-z]%');

CREATE TABLE players
(
	playerID    SERIAL      NOT NULL  UNIQUE,
	mail        t_mail      NOT NULL,
	playerName  VARCHAR(30) NOT NULL,
	playerLevel INT         NOT NULL,
	image	    VARCHAR(20) NOT NULL,
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
	winsPlayer1      INT         NOT NULL,
	winsPlayer2      INT         NOT NULL,
	ties             INT         NOT NULL,
	amountGames      INT         NOT NULL,
	numberActualGame INT         NOT NULL,
	CONSTRAINT PK_sessionID PRIMARY KEY (sessionID),
	CONSTRAINT FK_playerOneID_players FOREIGN KEY (playerOneID) REFERENCES players(playerID),
	CONSTRAINT FK_playerTwoID_players FOREIGN KEY (playerTwoID) REFERENCES players(playerID)	
);

CREATE TABLE messages 
(
	messageID      SERIAL  NOT NULL,
	sessionID      INT     NOT NULL, 
	transmitterID  INT     NOT NULL,
	messageContent TEXT    NOT NULL,
	CONSTRAINT PK_messageID PRIMARY KEY (messageID),
	CONSTRAINT FK_sessionID_sessions FOREIGN KEY (sessionID) REFERENCES sessions
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

--PROCEDURES

CREATE OR REPLACE FUNCTION mg_get_player(IN i_mail t_mail, OUT o_playerID INT, OUT o_playerName VARCHAR(30), OUT o_playerLevel INT, OUT o_image VARCHAR(20))
RETURNS
SETOF RECORD AS 
$body$
BEGIN 	
	RETURN query 
	SELECT playerID, playerName, playerLevel, image FROM players WHERE mail = i_mail;
END;	
$body$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION mg_get_board(IN i_sessionID INT, OUT o_playerOneID INT, OUT o_playerTwoID INT,OUT o_actualPlayerID INT, OUT o_boardSize INT, OUT o_board INTEGER[], OUT o_colorPlayer1 VARCHAR(30), OUT o_colorPlayer2 VARCHAR(30))
RETURNS
SETOF RECORD AS 
$body$
BEGIN 	
	RETURN query 
	SELECT playerOneID, playerTwoID, actualPlayerID, boardSize, board, colorPlayer1, colorPlayer2 FROM sessions where sessionID = i_sessionID;
END;	
$body$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION mg_update_board(IN i_sessionID INT, IN o_actualPlayerID INT, IN o_board INTEGER[])
RETURNS BOOLEAN AS
$body$
BEGIN 	
	UPDATE sessions SET board = o_board WHERE sessionID = i_sessionID;
	IF o_actualPlayerID = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) THEN UPDATE sessions SET actualPlayerID = (SELECT playerTwoID FROM sessions WHERE sessionID = i_sessionID) WHERE sessionID = i_sessionID;
	ELSE UPDATE sessions SET actualPlayerID = (SELECT playerOneID FROM sessions WHERE sessionID = i_sessionID) WHERE sessionID = i_sessionID;
	END IF;
	RETURN TRUE;
	EXCEPTION WHEN OTHERS THEN RETURN FALSE;
END;	
$body$
LANGUAGE plpgsql;

--INSERTS

INSERT INTO players (playerID, mail, playerName, playerLevel, image) VALUES (0,'maquina@othello.com','Maquina',0,'image1'),(1,'juan12@gmail.com','Juan12',1,'image2');

INSERT INTO sessions (state, playerOneID, playerTwoID, actualPlayerID, boardSize, board, colorPlayer1, colorPlayer2, winsPlayer1, winsPlayer2, ties, amountGames, numberActualGame) VALUES 
	(true,0,1,1,6,'{-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,-1,-1,-1,-1,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1}','red','blue',0,0,0,3,1);


SELECT mg_get_player('maquina@othello.com');
SELECT mg_get_board(1);
SELECT mg_update_board(1,0,'{0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,-1,-1,-1,-1,1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1}')

