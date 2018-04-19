import { Component, OnInit } from '@angular/core';
import { facebookSessionHandler } from '../../models/facebookSessionHandler.model';
import { NavService } from '../../services/nav.service';
import { userNotificationsHandler } from '../../models/userNotificationsHandler.model';

@Component({
  selector: 'app-message-nav-bar',
  templateUrl: './message-nav-bar.component.html',
  styleUrls: ['./message-nav-bar.component.css']
})
export class MessageNavBarComponent implements OnInit {

  private facebookManager: facebookSessionHandler;
  private userNotify:userNotificationsHandler;
  private messages:Array<any>;
  private messageBody:String;
  private playerId:Number;
  private sessionId:Number;
  private lastLength: number;
  private firstTime:Boolean;
  private messagesNumber:number=0;
  private characterPerLine;

  constructor(private navService: NavService) { 
    this.userNotify=new userNotificationsHandler();
    this.facebookManager=new facebookSessionHandler('726004681121152');

    this.characterPerLine=20;
    let playerIdLevel=JSON.parse(localStorage.getItem("playerInformation"));
    this.playerId=playerIdLevel.o_playerid;

    this.firstTime=true;
    this.lastLength=-1;
    let sessionInformation= JSON.parse(localStorage.getItem("sessionData"));
    this.sessionId= sessionInformation.sessionId;
    this.getMyMessages(this.sessionId);
    this.getMessages();
  }

  public setSize(message: String){
      return (message.length / this.characterPerLine)+1; 
  }

  public addDataToArray(dataArray:Array<any>){
  this.messages=new Array<any>();
  let size= dataArray.length;
  let i=0;
  for(i=0; i< size;i++){
      this.messages.push({"transmitterId":dataArray[i].o_transmitterid,
      "receiverId":dataArray[i].o_receiverid,"messageContent":dataArray[i].o_messagecontent});

    }
  
  }


  public restartMessagesNumber(){
  this.messagesNumber=0;

  }

  public sendMessage(){
    this.navService.sendMessage(this.sessionId,this.playerId,this.messageBody).subscribe(
      (res) =>{
        if (res.data!=true){
          this.userNotify.notify(1,"El proceso de envío del mensaje no fue exitoso",
          "Notificación del sistema");
        }
        else{
          this.getMyMessages(this.sessionId);
          this.messageBody=undefined;
        }
        

        
    
      },
      (err) => {
        console.log(err.json()); 
      });
  }

  public getMyMessages(sessionId:Number){
    this.navService.getMessages(sessionId).subscribe(
      (res) =>{
        //check this
        this.addDataToArray(res);
        
        //check if is there a new notification for the user
        if ((this.lastLength < this.messages.length)  && (this.firstTime===false)){
          this.messagesNumber= (this.messages.length - this.lastLength)+ this.messagesNumber;    
          //play sound   
          let audio = new Audio();
          audio.src = "../../assets/sounds/message.mp3";
          audio.load();
          audio.play();

        }
        this.lastLength=this.messages.length; 
        this.firstTime=false;
    
      },
      (err) => {
        console.log(err.json()); 
      });
  }

  public getMessages(){
    let id = setInterval(() => {
      this.getMyMessages(this.sessionId);
  }, 8000);

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

  ngOnInit() {
  }

}
