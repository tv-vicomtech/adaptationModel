import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{ NgbModule}from"@ng-bootstrap/ng-bootstrap";
import { HttpModule, Http } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadparamComponent } from './loadParam/loadparam.component';
import { RunapproachComponent } from './runApproach/runapproach.component';
import { DataService } from './shared/data.service';


@NgModule({
  declarations: [
    AppComponent,
    RunapproachComponent,
    LoadparamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot(),
   ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
