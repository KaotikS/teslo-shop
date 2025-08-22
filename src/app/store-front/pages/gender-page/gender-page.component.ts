import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  productService = inject(ProductsService)
  paginationService = inject(PaginationService)

  route = inject(ActivatedRoute)
  gender = toSignal(
    this.route.params.pipe(
      map(({gender}) => gender)
    )
  )

  productsResourse = rxResource({
    params: () => ({
      gender: this.gender(),
      page: this.paginationService.currentPage() - 1
    }),
    stream: ({params}) => {
      return this.productService.getProducts({
        gender: params.gender,
        offset: params.page * 8
      })
    }
  })
}
