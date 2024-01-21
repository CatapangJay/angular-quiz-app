import { Component } from '@angular/core';

@Component({
  selector: 'aqz-header',
  standalone: true,
  imports: [],
  template: `
    <nav class="bg-gray-800 text-gray-200 ">
      <div class="p-3 flex items-center justify-center">
        <div>GCP: Associate Cloud Engineer Exam</div>
        <!-- <div><span>1:30:00</span></div> -->
      </div>
    </nav>
  `,
})
export class HeaderComponent {}
