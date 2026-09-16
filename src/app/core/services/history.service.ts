import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HistoryResponse } from '../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = `${environment.apiUrl}/history`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<HistoryResponse[]> {
    return this.http.get<HistoryResponse[]>(this.apiUrl);
  }
}