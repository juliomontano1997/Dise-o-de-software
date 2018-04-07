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

    public updatePlayersArray(playersData:Array<any>){
        let size:Number = playersData.length;
        this.players=new Array<any>();
        let i=0;
        for (i=0; i < size;i++) {
            this.players.push(new player(playersData[i].o_playerid,
                playersData[i].o_playername,
                "",
                playersData[i].o_playerlevel,
                playersData[i].o_playerimage));
        }
    }

    public getMachineLevel (level:String):Number{
        if (level==="Fácil"){
            return 1;
        }   
        else if ("Intermedio"){
            return 2;
        }
        else{
            return 3;
        }
    }

    public isMachineId():boolean{
        return this.guestPlayerId===0;
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