import { Component, OnInit } from '@angular/core';
import { pendingSessions } from '../../models/pendingSessions.model';

@Component({
  selector: 'app-pending-sessions',
  templateUrl: './pending-sessions.component.html',
  styleUrls: ['./pending-sessions.component.css']
})
export class PendingSessionsComponent implements OnInit {
  
  private pendingSessions:Array<pendingSessions>;
  private amountItems=4; //amount of items per page
  private pageNumberTwo=1; //current page

  constructor() { 

    this.pendingSessions= new Array<pendingSessions>();
    this.pendingSessions.push(new pendingSessions(0,"Enemigo de prueba1",6,10));
    this.pendingSessions.push(new pendingSessions(1,"Enemigo de prueba2",5,8));
    this.pendingSessions.push(new pendingSessions(2,"Enemigo de prueba3",4,5));
    this.pendingSessions.push(new pendingSessions(3,"Enemigo de prueba4",3,6));
    this.pendingSessions.push(new pendingSessions(4,"Enemigo de prueba5",2,4));
    this.pendingSessions.push(new pendingSessions(5,"Enemigo de prueba6",1,10));
    this.pendingSessions.push(new pendingSessions(6,"Enemigo de prueba7",7,8));
    this.pendingSessions.push(new pendingSessions(7,"Enemigo de prueba8",8,6));
    this.pendingSessions.push(new pendingSessions(8,"Enemigo de prueba9",9,5));
    this.pendingSessions.push(new pendingSessions(9,"Enemigo de prueba10",5,4));

  }

  
  public restartSession(sessionId:Number){
    let playerIdLevel=JSON.parse(localStorage.getItem("playerInformation"));
    alert("Id de la sesión: "+ sessionId);
    localStorage.setItem("sessionData",JSON.stringify({"sessionId":sessionId,"playerId":playerIdLevel.o_playerId}));
    window.location.href='gameModule';
  }

  ngOnInit() {
  }

}
