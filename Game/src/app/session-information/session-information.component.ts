import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-information',
  templateUrl: './session-information.component.html',
  styleUrls: ['./session-information.component.css']
})
export class SessionInformationComponent implements OnInit {

  private informationArray:any;

  constructor() {

    this.informationArray=[];
   }


  ngOnInit() {
  }

}
