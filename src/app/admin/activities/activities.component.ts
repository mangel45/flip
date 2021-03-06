import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatosService } from '../../../datos.service';
import { Utils } from '../../utils/utils';
import { ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss', '../../../scss/vendors/toastr/toastr.scss'],    
  providers: [ToasterService]
})

export class ActivitiesComponent implements OnInit {
  
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
  comment: string = "";
  public newImages: any[] = [];

  public toasterconfig: ToasterConfig = new ToasterConfig({
      tapToDismiss: true,
      timeout: 3000,
      positionClass: "toast-top-center",
  });

  constructor(  private router: Router, private heroService: DatosService, private route: ActivatedRoute,
                private toasterService: ToasterService
                ) 
  { }

  ngOnInit() {
    if (localStorage.getItem("user") == undefined) {
      this.router.navigate(['/login']);
    }
    else {
      this.user = JSON.parse(localStorage.getItem("user"));
      console.log(this.user);
      this.IDUSR = JSON.parse(localStorage.getItem("user")).id;
      this.IDBUILD = this.route.snapshot.params['id']; 
      // this.get_posts();          
    }
  }  

  showSuccess() { 
    this.toasterService.pop('success', 'Success ', 'Your post was published correctly '); 
  }
  showWarning() {
    // this.toasterService.pop('warning', 'Post Deleted', 'The post was deleted'); 
  }
  showError() { 
    // this.toasterService.pop('error', 'Error ', 'An unexpected error occurred '); 
  }

  get_posts() {   
    var creadoobj = { buildingid: this.route.snapshot.params['id'] , userid: this.IDUSR };    
    this.heroService.ServicioPostPost("SeePost", creadoobj).subscribe((value) => {
      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          break;
        default:          
          if (value.result == "Success") {
            this.posts = value.item;
          }
      }
    });
  }

  addPost() {    
    var creadoobj = { id: 0, title: this.posttitle, userid: this.IDUSR, PostText: this.posttext, photo: this.postphoto, BuildingId: this.route.snapshot.params['id'] };        
    this.heroService.ServicioPostPost("PostPosts", creadoobj).subscribe((value) => {
      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          this.showError(); 
          break;
        default:          
          if (value.result == "Success") {
            this.get_posts();
             
            this.postphoto = "assets/img/Coliving.jpg";
            this.posttext = "";
            this.posttitle = "";
            // this.showSuccess();
          }
      }
    });
  }

  prepareImages(e) {
     
    if (Utils.isDefined(e.srcElement.files)) {
      for (let f of e.srcElement.files) {
        
        this.newImages.push(f);
      }
    }
    this.addImages();
  }

  addImages() {
    let url: string = '';
    if (!Utils.isEmpty(this.newImages)) {
      for (let f of this.newImages) {
        this.heroService.UploadImgSuc(f).subscribe((r) => {
          if (Utils.isDefined(r)) {
            url = <string>r.message;
            
            url = url.replace('/Imagenes', this.heroService.getURL() + 'Flip');
            
            this.postphoto = url;
            
            this.newImages = [];
          }
        })
      }
    }
  }


  editPost(id: number) {this.router.navigate(['/editcomment/' + id])}

  deletePost(idpost: number) {
    var creadoobj = { id: idpost, title: "", userid: this.IDUSR, PostText: "", photo: "", BuildingId: this.route.snapshot.params['id'] };
    
    this.heroService.ServicioPostPost("DeletePost", creadoobj).subscribe((value) => {
      switch (value.result) {
        case "Error":
          console.log("Ocurrio un error al cargar los catalogos: " + value.detalle);
          this.showError();
          break;

        default:          
          if (value.result == "Success") {
            this.get_posts();
            this.showWarning();
          }
      }
    }); 
  }

}
