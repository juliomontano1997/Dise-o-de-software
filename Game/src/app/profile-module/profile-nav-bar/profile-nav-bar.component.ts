import { Component, OnInit } from '@angular/core';
import { facebookSessionHandler } from '../../models/facebookSessionHandler.model';
import { Notifications } from '../../models/notifications.model';
import { NavService } from '../../services/nav.service';
import { userNotificationsHandler } from '../../models/userNotificationsHandler.model';

@Component({
  selector: 'app-profile-nav-bar',
  templateUrl: './profile-nav-bar.component.html',
  styleUrls: ['./profile-nav-bar.component.css']
})
export class ProfileNavBarComponent implements OnInit {

  private userNotices:userNotificationsHandler;
  private facebookManager: facebookSessionHandler;
  private notificationsNumber;
  private lastLength;

  private notificationId:Number;
  private playerId:Number;
  private notifications:Array<Notifications>;
  private notificationContent: Array<String>;
  private firstTime;  //represent if this is the first time that program get Notifications

  constructor(private navService:NavService) { 
    this.userNotices= new userNotificationsHandler();
    this.notifications=new Array<Notifications>();
    this.facebookManager=new facebookSessionHandler('726004681121152');
    this.notificationsNumber=0;
    this.lastLength=-1; //to control notifications
    this.firstTime=true;
    let playerIdLevel=JSON.parse(localStorage.getItem("playerInformation"));
    this.playerId=playerIdLevel.o_playerid;
    this.getNotifications();
  }

  ngOnInit() {
  }

  public setNotificationsArray(dataArray:Array<any>){
      this.notifications=new Array<Notifications>();
      this.addDataToArray(this.notifications,dataArray);     
  }

  public addDataToArray(array:Array<Notifications>,dataArray:Array<any>){
    let size= dataArray.length;
    let i=0;
    for(i=0; i< size;i++){
      this.notifications.push(new Notifications(dataArray[i].o_id,
        dataArray[i].o_content));

      }
    
  }

  public restartNotificationsNumber(){
    this.notificationsNumber=0;

  }

  public getMyInvitations(playerId){

    this.navService.getInvitations(playerId).subscribe(
      (res) =>{
        //check this
        this.addDataToArray(this.notifications,res);
        
        //check if is there a new notification for the user
        if ((this.lastLength < this.notifications.length)  && (this.firstTime===false)){
          this.notificationsNumber= (this.notifications.length - this.lastLength)+ this.notificationsNumber;    
          //play sound   
          let audio = new Audio();
          audio.src = "../../assets/sounds/notification.mp3";
          audio.load();
          audio.play();

        }
        this.lastLength=this.notifications.length; 
        this.firstTime=false;
    
      },
      (err) => {
        console.log(err.json()); 
      });
  }


  public getMyNotifications(playerId:Number){
      this.navService.getNotifications(playerId).subscribe(
        (res) =>{
          //check this
            this.setNotificationsArray(res);
            this.getMyInvitations(this.playerId);
        },
        (err) => {
          console.log(err.json()); 
        });
  }
  
  
  public invitationAnswer(invitationId:Number,decision:Boolean){
    let that=this;
    this.navService.invitationAnswer(invitationId,decision).subscribe(
      (res) =>{
        //check this
          if (res.data===true){
            if (decision==true){
              this.userNotices.notify(0,"La solicitud ha sido aceptada","Notificación del sistema");
            }
            else{
              this.userNotices.notify(0,"La solicitud ha sido rechazada","Notificación del sistema");
            }
           
          }
          this.getMyNotifications(this.playerId);
          console.log("res");
          console.log(res);
          
      },
      (err) => {
        console.log(err.json()); 
      });
  }

  public deleteNotification(notificationId:Number){
      this.navService.deleteNotification(notificationId).subscribe(
        (res) =>{
          //check this
          if (res.data===true){
            this.userNotices.notify(2,"La notificación ha sido eliminada","Notificación del sistema");
          }
          console.log("res");
          console.log(res);
          this.getMyNotifications(this.playerId);
            
        },
        (err) => {
          console.log(err.json()); 
        });
  }



  public getNotifications(){
    let id = setInterval(() => {
      this.getMyNotifications(this.playerId);
  }, 12000);

  }

  public closeSession(){
    this.navService.closeSession(this.playerId).subscribe(
      (res) =>{
        //check this
        console.log("respuesta cerrar sesión");
        console.log(res);
        if (res.data===true){
          this.facebookManager.logOut();
        }

      },
      (err) => {
        console.log(err.json()); 
      });

  }





}
