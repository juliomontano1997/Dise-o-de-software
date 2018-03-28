import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';

import { Routes, RouterModule } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';

const routes: Routes = [
  { path: '', component: LoginComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ],
  declarations: [LoginComponent
  ],
  providers: [LoginServiceService]
})

export class LoginModule { }
