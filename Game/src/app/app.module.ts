import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GameServicesService } from './services/game-services.service';
import { AppComponent } from './app.component';

import { HttpModule } from '@angular/http';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '',loadChildren: './login-module/login-module.module#LoginModule'},
  { path: 'gameModule', loadChildren: './game-module/game-module.module#GameModule'},
  { path: 'profileModule',loadChildren:'./profile-module/profile.module#ProfileModule' },
  { path: 'DemoModule',loadChildren:'./demo-module/demo-module.module#DemoModuleModule' },
];
const routerModule = RouterModule.forRoot(routes);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routerModule,
    HttpModule,
    HttpClientModule,],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
