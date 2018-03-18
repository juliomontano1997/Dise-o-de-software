import { Component, OnInit } from '@angular/core';
import { GameViewComponent } from '../game-view/game-view.component';

import { Subscription } from 'rxjs';
import { SessionStadisticsService } from '../../services/session-stadistics.service';
import { sessionInformationHandler } from '../../models/sessionInformationHandler.model';

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {

  private sessionInformationHandler:sessionInformationHandler;
  constructor(private sessionService:SessionStadisticsService,) {
      this.sessionInformationHandler=new sessionInformationHandler(1);
      this.getPlayersName();
      this.updateSessionInformation();
   }

  ngOnInit() {
  }

  
  public getSessionInformation():void{
    this.sessionService.getStadistics(this.sessionInformationHandler.getSessionId())
    .subscribe(
      (res) =>{
        console.log(res);
        this.sessionInformationHandler.UpdateData(res);
      },
      (err) => {
        console.log(err.json()); 
      });
  }

  public updateSessionInformation():void{
    let id = setInterval(() => {
      this.getSessionInformation();
    }, 1000);
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
        this.sessionService.giveUp(this.sessionInformationHandler.getSessionId())
        .subscribe(
          (res) =>{
    
            console.log(res);
          },
          (err) => {
            console.log(err.json()); 
          });

    }

    public passTurn(){
      this.sessionService.passTurn(this.sessionInformationHandler.getSessionId())
        .subscribe(
          (res) =>{
            console.log(res);
          },
          (err) => {
            console.log(err.json()); 
          });
    }

}
