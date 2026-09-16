import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { ProductResponse } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductResponse[] = [];
  categories: string[] = [];

  loading = false;
  errorMessage = '';

  searchTerm = '';
  selectedCategory = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.categories = this.extractCategories(products);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el catálogo.';
        this.loading = false;
      }
    });
  }

  search(): void {
    const term = this.searchTerm.trim();

    if (!term) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.productService.searchByName(term).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo realizar la búsqueda.';
        this.loading = false;
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (!category) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.productService.getByCategory(category).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo filtrar por categoría.';
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.loadProducts();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/product', id]);
  }

  private extractCategories(products: ProductResponse[]): string[] {
    const unique = new Set(products.map(p => p.category));
    return Array.from(unique);
  }
}