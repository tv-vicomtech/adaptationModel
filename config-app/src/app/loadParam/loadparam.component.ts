
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
  @ViewChild('compDim') compDim: ElementRef;
  @ViewChild('devProp') devProp: ElementRef;
  @ViewChild('devDim') devDim: ElementRef;
  @ViewChild('layoutProp') layoutProp: ElementRef;
  @ViewChild('assignmentProp') assignmentProp: ElementRef;
  @ViewChild('compNum1') compNum1: ElementRef;
  @ViewChild('compNum2') compNum2: ElementRef;
  @ViewChild('devNum1') devNum1: ElementRef;
  @ViewChild('devNum2') devNum2: ElementRef;
  constructor(dataService:DataService){
    this.dataService=dataService;
  }
  ngOnInit() {
    //this.load();

  }

  addCompProp(){
    this.dataService.addCompProp(this.compProp.nativeElement.value);
  }
  addCompDim(){
    this.dataService.addCompDim(this.compDim.nativeElement.value);
  }
  addDevProp(){
    this.dataService.addDevProp(this.devProp.nativeElement.value);
  }
  addDevDim(){
    this.dataService.addDevDim(this.devDim.nativeElement.value);
  }
  addLayoutProp(){
    this.dataService.addLayoutProp(this.layoutProp.nativeElement.value);
  }
  addNumCompRange(){
    this.dataService.addNumCompRange(/*'['+*/this.compNum1.nativeElement.value/*+','+this.compNum2.nativeElement.value+']'*/);
  }
  addNumDevRange(){
    this.dataService.addNumDevRange(/*'['+*/this.devNum1.nativeElement.value/*+','+this.devNum2.nativeElement.value+']'*/);
  }
  addAssignmentProp(){
    /*this.assignmentProps.push(this.assignmentProp.nativeElement.value);
    for(var i=0;i<this.assignment.length;i++){
      this.assignmentObj[this.assignment[i]][this.assignmentProp.nativeElement.value]=0;
    }

    this.affinityMat2.push(Array(this.layoutProps.length).fill(0));*/
  }
  compPropChanged(event){
    this.dataService.compPropChanged(event);
  }
  compDimChanged(event){
    this.dataService.compDimChanged(event);
  }
  devPropChanged(event){
    this.dataService.devPropChanged(event);
  }
  devDimChanged(event){
    this.dataService.devDimChanged(event);
  }
  layoutPropChanged(event){
    this.dataService.layoutPropChanged(event);
  }
  /*compNumRangeChanged(event){
    this.dataService.compNumRangeChanged(event);
  }
  devNumRangeChanged(event){
    this.dataService.devNumRangeChanged(event);
  }*/

  matrChanged(event){
    this.dataService.matr1Changed(event);
  }
  matr2Changed(event){
    this.dataService.matr2Changed(event);
  }
  matr3Changed(event){
    this.dataService.matr3Changed(event);
  }
  matr4Changed(event){
    this.dataService.matr4Changed(event);
  }
  criteriaValueChanged(event){
    this.dataService.criteriaValueChanged(event);
  }
  load(event){
    /*var data='var compProp={"main":{"attention":1,"interactivity":0},"video":{"attention":0.7,"interactivity":0.2},"banner":{"attention":0.6,"interactivity":0},"staticData":{"attention":0.5,"interactivity":0.2},"dynamicData":{"attention":0.5,"interactivity":1},"social":{"attention":0.3,"interactivity":1},"UGC":{"attention":0.3,"interactivity":1},"advertisement":{"attention":0.2,"interactivity":0}};var devProp={"mobile":{"screensize":0.2,"inputCapabilities":0.6},"tablet":{"screensize":0.4,"inputCapabilities":0.7},"computer":{"screensize":0.6,"inputCapabilities":1},"smartTv":{"screensize":1,"inputCapabilities":0.2}};var affinityMat=[[1,0.1],[0.2,1]];var layoutProp={"pip":{"scroll":0,"overlap":1,"emptySpace":0},"customGrid":{"scroll":0.7,"overlap":0,"emptySpace":0.7},"divided":{"scroll":0,"overlap":0,"emptySpace":0.7},"carousel":{"scroll":1,"overlap":0.9,"emptySpace":0.1}};var affinityMat2=[[0.1,0.1,0.5],[1,1,1],[0,0,1],[0,0,1]];var numCompRanges=["0","1","2","3","4","5","6","7","8","+"];var affinityMat3=[[1,1,1,1],[1,0,1,1],[0.9,0,1,0.8],[0.9,0,0.7,0.7],[0.9,0,0.9,0.8],[0.8,0,0.6,0.8],[0.6,0,0.8,0.9],[0.4,0,0.5,0.9],[0.2,0,0.4,0.5],[0.1,0,0.4,0.5]];var numDevRanges=["1","+"];var affinityMat4=[[1,0,1,1],[0.9,0,1,0.8]];'
    this.dataService.load(data);*/
    var myReader = new FileReader();
    myReader.readAsText(event.target.files[0]);
    myReader.addEventListener('loadend', (x)=> {
      //eval(x.target['result']);
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
    ";var criteriaVal="+JSON.stringify(this.dataService.getCriteriaVal())+";";
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
