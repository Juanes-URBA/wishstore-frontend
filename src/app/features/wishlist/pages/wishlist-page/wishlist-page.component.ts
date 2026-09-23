import { Component, OnInit } from '@angular/core';
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

  // Catálogo completo, usado como opciones del selector en el modal
  allProducts: ProductResponse[] = [];

  // Estado del modal "Cambiar producto"
  modalOpen = false;
  modalItem: WishlistItem | null = null;
  modalSelectedProductId: number | null = null;
  modalError = '';
  modalSaving = false;

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService
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

  openChangeProductModal(item: WishlistItem): void {
    this.modalItem = item;
    this.modalSelectedProductId = item.wishlist.productId;
    this.modalError = '';
    this.modalOpen = true;

    if (this.allProducts.length === 0) {
      this.productService.getProducts().subscribe({
        next: (products) => (this.allProducts = products),
        error: () => (this.modalError = 'No se pudieron cargar los productos disponibles.')
      });
    }
  }

  closeModal(): void {
    this.modalOpen = false;
    this.modalItem = null;
    this.modalSelectedProductId = null;
    this.modalError = '';
  }

  confirmChangeProduct(): void {
    if (!this.modalItem || !this.modalSelectedProductId) {
      return;
    }

    this.modalSaving = true;
    this.modalError = '';

    this.wishlistService.update(this.modalItem.wishlist.id, this.modalSelectedProductId).subscribe({
      next: (updated) => {
        this.productService.getProductById(updated.productId).subscribe((product) => {
          const index = this.items.findIndex((i) => i.wishlist.id === updated.id);
          if (index > -1) {
            this.items[index] = { wishlist: updated, product };
          }
          this.modalSaving = false;
          this.closeModal();
          this.successMessage = 'Producto de la wishlist actualizado.';
          setTimeout(() => (this.successMessage = ''), 3000);
        });
      },
      error: (err) => {
        this.modalSaving = false;
        if (err.status === 404) {
          this.modalError = 'El producto seleccionado no existe.';
        } else {
          this.modalError = 'No se pudo actualizar el producto.';
        }
      }
    });
  }
}