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

  constructor(private gameService: GameServicesService) { 
    this.sessionHandler= new boardSessionHandler(1,1);
    this.updateBoard();
    this.getBoardChanges();
  }
    
  ngOnInit() {

  }

  public updateBoard(): void{

    this.gameService.getUpdatedBoard(this.sessionHandler.getSessionId())
    .subscribe(
      (res) =>{

        this.sessionHandler.UpdateData(res);
      },
      (err) => {
        console.log(err.json()); 
      });

    }

  public getBoardChanges():void{
    let id = setInterval(() => {
      this.updateBoard(); 
      
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
        if (res===true){
        this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column]=this.sessionHandler.getPlayerPlayingId();
        this.sessionHandler.setActualPlayerId();
        //this.getBoardChanges();
        }


      },
      (err) => {
        console.log(err.json());   
      });
    }
   
  }

}
