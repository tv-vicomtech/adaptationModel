import { Component, OnInit } from '@angular/core';
import { Router,NavigationStart } from '@angular/router';
import { DataService } from '../shared/data.service';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';

@Component({
    selector: 'runapproach',
    templateUrl: './runapproach.component.html'
})
export class RunapproachComponent {
  dataService: DataService;

  affResults1:any[]=[];
  bestAffs1:any[]=[];

  affResults2:any[]=[];
  bestAffs2:any[]=[];

  auxResults2Out:any=[];
  auxResults2Int:any=[];

  assignments:any[]=[];

  compsInApp:any[]=[];
  devsInApp:any[]=[];

  evStep1:number=0;
  evStep2:number=0;
  evGlobal:number=0;
  evGlobalAll:number=0;

  evStep1All:number=0;
  evStep2All:number=0;
  affResults2All:any[]=[];
  bestAffs2All:any[]=[];
  bestLayoutAll:any[]=[];

  allResults:any[]=[];
  allR:any[]=[];
  allEvs:any[]=[];
  maxInd:number=0;
  minInd:number=0;


  assignmentsAll:any[]=[];
  twoStepRes:number=0;
  times11:any=0;
  times12:any=0;
  times13:any=0;
  times21:any=0;
  times22:any=0;
  newEvModel:any=0;
  newEvModelAll:any=0;
  E1:any[]=[];
  E2:any[]=[];
  E1All:any[]=[];
  E2All:any[]=[];

  s1neweval:any[]=[];

  constructor(dataService:DataService,private http: Http){
    this.dataService=dataService;
  }
  ngOnInit() {

    for(var i=0;i<this.compsInApp.length;i++){
      this.affResults1.push([]);
      for (var j=0;j<this.devsInApp.length;j++){
        this.affResults1[i].push(0);
      }
    }

  }

  calculateStep1New(){
    this.times11=performance.now();
    this.affResults1=[];
    this.evStep1=0;

    var savedDistances=[];
    var _this=this;
      this.compsInApp.forEach((c)=>{
        var cInAlld=[];
        var translations=[];
        var distances=[];

        _this.devsInApp.forEach((d)=>{
          var t=[];
          for(var i=0;i<Object.keys(_this.dataService.getCompObj()[c]["properties"]).length;i++){
            var prop=0;
            for(var j=0;j<Object.keys(_this.dataService.getDevObj()[d]["properties"]).length;j++){
              prop=prop+_this.dataService.getAffinityMat1()[i][j]*_this.dataService.getDevObj()[d]["properties"][Object.keys(_this.dataService.getDevObj()[d]["properties"])[j]];
            }
            t.push(prop);
          }
          translations.push(t);
        });
        for(var i=0;i<translations.length;i++){
          var d:any[]=[];
          for(var j=0;j<Object.keys(_this.dataService.getCompObj()[c]["properties"]).length;j++){
            d.push(translations[i][j]-_this.dataService.getCompObj()[c]["properties"][Object.keys(_this.dataService.getCompObj()[c]["properties"])[j]]);
          }
          distances.push(d);
        }
        var sumPropComps=0;
        for(var i=0;i<Object.keys(_this.dataService.getCompObj()[c]["properties"]).length;i++){
          sumPropComps=sumPropComps+_this.dataService.getCompObj()[c]["properties"][Object.keys(_this.dataService.getCompObj()[c]["properties"])[i]];
        }
        for(var i=0;i<distances.length;i++){
          var affd=0;
          for(var j=0;j<distances[i].length;j++){
            if(distances[i][j]>=0){
              affd=affd+(1*_this.dataService.getCompObj()[c]["properties"][Object.keys(_this.dataService.getCompObj()[c]["properties"])[j]]/sumPropComps);
            }
            else{
              affd=affd+((1+distances[i][j])*_this.dataService.getCompObj()[c]["properties"][Object.keys(_this.dataService.getCompObj()[c]["properties"])[j]]/sumPropComps);
            }
          }
          cInAlld.push(parseFloat(affd.toFixed(5)));
        }
        savedDistances.push(distances);


        this.affResults1.push(cInAlld);
      });

      this.times12= performance.now();

      //Obtain the index of the highest affinity

      this.bestAffs1=[];
      this.affResults1.forEach((c,i)=>{
        var max = c.reduce((acc,curr) => curr > acc ? curr : acc);
        var res = c.reduce((acc,curr,idx) => curr === max ? [...acc, idx] : acc, []);
        //in case of tie
        if(res.length>1){
            var auxArr:any=[];
            auxArr = Object.values(this.dataService.getCompObj()[this.compsInApp[i]]["properties"]);
            var maxPropInd=auxArr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            var val=0;
            var idx=0;
            for(var j=0;j<res.length;j++){

              if(j==0){
                val=savedDistances[i][res[j]].filter(num=>num>=0).reduce((total, value) => total + value, 0);
                idx=res[j];
              }
              else{
                if(savedDistances[i][res[j]].filter(num=>num>=0).reduce((total, value) => total + value, 0)<val){
                  val =savedDistances[i][res[j]].filter(num=>num>=0).reduce((total, value) => total + value, 0);
                  idx=res[j];
                }
              }

            }
            this.bestAffs1.push(idx);
        }
        else{
          this.bestAffs1.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
        }
      });
      this.assignments=[];
      this.devsInApp.forEach((d,i)=>{
        var cs=this.compsInApp.filter((el,j)=>{
          if(this.bestAffs1[j]==i)return el;
        });
        this.assignments.push([d,cs])
      });

      this.bestAffs1.forEach((ba,ind)=>{
        _this.evStep1=_this.evStep1+parseFloat(_this.affResults1[ind][ba]);
      });
      this.evStep1=(this.evStep1/this.affResults1.length);
      this.evStep1=parseFloat(this.evStep1.toFixed(5));
      this.times13=performance.now();



  }

