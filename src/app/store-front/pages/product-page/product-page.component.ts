import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productService = inject(ProductsService)
  idSlug = inject(ActivatedRoute).snapshot.params['idSlug']

  productResource = rxResource({
    params: () => ({ idSlug: this.idSlug }),
    stream: ({params}) => this.productService.getProductByIdSlug(params.idSlug)
  })
}
