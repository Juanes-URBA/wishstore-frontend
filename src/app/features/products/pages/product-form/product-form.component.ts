import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { ProductRequest, ProductResponse } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  isEditMode = false;
  productId: number | null = null;

  formData: ProductRequest = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: ''
  };

  loading = false;
  saving = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProductById(id).subscribe({
      next: (product: ProductResponse) => {
        this.formData = {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          image: product.image ?? ''
        };
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el producto para editar.';
        this.loading = false;
      }
    });
  }

  isValid(): boolean {
    return (
      this.formData.name.trim().length > 0 &&
      this.formData.category.trim().length > 0 &&
      this.formData.price >= 0 &&
      this.formData.stock >= 0
    );
  }

  save(): void {
    if (!this.isValid()) {
      this.errorMessage = 'Completa nombre, categoría, y valores válidos de precio y stock.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const request$ = this.isEditMode && this.productId
      ? this.productService.updateProduct(this.productId, this.formData)
      : this.productService.createProduct(this.formData);

    request$.subscribe({
      next: (product) => {
        this.saving = false;
        this.router.navigate(['/product', product.id]);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = this.isEditMode
          ? 'No se pudo actualizar el producto.'
          : 'No se pudo crear el producto.';
      }
    });
  }

  cancel(): void {
    if (this.isEditMode && this.productId) {
      this.router.navigate(['/product', this.productId]);
    } else {
      this.router.navigate(['/catalog']);
    }
  }
}