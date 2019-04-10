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
  allR:any[]=[];
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
          cInAlld.push(parseFloat(affd.toFixed(2)));
        }
        savedDistances.push(distances);
        //calcular afinidad

        this.affResults1.push(cInAlld);
      });


      //Obtain the index of the highest affinity

      this.bestAffs1=[];
      this.affResults1.forEach((c,i)=>{
        var max = c.reduce((acc,curr) => curr > acc ? curr : acc);
        var res = c.reduce((acc,curr,idx) => curr === max ? [...acc, idx] : acc, []);
        if(res.length>1){
            var auxArr:any=[];
            auxArr = Object.values(this.dataService.getCompObj()[this.compsInApp[i]]["properties"]);
            var maxPropInd=auxArr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            var val=0;
            var idx=0;
            for(var j=0;j<res.length;j++){
              if(j==0){
                val=savedDistances[i][res[j]][maxPropInd];
              }else{
                if(savedDistances[i][res[j]][maxPropInd]>val){
                  val=savedDistances[i][res[j]][maxPropInd];
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
        //console.log(l);
      //  console.log("compTypeFactor:"+_this.compTypeFactor+
      //  " compTypeAff:"+_this.compTypeAffl+
      //  " devTypeFactor:"+this.devTypeFactor+
      //  " devTypeAff:"+_this.devTypeAffl+
      //  "compNumFactor:"+_this.compNumFactor+
      //  " compNumAff:"+_this.compNumAffl+
        //" devNumFactor:"+this.devNumFactor+
        //" devNumAff:"+_this.devNumAffl);

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
  calculateStep2LayoutFunctions(){
    var _this=this;
    this.affResults2=[];
    this.auxResults2Out=[];
    this.auxResults2Int=[];
    this.evStep2=0;
    this.assignments.forEach((a,i)=>{
      var aInAllL=[_this.pipFunc(a[1].length,a[0],i,"one").affLayout,
      _this.customGridFunc(a[1].length,a[0]).affLayout,
      _this.dividedFunc(a[1].length,a[0],i,"one").affLayout,
      _this.carouselFunc(a[1].length,a[0],i,"one").affLayout
      ];
      _this.affResults2.push(aInAllL);

      /*var outInAll = [_this.pipFunc(a[1].length,a[0]).outputCap,
      _this.customGridFunc(a[1].length,a[0]).outputCap,
      _this.dividedFunc(a[1].length,a[0]).outputCap,
      _this.carouselFunc(a[1].length,a[0]).outputCap
      ];

      _this.auxResults2Out.push(outInAll);

      var intInAll = [_this.pipFunc(a[1].length,a[0]).interactivity,
      _this.customGridFunc(a[1].length,a[0]).interactivity,
      _this.dividedFunc(a[1].length,a[0]).interactivity,
      _this.carouselFunc(a[1].length,a[0]).interactivity
      ];
      _this.auxResults2Int.push(intInAll);*/

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
  calculateStep2LayoutFunctionsForAll(){
    var _this=this;
    this.affResults2All=[];

    this.evStep2All=0;
    this.assignmentsAll.forEach((a,i)=>{
      var aInAllL=[_this.pipFunc(a[1].length,a[0],i,"all").affLayout,
      _this.customGridFunc(a[1].length,a[0]).affLayout,
      _this.dividedFunc(a[1].length,a[0],i,"all").affLayout,
      _this.carouselFunc(a[1].length,a[0],i,"all").affLayout
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
    this.evStep2All=((this.evStep2All/this.affResults2All.length));
    //this.evGlobal=parseFloat(((this.evStep1+this.evStep2All)/2).toFixed(2));
    return {'all':_this.bestLayoutAll,'eval':_this.evStep2All}

  }
  customGridFunc(nc,dt){
    return{'affLayout': 0, 'outputCap':0,'interactivity':0};
  }
  dividedFunc(nc,dt,a,mode){
    if(mode == "all"){
      var assigns = this.assignmentsAll;
    }
    else if(mode=='one'){
      var assigns = this.assignments;
    }
    var cut_split = this.dataService.getDevObj()[dt]['dimensions'].cut_split;
    /*if(dt=='mobile'){
      cut_split = 2;
    }
    else if(dt=='tablet'){
      cut_split = 6;
    }
    else if(dt=='computer'){
      cut_split = 9;
    }
    else if(dt=='smartTv'){
      cut_split = 9;
    }*/

    var A_split = 1;

    var S_split = Math.max(
      0,
      1-((nc-1)/cut_split)
    );

    var E_split = 0;
    if(nc>0){
      E_split = (Math.ceil(Math.sqrt(nc))*Math.round(Math.sqrt(nc))-nc)/(Math.ceil(Math.sqrt(nc))*Math.round(Math.sqrt(nc)));
      E_split = 1-E_split;
    }

    var D_split = 0;
    var xp=this.dataService.getDevObj()[dt]['dimensions'].xp;
    var yp=this.dataService.getDevObj()[dt]['dimensions'].yp;
    for(var i=0;i<assigns[a][1].length;i++){
        var xmax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmax;
        var ymax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymax;
        var xmin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmin;
        var ymin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymin;
        var xp=this.dataService.getDevObj()[dt]['dimensions'].xp;

        if((xp*Math.ceil(Math.sqrt(nc)))/(yp*Math.round(Math.sqrt(nc)))>(xmax/ymax)){
            D_split = D_split + ((xmax/ymax)/((xp*Math.ceil(Math.sqrt(nc)))/(yp*Math.round(Math.sqrt(nc)))))
        }
        else if((xp*Math.ceil(Math.sqrt(nc)))/(yp*Math.round(Math.sqrt(nc)))<(xmin/ymin)){
            D_split = D_split + (((xp*Math.ceil(Math.sqrt(nc)))/(yp*Math.round(Math.sqrt(nc))))/(xmin/ymin))
        }
        else{
            D_split = D_split + 1;
        }
    }
    if(nc>0){
      D_split = D_split/nc;
    }
    var affLayout =parseFloat(Math.pow(A_split,this.dataService.getCriteriaValue("A"))*Math.pow(S_split,this.dataService.getCriteriaValue("S"))*Math.pow(E_split,this.dataService.getCriteriaValue("E"))*Math.pow(D_split,this.dataService.getCriteriaValue("D"))).toFixed(2);
    return{'affLayout': affLayout};

    /*if(nc==0){
      return {'affLayout': 0};
    }
    else{
      var screen = this.dataService.getDevObj()[dt]['screensize'];
      var input = this.dataService.getDevObj()[dt]['inputCapabilities'];

      var minSThres = 0;
      var maxEThres = 0;
      if(dt=='mobile'){
        minSThres = 0.49;
        maxEThres = 0.49;
      }
      else if(dt=='tablet'){
          minSThres = 0.24;
          maxEThres = 0.24;
      }
      else if(dt=='computer'){
        minSThres = 0.1;
        maxEThres = 0.1;
      }
      else if(dt=='smartTv'){
        minSThres = 0.1;
        maxEThres = 0.1;
      }


      var visualized_area = 1;
      //var visualized_cmps = 1;
      var shrink = ((1/Math.ceil(Math.sqrt(nc)))*(1/Math.round(Math.sqrt(nc))));
      var minS = shrink;

      var empty = 1-(((Math.ceil(Math.sqrt(nc))*Math.round(Math.sqrt(nc)))-nc)/(Math.ceil(Math.sqrt(nc))*Math.round(Math.sqrt(nc))));
      var maxE = 1- empty;
      var interactivity = 0;

      var interactivity = input - interactivity;
      if(interactivity>0){
        interactivity = 1;
      }
      else{
        interactivity = parseFloat((1 + interactivity).toFixed(2));
      }
      var outputCap = parseFloat(((visualized_area + shrink + empty)/3).toFixed(2));
      if(minS<=minSThres || maxE>=maxEThres){
        outputCap=0;
      }
      if(outputCap==0){
        interactivity=0;
      }
      var affLayout =parseFloat(((0.6*outputCap  + 0.4*interactivity ) ).toFixed(2));
      return{'affLayout': affLayout, 'outputCap':outputCap,'interactivity':interactivity};
    }*/

  }
  pipFunc(nc,dt,a,mode){
    if(mode == "all"){
      var assigns = this.assignmentsAll;
    }
    else if(mode=='one'){
      var assigns = this.assignments;
    }
    var cut_pip = this.dataService.getDevObj()[dt]['dimensions'].cut_pip;
    /*if(dt=='mobile'){
      cut_pip = 1;
    }
    else if(dt=='tablet'){
      cut_pip = 5;
    }
    else if(dt=='computer'){
      cut_pip = 8;
    }
    else if(dt=='smartTv'){
      cut_pip = 8;
    }*/

    var A_pip = 0;
    if(nc == 1){
        A_pip = 1
    }
    if(nc == 2){
        A_pip = 1 - 1/9;
    }
    if(nc == 3){
        A_pip = 1 - 2/9;
    }
    if(nc >= 4){
        A_pip = 1 - 1/3;
    }

    var S_pip = 0;
    S_pip = Math.max(
      0,
      1-((nc-1)/cut_pip)
    );

    var E_pip = 0;
    E_pip = 1;

    var xp=this.dataService.getDevObj()[dt]['dimensions'].xp;
    var yp=this.dataService.getDevObj()[dt]['dimensions'].yp;

    var D_pip = 0;
    if(nc>0 && nc<5){
      for(var i=0;i<assigns[a][1].length;i++){
        var xmax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmax;
        var ymax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymax;
        var xmin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmin;
        var ymin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymin;

        if((xp/yp)>(xmax/ymax)){
            D_pip = D_pip + ((xmax/ymax)/(xp/yp));
        }
        else if((xp/yp)<(xmin/ymin)){
            D_pip = D_pip + ((xp/yp)/(xmin/ymin));
          }
          else{
            D_pip = D_pip + 1;
          }
      }
    }
    else if(nc>=5){
      for(var i=0;i<assigns[a][1].length;i++){
        var xmax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmax;
        var ymax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymax;
        var xmin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmin;
        var ymin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymin;
        if (i==1){
            if((xp/yp)>(xmax/ymax)){
                D_pip = D_pip + ((xmax/ymax)/(xp/yp));
            }
            else if((xp/yp)<(xmin/ymin)){
                D_pip = D_pip + ((xp/yp)/(xmin/ymin));
            }
            else{
                D_pip = D_pip + 1;
            }
        }
        else{
            if(((xp/yp)*(nc-1)/3)>(xmax/ymax)){
                D_pip = D_pip + ((xmax/ymax)/((xp/yp)*(nc-1)/3));
            }
            else if(((xp/yp)*(nc-1)/3)<(xmin/ymin)){
                D_pip = D_pip + (((xp/yp)*(nc-1)/3)/(xmin/ymin));
            }
            else{
                D_pip = D_pip + 1;
            }
        }
      }
    }
    if(nc>0){
      D_pip = D_pip/nc;
    }

    var affLayout =parseFloat(Math.pow(A_pip,this.dataService.getCriteriaValue("A"))*Math.pow(S_pip,this.dataService.getCriteriaValue("S"))*Math.pow(E_pip,this.dataService.getCriteriaValue("E"))*Math.pow(D_pip,this.dataService.getCriteriaValue("D"))).toFixed(2);
    return{'affLayout': affLayout};
    /*if(nc==0){
      return {'affLayout': 0};
    }
    else{
      var screen = this.dataService.getDevObj()[dt]['screensize'];
      var input = this.dataService.getDevObj()[dt]['inputCapabilities'];
      var minSThres = 0;
      if(dt=='mobile'){
        minSThres = 0.49;
      }
      else if(dt=='tablet'){
          minSThres = 0.24;
      }
      else if(dt=='computer'){
        minSThres = 0.1;
      }
      else if(dt=='smartTv'){
        minSThres = 0.1;
      }

      if(nc<4){
          var visualized_area = 1-(nc-1)*(1/9);//((1-((nc-1)*(1/9)))+(nc-1))/nc;
      }
      else{
        var visualized_area = 1-(4-1)*(1/9);//((1-((nc-1)*(1/9)))+(nc-1))/nc;
      }


      //var visualized_cmps = 1;
      var shrink = (1 + (nc-1)*(1/9))/nc;
      if(nc==1){
          var minS = 1;
      }
      else if(nc>1 && nc<=4){
         var minS=1/9;
      }
      else{
        var minS = 1/(3*nc-3);
      }


      var empty = 1;
      var interactivity = 0.2;

      var interactivity = input - interactivity;
      if(interactivity>0){
        interactivity = 1;
      }
      else{
        interactivity = parseFloat((1 + interactivity).toFixed(2));
      }
      var outputCap = parseFloat(((visualized_area + shrink + empty)/3).toFixed(2));

      if(minS<=minSThres){
        outputCap=0;
      }
      if(outputCap==0){
        interactivity=0;
      }

      var affLayout =parseFloat(((0.6*outputCap  + 0.4*interactivity ) ).toFixed(2));
      return{'affLayout': affLayout, 'outputCap':outputCap,'interactivity':interactivity};
    }*/
  }
  carouselFunc(nc,dt,a,mode){
    if(mode == "all"){
      var assigns = this.assignmentsAll;
    }
    else if(mode=='one'){
      var assigns = this.assignments;
    }
    var exp_carousel = this.dataService.getDevObj()[dt]['dimensions'].exp_carousel;

    /*if(dt=='mobile'){
      exp_carousel = 0.5;
    }
    else if(dt=='tablet'){
      exp_carousel = 0.5;
    }
    else if(dt=='computer'){
      exp_carousel = 0.5;
    }
    else if(dt=='smartTv'){
      exp_carousel = 0.7;
    }*/

    var A_carousel = 0;
    if(nc>0){
      A_carousel = 1/(Math.pow(nc,exp_carousel));
    }

    var S_carousel = 1;

    var E_carousel = 1;

    var D_carousel=0;
    var xp=this.dataService.getDevObj()[dt]['dimensions'].xp;
    var yp=this.dataService.getDevObj()[dt]['dimensions'].yp;
    for(var i=0;i<assigns[a][1].length;i++){
      var xmax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmax;
      var ymax=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymax;
      var xmin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].xmin;
      var ymin=this.dataService.getCompObj()[assigns[a][1][i]]['dimensions'].ymin;
      if((xp/yp)>(xmax/ymax)){
            D_carousel = D_carousel + ((xmax/ymax)/(xp/yp));
      }
      else if((xp/yp)<(xmin[i]/ymin[i])){
            D_carousel = D_carousel + ((xp/yp)/(xmin/ymin));
      }
      else{
            D_carousel = D_carousel + 1;
      }
    }
    if(nc>0){
      D_carousel = D_carousel/nc
    }

    var affLayout =parseFloat(Math.pow(A_carousel,this.dataService.getCriteriaValue("A"))*Math.pow(S_carousel,this.dataService.getCriteriaValue("S"))*Math.pow(E_carousel,this.dataService.getCriteriaValue("E"))*Math.pow(D_carousel,this.dataService.getCriteriaValue("D"))).toFixed(2);
    return{'affLayout': affLayout};

    /*if(nc==0){
      return {'affLayout': 0};
    }
    else{
      var screen = this.dataService.getDevObj()[dt]['screensize'];
      var input = this.dataService.getDevObj()[dt]['inputCapabilities'];


      var visualized_area = 1/nc;
      var shrink = 1/nc;
      var empty = 1;
      var interactivity = 0.7;

      var interactivity = input - interactivity;
      if(interactivity>0){
        interactivity = 1;
      }
      else{
        interactivity = parseFloat((1 + interactivity).toFixed(2));
      }
      var outputCap = parseFloat(((visualized_area + shrink + empty)/3).toFixed(2));
      var affLayout =parseFloat(((0.6*outputCap  + 0.4*interactivity )).toFixed(2));
      return{'affLayout': affLayout, 'outputCap':outputCap,'interactivity':interactivity};
    }*/
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
      //console.log('aAA');

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

        //console.log(l);
        //console.log("compTypeFactor:"+_this.compTypeFactor+
      //  " compTypeAff:"+_this.compTypeAffl+
        //" devTypeFactor:"+this.devTypeFactor+
        //" devTypeAff:"+_this.devTypeAffl+
      //  "compNumFactor:"+_this.compNumFactor+
        //" compNumAff:"+_this.compNumAffl+
      //  " devNumFactor:"+this.devNumFactor+
      //  " devNumAff:"+_this.devNumAffl);
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
            //console.log(json);

            for(var i=0;i<json.length;i++){
              //console.log('Iteration:'+i+" ------------------------------------------------------------------------------");
              _this.assignmentsAll=[];
              _this.evStep1All=0;
              for(var j=0;j<json[0].length;j++){
                _this.assignmentsAll.push([_this.devsInApp[j],json[i][j]]);
                for(var k=0;k<json[i][j].length;k++){
                  _this.evStep1All=_this.evStep1All+parseFloat(_this.affResults1[_this.compsInApp.indexOf(json[i][j][k])][j]);
                }

              }
              _this.evStep1All=((_this.evStep1All/_this.affResults1.length));
              var res=_this.calculateStep2LayoutFunctionsForAll();
              _this.allR.push(
                [
                _this.assignmentsAll,
                _this.evStep1All,
                res['all'],
                res['eval'],
                (((_this.evStep1All+_this.evStep2All)/2))
              ]);
              _this.allEvs.push((((_this.evStep1All+_this.evStep2All)/2)));

            }
            _this.allR.sort(function(a,b){if(a[4]<b[4]){return 1};if(a[4]>b[4]){return -1;}})
            _this.allEvs.sort(function(a,b){if(a<b){return 1};if(a>b){return -1;}})
            _this.maxInd=_this.allEvs.indexOf(Math.max.apply(Math, _this.allEvs))
            _this.minInd=_this.allEvs.indexOf(Math.min.apply(Math, _this.allEvs))
            _this.allResults=_this.allR;
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
