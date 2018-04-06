import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import { GameServicesService } from '../../services/game-services.service';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { boardSessionHandler } from '../../models/boardSessionHandler.model';


@Component({
  selector: 'game-play-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
  
  private sessionHandler:boardSessionHandler;
  private sessionId

  constructor(private gameService: GameServicesService) { 
   // let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
  //  this.sessionHandler= new boardSessionHandler(sessionInformation.sessionId,sessionInformation.playerId);
    localStorage.setItem("notUpdate",JSON.stringify({"state":false})); 
    this.sessionHandler= new boardSessionHandler(4,1);
    this.updateBoard();
    this.getBoardChanges();
  }
    
  ngOnInit() {

  }


  public changeNotify (){
      localStorage.setItem("somethingChange",JSON.stringify({"state":true}));
  }

  public updateBoard(): void{

    this.gameService.getUpdatedBoard(this.sessionHandler.getSessionId())
    .subscribe(
      (res) =>{
        console.log("respuesta actualización");
        console.log(res);
        this.sessionHandler.UpdateData(res);
      },
      (err) => {
        console.log(err.json()); 
      });

    }

  public getBoardChanges():void{
    let id = setInterval(() => {
      if (this.sessionHandler.itsMyTurn()===true && (JSON.parse(localStorage.getItem("notUpdate")).state===false))
        {
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
        //this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column]=this.sessionHandler.getPlayerPlayingId();
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
