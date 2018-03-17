import { Component, OnInit } from '@angular/core';
import { GameViewComponent } from '../game-view/game-view.component';
import { MessageService } from '../../services/observer/index';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {
  subscription: Subscription; //it helps to make an observer
  private informationArray:any;

  constructor(private messageService: MessageService,) {

    this.informationArray=[];
    this.subscription = this.messageService.getMessage().subscribe
      (message => { 
        console.log("notificado, lo recibí");
        alert("I have to mak an http request: "+ message);
       });
   }

   //uodate the session information
   public getSessionInformation():void{

   }
  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
}

}
