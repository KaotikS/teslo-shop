import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productService = inject(ProductsService)
  paginationService = inject(PaginationService)

  productsResourse = rxResource({
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        offset: params.page * 8
      })
    }
  })
}
