import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>()

  router = inject(Router)
  formBuilder = inject(FormBuilder)
  wasSaved = signal(false)
  tempImages = signal<string[]>([])
  imageFileList: FileList | undefined = undefined
  imagesToCarousel = computed(() => {
    return [...this.product().images, ...this.tempImages()]
  })

  productService = inject(ProductsService)

  detailsForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [
      Validators.required,
      Validators.pattern(FormUtils.slugPattern)
    ]],
    price: [0, [
      Validators.required,
      Validators.min(0)
    ]],
    stock: [0, [
      Validators.required,
      Validators.min(0)
    ]],
    sizes: [['']],
    images: [['']],
    tags: [''],
    gender: ['men', [
      Validators.required,
      Validators.pattern(/men|women|kid|unisex/)
    ]]
  })

  sizes = [
    'XS', 'M', 'L', 'XL', 'XXL'
  ]

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>) {
    this.detailsForm.patchValue(formLike as any)
    this.detailsForm.patchValue({ tags: formLike.tags?.join(',') })
  }

  onSizeChange(size: string) {
    const currentSizes = this.detailsForm.value.sizes ?? []

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    } else {
      currentSizes.push(size)
    }

    this.detailsForm.patchValue({ sizes: currentSizes })
  }

  async onSubmit() {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched()
      return
    }

    const formValue = this.detailsForm.value
    const productLike: Partial<Product> = {
      ...(this.detailsForm.value as any),
      tags: formValue.tags?.
        toLowerCase().
        split(',').
        map(tag => tag.trim()) ?? []
    }

    const productId = this.product().id

    if (productId === 'new') {
      // Create product
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      )
      console.log('Product created', {product})
      this.router.navigate(['/admin/products', product.id])
    } else {
      // Update product
      const product = await firstValueFrom(
        this.productService.updateProduct(productId, productLike, this.imageFileList)
      )
      console.log('Product updated', {product})
    }

    this.wasSaved.set(true)
    setTimeout(() => {
      this.wasSaved.set(false)
    }, 3000)
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files ?? undefined
    this.imageFileList = files

    const imageUrls = Array.from(files ?? []).map(
      file => URL.createObjectURL(file)
    )

    this.tempImages.set(imageUrls)
  }
}
