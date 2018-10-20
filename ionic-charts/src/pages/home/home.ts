import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('lineCanvas') lineCanvas;
  observer: Observable<any>;
  result : JSON;
  products: any[];
  items = [{"id": "2", 
            "name": "iphone", 
            "data": "blub" }]


  public getSimilarProducts(){
    this.observer = this.httpClient.get('http://localhost:5000/similarprods')
    this.observer.subscribe(data => { 
      this.result = data
     })
     console.log("result", this.result[0])

     for (let product in this.result){
      console.log(this.result[product])
      this.products.push(this.result[product])
     }     

  }

  // call the rest api inside the constructor
  constructor(public navCtrl: NavController, public httpClient: HttpClient) {
    this.observer = this.httpClient.get('http://localhost:5000/similarprods')
    this.observer.subscribe(data => { 
      this.result = data
     })
    
  }

}
