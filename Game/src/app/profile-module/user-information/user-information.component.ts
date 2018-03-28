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

    //get player data through a web service
    // this.userService.getPlayerInformation().subscribe
    let playerData= JSON.parse(localStorage.getItem("user_data")); //parse string json to json object
    this.playerHandler=new player(1,playerData.name,playerData.email,2,
      "https://graph.facebook.com/"+playerData.id+"/picture?type=normal");
    console.log("player object");
    console.log(this.playerHandler);
  }

}
