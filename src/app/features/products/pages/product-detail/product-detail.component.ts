import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ProductResponse } from '../../../../core/models/product.model';
import { CURRENT_USER_ID } from '../../../../core/constants/user.constant';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: ProductResponse | null = null;
  loading = false;
  errorMessage = '';

  addingToWishlist = false;
  wishlistMessage = '';
  wishlistMessageType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'El producto no existe.';
      return;
    }

    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'El producto no existe.';
        } else {
          this.errorMessage = 'No se pudo cargar el producto.';
        }
      }
    });
  }

  addToWishlist(): void {
    if (!this.product) {
      return;
    }

    this.addingToWishlist = true;
    this.wishlistMessage = '';

    this.wishlistService.addToWishlist({
      userId: CURRENT_USER_ID,
      productId: this.product.id
    }).subscribe({
      next: () => {
        this.wishlistMessage = 'Producto agregado a tu wishlist.';
        this.wishlistMessageType = 'success';
        this.addingToWishlist = false;
      },
      error: (err) => {
        this.addingToWishlist = false;
        this.wishlistMessageType = 'error';

        if (err.status === 409) {
          this.wishlistMessage = 'Este producto ya está en tu wishlist.';
        } else if (err.status === 404) {
          this.wishlistMessage = 'El producto no existe.';
        } else {
          this.wishlistMessage = 'No se pudo agregar el producto a tu wishlist.';
        }
      }
    });
  }
}