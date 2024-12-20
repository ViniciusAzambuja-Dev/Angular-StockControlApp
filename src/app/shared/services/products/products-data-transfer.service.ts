import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  public productsDatas: Array<GetAllProductsResponse> = [];

  setProductsDatas(products: Array<GetAllProductsResponse>) : void {
    if(products){
      this.productsDataEmitter$.next(products)
      this.getProductsDatas();
    }
  }
  getProductsDatas(){
    this.productsDataEmitter$
    .pipe(
      take(1),
      map((data) => data?.filter((product) => product.amount > 0))
    ).subscribe({
      next: (response) => {
        if(response){
          this.productsDatas = response;
        }
      },
    });
    return this.productsDatas;
  }
}
