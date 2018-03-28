import { player } from './player.model';

export class onlinePlayersHandler {

    private players:Array<player>;
    private guestPlayerId;
    
    constructor(){
        this.guestPlayerId=0;
        this.players=new Array<player>();
        
    }


    public setPlayers(data:Array<any>){
        this.players=data;
    }

    public setGuestPlayerId(playerId:Number){
        this.guestPlayerId=playerId;
    }

    public getPlayers(){
        return this.players;
    }

    public getGuestPlayerId(){
        return this.guestPlayerId;
    }

    public checkSessionData(boardSize:Number,gamesNumber):boolean{
        if ((boardSize!= undefined)||(gamesNumber!=undefined)){
            if ((boardSize > 0)&&(gamesNumber>0)){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

}