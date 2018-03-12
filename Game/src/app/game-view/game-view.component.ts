import { Component, OnInit } from '@angular/core';

import { GameServicesService } from '../services/game-services.service';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { boardSessionHandler } from '../models/boardSessionHandler.model';

@Component({
  selector: 'game-play-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
  
  private sessionHandler:boardSessionHandler;

  constructor(private gameService: GameServicesService) { 
    this.getBoardChanges();
    this.sessionHandler=new boardSessionHandler(1,0,1,15,
      [0,-1,1,0,-1,-1,-1,0,0,0,-1,-1,-1,-1,-1,
        0,0,0,0,1,1,1,0,0,0,-1,-1,-1,-1,-1,
        -1,-1,1,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,
        0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,-1,-1,
        1,-1,1,-1,1,-1,0,0,0,0,-1,-1,-1,-1,-1,
        0,0,1,0,1,0,0,-1,-1,-1,-1,-1,-1,-1,-1,
        0,1,1,1,0,0,1,1,1,1,-1,-1,-1,-1,-1,
        0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,0,0,0,0,0,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,0,0,0,0,0,-1,-1,-1,-1,-1,
        0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,
        0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,1,0,0,0,0,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,0,0,0,0,0,-1,-1,-1,-1,-1,
        -1,-1,-1,-1,-1,,0,0,0,0,-1,-1,-1,-1,-1,],'red','black',1);

  }
    
  ngOnInit() {

  }
  
  public updateBoard(): void{
    this.gameService.getUpdatedBoard(0,1)
    .subscribe(
      (res) =>{
        console.log("respuesta success");
        console.log(res.nombre);
      },
      (err) => {
        console.log("respuesta not sucess");
        console.log(err.json());
        
      });

    }

  public getBoardChanges():void{
    let id = setInterval(() => {
      if (this.sessionHandler.itsMyTurn()==true){
        clearInterval(id);
      }
      else{
      this.updateBoard(); 
      }
    }, 3000);
  }
    
  public checkEqualId(row:number, column:number, Id:number,){
      return this.sessionHandler.getBoard()[(row*this.sessionHandler.getBoardSize())+column] === Id ? true : false; 
  } 

  public movePiece(row:number,column:number){
    this.sessionHandler.setActualPlayerId(this.sessionHandler.getPlayerTwoId());
    
    if (this.sessionHandler.itsMyTurn()==true){
      this.gameService.makeMove(row,column,1,1)
    .subscribe(
      (res) =>{
        console.log(res);
        this.getBoardChanges();
      },
      (err) => {
        console.log(err.json());
        
      });
    }
    
  }

}
