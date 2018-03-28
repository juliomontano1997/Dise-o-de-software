import { Component, OnInit } from '@angular/core';
import { facebookSessionHandler } from '../../models/facebookSessionHandler.model';
@Component({
  selector: 'app-profile-nav-bar',
  templateUrl: './profile-nav-bar.component.html',
  styleUrls: ['./profile-nav-bar.component.css']
})
export class ProfileNavBarComponent implements OnInit {

  private facebookManager: facebookSessionHandler;
  private notificationsNumber;
  constructor() { 
    this.facebookManager=new facebookSessionHandler('726004681121152');
    this.notificationsNumber=0;
  }

  ngOnInit() {
  }

  public closeSession(){
    
    this.facebookManager.logOut();
    
  }



}
