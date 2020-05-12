import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { DatosService } from '../../../../../datos.service';
import { LoaderComponent } from '../../../../../ts/loader';
import { SystemMessage } from '../../../../../ts/systemMessage';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Utils } from '../../../../utils/utils';

@Component({
  selector: 'app-room-new',
  templateUrl: './room-new.component.html',
  styleUrls: ['./room-new.component.scss']
})
export class RoomNewComponent implements OnInit {

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public services: DatosService,
    private _formBuilder: FormBuilder,
    private _location: Location
  ) { }

  public section: string;
  buildingId;
  roomObj = {
    active: false,
    buildingId: 0,
    description: '',
    id: 0,
    imageRooms: [],
    name: '',
    price: 0,
    typeRoomId: 0,
  };
  imageRooms;
  typeRoomList;

  loader = new LoaderComponent();
  systemMessage = new SystemMessage();

  public images_in_gallery:any = [
    {id: 0, src: '../../../assets/14.jpg', can_delete: false, last_one: true}
  ];

  public form_required: any = {
    no_name: false,
    no_description: false,
    no_price: false,
    perkPhotoCtrl: this._formBuilder.group({ labelCtrl: ['Choose file'], photoCtrl: [], serverUrlCtrl: [] }),
  };

  ngOnInit() {
    this.section = 'roomCatalog';
    this.buildingId = this.route.snapshot.paramMap.get('id');
    this.getTypeRooms(this.buildingId);
  }

  getTypeRooms(id) {
    let obj = { buildingId: id };
    this.services.service_general_get_with_params('Room/getTypeRoom', obj).subscribe((value) => {
      this.typeRoomList = value.item;
      console.log('Reponse Type Room ', this.typeRoomList);
    });
  }

  update () {
    this.loader.showLoader();
    if (this.roomObj.name.length === 0) {
      this.form_required.no_name = true;
      this.loader.hideLoader();
    } else if (this.roomObj.description.length === 0) {
      this.form_required.no_name = false;
      this.form_required.no_description = true;
      this.loader.hideLoader();
    } else if (this.roomObj.price === 0 || this.roomObj.price === null) {
      this.form_required.no_price = true;
      this.form_required.no_name = false;
      this.form_required.no_description = false;
      this.loader.hideLoader();
    } else {
      let gallery: any[] = [];
      this.images_in_gallery.forEach(element => {
        let data = {
          id: 0,
          idRoom: this.roomObj.id,
          active: true,
          photoUrl: element.src
        };
        gallery.push(data);
       
      });
      console.log('New Gallery', gallery);
      this.roomObj.imageRooms = gallery;
      this.roomObj.typeRoomId = this.roomObj.typeRoomId;
      this.roomObj.buildingId = parseInt(this.buildingId);
      console.log(this.roomObj);
      // return;
      this.services.service_general_post('Room/addRoom', this.roomObj).subscribe((value) => {
        this.form_required.no_price = false;
        this.form_required.no_name = false;
        this.form_required.no_description = false;
        this.loader.hideLoader();
        switch(value.result) {
          case 'Success':
            this.systemMessage.showMessage({
              kind: 'ok',
              message: {
                header: value.detalle,
                text: 'The Room has been update successfully.'
              },
              time: 2000
            });
            this._location.back();
            break;
        }
      });
    }
  }

  public addOneImageToGallery():void {
    let new_image = {
      id: 0,
      src: '../../../assets/14.jpg',
      can_delete: true,
      last_one: false
    };
    this.images_in_gallery.push( new_image );
    this.images_in_gallery.forEach( ( image: any, index ) => {
      image.id = index;
      image.last_one = false;
    });
    this.images_in_gallery[this.images_in_gallery.length - 1].last_one = true;
  }

  public getGalleryImages( id_image: string ):void {
    const image_container = document.getElementById(id_image).parentElement.querySelector('img');
    setTimeout( () => {
      image_container.src = this.imagesOnGallery;
    }, 420);
  }

  public validateImageUpload( event_data:any, dimensions_image:string, target_image:string, name_image:string ):void {
    const event = event_data.target,
          dimensions_image_data = {
            get_dimensions: ( function() {
              const dimensions_split = dimensions_image.split('x'),
                    width = Number( dimensions_split[0] ),
                    height = Number( dimensions_split[1] );
              return {
                width: width,
                height: height
              }
            }())
          },
          image_limit_width = dimensions_image_data.get_dimensions.width,
          image_limit_height = dimensions_image_data.get_dimensions.height,
          id_image_container:any = document.getElementById( target_image ),
          name_image_container = document.getElementById( name_image ),
          native_image_uploaded = document.getElementById('image_real_dimension'),
          root_data = this;

    if( event.files && event.files[0] ) {
      const reader = new FileReader();
            reader.onload = function(e:any) {
              const image_convert:any = e.target.result,
                    validating_image = new Promise( (resolve) => {
                      native_image_uploaded.setAttribute('src', image_convert);
                      setTimeout( () => {

                        const native_image_dimension = {
                          image: image_convert,
                          width: native_image_uploaded.offsetWidth,
                          height: native_image_uploaded.offsetHeight
                        };

                        resolve( native_image_dimension );

                      }, 420);
              
                    });

                    validating_image.then( ( image_data:any ) => { 

                      if( image_limit_width === image_data.width && image_limit_height === image_data.height ) {

                        id_image_container.setAttribute('src', image_data.image );
                        name_image_container.innerHTML = `<span class="image-name">${ event.files[0].name }</span>`;
                        id_image_container.classList.remove('no-image');
                        if( event.hasAttribute('gallery') ) root_data.getGalleryImages(event.getAttribute('id'));

                      } else {

                        id_image_container.src = '../../../assets/14.jpg';
                        name_image_container.innerHTML = `La imagen debe medir <br /><span class="text-bold">${ dimensions_image }</span>`;
                        id_image_container.classList.add('no-image');
                        // if( !event.hasAttribute('gallery') ) root_data.data_perk.photo = '../../../../../assets/14.jpg';

                      }
                      
                    });

            }

            reader.readAsDataURL( event.files[0] );

    }
    
  }

  public newImagesG: any[] = [];
  public imagesOnGallery: string;
  prepareImagesG(e, id) {     
    if (Utils.isDefined(e.srcElement.files)) {
      for (let f of e.srcElement.files) {        
        this.newImagesG.push(f);
        console.log( e.srcElement.files );
      }
    }
    this.addImagesG(id);
  }

  addImagesG(id) {
    let url: string = '';
    if (!Utils.isEmpty(this.newImagesG)) {
      for (let f of this.newImagesG) { console.log( this.newImagesG );
        this.services.UploadImgSuc(f).subscribe((r) => {
          if (Utils.isDefined(r)) {
            url = <string>r.message;
            url = url.replace('/Imagenes', this.services.getURL() + 'Flip'); 
            console.log('Desde la galeria => ',url);   
            this.newImagesG = [];
            this.imagesOnGallery = url;
            this.images_in_gallery.forEach(element => {
              element.src = element.id === id ? url : element.src;
            });
            console.log(url);
          }
        })
      }
    }
  }

  public deleteImageFromGallery( id:number ):void {

    this.images_in_gallery.splice( this.images_in_gallery.forEach( (image:any) => {  image.id == id } ), 1);

    this.images_in_gallery[this.images_in_gallery.length - 1].last_one = true;
    this.images_in_gallery[0].can_delete = false;

  }

}
