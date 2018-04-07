import { Component, OnInit } from '@angular/core';
import { player } from '../../models/player.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {

  private playerHandler: player;
  
  constructor(private userService: UserService) { 
    this.getPlayerInformation();
  }

  ngOnInit() {
  }

  public getPlayerInformation(){

    let playerData= JSON.parse(localStorage.getItem("user_data")); //parse string json to json object
    let playerIdLevel=JSON.parse(localStorage.getItem("playerInformation"));
    this.playerHandler=new player(playerIdLevel.o_playerid,playerData.name,playerData.email,
      playerIdLevel.o_playerlevel, "https://graph.facebook.com/"+playerData.id+"/picture?type=normal");
    console.log("player object");
    console.log(this.playerHandler);
  }

}
