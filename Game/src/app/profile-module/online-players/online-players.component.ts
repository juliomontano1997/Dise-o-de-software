import { Component, OnInit } from '@angular/core';
import { onlinePlayersHandler } from '../../models/onlinePlayersHandler.model';
import { userNotificationsHandler } from '../../models/userNotificationsHandler.model';
import { OnlinePlayersService } from '../../services/online-players.service';
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
  private playerId:Number;
  private userNotices:userNotificationsHandler;

  constructor( private onlinePlayersService: OnlinePlayersService) { 
    this.userNotices= new userNotificationsHandler();
    this.playersHandler=new onlinePlayersHandler();
    let playerIdLevel=JSON.parse(localStorage.getItem("playerInformation"));
    this.playerId=playerIdLevel.o_playerid;
    this.getPlayers();
    this.getPlayersOnline();

  }

  public invitePlayer(playerId:Number){
    this.playersHandler.setGuestPlayerId(playerId);
  
  }

  

  public finishInvitation(){
    
    if (this.playersHandler.checkSessionData(this.boardSize,this.amountGames)){
      if (this.playersHandler.isMachineId()===true) {

        // get real machine level representation 

        let machineLevel: Number = this.playersHandler.getMachineLevel(this.selectedLevel);

        this.onlinePlayersService.inviteMachine(this.playerId,
        this.boardSize,this.amountGames,machineLevel)
        .subscribe(
          (res) =>{
              console.log("successful machine invitation");
              console.log(res);
              if (res.data===false){
                this.userNotices.notify(1,
                  "La invitación no ha sido enviada, posiblemente usted ya este jugando una sesión con la máquina o el tamaño del tablero no es un número par y mayor que 2",
                  "Notificación del sistema");
                
              }
              this.amountGames=undefined;
              this.boardSize=undefined;
              
              
          },
          (err) => {
            console.log(err.json()); 
          });
      }
      //invite player
      else{
        
        this.onlinePlayersService.invitePlayer(this.playerId,this.playersHandler.getGuestPlayerId(),
        this.boardSize,this.amountGames)
        .subscribe(
            (res) =>{
            console.log("successful player invitation");
            console.log(res);
            //success player invitation
            if (res.data===false){
              this.userNotices.notify(1,"La invitación no ha sido enviada, posiblemente usted ya este jugando una sesión con esta persona "+ 
              "o el tamaño del tablero no es un número par y mayor que 2","Notificación del sistema");
              
            }
            this.amountGames=undefined;
            this.boardSize=undefined;
            
          },
          (err) => {
          console.log(err.json()); 
          });
      }
    }

    else{
      this.userNotices.notify(1,"Debe especificar el número de partidas y el tamaño de tablero"  
      +" tal que sean mayor a 0 ","Notificación del sistema");
      //show error in board size or amount games
    }

  }

  public getPlayers(){
    this.onlinePlayersService.getPlayers(this.playerId)
    .subscribe(
        (res) =>{
            console.log("playersOnline");
            console.log(res);
            this.playersHandler.updatePlayersArray(res);
        },
        (err) => {
          console.log(err.json()); 
        });
  }

  public getPlayersOnline():void{
    let id = setInterval(() => {
        this.getPlayers();
    }, 10000);
  }

  ngOnInit() {
  }

}
