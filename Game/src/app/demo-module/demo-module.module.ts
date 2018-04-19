import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponentComponent } from './demo-component/demo-component.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GameViewComponent } from '../game-module/game-view/game-view.component';

const routes: Routes = [
  { path: '', component: DemoComponentComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DemoComponentComponent, GameViewComponent]
})
export class DemoModuleModule { }
