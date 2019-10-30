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

  compProps:any[]=[];
  devProps:any[]=[];

  affinityMat1:any[]=[];
	affinityMat1Norm:any[]=[];

	criteria:any[]=[];
	criteriaVal:any[]=[];
	coefs:any[]=[];
	coefsVal:any[]=[];
	Sc:any[]=[];
	Ss:any[]=[];


	public statusObs:Observable<any>;
  private _statusObs: Observer<any>;



  constructor (){
    this.devs=['mobile','tablet','computer','smartTv'];

    this.layouts=['pip','split','carousel'];
    this.comps=['main','video','banner','staticData','dynamicData','social','UGC','advertisement'];
		this.criteria = ["A", "S", "E"];
		this.Sc = [1,1,1,1];
		this.Ss = [1,1,1,1];
		this.coefs = ["coef_car", "coef_pip", "coef_split"]
		this.coefsVal=[1,1,1];
		this.criteriaVal=[1,1,1];
    this.assignmentPos=['main','video','banner','staticData','dynamicData','social','UGC','advertisement','mobile','tablet','computer','smartTv'];
    for(var i=0;i<this.comps.length;i++){
      this.compObj[this.comps[i]]={"properties":{}};
    }
    for(var i=0;i<this.devs.length;i++){
      this.devObj[this.devs[i]]={"properties":{}};
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

  addDevProp(val:any){
    this.devProps.push(val);
    for(var i=0;i<this.devs.length;i++){
      this.devObj[this.devs[i]]['properties'][val]=0;
    }
    for(var i=0;i<this.compProps.length;i++){
      this.affinityMat1[i].push(0);
			this.affinityMat1Norm[i].push(0);
    }

  }

  compPropChanged(event){
    this.compObj[event.srcElement.id.split('_of_')[1]]['properties'][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
  }

  devPropChanged(event){
    this.devObj[event.srcElement.id.split('_of_')[1]]['properties'][event.srcElement.id.split('_of_')[0]]=parseFloat(event.srcElement.value);
  }



  matr1Changed(event){
    this.affinityMat1[this.compProps.indexOf(event.srcElement.id.split('_with_')[0])][this.devProps.indexOf(event.srcElement.id.split('_with_')[1])]=parseFloat(event.srcElement.value);
		this.affinityMat1Norm=JSON.parse(JSON.stringify(this.affinityMat1));
		for(var i=0;i<this.affinityMat1.length;i++){
			var totalRow=this.affinityMat1[i].reduce((total, value) => total + value, 0);
			this.affinityMat1Norm[i]=JSON.parse(JSON.stringify(this.affinityMat1[i])).map(num=>num/totalRow);
		}


  }

  load(x:any){


			this.compProps=Object.keys(JSON.parse(x.target['result'].split(';')[0].split('=')[1])['main']['properties']);
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
			this.Ss=eval(x.target['result'].split(';')[8].split('=')[1]);


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

      this.compProps.splice(this.compProps.indexOf(event.srcElement.id.split('_deletefromcompsprops_')[0]),1);
    }

    else if(event.srcElement.id.indexOf('_deletefromdevsprops_')>0){
      for(var i =0;i<this.compProps.length;i++){
        this.affinityMat1[i].splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevsprops_')[0]), 1);
      }
      var _this=this;
      Object.keys(this.devObj).forEach((ob)=>{
        delete _this.devObj[ob]['properties'][event.srcElement.id.split('_deletefromdevsprops_')[0]];
      });

			this.devProps.splice(this.devProps.indexOf(event.srcElement.id.split('_deletefromdevsprops_')[0]),1);

    }

  }

}
