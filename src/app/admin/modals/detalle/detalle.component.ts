import { Component, OnInit, ViewChild, Input, forwardRef, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { DatosService } from '../../../../datos.service';
import * as moment from 'moment';

class ScheduleModel {
  public Id:number;
  public Date;
  public TimeStart;
  public TimeEnd; 
  //public Status:number;   
  constructor() {}
}

class ActivityModel {
  public Id:number;
  public Name:string;
  public Description:string;
  public Photo:string;
  public QuoteMax:number;
  public AmenityId:number;
  public Private:boolean;
  public UserId:number;
  public Status:number;
  public Schedules:ScheduleModel[] = [];
  constructor() {}
}

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
  providers: [ToasterService]
})
export class DetalleComponent implements OnInit {    
  /////////////////////////////////////////////////////////
  // passed in initialState from reservations.component.ts
  idProps;    
  responseData;
  
  ///////////////////////////////////////////
  // DETALLE VIEW
  eventDetail;  

  ///////////////////////////////////////////
  // EDIT VIEW
  isEditVisible = false;
    ////////////////////////////////////////////////////////
    // CONFIGURATION
    showMin: boolean = false;
    showSec: boolean = false;
    isMeridian:boolean = false;
    minDate:Date = new Date();  
    ////////////////////////////////////////////////////////
    // Form
    datePicker;
    startTime:Date;
    endTime:Date;

    scheduleModel:ScheduleModel = new ScheduleModel();    // For this moment only supports 1 schedule
    acitivyModel:ActivityModel = new ActivityModel();
    public newImages: any[] = [];


  public toasterconfig: ToasterConfig = new ToasterConfig({
    tapToDismiss: true,
    timeout: 3000,
    positionClass: "toast-top-center",
  });

  constructor( public modalRef: BsModalRef, private modalService: BsModalService, private heroService: DatosService,
               private toasterService: ToasterService
  ) { }

  ngOnInit() {
    console.log(this.idProps);    
    this.responseData = {action:'None'};
    var params = { "id": this.idProps };
    this.heroService.service_general_get_with_params("Schedules", params).subscribe(
      (res)=> {
        console.log(res.item);
        if(res.result === "Success"){          
          if (res.item.length < 0) { return; }
          this.eventDetail = res.item[0];
        } else if (res.result === "Error") { console.log("Ocurrio un error" + res.detalle); } 
        else { console.log("Error");}
      },
      (err)=> {console.log(err);}
    );    
  }

  public Edit() {
    this.isEditVisible = !this.isEditVisible;
    //////////// LOAD editDetail into activityModel (model that will be sent to service) ///////////////
    this.acitivyModel.Id = this.eventDetail.activity.id;
    this.acitivyModel.Name = this.eventDetail.activity.name;
    this.acitivyModel.Description = this.eventDetail.activity.description;
    this.acitivyModel.Photo= this.eventDetail.activity.photo;
    this.acitivyModel.QuoteMax = this.eventDetail.activity.quoteMax;
    this.acitivyModel.AmenityId = this.eventDetail.activity.amenityId;
    this.acitivyModel.Private = this.eventDetail.activity.private;
    this.acitivyModel.UserId = this.eventDetail.activity.userId;
    this.acitivyModel.Status = this.eventDetail.activity.status;
    
    this.datePicker = moment(this.eventDetail.date).toDate();
    this.startTime = this.eventDetail.timeStart;
    this.endTime = this.eventDetail.timeEnd;
    this.scheduleModel.Id = this.eventDetail.id;
  }
  
  public Update() {                   
    ///////// Servidor le aumenta +5 horas por la zona horaria ////////////////////
    let date = moment(this.datePicker).format('YYYY/MM/DD');
    let startHour = moment(this.startTime).format('HH');
    let endHour = moment(this.endTime).format('HH');
    
    this.scheduleModel.Date = moment(this.datePicker).startOf('day').subtract(5, 'hour').toDate();
    this.scheduleModel.TimeStart = moment(`${date} ${startHour}`, 'YYYY/MM/DD HH').subtract(5, 'hour').toDate();
    this.scheduleModel.TimeEnd = moment(`${date} ${endHour}`, 'YYYY/MM/DD HH').subtract(5, 'hour').toDate();
    
    ///////// Adding the complementaryData to the activityModel ///////////////////
    this.acitivyModel.Schedules = [];        
    this.acitivyModel.Schedules.push(this.scheduleModel);            
    console.log(this.acitivyModel);               
    // return;
    this.heroService.service_general_put(`Activity/${this.acitivyModel.Id}`, this.acitivyModel).subscribe(
      (res)=> {        
        // console.log(res);
        // this.responseData = {action:'Edit'};        

        if(res.result === "Success"){          
          console.log(res.item);  
          // this.responseData = {result:true, id:res.item.id, name:res.item.name};                
          this.responseData = {action:'Edit'};  
          this.modalRef.hide();
        } else if(res.result === "Error") {
          console.log(res.detalle);
          this.toasterService.pop('danger', 'Error', res.detalle);
        } else { console.log("Error"); this.toasterService.pop('danger', 'Error', 'An error has been ocurred.'); }

      },
      (err)=> { console.log(err);}       
    );        
  }
  
  public Delete() {    
    if (!confirm('Would you like to delete this event?')) { return;}    

    let params = this.eventDetail.activity.id;        
    this.heroService.service_general_delete(`Activity/${params}`).subscribe(
      (res)=> {        
        console.log(res);
        this.responseData = {action:'Delete'};        
      },
      (err)=> {
        console.log(err);
      },
      () => { this.modalRef.hide(); }      
    );
  }  
}
