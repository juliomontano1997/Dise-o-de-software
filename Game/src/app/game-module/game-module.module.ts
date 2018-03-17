import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { GameServicesService } from '../services/game-services.service';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GameModuleComponent } from '../game-module/game-module/game-module.component';
import { GameViewComponent } from './game-view/game-view.component';
import { SessionInformationComponent } from './session-information/session-information.component';
import { MessageService } from '../services/Observer/message.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
  ],
  declarations: [
  GameModuleComponent,
  GameViewComponent,
  SessionInformationComponent
  ],
  providers: [GameServicesService,MessageService]
})
export class GameModule { }
