import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  paginationService = inject(PaginationService)
  productService = inject(ProductsService)
  productsPerPage = signal(10)
  router = inject(Router)

  productsResourse = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      productsPerPage: this.productsPerPage()
    }),
    stream: ({params}) => {
      return this.productService.getProducts({
        offset: params.page * params.productsPerPage,
        limit: params.productsPerPage
      })
    }
  })

  onProductsPerPageSelect(value: number) {
    this.productsPerPage.set(value)
    this.router.navigateByUrl('/admin/products?page=1')
  }
}
