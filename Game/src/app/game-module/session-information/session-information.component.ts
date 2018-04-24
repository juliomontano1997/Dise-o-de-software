import { Component, OnInit } from '@angular/core';
import { GameViewComponent } from '../game-view/game-view.component';

import { Subscription } from 'rxjs';
import { userNotificationsHandler } from '../../models/userNotificationsHandler.model';
import { SessionStadisticsService } from '../../services/session-stadistics.service';
import { sessionInformationHandler } from '../../models/sessionInformationHandler.model';

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {

  private sessionInformationHandler:sessionInformationHandler;
  private userNotices:userNotificationsHandler;

  constructor(private sessionService:SessionStadisticsService,) {
    let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
    this.sessionInformationHandler=new sessionInformationHandler(sessionInformation.sessionId);
    this.sessionInformationHandler.setPlayerPlayingId(sessionInformation.playerId);
    this.userNotices= new userNotificationsHandler();
    this.getPlayersName();
    this.getSessionInformation();
    this.updateSessionInformation();
  }

  ngOnInit() {
  }


  public finishGame(){
    let message:String= this.sessionInformationHandler.getWinner();
    this.userNotices.notify(3,message,"Fin de sesión");

    setTimeout(() => {
      this.sessionService.getFinishSession(this.sessionInformationHandler.getSessionId()).subscribe(
        (res) =>{
          window.location.href='profileModule';
        },
        (err) => {
          console.log(err.json()); 
        });
    }, 4000);
    

  }

  public getSessionInformation():void{
    this.sessionService.getStadistics(this.sessionInformationHandler.getSessionId())
    .subscribe(
      (res) =>{
        console.log(res);
        if (res.length > 0) {

          //fin del juego
          if (res[0].o_amountgames < res[0].o_numberactualgame){
            this.sessionInformationHandler.setWinsPlayerOne(res[0].o_winsplayer1);
            this.sessionInformationHandler.setWinsPlayerTwo(res[0].o_winsplayer2);
            this.sessionInformationHandler.setTiesNumber(res[0].o_ties);
            setTimeout(() => {
              this.finishGame();
            }, 1100);
            
          }
          else{
            
            this.sessionInformationHandler.UpdateData(res);
          }
 
        }
        else{
          setTimeout(() => {
            this.finishGame();
          }, 1100);
        }

      },
      (err) => {
        console.log(err.json()); 
      });
  }

  public updateSessionInformation():void {
    let id = setInterval(() => {

          this.getSessionInformation();

        
       
      
    }, 6000);
  }

  public getPlayersName(): void{

    this.sessionService.getSessionNames(this.sessionInformationHandler.getSessionId())
    .subscribe(
      (res) =>{
        
        this.sessionInformationHandler.setPlayersNameData(res);
      },
      (err) => {
        console.log(err.json()); 
      });

    }

    public giveUp(){
        this.sessionService.giveUp(this.sessionInformationHandler.getSessionId()
      ,this.sessionInformationHandler.getPlayerPlayingId(), this.sessionInformationHandler.getAmountGamesNumber(), 
      this.sessionInformationHandler.getCurrentGameNumber())
        .subscribe(
          (res) =>{
    
              this.getSessionInformation();       
            
          },
          (err) => {
            console.log(err.json()); 
          });

    }

    public passTurn(){
      this.sessionService.passTurn(this.sessionInformationHandler.getSessionId(),
      this.sessionInformationHandler.getPlayerPlayingId())
        .subscribe(
          (res) =>{
              //it's not necessary to do nothing
          },
          (err) => {
            console.log(err.json()); 
          });
    }

    

}
