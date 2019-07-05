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
	compDims:any[]=[];
  devProps:any[]=[];
	devDims:any[]=[];
  layoutProps:any[]=[];
	numCompRanges:any[]=[];
	numDevRanges:any[]=[];

  affinityMat1:any[]=[];
	affinityMat1Norm:any[]=[];
  affinityMat2:any[]=[];
	affinityMat3:any[]=[];
	affinityMat4:any[]=[];

	criteria:any[]=[];
	criteriaVal:any[]=[];
	coefs:any[]=[];
	coefsVal:any[]=[];
	Sc:any[]=[];
	Ss:any[]=[];


	public statusObs:Observable<any>;
  private _statusObs: Observer<any>;


  //private playerService:PlayerService;

  constructor (){
    this.devs=['mobile','tablet','computer','smartTv'];
		this.compDims=["xmin","ymin","xmax","ymax"]
		this.devDims=["xp","yp","cut_pip","cut_split","exp_carousel"]
    this.layouts=['pip','split','carousel'];
    this.comps=['main','video','banner','staticData','dynamicData','social','UGC','advertisement'];
		this.criteria = ["A", "S", "E", "D"];
		this.Sc = [1,1,1,1];
		this.Ss = [1,1,1,1];
		this.coefs = ["coef_car", "coef_pip", "coef_split"]
		this.coefsVal=[1,1,1];
		this.criteriaVal=[1,1,1,1];
    this.assignmentPos=['main','video','banner','staticData','dynamicData','social','UGC','advertisement','mobile','tablet','computer','smartTv'];
    for(var i=0;i<this.comps.length;i++){
      this.compObj[this.comps[i]]={"properties":{},"dimensions":{}};
    }
    for(var i=0;i<this.devs.length;i++){
      this.devObj[this.devs[i]]={"properties":{},"dimensions":{}};
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
      this.compObj[this.comps[i]]["properties"][val]=0;
    }

    this.affinityMat1.push(Array(this.devProps.length).fill(0));
		this.affinityMat1Norm.push(Array(this.devProps.length).fill(0));

		this.affinityMat2.splice(this.compProps.length-1,0,Array(this.layoutProps.length).fill(0));


  }
	criteriaValueChanged(event){
		this.criteriaVal[this.criteria.indexOf(event.srcElement.id)]=parseFloat(event.srcElement.value);
	}
	coefValueChanged(event){
		this.coefsVal[this.coefs.indexOf(event.srcElement.id)]=parseFloat(event.srcElement.value);
	}
	ScValueChanged(event){
		this.Sc[this.devs.indexOf(event.srcElement.id.split('sc_')[1])]=parseFloat(event.srcElement.value);
	}
	SsValueChanged(event){
		this.Ss[this.devs.indexOf(event.srcElement.id.split('ss_')[1])]=parseFloat(event.srcElement.value);
	}
	addCompDim(val:any){
		this.compDims.push(val);
    for(var i=0;i<this.comps.length;i++){
      this.compObj[this.comps[i]]["dimensions"][val]=0;
    }
	}
  addDevProp(val:any){
    this.devProps.push(val);
    for(var i=0;i<this.devs.length;i++){
      this.devObj[this.devs[i]]['properties'][val]=0;
    }
    for(var i=0;i<this.compProps.length;i++){
      this.affinityMat1[i].push(0);
			this.affinityMat1Norm[i].push(0);
    }

		this.affinityMat2.splice(this.devProps.length-1+this.compProps.length,0,Array(this.layoutProps.length).fill(0));

  }
	addDevDim(val:any){
		this.devDims.push(val);
    for(var i=0;i<this.devs.length;i++){
      this.devObj[this.devs[i]]['dimensions'][val]=0;
    }
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
    this.compObj[event.srcElement.id.split('_of_')[1]]['properties'][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
  }
	compDimChanged(event){
		this.compObj[event.srcElement.id.split('_of_')[1]]['dimensions'][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
	}
  devPropChanged(event){
    this.devObj[event.srcElement.id.split('_of_')[1]]['properties'][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
  }
	devDimChanged(event){
		this.devObj[event.srcElement.id.split('_of_')[1]]['dimensions'][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
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
		this.affinityMat1Norm=JSON.parse(JSON.stringify(this.affinityMat1));
		for(var i=0;i<this.affinityMat1.length;i++){
			var totalRow=this.affinityMat1[i].reduce((total, value) => total + value, 0);
			this.affinityMat1Norm[i]=JSON.parse(JSON.stringify(this.affinityMat1[i])).map(num=>num/totalRow);
		}


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

			this.compProps=Object.keys(JSON.parse(x.split(';')[0].split('=')[1])['main']['properties']);
      this.compObj=JSON.parse(x.split(';')[0].split('=')[1]);
      this.devProps=Object.keys(JSON.parse(x.split(';')[1].split('=')[1])['mobile']['properties']);

      this.devObj=JSON.parse(x.split(';')[1].split('=')[1]);
      this.affinityMat1=JSON.parse(x.split(';')[2].split('=')[1]);
			this.affinityMat1Norm=JSON.parse(JSON.stringify(this.affinityMat1));
			for(var i=0;i<this.affinityMat1.length;i++){
				var totalRow=this.affinityMat1[i].reduce((total, value) => total + value, 0);
				this.affinityMat1Norm[i]=JSON.parse(JSON.stringify(this.affinityMat1[i])).map(num=>num/totalRow);
			}
			this.criteria = eval(x.split(';')[3].split('=')[1]);
			this.criteriaVal = eval(x.split(';')[4].split('=')[1]);
			this.coefs = eval(x.split(';')[5].split('=')[1]);
			this.coefsVal = eval(x.split(';')[6].split('=')[1]);
			this.Sc=eval(x.split(';')[7].split('=')[1]);
			this.Ss=eval(x.split(';')[8].split('=')[1]);

			/*this.compProps=Object.keys(JSON.parse(x.target['result'].split(';')[0].split('=')[1])['main']['properties']);
      this.compObj=JSON.parse(x.target['result'].split(';')[0].split('=')[1]);
      this.devProps=Object.keys(JSON.parse(x.target['result'].split(';')[1].split('=')[1])['mobile']['properties']);

      this.devObj=JSON.parse(x.target['result'].split(';')[1].split('=')[1]);
      this.affinityMat1=JSON.parse(x.target['result'].split(';')[2].split('=')[1]);
			this.affinityMat1Norm=JSON.parse(JSON.stringify(this.affinityMat1));
			for(var i=0;i<this.affinityMat1.length;i++){
				var totalRow=this.affinityMat1[i].reduce((total, value) => total + value, 0);
				this.affinityMat1Norm[i]=JSON.parse(JSON.stringify(this.affinityMat1[i])).map(num=>num/totalRow);
			}
			this.criteria = eval(x.target['result'].split(';')[3].split('=')[1]);
			this.criteriaVal = eval(x.target['result'].split(';')[4].split('=')[1]);
			this.coefs = eval(x.target['result'].split(';')[5].split('=')[1]);
			this.coefsVal = eval(x.target['result'].split(';')[6].split('=')[1]);
			this.Sc=eval(x.target['result'].split(';')[7].split('=')[1]);
			this.Ss=eval(x.target['result'].split(';')[8].split('=')[1]);*/

			
      //this.assignmentProps=Object.keys(JSON.parse(x.target['result'].split(';')[3].split('=')[1])['assignment']);
      //this.assignmentObj=JSON.parse(x.target['result'].split(';')[3].split('=')[1]);
      /*this.layoutProps=Object.keys(JSON.parse(x.target['result'].split(';')[3].split('=')[1])['pip']);
      this.layoutObj=JSON.parse(x.target['result'].split(';')[3].split('=')[1]);
      this.affinityMat2=JSON.parse(x.target['result'].split(';')[4].split('=')[1]);
			this.numCompRanges=eval(x.target['result'].split(';')[5].split('=')[1]);
			this.affinityMat3=JSON.parse(x.target['result'].split(';')[6].split('=')[1]);
			this.numDevRanges=eval(x.target['result'].split(';')[7].split('=')[1]);
			this.affinityMat4=JSON.parse(x.target['result'].split(';')[8].split('=')[1]);*/

      //alert("File loaded");

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
	getAffinityMat1Norm(){
    return this.affinityMat1Norm;
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
	getCriteria(){
		return this.criteria;
	}
	getCriteriaVal(){
		return this.criteriaVal;
	}
	getCoefs(){
		return this.coefs;
	}
	getCoefsVal(){
		return this.coefsVal;
	}
	getSc(){
		return this.Sc;
	}
	getSs(){
		return this.Ss;
	}
	getScVal(c:string){
		return this.Sc[this.devs.indexOf(c)];
	}
	getSsVal(c:string){
		return this.Ss[this.devs.indexOf(c)];
	}

	getCriteriaValue(c:string){
		return this.criteriaVal[this.criteria.indexOf(c)];
	}
	getCoefValue(c:string){
		return this.coefsVal[this.coefs.indexOf(c)];
	}
  delete(event){
    if(event.srcElement.id.indexOf('_deletefromcompsprops_')>0){
      this.affinityMat1.splice(this.compProps.indexOf(event.srcElement.id.split('_deletefromcompsprops_')[0]), 1);
      Object.keys(this.compObj).forEach((o)=>{
        delete this.compObj[o]['properties'][event.srcElement.id.split('_deletefromcompsprops_')[0]];
      });

			this.affinityMat2.splice(this.compProps.indexOf(event.srcElement.id.split('_deletefromcompsprops_')[0]),1);

      this.compProps.splice(this.compProps.indexOf(event.srcElement.id.split('_deletefromcompsprops_')[0]),1);
    }
		else if(event.srcElement.id.indexOf('_deletefromcompsdims_')>0){
			Object.keys(this.compObj).forEach((o)=>{
        delete this.compObj[o]['dimensions'][event.srcElement.id.split('_deletefromcompsdims_')[0]];
      });
			this.compDims.splice(this.compDims.indexOf(event.srcElement.id.split('_deletefromcompsdims_')[0]),1);
		}
    else if(event.srcElement.id.indexOf('_deletefromdevsprops_')>0){
      for(var i =0;i<this.compProps.length;i++){
        this.affinityMat1[i].splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevsprops_')[0]), 1);
      }
      var _this=this;
      Object.keys(this.devObj).forEach((ob)=>{
        delete _this.devObj[ob]['properties'][event.srcElement.id.split('_deletefromdevsprops_')[0]];
      });


			this.affinityMat2.splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevsprops_')[0])+this.compProps.length,1);

			this.devProps.splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevsprops_')[0]),1);

    }
		else if(event.srcElement.id.indexOf('_deletefromdevsdims_')>0){
			Object.keys(this.devObj).forEach((ob)=>{
        delete this.devObj[ob]['dimensions'][event.srcElement.id.split('_deletefromdevsdims_')[0]];
      });
			this.devDims.splice(this.devDims.indexOf(event.srcElement.id.split('_deletefromdevsdims_')[0]),1);

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
