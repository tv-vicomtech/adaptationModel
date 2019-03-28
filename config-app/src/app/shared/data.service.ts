import { Injectable,EventEmitter,OnInit } from '@angular/core';
import { Observable, Subscription,Observer } from 'rxjs/Rx';


@Injectable()
export class DataService {

	private data:any=[];
  devs:any[]=[];
  layouts:any[]=[];
  comps:any[]=[];
  assignmentPos:any=[];



  compObj={};
  devObj={};
  layoutObj={};
	compNumRangeObj={};
	devNumRangeObj={};

  compProps:any[]=[];
  devProps:any[]=[];
  layoutProps:any[]=[];
	numCompRanges:any[]=[];
	numDevRanges:any[]=[];

  affinityMat1:any[]=[];
  affinityMat2:any[]=[];
	affinityMat3:any[]=[];
	affinityMat4:any[]=[];


	public statusObs:Observable<any>;
  private _statusObs: Observer<any>;


  //private playerService:PlayerService;

  constructor (){
    this.devs=['mobile','tablet','computer','smartTv'];
    this.layouts=['pip','customGrid','divided','carousel'];
    this.comps=['main','video','banner','staticData','dynamicData','social','UGC','advertisement'];
    this.assignmentPos=['main','video','banner','staticData','dynamicData','social','UGC','advertisement','mobile','tablet','computer','smartTv'];
    for(var i=0;i<this.comps.length;i++){
      this.compObj[this.comps[i]]={};
    }
    for(var i=0;i<this.devs.length;i++){
      this.devObj[this.devs[i]]={};
    }
    for(var i=0;i<this.layouts.length;i++){
      this.layoutObj[this.layouts[i]]={};
    }



	}
	getStatusSubscriber(): any {
		return this.statusObs;
	}
  addCompProp(val:any){
    this.compProps.push(val);
    for(var i=0;i<this.comps.length;i++){
      this.compObj[this.comps[i]][val]=0;
    }

    this.affinityMat1.push(Array(this.devProps.length).fill(0));


		this.affinityMat2.splice(this.compProps.length-1,0,Array(this.layoutProps.length).fill(0));


  }
  addDevProp(val:any){
    this.devProps.push(val);
    for(var i=0;i<this.devs.length;i++){
      this.devObj[this.devs[i]][val]=0;
    }
    for(var i=0;i<this.compProps.length;i++){
      this.affinityMat1[i].push(0);
    }

		this.affinityMat2.splice(this.devProps.length-1+this.compProps.length,0,Array(this.layoutProps.length).fill(0));

  }
  addLayoutProp(val:any){
    this.layoutProps.push(val);
    for(var i=0;i<this.layouts.length;i++){
      this.layoutObj[this.layouts[i]][val]=0;
    }
    for(var i=0;i<(this.comps.length*this.compProps.length)+(this.devs.length*this.devProps.length)+this.numCompRanges.length+this.numDevRanges.length;i++){
      this.affinityMat2[i].push(0);
    }
  }
	addNumCompRange(val:any){
			this.numCompRanges.push(val);
			//this.compNumRangeObj[val]=0;
			//this.affinityMat2.splice((this.numCompRanges.length-1+this.devProps.length+this.compProps.length),0,Array(this.layoutProps.length).fill(0));
			this.affinityMat3.push(Array(this.layouts.length).fill(0));
	}
	addNumDevRange(val:any){
			this.numDevRanges.push(val);
			//this.devNumRangeObj[val]=0;
			//this.affinityMat2.splice((this.numDevRanges.length-1+this.numCompRanges.length+this.devProps.length+this.compProps.length),0,Array(this.layoutProps.length).fill(0));
			this.affinityMat4.push(Array(this.layouts.length).fill(0));
	}
  pushAffinityMat2(){
    this.affinityMat2.push(Array(this.layoutProps.length).fill(0));
  }

