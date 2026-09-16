import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './features/products/pages/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/pages/product-detail/product-detail.component';
import { WishlistPageComponent } from './features/wishlist/pages/wishlist-page/wishlist-page.component';
import { HistoryPageComponent } from './features/history/pages/history-page/history-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'wishlist', component: WishlistPageComponent },
  { path: 'history', component: HistoryPageComponent },
  { path: '**', redirectTo: 'catalog' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}