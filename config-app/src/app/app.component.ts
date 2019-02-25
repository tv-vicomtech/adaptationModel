import { Component,ViewChild,OnInit,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'config-app';
  constructor( private http: Http) {

    }


}
