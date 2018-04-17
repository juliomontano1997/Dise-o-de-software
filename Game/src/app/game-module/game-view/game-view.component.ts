import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { GameServicesService } from '../../services/game-services.service';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { boardSessionHandler } from '../../models/boardSessionHandler.model';
import { userNotificationsHandler } from '../../models/userNotificationsHandler.model';

@Component({
  selector: 'game-play-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
  
  private sessionHandler:boardSessionHandler;
  private sessionId;
  private colors:Array<any>;
  private selectedColor:String;
  private userNotify:userNotificationsHandler;

  constructor(private gameService: GameServicesService) { 
    let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
    this.userNotify=new userNotificationsHandler();
    this.selectedColor="#000000";
    this.sessionHandler= new boardSessionHandler(sessionInformation.sessionId,sessionInformation.playerId);
    this.updateBoard();
    this.getBoardChanges();
  }
    
  ngOnInit() {

  }

  public changePiecesColor(){
      this.gameService.changePiecesColor(this.sessionHandler.getSessionId(),this.sessionHandler.getPlayerPlayingId(),
      this.selectedColor.slice(1,this.selectedColor.length))
      .subscribe(
        (res) =>{

          //color is not available
          if (res.data===false){
          this.userNotify.notify(1,"No fue posible realizar el cambio de color verifique que el color seleccionado no esté siendo utilizado por su oponente",
          "Notificación de sistema");
          }
          
          
        },
        (err) => {
          console.log(err.json()); 
        });

  }

  public changeNotify (){
      localStorage.setItem("somethingChange",JSON.stringify({"state":true}));
  }

  public updateBoard(): void{

    this.gameService.getUpdatedBoard(this.sessionHandler.getSessionId())
    .subscribe(
      (res) =>{

          if (res.length >0){
            this.sessionHandler.UpdateData(res);
          }
        
      },
      (err) => {
        console.log(err.json()); 
      });

    }

  public getBoardChanges():void{
    let id = setInterval(() => {
      console.log("looking for answer");
      
      if (JSON.parse(localStorage.getItem("notUpdate")).state===false){

        this.updateBoard(); 
      }
      
      else{
        clearInterval(id);
      }
      
    }, 500);
  }
    
  public checkEqualId(row:number, column:number, Id:number,){
      return this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column] === Id ? true : false; 
  } 

  public movePiece(row:number,column:number){
  
    if (this.sessionHandler.itsMyTurn()==true){
      this.gameService.makeMove(row,column,this.sessionHandler.getSessionId(),this.sessionHandler.getPlayerPlayingId())
    .subscribe(
      (res) =>{
        if (res!=false){
        this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column]=this.sessionHandler.getPlayerPlayingId();
        this.sessionHandler.setActualPlayerId();
        this.getBoardChanges();
        
        }




      },
      (err) => {
        console.log(err.json());   
      });
    }
   
  }

}