  calculateStep2LayoutFunctions(){

    var _this=this;
    this.affResults2=[];
    this.evStep2=0;
    this.assignments.forEach((a,i)=>{
      var aInAllL=[parseFloat(_this.pipFunc(a[1].length,a[0],i,"one").affLayout.toFixed(5)),
      parseFloat(_this.splitFunc(a[1].length,a[0],i,"one").affLayout.toFixed(5)),
      parseFloat(_this.carouselFunc(a[1].length,a[0],i,"one").affLayout.toFixed(5))
      ];
      _this.affResults2.push(aInAllL);

    });
    this.bestAffs2=[];
    this.affResults2.forEach((c)=>{
      this.bestAffs2.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
    });

    this.bestAffs2.forEach((ba,ind)=>{
      _this.evStep2=_this.evStep2+parseFloat(_this.affResults2[ind][ba]);
    });
    this.evStep2=parseFloat((this.evStep2/this.affResults2.length).toFixed(5));
    this.evGlobal=parseFloat(((this.evStep1+this.evStep2)/2).toFixed(5));
    this.E1=[];
    this.E2=[];
    this.newEvModel=0;
    for (var ind=0;ind<this.assignments.length;ind++){
      var aux = 0;
      var indices = this.bestAffs1.map((e, i) => e === ind ? i : '').filter(String);
      for (var j=0;j<indices.length;j++){
        aux= aux+this.affResults1[indices[j]][ind];
      }
      this.E1.push(aux/indices.length);
      this.E2.push(this.affResults2[ind][this.bestAffs2[ind]]);
      aux=(this.affResults2[ind][this.bestAffs2[ind]]/indices.length)*aux;
      this.newEvModel=this.newEvModel+aux;
    }
    this.newEvModel=parseFloat((this.newEvModel/this.assignments.length).toFixed(5));


  }
  calculateStep2LayoutFunctionsForAll(){
    var _this=this;
    this.affResults2All=[];

    this.evStep2All=0;
    this.assignmentsAll.forEach((a,i)=>{
      var aInAllL=[parseFloat(_this.pipFunc(a[1].length,a[0],i,"all").affLayout.toFixed(5)),
      parseFloat(_this.splitFunc(a[1].length,a[0],i,"all").affLayout.toFixed(5)),
      parseFloat(_this.carouselFunc(a[1].length,a[0],i,"all").affLayout.toFixed(5))
      ];
      _this.affResults2All.push(aInAllL);

    });

    this.bestAffs2All=[];
    this.affResults2All.forEach((c)=>{
      this.bestAffs2All.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
    });
    this.bestLayoutAll=[];
    this.bestAffs2All.forEach((ba,ind)=>{
      this.bestLayoutAll.push(_this.dataService.layouts[ba]);
    });

    this.bestAffs2All.forEach((ba,ind)=>{
      _this.evStep2All=_this.evStep2All+parseFloat(_this.affResults2All[ind][ba]);
    });
    this.evStep2All=parseFloat((this.evStep2All/this.affResults2All.length).toFixed(5));
    this.evGlobalAll=parseFloat(((this.evStep1+this.evStep2All)/2).toFixed(5));

    this.newEvModelAll=0;
    var iterE1=[];
    var iterE2=[];
    for (var ind=0;ind<this.assignmentsAll.length;ind++){

      var aux=this.s1neweval[ind];
      if(this.assignmentsAll[ind][1].length>0){
        iterE1.push(aux/this.assignmentsAll[ind][1].length);
      }
      else{
        iterE1.push(0);
      }

      if(this.assignmentsAll[ind][1].length>0){
        iterE2.push(this.affResults2All[ind][this.bestAffs2All[ind]]);
        aux=(this.affResults2All[ind][this.bestAffs2All[ind]]/this.assignmentsAll[ind][1].length)*aux;
      }
      else{
        iterE2.push(0);
        aux=0;
      }
      this.newEvModelAll=this.newEvModelAll+aux;
    }

    this.newEvModelAll=parseFloat((this.newEvModelAll/this.assignmentsAll.length).toFixed(5));
    return {'all':_this.bestLayoutAll,'eval':_this.evStep2All,'newmodel':this.newEvModelAll,'E1':iterE1,'E2':iterE2}

  }
  customGridFunc(nc,dt){
    return{'affLayout': 0, 'outputCap':0,'interactivity':0};
  }
  calculateA(nc, ni, fi, scs, ss, nt, t,exp){
    var a11=1;
    var a12=1;
    var a2=1;

    //a11 always 1

    //a12 overlaps
    if(fi==0){
      a12=1;
    }
    else{
      if((nc-1)>=(fi*scs/ss)){
        a12=1-fi;
      }
      else{
        a12=1-(((nc-1)*ss)/scs);
      }
    }

    if(nc==0){
      a2=0
    }
    else{
      a2=1/Math.pow(Math.pow((nc/nt),t),exp);
    }

    var a = a11*a12*a2;
    return a;

  }
  calculateS(nc, ni, fi, scs,sc, ss, nt, t,coef){
    var s1=1;
    var s2=1;

    //s1 reducción
    if(t==1){
      s1=scs/nt;
    }
    else if(ni>0){
      if(nc<1+ni){
        s1=(1+(fi/scs)*(nc-1))/nc;
      }
      else{
        if(nc==1){
          s1=1/coef;
        }
        else{
          s1=((1+(fi/scs)*(ni-1))/(ni))/Math.pow(coef,nc-ni);

        }
      }
    }
    else{
      if(scs/nc>=sc){
        s1=scs/nc
      }else{
        s1=this.calculateS(nc-1, ni, fi, scs, sc, ss, nt, t,coef)/coef;
      }
    }
    //s2 distorsión/deformación no afecta
    s2 = 1;

    var s=s1*s2;
    return s;

  }
  calculateE(nc,fi,t)
  {
    var e=1;
    //carousel
    if(t==1){
      e=1;
    }
    //pip
    else if(fi>0){
      e=1;
    }
    //split
    else{
      if(nc==0){
        e=0;
      }
      else{
        e =1-(Math.ceil(Math.sqrt(nc))*Math.round(Math.sqrt(nc))-nc)/(Math.ceil(Math.sqrt(nc))*Math.round(Math.sqrt(nc)));
      }
    }
    return e;
  }
  splitFunc(nc,dt,a,mode){
    if(nc==0){
      return{'affLayout': 0};
    }
    if(mode == "all"){
      var assigns = this.assignmentsAll;
    }
    else if(mode=='one'){
      var assigns = this.assignments;
    }

    var sc=1/this.dataService.getScVal(dt);
    var ss=sc/this.dataService.getSsVal(dt);
    var scs = 1;
    var fi=0;
    var ni=0;

    var t=0;
    var nt=Math.round(scs/sc);
    var coef_split=4;

    var A_split = this.calculateA(nc,ni, fi, scs, ss, nt, t,this.dataService.getCoefValue("coef_split"));

    var S_split = this.calculateS(nc,ni, fi, scs,sc, ss, nt, t, this.dataService.getCoefValue("coef_split"));

    var E_split = this.calculateE(nc,fi,t);

    var affLayout =Math.pow(A_split,this.dataService.getCriteriaValue("A"))*Math.pow(S_split,this.dataService.getCriteriaValue("S"))*Math.pow(E_split,this.dataService.getCriteriaValue("E"))*1;
    return{'affLayout': affLayout};

  }
  pipFunc(nc,dt,a,mode){
    if(nc==0){
      return{'affLayout': 0};
    }
    if(mode == "all"){
      var assigns = this.assignmentsAll;
    }
    else if(mode=='one'){
      var assigns = this.assignments;
    }

    var sc=1/this.dataService.getScVal(dt);
    var ss=sc/this.dataService.getSsVal(dt);
    var scs=1;
    var fi=1/3;

    var ni=Math.round(fi*scs/ss);
    var t=0;
    var nt=1;
    var coef_pip = 4;


    var A_pip = this.calculateA(nc,ni, fi, scs, ss, nt, t,this.dataService.getCoefValue("coef_pip"));

    var S_pip = this.calculateS(nc,ni, fi, scs, sc, ss, nt, t,this.dataService.getCoefValue("coef_pip"));

    var E_pip = this.calculateE(nc,fi,t);


    var affLayout =Math.pow(A_pip,this.dataService.getCriteriaValue("A"))*Math.pow(S_pip,this.dataService.getCriteriaValue("S"))*Math.pow(E_pip,this.dataService.getCriteriaValue("E"))*1;
    return{'affLayout': affLayout};


  }
  carouselFunc(nc,dt,a,mode){
    if(nc==0){
      return{'affLayout': 0};
    }
    if(mode == "all"){
      var assigns = this.assignmentsAll;
    }
    else if(mode=='one'){
      var assigns = this.assignments;
    }

    var sc=1/this.dataService.getScVal(dt);
    var ss=sc/this.dataService.getSsVal(dt);
    var scs=1;
    var fi=0;
    var ni=0;

    var t=1;
    var nt=1;
    var coef_car=0.4;

    var A_carousel = this.calculateA(nc,ni, fi, scs, ss, nt, t,this.dataService.getCoefValue("coef_car"));

    var S_carousel = this.calculateS(nc,ni, fi, scs,sc, ss, nt, t,this.dataService.getCoefValue("coef_car"));

    var E_carousel = this.calculateE(nc,fi,t);

    var affLayout =Math.pow(A_carousel,this.dataService.getCriteriaValue("A"))*Math.pow(S_carousel,this.dataService.getCriteriaValue("S"))*Math.pow(E_carousel,this.dataService.getCriteriaValue("E"))*1;
    return{'affLayout': affLayout};

  }

