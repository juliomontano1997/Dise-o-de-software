import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GameServicesService } from './services/game-services.service';
import { AppComponent } from './app.component';

import { HttpModule } from '@angular/http';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { GameViewComponent } from './game-view/game-view.component';
import { SessionInformationComponent } from './session-information/session-information.component';

const routes: Routes = [
  { path: '', component: AppComponent},
  { path: 'playGame', component: GameViewComponent }
  ];

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    SessionInformationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    HttpClientModule,
  ],
  providers: [GameServicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
