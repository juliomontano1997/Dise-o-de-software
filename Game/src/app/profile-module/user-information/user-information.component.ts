import { Component, OnInit } from '@angular/core';
import { player } from '../../models/player.model';

import { LoginServiceService } from '../../services/login-service.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {

  private playerHandler: player;
  
  constructor(private loginService:LoginServiceService) { 
    this.getPlayerInformation();
  }

  ngOnInit() {
  }

  public getPlayerInformation(){

    let playerData= JSON.parse(localStorage.getItem("user_data")); //parse string json to json object
    let playerIdLevel=JSON.parse(localStorage.getItem("playerInformation"));

    this.loginService.userRegistration(playerData.email,playerData.name,
      "https://graph.facebook.com/"+playerData.id+"/picture?type=normal")
    .subscribe(
        (res) =>{

          this.playerHandler=new player(playerIdLevel.o_playerid,playerData.name,playerData.email,
            res[0].o_playerlevel, "https://graph.facebook.com/"+playerData.id+"/picture?type=normal");

        },
        (err) => {
          console.log(err.json()); 
        });
    
  }

}
