import { Routes } from '@angular/router';
import { StoreFrontLayoutComponent } from './layouts/store-front-layout/store-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GenderPageComponent } from './pages/gender-page/gender-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { NotFountPageComponent } from './pages/not-fount-page/not-fount-page.component';

export const storeFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'gender/:gender', component: GenderPageComponent },
      { path: 'products/:idSlug', component: ProductPageComponent },
      { path: 'not-found', component: NotFountPageComponent },
    ]
  },
  {
    path: '**', redirectTo: ''
  }
]

export default storeFrontRoutes
