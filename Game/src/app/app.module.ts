import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GameServicesService } from './services/game-services.service';
import { AppComponent } from './app.component';

import { HttpModule } from '@angular/http';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GameModule } from '../app/game-module/game-module.module';
import { LoginModule } from './login-module/login-module.module';
import { ProfileModule } from './profile-module/profile.module';
//import { AppRoutingModule, routingComponents } from './app.routing';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login-module/login/login.component';
import { GameModuleComponent } from './game-module/game-module/game-module.component';
import { ProfileComponent } from './profile-module/profile/profile.component';
import { MessageService } from './services/Observer/message.service';

 export const routes: Routes = [
  { path: '', component: GameModuleComponent},
  { path: '**', component:GameModuleComponent},
  { path: 'gameModule', component: GameModuleComponent},
  { path: 'profileModule', component:ProfileComponent},
  ];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    HttpClientModule,
    GameModule,
    LoginModule,
    ProfileModule],
  providers: [GameServicesService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
