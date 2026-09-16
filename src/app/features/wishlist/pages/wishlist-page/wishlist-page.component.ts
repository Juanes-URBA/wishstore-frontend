import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { WishlistService } from '../../../../core/services/wishlist.service';
import { ProductService } from '../../../../core/services/product.service';
import { WishlistResponse } from '../../../../core/models/wishlist.model';
import { ProductResponse } from '../../../../core/models/product.model';
import { CURRENT_USER_ID } from '../../../../core/constants/user.constant';

interface WishlistItem {
  wishlist: WishlistResponse;
  product: ProductResponse | null;
}

@Component({
  selector: 'app-wishlist-page',
  templateUrl: './wishlist-page.component.html',
  styleUrls: ['./wishlist-page.component.scss']
})
export class WishlistPageComponent implements OnInit {
  items: WishlistItem[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  userId = CURRENT_USER_ID;

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    this.errorMessage = '';

    this.wishlistService.getByUser(this.userId).subscribe({
      next: (wishlistEntries) => {
        if (wishlistEntries.length === 0) {
          this.items = [];
          this.loading = false;
          return;
        }

        const productRequests = wishlistEntries.map((entry) =>
          this.productService.getProductById(entry.productId).pipe(
            catchError(() => of(null))
          )
        );

        forkJoin(productRequests).subscribe((products) => {
          this.items = wishlistEntries.map((entry, index) => ({
            wishlist: entry,
            product: products[index]
          }));
          this.loading = false;
        });
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar tu wishlist.';
        this.loading = false;
      }
    });
  }

  remove(wishlistId: number): void {
    this.wishlistService.removeFromWishlist(wishlistId).subscribe({
      next: () => {
        this.items = this.items.filter((item) => item.wishlist.id !== wishlistId);
        this.successMessage = 'Producto eliminado de tu wishlist.';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: () => {
        this.errorMessage = 'No se pudo eliminar el producto.';
      }
    });
  }

  edit(productId: number): void {
    this.router.navigate(['/product', productId, 'edit']);
  }
}