  tryAllStep1(){
    var t1=performance.now();
    var xhr = new XMLHttpRequest();
    var url = "http://192.168.10.4:5002/combinations";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var _this=this;
    _this.allResults=[];
    _this.allR=[];
    _this.allEvs=[];
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);

            _this.calculateStep1New();
            for(var i=0;i<json.length;i++){

              _this.assignmentsAll=[];
              _this.evStep1All=0;
              _this.s1neweval=[];
              for(var j=0;j<json[0].length;j++){
                _this.assignmentsAll.push([_this.devsInApp[j],json[i][j]]);
                var auxev=0;
                for(var k=0;k<json[i][j].length;k++){
                  _this.evStep1All=_this.evStep1All+parseFloat(_this.affResults1[_this.compsInApp.indexOf(json[i][j][k])][j]);
                  auxev=auxev+_this.affResults1[_this.compsInApp.indexOf(json[i][j][k])][j]
                }
                _this.s1neweval.push(auxev);

              }

              _this.evStep1All=parseFloat((_this.evStep1All/_this.affResults1.length).toFixed(5));
              var res=_this.calculateStep2LayoutFunctionsForAll();
              _this.allR.push(
                [
                _this.assignmentsAll,
                _this.evStep1All,
                res['all'],
                res['eval'],
                parseFloat(((_this.evStep1All+_this.evStep2All)/2).toFixed(5)),
                res['newmodel'],
                res['E1'],
                res['E2']
              ]);

              _this.allEvs.push(res['newmodel']);
              if(i==json.length-1){
                console.log('Arrived');
              }
            }
            _this.allR.sort(function(a,b){if(a[5]<b[5]){return 1};if(a[5]>b[5]){return -1;}})
            _this.allEvs.sort(function(a,b){if(a<b){return 1};if(a>b){return -1;}})
            _this.maxInd=_this.allEvs.indexOf(Math.max.apply(Math, _this.allEvs))
            _this.minInd=_this.allEvs.indexOf(Math.min.apply(Math, _this.allEvs))
            _this.allResults=_this.allR;
            var t2=performance.now();


        }
    }
    var data = JSON.stringify({"items":this.compsInApp,"boxes":this.devsInApp.length});
    xhr.send(data);
  }
  runSelectedApproach(){
    this.calculateStep1New();
    this.calculateStep2LayoutFunctions();
  }
  addCompToApp(val:any){
    this.compsInApp.push(val);
  }
  addDevToApp(val:any){
    this.devsInApp.push(val);
  }
  delete(){
    if(event.srcElement.id.indexOf('_deletefromcompsinapp_')>0){
      this.compsInApp.splice(this.compsInApp.indexOf(event.srcElement.id.split('_deletefromcompsinapp_')[0]),1);
      this.affResults1=[];
      this.bestAffs1=[];
    }
    else if(event.srcElement.id.indexOf('_deletefromdevsinapp_')>0){
      this.devsInApp.splice(this.devsInApp.indexOf(event.srcElement.id.split('_deletefromdevsinapp_')[0]),1);
      this.affResults1=[];
      this.bestAffs1=[];
    }

  }
}
