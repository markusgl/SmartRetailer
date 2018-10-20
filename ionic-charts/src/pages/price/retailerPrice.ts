export interface IRetailerPrice {
    retailerId: number,
    current: boolean,
    retailerName: string,
    retailerAddress: string,
    // distance can be requested through google maps api
    retailerDistance: number,
    productPrice: number,
    rating: number
}