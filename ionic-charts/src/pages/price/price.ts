import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { IRetailerPrice } from './retailerPrice';

@Component({
  selector: 'page-price',
  templateUrl: 'price.html'
})
export class PricePage implements OnInit {
  distance: number = 5;
  filterTopRetailers: boolean = false;
  productname:String;
  filteredPriceData: IRetailerPrice[];
  priceData: IRetailerPrice[];
  result: any;
  json_result:JSON;

  @ViewChild('lineCanvas') lineCanvas;
  plotdata: Observable<any>;
  observer: Observable<any>;

  //**########## BAR CHART ######### *//
  public barChartType:string = 'bar';
  public barChartLegend:boolean = false;
//   // grey '#8dd35f'
  public backgroundColors:[{backgroundColor: ["#e84351", "#434a54", "#3ebf9b", "#4d86dc", "#f3af37"]}]
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
         ticks: {
            max: 600,
            min: 300
         }
      }]
    }
  };

  public barChartLabels: string[] = [];
  public barChartData: any[] = [{data:[]}];

  // ctor
  constructor(public navCtrl: NavController, public httpClient: HttpClient) {
    let data = JSON.parse(localStorage.getItem('myData'));
    this.productname = data.productname;
    
    this.getPrices()
  }

  getPrices():void{
    //request the data
    let data = JSON.parse(localStorage.getItem('myData'));
    this.productname = data.productname;

    console.log("productname", this.productname)
    let postData = {"data": this.productname} 
    //let postData = {"data":"Apple iPhone 7 (32GB)"}
    this.observer = this.httpClient.post('http://localhost:5000/getPricesInOtherShops', postData)
    this.observer.subscribe(data => { 
      this.result = data
    })
    console.log("received results", this.result)
   
    if (this.result != undefined){
      this.json_result = JSON.parse(JSON.stringify(this.result))
      console.log(this.json_result)
    }
    

    if (this.json_result != undefined){
      this.priceData = []
      for (let j = 0; j < 4; j++){
        console.log(this.json_result['prices'][j])
        console.log(this.json_result['shop'][j])
        
        this.priceData.push({
          "retailerId": 1,
          "productPrice": this.json_result['prices'][j],
          "current":false,
          "retailerName": this.json_result['shop'][j],
          "retailerAddress": null,
          "retailerDistance": null,
          "rating": 5
        })
      }

      this.initChart();
    }

  }


  ngOnInit(): void {
    this.getPrices()

    /*
    this.priceData = [
      {
        "retailerId": 1,
        "productPrice": 400,
        "current":false,
        "retailerName": "Amazon",
        "retailerAddress": null,
        "retailerDistance": null,
        "rating": 5
      },
      {
          "retailerId": 2,
          "productPrice": 449,
          "current":false,
          "retailerName": "Saturn WT",
          "retailerAddress": "GDN-0011",
          "retailerDistance": 2,
          "rating": 5
        },
        {
          "retailerId": 3,
          "productPrice": 449,
          "current":true,
          "retailerName": "Saturn M",
          "retailerAddress": "GDN-0011",
          "retailerDistance": 0,
          "rating": 5
        },
        {
          "retailerId": 4,
          "productPrice": 450,
          "current":false,
          "retailerName": "Garvis",
          "retailerAddress": "GDN-0011",
          "retailerDistance": 16,
          "rating": 3
        },
        {
          "retailerId": 5,
          "productPrice": 500,
          "current":false,
          "retailerName": "Telekom",
          "retailerAddress": "GDN-0011",
          "retailerDistance": 5,
          "rating": 5
        }
    ];

    this.initChart();
    */
  }

  // BAR CHART events
  public barChartClicked(e:any):void {
    console.log(e);
  }
  
  public barChartHovered(e:any):void {
    console.log(e);
  }
  
  public filterTopRetailersClicked(): void {
    this.filterTopRetailers = !this.filterTopRetailers;
    this.initChart();
  }

  public initChart():void{
    
    this.barChartLabels = [];
    this.barChartData[0].data = [];

    const dataByPrice = this.priceData.sort((n1, n2) => n1.productPrice - n2.productPrice);

    let minPrice = Number.MAX_VALUE;
    let maxPrice = 0;

    for (var idx in dataByPrice) // for acts as a foreach  
    {  
      if (this.filterTopRetailers && dataByPrice[idx].rating < 4) {
        continue;
      }
      if (dataByPrice[idx].retailerDistance > this.distance){
        continue;
      }

      this.barChartData[0].data.push(dataByPrice[idx].productPrice);
      this.barChartLabels.push(dataByPrice[idx].retailerName);
      minPrice = Math.min(minPrice, dataByPrice[idx].productPrice);
      maxPrice = Math.max(maxPrice, dataByPrice[idx].productPrice);

      if (dataByPrice[idx].current == true){
        // todo change color
      }
    }

    if (maxPrice > 0) {
      let range = maxPrice - minPrice;
      this.barChartOptions.scales.yAxes[0].ticks.max = Math.ceil((maxPrice + range*0.2)/10)*10;
      this.barChartOptions.scales.yAxes[0].ticks.min = Math.floor((minPrice + range*0.3)/10)*10;
    }
  }
}
