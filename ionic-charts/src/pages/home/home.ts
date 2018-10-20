import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/interval'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('lineCanvas') lineCanvas;
  observer: Observable<any>;
  result2 : any;
  result: any;
  items = []
  products = []
  timerVar;
  timerMin=10;
  timerSec=59;
  data:any={}

  public getSimilarProducts(productname:String){
    this.items = []

    //let headers = new HttpHeaders()
    //headers = headers.append('Content-Type','application/json')
    
    //e.g. Apple iPhone 7 Plus (32GB)
    console.log("productname", productname)
    if (productname != ""){
      let postData = {"data": productname}

      this.observer = this.httpClient.post('http://localhost:5000/devicedata', postData)
      this.observer.subscribe(data => { 
        this.result = data
      })

      console.log("result", this.result)
      let json_result;

      if (this.result != undefined){
        json_result = JSON.parse(JSON.stringify(this.result))
        
        console.log(json_result['recommendations'])
        for (let product in json_result['recommendations']){
          console.log(json_result['recommendations'][product])
          this.items.push(json_result['recommendations'][product])
        }
      }
    }
  }

  public getProductList(){
    
    this.httpClient.get('http://localhost:5000/getDeviceList').subscribe(data => 
    { 
      this.result2 = data
    })

    console.log("product results", this.result2)

    /*let json_result
    if (result2 != undefined){
      json_result = JSON.parse(JSON.stringify(this.result))
      for (let product in json_result){
        console.log(json_result)
        this.products.push(json_result)
      }
    }*/
  }

  startTimer(){
    // one second interval
    this.timerVar = Observable.interval(1000).subscribe( x => {
        this.timerSec -= 1;
        
        if (x == 0) {
          this.timerVar.unsubscribe()
        }
    })
  }


  // call the rest api inside the constructor
  constructor(public navCtrl: NavController, public httpClient: HttpClient) {
    /*this.observer = this.httpClient.get('http://localhost:5000/similarprods')
    this.observer.subscribe(data => { 
      this.result = data
     })*/
     this.data.productname=""
     this.getProductList()
  }

}