  compPropChanged(event){
    this.compObj[event.srcElement.id.split('_of_')[1]][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
  }
  devPropChanged(event){
    this.devObj[event.srcElement.id.split('_of_')[1]][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
  }
  layoutPropChanged(event){
    this.layoutObj[event.srcElement.id.split('_of_')[1]][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
  }
	/*compNumRangeChanged(event){
		this.compNumRangeObj[event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
	}
	devNumRangeChanged(event){
		this.devNumRangeObj[event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
	}*/
  matr1Changed(event){
    this.affinityMat1[this.compProps.indexOf(event.srcElement.id.split('_with_')[0])][this.devProps.indexOf(event.srcElement.id.split('_with_')[1])]=parseFloat(event.srcElement.value);
  }
  matr2Changed(event){
		if(event.srcElement.id.indexOf('_cwith_')>-1){
			var cp=event.srcElement.id.split('_cwith_')[0];
			var lp=event.srcElement.id.split('_cwith_')[1];
			this.affinityMat2[this.compProps.indexOf(cp)][this.layoutProps.indexOf(lp)]=parseFloat(event.srcElement.value);
		}
		else if(event.srcElement.id.indexOf('_dwith_')>-1){
			var dp=event.srcElement.id.split('_dwith_')[0];
			var lp=event.srcElement.id.split('_dwith_')[1];
			this.affinityMat2[this.devProps.indexOf(dp)+this.compProps.length][this.layoutProps.indexOf(lp)]=parseFloat(event.srcElement.value);
		}


  }
	matr3Changed(event){
		var nc=event.srcElement.id.split('_ncwith_')[0];
		var l=event.srcElement.id.split('_ncwith_')[1];
		this.affinityMat3[this.numCompRanges.indexOf(nc)][this.layouts.indexOf(l)]=parseFloat(event.srcElement.value);
	}
	matr4Changed(event){
		var nd=event.srcElement.id.split('_ndwith_')[0];
		var l=event.srcElement.id.split('_ndwith_')[1];
		this.affinityMat4[this.numDevRanges.indexOf(nd)][this.layouts.indexOf(l)]=parseFloat(event.srcElement.value);
	}
  load(x:any){


/*		//eval(x.target['result']);
		this.compProps=Object.keys(JSON.parse(x.split(';')[0].split('=')[1])['main']);
		this.compObj=JSON.parse(x.split(';')[0].split('=')[1]);
		this.devProps=Object.keys(JSON.parse(x.split(';')[1].split('=')[1])['mobile']);
		this.devObj=JSON.parse(x.split(';')[1].split('=')[1]);
		this.affinityMat1=JSON.parse(x.split(';')[2].split('=')[1]);

		//this.assignmentProps=Object.keys(JSON.parse(x.target['result'].split(';')[3].split('=')[1])['assignment']);
		//this.assignmentObj=JSON.parse(x.target['result'].split(';')[3].split('=')[1]);
		this.layoutProps=Object.keys(JSON.parse(x.split(';')[3].split('=')[1])['pip']);
		this.layoutObj=JSON.parse(x.split(';')[3].split('=')[1]);
		this.affinityMat2=JSON.parse(x.split(';')[4].split('=')[1]);
		this.numCompRanges=eval(x.split(';')[5].split('=')[1]);
		this.affinityMat3=JSON.parse(x.split(';')[6].split('=')[1]);
		this.numDevRanges=eval(x.split(';')[7].split('=')[1]);
		this.affinityMat4=JSON.parse(x.split(';')[8].split('=')[1]);*/
      //eval(x.target['result']);
      this.compProps=Object.keys(JSON.parse(x.target['result'].split(';')[0].split('=')[1])['main']);
      this.compObj=JSON.parse(x.target['result'].split(';')[0].split('=')[1]);
      this.devProps=Object.keys(JSON.parse(x.target['result'].split(';')[1].split('=')[1])['mobile']);
      this.devObj=JSON.parse(x.target['result'].split(';')[1].split('=')[1]);
      this.affinityMat1=JSON.parse(x.target['result'].split(';')[2].split('=')[1]);

      //this.assignmentProps=Object.keys(JSON.parse(x.target['result'].split(';')[3].split('=')[1])['assignment']);
      //this.assignmentObj=JSON.parse(x.target['result'].split(';')[3].split('=')[1]);
      this.layoutProps=Object.keys(JSON.parse(x.target['result'].split(';')[3].split('=')[1])['pip']);
      this.layoutObj=JSON.parse(x.target['result'].split(';')[3].split('=')[1]);
      this.affinityMat2=JSON.parse(x.target['result'].split(';')[4].split('=')[1]);
			this.numCompRanges=eval(x.target['result'].split(';')[5].split('=')[1]);
			this.affinityMat3=JSON.parse(x.target['result'].split(';')[6].split('=')[1]);
			this.numDevRanges=eval(x.target['result'].split(';')[7].split('=')[1]);
			this.affinityMat4=JSON.parse(x.target['result'].split(';')[8].split('=')[1]);
      alert("File loaded");

  }
  getCompObj(){
    return this.compObj;
  }
  getDevObj(){
    return this.devObj;
  }
  getAffinityMat1(){
    return this.affinityMat1;
  }
  getLayoutObj(){
    return this.layoutObj;
  }
  getAffinityMat2(){
    return this.affinityMat2;
  }
	getAffinityMat3(){
    return this.affinityMat3;
  }
	getAffinityMat4(){
    return this.affinityMat4;
  }
	getNumCompRanges(){
		return this.numCompRanges;
	}
	getNumDevRanges(){
		return this.numDevRanges;
	}

  delete(event){
    if(event.srcElement.id.indexOf('_deletefromcomps_')>0){
      this.affinityMat1.splice(this.compProps.indexOf(event.srcElement.id.split('_deletefromcomps_')[0]), 1);
      Object.keys(this.compObj).forEach((o)=>{
        delete this.compObj[o][event.srcElement.id.split('_deletefromcomps_')[0]];
      });

			this.affinityMat2.splice(this.compProps.indexOf(event.srcElement.id.split('_deletefromcomps_')[0]),1);

      this.compProps.splice(this.compProps.indexOf(event.srcElement.id.split('_deletefromcomps_')[0]),1);
    }
    else if(event.srcElement.id.indexOf('_deletefromdevs_')>0){
      for(var i =0;i<this.compProps.length;i++){
        this.affinityMat1[i].splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevs_')[0]), 1);
      }
      var _this=this;
      Object.keys(this.devObj).forEach((ob)=>{
        delete _this.devObj[ob][event.srcElement.id.split('_deletefromdevs_')[0]];
      });


			this.affinityMat2.splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevs_')[0])+this.compProps.length,1);

			this.devProps.splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevs_')[0]),1);

    }
    else if(event.srcElement.id.indexOf('_deletefromlayouts_')>0){
      for(var i =0;i<(this.compProps.length+this.devProps.length+this.numCompRanges.length+this.numDevRanges.length);i++){
        this.affinityMat2[i].splice(this.layoutProps.indexOf(event.srcElement.id.split('_deletefromlayouts_')[0]), 1);
      }
      var _this=this;
      Object.keys(this.layoutObj).forEach((ob)=>{
        delete _this.layoutObj[ob][event.srcElement.id.split('_deletefromlayouts_')[0]];
      });
      this.layoutProps.splice(this.layoutProps.indexOf(event.srcElement.id.split('_deletefromlayouts_')[0]),1);

    }
		else if(event.srcElement.id.indexOf('_deletefromnumbdevs_')>0){
			this.affinityMat4.splice(this.numDevRanges.indexOf(event.srcElement.id.split('_deletefromnumbdevs_')[0]),1);

      //delete this.devNumRangeObj[event.srcElement.id.split('_deletefromnumbdevs_')[0]];
			this.numDevRanges.splice(this.numDevRanges.indexOf(event.srcElement.id.split('_deletefromnumbdevs_')[0]),1);

		}
		else if(event.srcElement.id.indexOf('_deletefromnumbcomps_')>0){
			this.affinityMat3.splice(this.numCompRanges.indexOf(event.srcElement.id.split('_deletefromnumbcomps_')[0]),1);

      //delete this.compNumRangeObj[event.srcElement.id.split('_deletefromnumbcomps_')[0]];
			this.numCompRanges.splice(this.numCompRanges.indexOf(event.srcElement.id.split('_deletefromnumbcomps_')[0]),1);

		}

  }

}