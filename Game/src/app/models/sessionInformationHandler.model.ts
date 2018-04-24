export class sessionInformationHandler {
    private sessionId: number;
    private playerOneID:number;
    private playerOneName: String;
    private playerTwoName:String;
    private tiesNumber: number;
    private winsPlayerOne: number;
    private winsPlayerTwo: number;
    private currentGameNumber: number;
    private amountGamesNumber: number;

    private playerPlayingId: Number;
  
    constructor(sessionId:number){
        this.sessionId=sessionId;
    }


 

    public setPlayerPlayingId(playerId:Number){
        this.playerPlayingId=playerId;
    }

    public getPlayerPlayingId():Number{
        return this.playerPlayingId;
    }


    public UpdateData(dataArray: Array<any>){
        this.setAmountGamesNumber(dataArray[0].o_amountgames);
        this.setCurrentGameNumber(dataArray[0].o_numberactualgame);
        this.setWinsPlayerOne(dataArray[0].o_winsplayer1);
        this.setWinsPlayerTwo(dataArray[0].o_winsplayer2);
        this.setTiesNumber(dataArray[0].o_ties);
    }
    
    public compareIds(playerId:Number,idToCompare:Number) :Boolean{
        if (playerId===idToCompare){
            return true;
        }
        return false;
    }

    public getWinner(): String {
        if (this.winsPlayerOne > this.winsPlayerTwo){
            alert("Ganó "+ this.playerOneName + " jugador 1 _ playerOne= ");

            return "Ganó "+ this.playerOneName;
            
        }
        else if (this.winsPlayerOne < this.winsPlayerTwo){
            alert("Ganó "+ this.playerTwoName + " jugador 2 _ playertwo= ");

            return "Ganó "+ this.playerTwoName;
        }
        //tie
        else{
            alert("empate");
            "La sesión finalizó en un empate";
        }
    }


    public setPlayerOneId(playerOneID:number):void{
        this.playerOneID=playerOneID;
    }
    
    public setPlayerOneName(playerOneName:String):void{
        this.playerOneName=playerOneName;
    }

    public setPlayerTwoName(playerTwoName:String):void{
        this.playerTwoName=playerTwoName;
    }

    public setTiesNumber(tiesNumber:number):void{
        this.tiesNumber=tiesNumber;
    }

    public setWinsPlayerOne(winsPlayerOne:number):void{
        this.winsPlayerOne=winsPlayerOne;
    }

    public setWinsPlayerTwo(winsPlayerTwo:number):void{
        this.winsPlayerTwo=winsPlayerTwo;
    }

    public setCurrentGameNumber(currentGameNumber:number):void{
        this.currentGameNumber=currentGameNumber;
    }

    public setAmountGamesNumber(amountGamesNumber:number):void{
        this.amountGamesNumber=amountGamesNumber;
    }

    public setPlayersNameData(dataArray:Array<any>):void{
        if (dataArray[0].o_playeroneid===dataArray[0].o_playerid){
            this.setPlayerOneName(dataArray[0].o_playername);
            this.setPlayerTwoName(dataArray[1].o_playername);
        }
        else{
            this.setPlayerOneName(dataArray[1].o_playername);
            this.setPlayerTwoName(dataArray[0].o_playername);
        }
    }

    public getSessionId():number{
        return this.sessionId;
    }

    public getPlayerOneId():number{
        return this.playerOneID;
    }

    public getPlayerOneName():String{
        return this.playerOneName;
    }

    public getPlayerTwoName():String{
        return this.playerTwoName;
    }

    public getTiesNumber():number{
        return this.tiesNumber;
    }

    public getWinsPlayerOne():number{
        return this.winsPlayerOne;
    }

    public getWinsPlayerTwo():number{
        return this.winsPlayerTwo;
    }

    public getCurrentGameNumber():number{
        return this.currentGameNumber;
    }

    public getAmountGamesNumber():number{
        return this.amountGamesNumber;
    }

}
