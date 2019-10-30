
import { Router,NavigationStart } from '@angular/router';
import { Component,ViewChild,OnInit,ElementRef } from '@angular/core';
import { DataService } from '../shared/data.service';
@Component({
    selector: 'loadparam',
    templateUrl: './loadparam.component.html'
})
export class LoadparamComponent {

  dataService: DataService;

  @ViewChild('compProp') compProp: ElementRef;
  @ViewChild('devProp') devProp: ElementRef;


  constructor(dataService:DataService){
    this.dataService=dataService;

  }
  ngOnInit() {

  }

  addCompProp(){
    this.dataService.addCompProp(this.compProp.nativeElement.value);
  }

  addDevProp(){
    this.dataService.addDevProp(this.devProp.nativeElement.value);
  }

  compPropChanged(event){
    this.dataService.compPropChanged(event);
  }

  devPropChanged(event){
    this.dataService.devPropChanged(event);
  }

  matrChanged(event){
    this.dataService.matr1Changed(event);
  }

  criteriaValueChanged(event){
    this.dataService.criteriaValueChanged(event);
  }
  coefsValueChanged(event){
    this.dataService.coefValueChanged(event);
  }
  ScValueChanged(event){
    this.dataService.ScValueChanged(event);
  }
  SsValueChanged(event){
    this.dataService.SsValueChanged(event);
  }
  load(event){
    var myReader = new FileReader();
    myReader.readAsText(event.target.files[0]);
    myReader.addEventListener('loadend', (x)=> {
      this.dataService.load(x);
    });
    myReader.addEventListener('error', function (x) {
      console.log(x.target['result']);
    });

  }
  save(){
    var data="var compProp="+JSON.stringify(this.dataService.getCompObj())+
    ";var devProp="+JSON.stringify(this.dataService.getDevObj())+
    ";var affinityMat="+JSON.stringify(this.dataService.getAffinityMat1())+
    ";var criteria="+JSON.stringify(this.dataService.getCriteria())+
    ";var criteriaVal="+JSON.stringify(this.dataService.getCriteriaVal())+
    ";var coefs="+JSON.stringify(this.dataService.getCoefs())+
    ";var coefsVal="+JSON.stringify(this.dataService.getCoefsVal())+
    ";var Sc="+JSON.stringify(this.dataService.getSc())+
    ";var Ss="+JSON.stringify(this.dataService.getSs())+";";

    var blob = new Blob([data], { type: "application/js" });
      var url = window.URL.createObjectURL(blob);

      var a: any = document.querySelector('#Saveto');
      a.href = url;

      a.download = "adaptationParameters.js";

  }
  delete(){
    this.dataService.delete(event);

  }

}
