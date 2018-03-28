export class player {

    private playerId:Number;
    private playerName:String;
    private playerEmail:String;
    private playerLevel:Number;
    private playerImage:String;

    private appId: String;

    constructor(playerId:Number,playerName:String,playerEmail:String,playerLevel:Number,playerImage:String){
        this.playerId=playerId;
        this.playerName=playerName;
        this.playerEmail=playerEmail;
        this.playerLevel=playerLevel;
        this.playerImage=playerImage;
    }

    public getPlayerId():Number{
        return this.playerId;
    }

    public getPlayerName(): String{
        return this.playerName;
    }

    public getPlayerImage(): String{
        return this.playerImage;
    }

    public getPlayerEmail(): String{
        return this.playerEmail;
    }

    public getPlayerLevel(): Number{
        return this.playerLevel;
    }
   
}