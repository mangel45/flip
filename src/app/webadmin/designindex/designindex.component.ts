import { Component, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { DatosService } from '../../../datos.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-designindex',
  templateUrl: './designindex.component.html',
  styleUrls: ['./designindex.component.scss']
})
export class DesignindexComponent implements OnInit {

  
    
    public myModal;
    public largeModal;
    public smallModal;
    public primaryModal;
    public successModal;
    public warningModal;
    public dangerModal;
    public infoModal;
  
    constructor(private router: Router,
      private heroService: DatosService,
      private route: ActivatedRoute,
      toasterService: ToasterService) {
        this.toasterService = toasterService;
      }
    posts: any[];
    email: string;
    password: string;
    token: boolean;
    message: {};
    validar: boolean = false;
    idpost: any;
    IDUSR: string = "0";
    IDBUILD: string = "0";
    PostId: number ;
    posttext: string = "";
    posttitle: string = "";
    public user: string[];
  
    postphoto: string = "assets/img/Coliving.jpg";
    
  imageInputLabel = "Choose file";

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 3000,
      positionClass: "toast-top-center",
    });
  
    comment: string = "";
  
    public newImages: any[] = [];
  
  
    ngOnInit() {
      if (localStorage.getItem("user") == undefined) {
        this.router.navigate(['/login']);
      }
      else {
  
        this.user = JSON.parse(localStorage.getItem("user"));
        console.log(this.user);
        this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
        this.IDBUILD = this.route.snapshot.params['id']; 
        this.get_photos();
        
  
      }
    }
  
    get_photos() {
      // debugger;
       var creadoobj = { buildingid: 1 , userid: this.IDUSR };
       //debugger;
       this.heroService.ServicioPostPost("SeeDesignIndex", creadoobj).subscribe((value) => {
   
   
         switch (value.result) {
           case "Error":
             console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
             break;
           default:
             //debugger; 
             if (value.result == "Success") {
              //  debugger;
               this.posts = value.item;
             }
         }
       });
     }
  
  
       
  showSuccess() {
    this.toasterService.pop('success', 'Success ', 'Publicación Actualizada Correctamente ');
  }

  showError() {
    this.toasterService.pop('error', 'Error ', 'Por favor completa todos los campos ');
  }
  showWarning() {
    this.toasterService.pop('warning', 'Warning Toaster', 'Completa todos los campos por favor');
  }
   


     passdata(id:any ){
      this.PostId = id ; 
     }
  
     
     updatephoto() {
      // debugger;
      if(this.imageInputLabel!="Choose file"){
      var creadoobj = { id: this.PostId, Photo: this.postphoto,  Position: this.PostId };
      //debugger;
  
      this.heroService.ServicioPostPost("UpdateDesignIndex", creadoobj).subscribe((value) => {
  
  
        switch (value.result) {
          case "Error":
            console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
           
            break;
          default:
            //debugger;
            if (value.result == "Success") {
              this.get_photos();
              this.postphoto=""; 
              this.imageInputLabel="Choose file";
              this.showSuccess();
            }
        }
      });    
    }
    else {
      this.showWarning();
    }
  
    }
     
    prepareImages(e) {
      //debugger; 
      if (Utils.isDefined(e.srcElement.files)) {
        for (let f of e.srcElement.files) {
          //debugger;
          this.newImages.push(f);
        }
      }
      this.addImages();
  
    }
  
  
    addImages() {
      let url: string = '';
      if (!Utils.isEmpty(this.newImages)) {
        for (let f of this.newImages) {
          this.imageInputLabel = f.name;
          this.heroService.UploadImgSuc(f).subscribe((r) => {
            if (Utils.isDefined(r)) {
              url = <string>r.message;
            //  debugger;
              url = url.replace('/Imagenes', this.heroService.getURL() + 'Flip');
              //debugger;
              this.postphoto = url;
              //debugger;
              this.newImages = [];
            }
          })
        }
      }
    }
  }
  