export class pendingSessions {
    private sessionId:Number;
    private enemyName:String;
    private amountGames:Number;
    private boardSize: String;
    private currentGameNumber:Number;


    constructor(sessionId:Number,enemyName:String,amountGames:Number,boardSize:Number,currentGameNumber:Number){
        this.sessionId=sessionId;
        this.enemyName=enemyName;
        this.amountGames= amountGames;
        this.boardSize=boardSize.toString()+"X"+boardSize.toString();
        this.currentGameNumber=currentGameNumber;
    }

    public getSessionId(): Number{
        return this.sessionId;
    }

    public getEnemyName(): String{
        return this.enemyName;
    }

    public getCurrentGameNumber():Number{
        return this.currentGameNumber;
    }

    public getAmountGames():Number{
        return this.amountGames;
    }

    public getBoardSize():String{
        return this.boardSize;
    }

    
}