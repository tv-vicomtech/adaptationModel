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

  assignments:any[]=[];

  compsInApp:any[]=[];
  devsInApp:any[]=[];

  devTypeFactor:number=0.29;
  compNumFactor:number=0.26;
  compTypeFactor:number=0.225;
  devNumFactor:number=0.225;

  evStep1:number=0;
  evStep2:number=0;
  evGlobal:number=0;

  evStep1All:number=0;
  evStep2All:number=0;
  affResults2All:any[]=[];
  bestAffs2All:any[]=[];
  bestLayoutAll:any[]=[];

  allResults:any[]=[];
  allEvs:any[]=[];
  maxInd:number=0;
  minInd:number=0;

  compTypeAffl:number=0;
  compNumAffl:number=0;
  devNumAffl:number=0;
  devTypeAffl:number=0;
  assignmentsAll:any[]=[];
  constructor(dataService:DataService,private http: Http){
    this.dataService=dataService;
  }
  ngOnInit() {

    /*var data='var compProp={"main":{"attention":1,"interactivity":0},"video":{"attention":0.7,"interactivity":0.2},"banner":{"attention":0.6,"interactivity":0},"staticData":{"attention":0.5,"interactivity":0.2},"dynamicData":{"attention":0.5,"interactivity":1},"social":{"attention":0.3,"interactivity":1},"UGC":{"attention":0.3,"interactivity":1},"advertisement":{"attention":0.2,"interactivity":0}};var devProp={"mobile":{"screensize":0.2,"inputCapabilities":0.6},"tablet":{"screensize":0.4,"inputCapabilities":0.7},"computer":{"screensize":0.6,"inputCapabilities":1},"smartTv":{"screensize":1,"inputCapabilities":0.2}};var affinityMat=[[1,0.1],[0.2,1]];var layoutProp={"pip":{"scroll":0,"overlap":1,"emptySpace":0},"customGrid":{"scroll":0.7,"overlap":0,"emptySpace":0.7},"divided":{"scroll":0,"overlap":0,"emptySpace":0.7},"carousel":{"scroll":1,"overlap":0.9,"emptySpace":0.1}};var affinityMat2=[[0.1,0.1,0.5],[1,1,1],[0,0,1],[0,0,1]];var numCompRanges=["0","1","2","3","4","5","6","7","8","+"];var affinityMat3=[[1,1,1,1],[1,0,1,1],[0.9,0,1,0.8],[0.9,0,0.7,0.7],[0.9,0,0.9,0.8],[0.8,0,0.6,0.8],[0.6,0,0.8,0.9],[0.4,0,0.5,0.9],[0.2,0,0.4,0.5],[0.1,0,0.4,0.5]];var numDevRanges=["1","+"];var affinityMat4=[[1,0,1,1],[0.9,0,1,0.8]];'
    this.dataService.load(data);*/

    for(var i=0;i<this.compsInApp.length;i++){
      this.affResults1.push([]);
      for (var j=0;j<this.devsInApp.length;j++){
        this.affResults1[i].push(0);
      }
    }
    /*for(var i=0;i<this.dataService.assignmentProps.length;i++){
      this.dataService.pushAffinityMat2();

    }*/

  }
  calculateStep1(){
    this.affResults1=[];
    this.evStep1=0;


    var _this=this;
      this.compsInApp.forEach((c)=>{
        var cInAlld=[];
        var sumPropComps=0;
        for(var i=0;i<Object.keys(_this.dataService.getCompObj()[c]).length;i++){
          sumPropComps=sumPropComps+_this.dataService.getCompObj()[c][Object.keys(_this.dataService.getCompObj()[c])[i]];
        }
        _this.devsInApp.forEach((d)=>{
          var affd=0;
          var sumPropDevs=0;
          for(var i=0;i<Object.keys(_this.dataService.getDevObj()[d]).length;i++){
            sumPropDevs=sumPropDevs+_this.dataService.getDevObj()[d][Object.keys(_this.dataService.getDevObj()[d])[i]];
          }
          for(var i=0;i<Object.keys(_this.dataService.getCompObj()[c]).length;i++){
            for(var j=0;j<Object.keys(_this.dataService.getDevObj()[d]).length;j++){
              affd=affd+_this.dataService.getAffinityMat1()[i][j]*
              ((_this.dataService.getCompObj()[c][Object.keys(_this.dataService.getCompObj()[c])[i]])/sumPropComps)*
              (_this.dataService.getDevObj()[d][Object.keys(_this.dataService.getDevObj()[d])[j]]/sumPropDevs);
            }
          }
          //affd=affd/(Object.keys(_this.dataService.getCompObj()[c]).length*Object.keys(_this.dataService.getDevObj()[d]).length)
          cInAlld.push(affd.toFixed(2));
        });
        this.affResults1.push(cInAlld);
      });

      //Obtain the index of the highest affinity

      this.bestAffs1=[];
      this.affResults1.forEach((c)=>{
        this.bestAffs1.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
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
      this.evStep1=parseFloat(this.evStep1.toFixed(2));

  }
  calculateStep1New(){
    this.affResults1=[];
    this.evStep1=0;


    var _this=this;
      this.compsInApp.forEach((c)=>{
        var cInAlld=[];
        var translations=[];
        var distances=[];
        _this.devsInApp.forEach((d)=>{
          var t=[];
          for(var i=0;i<Object.keys(_this.dataService.getCompObj()[c]).length;i++){
            var prop=0;
            for(var j=0;j<Object.keys(_this.dataService.getDevObj()[d]).length;j++){
              prop=prop+_this.dataService.getAffinityMat1()[i][j]*_this.dataService.getDevObj()[d][Object.keys(_this.dataService.getDevObj()[d])[j]];
            }
            t.push(prop);
          }
          translations.push(t);
        });
        for(var i=0;i<translations.length;i++){
          var d:any[]=[];
          for(var j=0;j<Object.keys(_this.dataService.getCompObj()[c]).length;j++){
            d.push(translations[i][j]-_this.dataService.getCompObj()[c][Object.keys(_this.dataService.getCompObj()[c])[j]]);
          }
          distances.push(d);
        }
        var sumPropComps=0;
        for(var i=0;i<Object.keys(_this.dataService.getCompObj()[c]).length;i++){
          sumPropComps=sumPropComps+_this.dataService.getCompObj()[c][Object.keys(_this.dataService.getCompObj()[c])[i]];
        }
        for(var i=0;i<distances.length;i++){
          var affd=0;
          for(var j=0;j<distances[i].length;j++){
            if(distances[i][j]>=0){
              affd=affd+(1*_this.dataService.getCompObj()[c][Object.keys(_this.dataService.getCompObj()[c])[j]]/sumPropComps);
            }
            else{
              affd=affd+((1+distances[i][j])*_this.dataService.getCompObj()[c][Object.keys(_this.dataService.getCompObj()[c])[j]]/sumPropComps);
            }
          }
          cInAlld.push(parseFloat(affd.toFixed(2)));
        }
        //calcular afinidad

        this.affResults1.push(cInAlld);
      });


      //Obtain the index of the highest affinity

      this.bestAffs1=[];
      this.affResults1.forEach((c)=>{
        this.bestAffs1.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
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
      this.evStep1=parseFloat(this.evStep1.toFixed(2));

  }
  calculateStep2(){
    this.affResults2=[];
    this.evStep2=0;

    var _this=this;
    this.assignments.forEach((a)=>{
      var aInAllL=[];
      this.dataService.layouts.forEach((l)=>{
        var sumPropLay=0;
        for(var p=0;p<Object.keys(_this.dataService.getLayoutObj()[l]).length;p++){
          sumPropLay=sumPropLay+_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[p]];
        }

        _this.compTypeAffl=0;
        //var cont=0;
        for(var i=0;i<a[1].length;i++){
          var sumPropComps=0;
          for(var p=0;p<Object.keys(_this.dataService.getCompObj()[a[1][i]]).length;p++){
            sumPropComps=sumPropComps+_this.dataService.getCompObj()[a[1][i]][Object.keys(_this.dataService.getCompObj()[a[1][i]])[p]];
          }
          for(var j=0;j<Object.keys(_this.dataService.getLayoutObj()[l]).length;j++){
            for (var k=0;k<_this.dataService.compProps.length;k++){
              _this.compTypeAffl=_this.compTypeAffl+_this.dataService.getAffinityMat2()[k][j]*
              (_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]]/sumPropLay)*
              (_this.dataService.getCompObj()[a[1][i]][Object.keys(_this.dataService.getCompObj()[a[1][i]])[k]]/sumPropComps);
              //cont=cont+1;
            }
          }
        }

        if(a[1].length>0){
          _this.compTypeAffl=_this.compTypeAffl/a[1].length;
        }
        else{
          _this.compTypeAffl=0;
        }




        _this.devTypeAffl=0;
        //cont=0;
        var sumPropDevs=0;
        for(var p=0;p<Object.keys(_this.dataService.getDevObj()[a[0]]).length;p++){
          sumPropDevs=sumPropDevs+_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[p]];
        }

        for(var j=0;j<Object.keys(this.dataService.getLayoutObj()[l]).length;j++){
          for (var k=0;k<this.dataService.devProps.length;k++){
            _this.devTypeAffl=_this.devTypeAffl+_this.dataService.getAffinityMat2()[k+_this.dataService.compProps.length][j]*
            (_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]]/sumPropLay)*
            (_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[k]]/sumPropDevs);
            //cont=cont+1;
          }
        }

        _this.devTypeAffl=_this.devTypeAffl;

        _this.compNumAffl=0;

        if(_this.dataService.numCompRanges.indexOf(String(a[1].length))>-1){
          _this.compNumAffl=_this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.indexOf(String(a[1].length))][_this.dataService.layouts.indexOf(l)];
        }
        else if(a[1].length>_this.dataService.numCompRanges[_this.dataService.numCompRanges.length-2]){
          _this.compNumAffl=_this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.length-1][_this.dataService.layouts.indexOf(l)];
        }

        _this.devNumAffl=0;

        if(_this.dataService.numDevRanges.indexOf(String(_this.assignments.length))>-1){
          _this.devNumAffl=this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.indexOf(String(_this.assignments.length))][_this.dataService.layouts.indexOf(l)];
        }
        else if(this.assignments.length>_this.dataService.numDevRanges[_this.dataService.numDevRanges.length-2]){
          _this.devNumAffl=this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.length-1][_this.dataService.layouts.indexOf(l)];
        }


      /*  var compNumAffl=0;
        cont=0;
        for (var i=0;i<_this.dataService.numCompRanges.length;i++){
          var initVal=parseInt(_this.dataService.numCompRanges[i].split(',')[0].split('[')[1]);
          var finVal=parseInt(_this.dataService.numCompRanges[i].split(',')[1].split(']')[0]);
          if(a[1].length>=initVal && a[1].length<=finVal){
            for(var k=0;k<_this.dataService.layoutProps.length;k++){
              compNumAffl=compNumAffl+_this.dataService.getAffinityMat2()[i+_this.dataService.comps.length*_this.dataService.compProps.length+_this.dataService.devs.length*_this.dataService.devProps.length][k]*
              _this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[k]]*
              _this.dataService.getNumCompRanges()[_this.dataService.numCompRanges[i]];
              cont=cont+1;
            }
          }
        }
        if(cont>0){
          compNumAffl=compNumAffl*this.compNumFactor/cont;
        }
        var devNumAffl=0;
        cont=0;
        for (var i=0;i<_this.dataService.numDevRanges.length;i++){
          var initVal=parseInt(_this.dataService.numDevRanges[i].split(',')[0].split('[')[1]);
          var finVal=parseInt(_this.dataService.numDevRanges[i].split(',')[1].split(']')[0]);
          if(a.length>=initVal && a.length<=finVal){
            for(var k=0;k<_this.dataService.layoutProps.length;k++){
              devNumAffl=devNumAffl+_this.dataService.getAffinityMat2()[i+_this.dataService.numCompRanges.length+_this.dataService.comps.length*_this.dataService.compProps.length+_this.dataService.devs.length*_this.dataService.devProps.length][k]*
              _this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[k]]*
              _this.dataService.getNumDevRanges()[_this.dataService.numDevRanges[i]];
              cont=cont+1;
            }
          }
        }
        if(cont>0){
          devNumAffl=devNumAffl*this.devNumFactor/cont;
        }*/

        aInAllL.push((this.compTypeFactor*_this.compTypeAffl+this.devTypeFactor*_this.devTypeAffl+this.compNumFactor*_this.compNumAffl+this.devNumFactor*_this.devNumAffl).toFixed(2));
        console.log(l);
        console.log("compTypeFactor:"+_this.compTypeFactor+
        " compTypeAff:"+_this.compTypeAffl+
        " devTypeFactor:"+this.devTypeFactor+
        " devTypeAff:"+_this.devTypeAffl+
        "compNumFactor:"+_this.compNumFactor+
        " compNumAff:"+_this.compNumAffl+
        " devNumFactor:"+this.devNumFactor+
        " devNumAff:"+_this.devNumAffl);

      });
      this.affResults2.push(aInAllL);
    });

    this.bestAffs2=[];
    this.affResults2.forEach((c)=>{
      this.bestAffs2.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
    });

    this.bestAffs2.forEach((ba,ind)=>{
      _this.evStep2=_this.evStep2+parseFloat(_this.affResults2[ind][ba]);
    });
    this.evStep2=parseFloat((this.evStep2/this.affResults2.length).toFixed(2));
    this.evGlobal=parseFloat(((this.evStep1+this.evStep2)/2).toFixed(2));
  }

  calculateStep2New(){
    this.affResults2=[];
    this.evStep2=0;

    var _this=this;
    this.assignments.forEach((a)=>{
      var aInAllL=[];

      var translationsComps=[];
      var translationsDevs=[];
      var distancesComps=[];
      var distancesDevs=[];

        this.dataService.layouts.forEach((l)=>{

              if(a[1].length>0){
                var t=[];
                for(var i=0;i<Object.keys(_this.dataService.getCompObj()[a[1][0]]).length;i++){
                  var prop=0;
                  for(var j=0;j<Object.keys(_this.dataService.getLayoutObj()[l]).length;j++){
                    prop=prop+_this.dataService.getAffinityMat2()[i][j]*_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]];
                  }
                  t.push(prop);
                }
                translationsComps.push(t);
              }



              var t=[];
              for(var i=0;i<Object.keys(_this.dataService.getDevObj()[a[0]]).length;i++){
                var prop=0;
                for(var j=0;j<Object.keys(_this.dataService.getLayoutObj()[l]).length;j++){
                  prop=prop+_this.dataService.getAffinityMat2()[i+_this.dataService.compProps.length][j]*_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]];
                }
                t.push(prop);
              }
              translationsDevs.push(t);
        });
        if(a[1].length>0){
          for(var i=0;i<translationsComps.length;i++){
            var d:any[]=[];
            for(var k=0;k<a[1].length;k++){
              d.push([]);
              for(var j=0;j<Object.keys(_this.dataService.getCompObj()[a[1][k]]).length;j++){
                d[k].push(translationsComps[i][j]-_this.dataService.getCompObj()[a[1][k]][Object.keys(_this.dataService.getCompObj()[a[1][k]])[j]]);
              }
            }
            distancesComps.push(d);
          }
        }

        for(var i=0;i<translationsDevs.length;i++){
          var d:any[]=[];
          for(var j=0;j<Object.keys(_this.dataService.getDevObj()[a[0]]).length;j++){
              d.push(translationsDevs[i][j]-_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[j]]);
          }
          distancesDevs.push(d);
        }
        if(a[1].length>0){
          var affCompsAllLayouts=[];
          for(var i=0;i<distancesComps.length;i++){
            var affl=0;
            for(var j=0;j<distancesComps[i].length;j++){
              var affc=0;
              var sumPropComps=0;
              for(var p=0;p<Object.keys(_this.dataService.getCompObj()[a[1][j]]).length;p++){
                sumPropComps=sumPropComps+_this.dataService.getCompObj()[a[1][j]][Object.keys(_this.dataService.getCompObj()[a[1][j]])[p]];
              }
              for (var k=0;k<distancesComps[i][j].length;k++){
                if(distancesComps[i][j]>=0){
                  affc=affc+(1*_this.dataService.getCompObj()[a[1][j]][Object.keys(_this.dataService.getCompObj()[a[1][j]])[k]]/sumPropComps);
                }
                else{
                  affc=affc+((1+distancesComps[i][j][k])*_this.dataService.getCompObj()[a[1][j]][Object.keys(_this.dataService.getCompObj()[a[1][j]])[k]]/sumPropComps);
                }
              }
              affl=affl+affc;
            }
            affCompsAllLayouts.push(_this.compTypeFactor*(affl/a[1].length));
          }
        }
        else{
          for(var i=0;i<_this.dataService.layouts.length;i++){
            affCompsAllLayouts.push(0)
          }
        }


        var affDevsAllLayouts=[];
        for(var i=0;i<distancesDevs.length;i++){
          var affl=0;

          var sumPropDevs=0;
          for(var p=0;p<Object.keys(_this.dataService.getDevObj()[a[0]]).length;p++){
            sumPropDevs=sumPropDevs+_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[p]];
          }
          for (var k=0;k<distancesDevs[i].length;k++){
            if(distancesDevs[i][k]>=0){
              affl=affl+(1*_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[k]]/sumPropDevs);
            }
            else{
              affl=affl+((1+distancesDevs[i][k])*_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[k]]/sumPropDevs);
            }
          }

          affDevsAllLayouts.push(_this.devTypeFactor*affl);
        }

        var affNumCompsAllLayouts=[];
        var affNumDevsAllLayouts=[];
        for(var i=0;i<_this.dataService.layouts.length;i++){
          if(_this.dataService.numCompRanges.indexOf(String(a[1].length))>-1){
            affNumCompsAllLayouts.push(_this.compNumFactor*_this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.indexOf(String(a[1].length))][i]);
          }
          else if(a[1].length>_this.dataService.numCompRanges[_this.dataService.numCompRanges.length-2]){
            affNumCompsAllLayouts.push(_this.compNumFactor*_this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.length-1][i]);
          }

          if(_this.dataService.numDevRanges.indexOf(String(_this.assignments.length))>-1){
            affNumDevsAllLayouts.push(_this.devNumFactor*this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.indexOf(String(_this.assignments.length))][i]);
          }
          else if(this.assignments.length>_this.dataService.numDevRanges[_this.dataService.numDevRanges.length-2]){
            affNumDevsAllLayouts.push(_this.devNumFactor*this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.length-1][i]);
          }
        }

        aInAllL=[];
        for(var i=0;i<_this.dataService.layouts.length;i++){
            aInAllL.push(parseFloat((affCompsAllLayouts[i]+affDevsAllLayouts[i]+affNumCompsAllLayouts[i]+affNumDevsAllLayouts[i]).toFixed(2)));
        }
        _this.affResults2.push(aInAllL);
      });
      console.log('aAA');

      this.bestAffs2=[];
      this.affResults2.forEach((c)=>{
        this.bestAffs2.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
      });

      this.bestAffs2.forEach((ba,ind)=>{
        _this.evStep2=_this.evStep2+parseFloat(_this.affResults2[ind][ba]);
      });
      this.evStep2=parseFloat((this.evStep2/this.affResults2.length).toFixed(2));
      this.evGlobal=parseFloat(((this.evStep1+this.evStep2)/2).toFixed(2));

  }
  calculateStep2ForAllNew(){
    this.affResults2All=[];
    this.evStep2All=0;

    var _this=this;
    this.assignmentsAll.forEach((a)=>{
      var aInAllL=[];

      var translationsComps=[];
      var translationsDevs=[];
      var distancesComps=[];
      var distancesDevs=[];

        this.dataService.layouts.forEach((l)=>{

              if(a[1].length>0){
                var t=[];
                for(var i=0;i<Object.keys(_this.dataService.getCompObj()[a[1][0]]).length;i++){
                  var prop=0;
                  for(var j=0;j<Object.keys(_this.dataService.getLayoutObj()[l]).length;j++){
                    prop=prop+_this.dataService.getAffinityMat2()[i][j]*_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]];
                  }
                  t.push(prop);
                }
                translationsComps.push(t);
              }



              var t=[];
              for(var i=0;i<Object.keys(_this.dataService.getDevObj()[a[0]]).length;i++){
                var prop=0;
                for(var j=0;j<Object.keys(_this.dataService.getLayoutObj()[l]).length;j++){
                  prop=prop+_this.dataService.getAffinityMat2()[i+_this.dataService.compProps.length][j]*_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]];
                }
                t.push(prop);
              }
              translationsDevs.push(t);
        });

        if(a[1].length>0){
          for(var i=0;i<translationsComps.length;i++){
            var d:any[]=[];
            for(var k=0;k<a[1].length;k++){
              d.push([]);
              for(var j=0;j<Object.keys(_this.dataService.getCompObj()[a[1][k]]).length;j++){
                d[k].push(translationsComps[i][j]-_this.dataService.getCompObj()[a[1][k]][Object.keys(_this.dataService.getCompObj()[a[1][k]])[j]]);
              }
            }
            distancesComps.push(d);
          }
        }

        for(var i=0;i<translationsDevs.length;i++){
          var d:any[]=[];
          for(var j=0;j<Object.keys(_this.dataService.getDevObj()[a[0]]).length;j++){
              d.push(translationsDevs[i][j]-_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[j]]);
          }
          distancesDevs.push(d);
        }
        var affCompsAllLayouts=[];
        if(a[1].length>0){
          for(var i=0;i<distancesComps.length;i++){
            var affl=0;
            for(var j=0;j<distancesComps[i].length;j++){
              var affc=0;
              var sumPropComps=0;
              for(var p=0;p<Object.keys(_this.dataService.getCompObj()[a[1][j]]).length;p++){
                sumPropComps=sumPropComps+_this.dataService.getCompObj()[a[1][j]][Object.keys(_this.dataService.getCompObj()[a[1][j]])[p]];
              }
              for (var k=0;k<distancesComps[i][j].length;k++){
                if(distancesComps[i][j]>=0){
                  affc=affc+(1*_this.dataService.getCompObj()[a[1][j]][Object.keys(_this.dataService.getCompObj()[a[1][j]])[k]]/sumPropComps);
                }
                else{
                  affc=affc+((1+distancesComps[i][j][k])*_this.dataService.getCompObj()[a[1][j]][Object.keys(_this.dataService.getCompObj()[a[1][j]])[k]]/sumPropComps);
                }
              }
              affl=affl+affc;
            }
            affCompsAllLayouts.push(_this.compTypeFactor*(affl/a[1].length));
          }
        }
        else{
          for(var i=0;i<_this.dataService.layouts.length;i++){
            affCompsAllLayouts.push(0)
          }
        }


        var affDevsAllLayouts=[];
        for(var i=0;i<distancesDevs.length;i++){
          var affl=0;

          var sumPropDevs=0;
          for(var p=0;p<Object.keys(_this.dataService.getDevObj()[a[0]]).length;p++){
            sumPropDevs=sumPropDevs+_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[p]];
          }
          for (var k=0;k<distancesDevs[i].length;k++){
            if(distancesDevs[i][k]>=0){
              affl=affl+(1*_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[k]]/sumPropDevs);
            }
            else{
              affl=affl+((1+distancesDevs[i][k])*_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[k]]/sumPropDevs);
            }
          }

          affDevsAllLayouts.push(_this.devTypeFactor*affl);
        }

        var affNumCompsAllLayouts=[];
        var affNumDevsAllLayouts=[];
        for(var i=0;i<_this.dataService.layouts.length;i++){
          if(_this.dataService.numCompRanges.indexOf(String(a[1].length))>-1){
            affNumCompsAllLayouts.push(_this.compNumFactor*_this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.indexOf(String(a[1].length))][i]);
          }
          else if(a[1].length>_this.dataService.numCompRanges[_this.dataService.numCompRanges.length-2]){
            affNumCompsAllLayouts.push(_this.compNumFactor*_this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.length-1][i]);
          }

          if(_this.dataService.numDevRanges.indexOf(String(_this.assignmentsAll.length))>-1){
            affNumDevsAllLayouts.push(_this.devNumFactor*this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.indexOf(String(_this.assignmentsAll.length))][i]);
          }
          else if(this.assignments.length>_this.dataService.numDevRanges[_this.dataService.numDevRanges.length-2]){
            affNumDevsAllLayouts.push(_this.devNumFactor*this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.length-1][i]);
          }
        }

        aInAllL=[];
        for(var i=0;i<_this.dataService.layouts.length;i++){
            aInAllL.push(parseFloat((affCompsAllLayouts[i]+affDevsAllLayouts[i]+affNumCompsAllLayouts[i]+affNumDevsAllLayouts[i]).toFixed(2)));
        }
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
      this.evStep2All=parseFloat((this.evStep2All/this.affResults2All.length).toFixed(2));
      //this.evGlobal=parseFloat(((this.evStep1+this.evStep2All)/2).toFixed(2));
      return {'all':_this.bestLayoutAll,'eval':_this.evStep2All}
  }

  calculateStep2ForAll(){
    this.affResults2All=[];
    this.evStep2All=0;

    var _this=this;
    this.assignmentsAll.forEach((a)=>{
      var aInAllL=[];
      this.dataService.layouts.forEach((l)=>{
        var sumPropLay=0;
        for(var p=0;p<Object.keys(_this.dataService.getLayoutObj()[l]).length;p++){
          sumPropLay=sumPropLay+_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[p]];
        }

        var compTypeAffl=0;
        //var cont=0;
        for(var i=0;i<a[1].length;i++){
          var sumPropComps=0;
          for(var p=0;p<Object.keys(_this.dataService.getCompObj()[a[1][i]]).length;p++){
            sumPropComps=sumPropComps+_this.dataService.getCompObj()[a[1][i]][Object.keys(_this.dataService.getCompObj()[a[1][i]])[p]];
          }
          for(var j=0;j<Object.keys(_this.dataService.getLayoutObj()[l]).length;j++){
            for (var k=0;k<_this.dataService.compProps.length;k++){
              compTypeAffl=compTypeAffl+_this.dataService.getAffinityMat2()[k][j]*
              (_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]]/sumPropLay)*
              (_this.dataService.getCompObj()[a[1][i]][Object.keys(_this.dataService.getCompObj()[a[1][i]])[k]]/sumPropComps);
              //cont=cont+1;
            }
          }
        }

        if(a[1].length>0){
          compTypeAffl=compTypeAffl/a[1].length;
        }
        else{
          compTypeAffl=0;
        }




        var devTypeAffl=0;
        //cont=0;
        var sumPropDevs=0;
        for(var p=0;p<Object.keys(_this.dataService.getDevObj()[a[0]]).length;p++){
          sumPropDevs=sumPropDevs+_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[p]];
        }

        for(var j=0;j<Object.keys(this.dataService.getLayoutObj()[l]).length;j++){
          for (var k=0;k<this.dataService.devProps.length;k++){
            devTypeAffl=devTypeAffl+_this.dataService.getAffinityMat2()[k+_this.dataService.compProps.length][j]*
            (_this.dataService.getLayoutObj()[l][Object.keys(_this.dataService.getLayoutObj()[l])[j]]/sumPropLay)*
            (_this.dataService.getDevObj()[a[0]][Object.keys(_this.dataService.getDevObj()[a[0]])[k]]/sumPropDevs);
            //cont=cont+1;
          }
        }

        devTypeAffl=devTypeAffl;

        var compNumAffl=0;

        if(_this.dataService.numCompRanges.indexOf(String(a[1].length))>-1){
          compNumAffl=this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.indexOf(String(a[1].length))][_this.dataService.layouts.indexOf(l)];
        }
        else if(a[1].length>_this.dataService.numCompRanges[_this.dataService.numCompRanges.length-2]){
          compNumAffl=this.dataService.getAffinityMat3()[_this.dataService.numCompRanges.length-1][_this.dataService.layouts.indexOf(l)];
        }

        var devNumAffl=0;

        if(_this.dataService.numDevRanges.indexOf(String(this.assignmentsAll.length))>-1){
          devNumAffl=this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.indexOf(String(this.assignmentsAll.length))][_this.dataService.layouts.indexOf(l)];
        }
        else if(this.assignmentsAll.length>_this.dataService.numDevRanges[_this.dataService.numDevRanges.length-2]){
          devNumAffl=this.dataService.getAffinityMat4()[_this.dataService.numDevRanges.length-1][_this.dataService.layouts.indexOf(l)];
        }


        aInAllL.push((this.compTypeFactor*compTypeAffl+this.devTypeFactor*devTypeAffl+this.compNumFactor*compNumAffl+this.devNumFactor*devNumAffl).toFixed(2));

        console.log(l);
        console.log("compTypeFactor:"+_this.compTypeFactor+
        " compTypeAff:"+_this.compTypeAffl+
        " devTypeFactor:"+this.devTypeFactor+
        " devTypeAff:"+_this.devTypeAffl+
        "compNumFactor:"+_this.compNumFactor+
        " compNumAff:"+_this.compNumAffl+
        " devNumFactor:"+this.devNumFactor+
        " devNumAff:"+_this.devNumAffl);
      });
      this.affResults2All.push(aInAllL);
    });

    this.bestAffs2All=[];
    this.affResults2All.forEach((c)=>{
      _this.bestAffs2All.push(c.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0));
    });

    this.bestAffs2All.forEach((ba,ind)=>{
      _this.evStep2All=_this.evStep2All+parseFloat(_this.affResults2All[ind][ba]);
    });
    this.bestLayoutAll=[];
    this.bestAffs2All.forEach((ba,ind)=>{
      this.bestLayoutAll.push(_this.dataService.layouts[ba]);
    });
    this.evStep2All=parseFloat((this.evStep2All/this.affResults2All.length).toFixed(2));
    //this.evGlobal=parseFloat(((this.evStep1+this.evStep2)/2).toFixed(2));
    return {'all':_this.bestLayoutAll,'eval':_this.evStep2All}
  }

  tryAllStep1(){

    var xhr = new XMLHttpRequest();
    var url = "http://127.0.0.1:5002/combinations";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    var _this=this;
    _this.allResults=[];
    _this.allEvs=[];
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);

            for(var i=0;i<json.length;i++){
              console.log('Iteration:'+i+" ------------------------------------------------------------------------------");
              _this.assignmentsAll=[];
              _this.evStep1All=0;
              for(var j=0;j<json[0].length;j++){
                _this.assignmentsAll.push([_this.devsInApp[j],json[i][j]]);
                for(var k=0;k<json[i][j].length;k++){
                  _this.evStep1All=_this.evStep1All+parseFloat(_this.affResults1[_this.compsInApp.indexOf(json[i][j][k])][j]);
                }

              }
              _this.evStep1All=parseFloat((_this.evStep1All/_this.affResults1.length).toFixed(2));
              var res=_this.calculateStep2ForAllNew();
              _this.allResults.push(
                [
                _this.assignmentsAll,
                _this.evStep1All,
                res['all'],
                res['eval'],
                parseFloat(((_this.evStep1All+_this.evStep2All)/2).toFixed(2))
              ]);
              _this.allEvs.push(parseFloat(((_this.evStep1All+_this.evStep2All)/2).toFixed(2)));

            }
            _this.maxInd=_this.allEvs.indexOf(Math.max.apply(Math, _this.allEvs))
            _this.minInd=_this.allEvs.indexOf(Math.min.apply(Math, _this.allEvs))
        }
    }
    var data = JSON.stringify({"items":this.compsInApp,"boxes":this.devsInApp.length});
    xhr.send(data);
  }
  runSelectedApproach(){
    this.calculateStep1New();
    this.calculateStep2New();
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
