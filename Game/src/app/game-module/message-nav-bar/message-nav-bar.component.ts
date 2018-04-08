import { Component, OnInit } from '@angular/core';
import { facebookSessionHandler } from '../../models/facebookSessionHandler.model';
import { NavService } from '../../services/nav.service';
@Component({
  selector: 'app-message-nav-bar',
  templateUrl: './message-nav-bar.component.html',
  styleUrls: ['./message-nav-bar.component.css']
})
export class MessageNavBarComponent implements OnInit {

  private facebookManager: facebookSessionHandler;
  private messages:Array<any>;
  private messageBody:String;
  private playerId:Number;
  private sessionId:Number;
  private messagesNumber:Number=0;

  constructor(private navService: NavService) { 
    this.facebookManager=new facebookSessionHandler('726004681121152');
    this.messages= new Array<any>();
    //testing
    this.playerId=1;
    this.messages.push({"transmitterId":1,"receiverId":2,"sessionId":2,"messageId":1,"messageContent":"Hola crees que está es una buena partida?"});
    this.messages.push({"transmitterId":2,"receiverId":1,"sessionId":2,"messageId":2,"messageContent":"Me parece que es una buena partida"});
    this.messages.push({"transmitterId":1,"receiverId":2,"sessionId":2,"messageId":3,"messageContent":"¿Creés poder pausar y continuarla mañana?"});
    this.messages.push({"transmitterId":2,"receiverId":1,"sessionId":2,"messageId":4,"messageContent":"Por mí está bien, en la noche estoy libre"});



  }

  public sendMessage(){

  }

  public setBackgroundColor(transmitterId){
      if (transmitterId===this.playerId){
        return 'lightblue';
      }
      else{
        return 'lightgreen';
      }
  }

  public closeSession(){
    this.navService.closeSession(this.playerId).subscribe(
      (res) =>{
        //check this
        if (res.data===true){
          this.facebookManager.logOut();
    
        }

      },
      (err) => {
        console.log(err.json()); 
      });
    
  }



  /**
  public getBoardChanges():void{
    let id = setInterval(() => {
      
      
    }, 5000);
  }
*/
  ngOnInit() {
  }

}
