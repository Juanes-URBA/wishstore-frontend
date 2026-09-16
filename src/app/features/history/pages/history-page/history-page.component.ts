import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../../../core/services/history.service';
import { HistoryResponse } from '../../../../core/models/history.model';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit {
  events: HistoryResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = '';

    this.historyService.getAll().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el historial.';
        this.loading = false;
      }
    });
  }
}