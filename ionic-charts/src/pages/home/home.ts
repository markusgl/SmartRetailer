import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { PricePage } from '../price/price';
//import 'rxjs/add/observable/interval'

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
  stars:any;
  similarities = [96, 92, 90, 93];
  ratings = [3.4, 4.1, 4.3, 3.9];
  

  public getSimilarProducts(productname:String){
    this.items = []
    console.log("items", this.items)

    console.log("productname", productname)
    if (productname != ""){
      let postData = {"data": productname}

      console.log("productname home", this.data.productname)
      localStorage.setItem('myData',JSON.stringify({"productname": this.data.productname}));

      this.observer = this.httpClient.post('http://localhost:5000/devicedata', postData)
      this.observer.subscribe(data => { 
        this.result = data
      
        let json_result;
        if (this.result != undefined){
          json_result = JSON.parse(JSON.stringify(this.result))
          console.log("stars", json_result['stars'])
          
          for (let product in json_result['recommendations']){
            this.items.push(json_result['recommendations'][product])
          } 
        }
        else{
          // TODO
          console.log("No similar products found.")
        }
      })
      
      // Discount alert
      const alert = this.alertCtrl.create({
        title: 'Discout Alert!',
        subTitle: 'Buy within the next 10 minutes and get 10% discount!',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  public getProductList(){
    this.products = []

    this.httpClient.get('http://localhost:5000/getDeviceList').subscribe(data => 
    { 
      this.result2 = data
    
      let json_result
      if (this.result2 != undefined){
        json_result = JSON.parse(JSON.stringify(this.result2))
        for (let product in json_result){
          this.products.push(json_result[product])
        }
        this.products.sort()
      }
    }) 
  }


  constructor(public navCtrl: NavController, public httpClient: HttpClient, public alertCtrl: AlertController) {
      this.data.productname=""
  }

  ngOnInit(): void {
    this.getProductList()
  }

}
