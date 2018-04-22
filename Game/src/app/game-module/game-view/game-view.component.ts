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
  private movesList:Array<any>;
  private isDemo:boolean; //to control demo actions
  private demoIndex:number;


  constructor(private gameService: GameServicesService) { 
    this.isDemo=false;
    let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
    if (sessionInformation.playerId===1){
      this.isDemo=true;
      this.demoIndex=0;
      this.movesList=new Array();
      this.movesList=[[2,4],[3,1],[5,1],[4,2],[0,4],[1,3],[5,3],[4,0],[3,0],[5,5],[4,5],[3,4],[2,5]
      ,[2,1],[0,0],[1,1,]];
    }
    this.userNotify=new userNotificationsHandler();
    this.selectedColor="#000000";
    this.sessionHandler= new boardSessionHandler(sessionInformation.sessionId,sessionInformation.playerId);
    this.updateBoard();
    this.getBoardChanges();
  }
    
  ngOnInit() {

  }

  public demo(){
    console.log("???????????????????????????");
    console.log("DEMO");
    console.log(this.isDemo);
    console.log("???????????????????????????");
    return this.isDemo;
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

           if (res.length > 0){
            this.sessionHandler.UpdateData(res);
          }

          if (this.isDemo===true) {
 
              if (this.demoIndex === this.movesList.length){
                 this.userNotify.notify(0,"El demo ha finalizado","Notificación del sistema");
                 setTimeout(() => {
                  window.location.href='/'; //go to login page
                }, 300);
                 
              }

              if (this.sessionHandler.itsMyTurn()===true && this.demoIndex < this.movesList.length){
                setTimeout(() => {

                  this.demoMove(this.movesList[this.demoIndex][0],this.movesList[this.demoIndex][1]);
                }, 3000);
                
              }
             
              
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
      
    }, 1000);
  }
    
  public checkEqualId(row:number, column:number, Id:number,){
      return this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column] === Id ? true : false; 
  } 

  public demoMove(row:number,column:number){
    this.gameService.makeMove(row,column,this.sessionHandler.getSessionId(),this.sessionHandler.getPlayerPlayingId())
    .subscribe(
      (res) =>{
        if (res!=false){  
        this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column]=this.sessionHandler.getPlayerPlayingId();
        this.sessionHandler.setActualPlayerId();
        this.demoIndex++;
        }




      },
      (err) => {
        console.log(err.json());   
      });
  }

  public movePiece(row:number,column:number){
  
    if (this.sessionHandler.itsMyTurn()==true && this.isDemo===false){
      this.gameService.makeMove(row,column,this.sessionHandler.getSessionId(),this.sessionHandler.getPlayerPlayingId())
    .subscribe(
      (res) =>{
        if (res!=false){  
        this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column]=this.sessionHandler.getPlayerPlayingId();
        this.sessionHandler.setActualPlayerId();
        
        }




      },
      (err) => {
        console.log(err.json());   
      });
    }
   
  }

}
