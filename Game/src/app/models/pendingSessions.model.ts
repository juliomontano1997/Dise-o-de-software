export class pendingSessions {
    private sessionId:Number;
    private enemyName:String;
    private amountGames:Number;
    private boardSize: String;

    constructor(sessionId:Number,enemyName:String,amountGames:Number,boardSize:Number){
        this.sessionId=sessionId;
        this.enemyName=enemyName;
        this.amountGames= amountGames;
        this.boardSize=boardSize.toString()+"X"+boardSize.toString();
    }

    public getSessionId(): Number{
        return this.sessionId;
    }

    public getEnemyName(): String{
        return this.enemyName;
    }

    public getAmountGames():Number{
        return this.amountGames;
    }

    public getBoardSize():String{
        return this.boardSize;
    }

    
}