import { Injectable } from '@angular/core';

// Importar objetos de la librería http
//import { Http, Response, RequestOptions, Headers } from '@angular/http';
// Importar la clase Observable desde la librería rxjs
//import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class DatosService {


    //public heroesUrl = 'http://localhost:49314/api/';  // URL to web api 
    public heroesUrl = 'http://23.253.173.64:8088/api/';  // URL to web api 
  private url: string = 'http://23.253.173.64:8088/'; // URL api server 

  getURL() {
    return this.url;
  }

    constructor(private http: HttpClient, private https: Http) { }
    getAPI() {
        return this.heroesUrl;
    }

    ServicioPostLogin(url, parametros): Observable<any> {
        let headers = new HttpHeaders();
      console.log(parametros);
      debugger;
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post(this.heroesUrl + 'Login/' + url, parametros);
    }
    ServicioPostRecoverPass(url, parametros): Observable<any> {
        let headers = new HttpHeaders();
        console.log(parametros);
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post(this.heroesUrl + 'RecoverPass/' + url, parametros);
    }
    ServicioPostPost(url, parametros): Observable<any> {
        let headers = new HttpHeaders();
        console.log(parametros);
        headers = headers.set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post(this.heroesUrl + 'Post/' + url, parametros);
    }
  ServicioPostBuilds(url, parametros): Observable<any> {
    let headers = new HttpHeaders();
    console.log(parametros);
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.post(this.heroesUrl + 'Building/' + url, parametros);
  }
  UploadImgSuc(fileToUpload: any): any {

    let input = new FormData();
    input.append("file", fileToUpload);
    debugger;
    return this.http.post(this.heroesUrl + "Post/UploadImg", input);
  }

}