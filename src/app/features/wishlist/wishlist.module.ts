import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WishlistPageComponent } from './pages/wishlist-page/wishlist-page.component';

@NgModule({
  declarations: [
    WishlistPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class WishlistModule {}