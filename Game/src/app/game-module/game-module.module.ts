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
import { SessionStadisticsService } from '../services/session-stadistics.service';
import { Routes, RouterModule } from '@angular/router';
import { MessageNavBarComponent } from './message-nav-bar/message-nav-bar.component';

const routes: Routes = [
  { path: '', component: GameModuleComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
  GameModuleComponent,
  GameViewComponent,
  SessionInformationComponent,
  MessageNavBarComponent
  ],
  providers: [GameServicesService, SessionStadisticsService,]
})
export class GameModule { }
