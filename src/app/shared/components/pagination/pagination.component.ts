import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = input<number>(1)
  activePage = linkedSignal(this.currentPage)
  pages = input<number>(1)

  getPagesCount = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1)
  })
}
