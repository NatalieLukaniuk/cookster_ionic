import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/recipies.models';
import { ProductsApiService } from './products-api.service';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productsApi = inject(ProductsApiService);
  uiService = inject(UiService)

  private products = signal<Product[]>([]);
  private sortedProducts = computed(() => {
    const sorted = this.products()
    sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  })
  getProducts = this.products.asReadonly();
  getSortedProducts = this.sortedProducts;
  private isProductsLoaded = signal(false);
  getIsProductsLoaded = this.isProductsLoaded.asReadonly();

  private ingredientsToAdd = signal<string[]>([]);
  getIngredientsToAdd = this.ingredientsToAdd.asReadonly();

  loadProducts(): Observable<Product[]> {
    return this.productsApi.getProducts().pipe(
      take(1),
      map((res: Object) => {
        const products = Object.entries(res).map(([id, product]) => ({ ...product, id })).reverse();
        return products;
      }),
      tap((products: Product[]) => {
        this.setProducts(products);
        this.setIsProductsLoaded()
      }),
      catchError(err => {
        this.uiService.setError("Не вдалось завантажити продукти з бази" + err.message);
        return of([])
      })
    )
  }

  private setProducts(products: Product[]) {
    this.products.set(products)
  }

  private setIsProductsLoaded() {
    this.isProductsLoaded.set(true)
  }

  addNewProduct() {

  }

  updateProduct(product: Product): Observable<Product | null> {
    this.uiService.setIsLoadingTrue()
    return this.productsApi.updateProduct(product.id, product).pipe(
      take(1),
      tap(product => {
        this.onProductUpdated(product);
        this.uiService.setIsLoadingFalse();
        this.uiService.showSuccessMessage(`${product.name} оновлено`)
      }),
      catchError(err => {
        this.uiService.setIsLoadingFalse();
        this.uiService.setError(`Не вдалось оновити продукт: ${err.message}`)
        return of(null)
      })
    )
  }

  private onNewProductAdded(newProduct: Product) {
    this.products.update(current => {
      let _array = current.map((product) => product);
      _array.unshift(newProduct);
      return _array;
    })
  }

  private onProductUpdated(updatedProduct: Product) {
    this.products.update((current) => {
      const updatedProducts = current.map((product) => {
        if (product.id == updatedProduct.id) {
          return updatedProduct;
        } else return product;
      });
      return updatedProducts
    })
  }

}
