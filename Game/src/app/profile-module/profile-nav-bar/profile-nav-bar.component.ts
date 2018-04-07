import { Component, OnInit } from '@angular/core';
import { facebookSessionHandler } from '../../models/facebookSessionHandler.model';
import { Notifications } from '../../models/notifications.model';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-profile-nav-bar',
  templateUrl: './profile-nav-bar.component.html',
  styleUrls: ['./profile-nav-bar.component.css']
})
export class ProfileNavBarComponent implements OnInit {

  private facebookManager: facebookSessionHandler;
  private notificationsNumber;
  private notificationId:Number;
  private playerId:Number;
  private notifications:Array<Notification>;
  private notificationContent: Array<String>;

  constructor(private navService:NavService) { 
    this.notifications=new Array<Notification>();
    this.facebookManager=new facebookSessionHandler('726004681121152');
    this.notificationsNumber=0;
    let playerIdLevel=JSON.parse(localStorage.getItem("playerInformation"));
    this.playerId=playerIdLevel.o_playerId;
    this.getNotifications();
  }

  ngOnInit() {
  }

  public setNotificationsArray(dataArray:Array<any>){
      let size= dataArray.length;
      let i=0;
      this.notifications=new Array<Notification>();

      for(i=0; i< size;i++){
      this.notifications.push(new Notification(dataArray[i].o_id,
        dataArray[i].o_content));

      }
  }

  public getMyNotifications(playerId:Number){
      this.navService.getNotifications(playerId).subscribe(
        (res) =>{
          //check this
            this.setNotificationsArray(res);
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
    
    this.facebookManager.logOut();
    
  }





}
