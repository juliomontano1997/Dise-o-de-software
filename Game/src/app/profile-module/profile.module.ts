import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { GameServicesService } from '../services/game-services.service';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { UserInformationComponent } from './user-information/user-information.component';
import { ProfileNavBarComponent } from './profile-nav-bar/profile-nav-bar.component';
import { OnlinePlayersComponent } from './online-players/online-players.component';
import { PendingSessionsComponent } from './pending-sessions/pending-sessions.component';
import { UserService } from '../services/user.service';
import {NgxPaginationModule} from 'ngx-pagination';


const routes: Routes = [
  { path: '', component: ProfileComponent},
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule

  ],
  declarations: [ProfileComponent, UserInformationComponent, ProfileNavBarComponent, OnlinePlayersComponent, PendingSessionsComponent],
  providers: [UserService]
})
export class ProfileModule { }
