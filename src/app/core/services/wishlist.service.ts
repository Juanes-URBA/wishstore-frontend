import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { WishlistRequest, WishlistResponse } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<WishlistResponse[]> {
    return this.http.get<WishlistResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  addToWishlist(request: WishlistRequest): Observable<WishlistResponse> {
    return this.http.post<WishlistResponse>(this.apiUrl, request);
  }

  removeFromWishlist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}