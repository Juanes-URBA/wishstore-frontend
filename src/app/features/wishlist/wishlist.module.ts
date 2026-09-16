import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { WishlistPageComponent } from './pages/wishlist-page/wishlist-page.component';

@NgModule({
  declarations: [
    WishlistPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class WishlistModule {}