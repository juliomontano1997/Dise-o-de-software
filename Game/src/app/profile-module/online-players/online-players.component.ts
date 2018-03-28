import { Component, OnInit } from '@angular/core';
import { onlinePlayersHandler } from '../../models/onlinePlayersHandler.model';
import { player } from '../../models/player.model';
@Component({
  selector: 'app-online-players',
  templateUrl: './online-players.component.html',
  styleUrls: ['./online-players.component.css']
})
export class OnlinePlayersComponent implements OnInit {

  private playersHandler: onlinePlayersHandler;
  private amountGames:Number;
  private boardSize: Number; 
  private amountItems=6; //amount of items per page
  private pageNumber=1; //current page
  private machineId=0;
  private selectedLevel="Fácil";

  constructor() { 

    this.playersHandler=new onlinePlayersHandler();
    let p:Array<player>;
    p=new Array<player>();
    let playerData= JSON.parse(localStorage.getItem("user_data")); //parse string json to json object
    p.push(new player(0,"Máquina","nothing",0,"/assets/images/machine.jpg"));
    p.push(new player(1,"Joshua Carranza Pérez","email",1,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(2,"Joshua Carranza Pérez","email",2,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(3,"Joshua Carranza Pérez","email",3,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(4,"Joshua Carranza Pérez","email",4,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(5,"Joshua Carranza Pérez","email",5,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(6,"Joshua Carranza Pérez","email",6,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(7,"Joshua Carranza Pérez","email",7,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(8,"Joshua Carranza Pérez","email",8,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(9,"Joshua Carranza Pérez","email",9,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(10,"Joshua Carranza Pérez","email",10,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(11,"Joshua Carranza Pérez","email",11,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    p.push(new player(12,"Joshua Carranza Pérez","email",12,"https://graph.facebook.com/"+playerData.id+"/picture?type=normal"));
    this.playersHandler.setPlayers(p);
    console.log("players");
    console.log(this.playersHandler.getPlayers());
  }

  public invitePlayer(playerId:Number){
    this.playersHandler.setGuestPlayerId(playerId);
    alert("invitar jugador con Id: " + playerId);
  }

  public finishInvitation(){
      alert("terminar la invitación: bsize= "+ this.boardSize+ " games: " +this.amountGames
      +" select model: "+ this.selectedLevel); 
      console.log("resultado de validar");
      console.log(this.playersHandler.checkSessionData(this.boardSize,this.amountGames));

  }

  ngOnInit() {
  }

}
