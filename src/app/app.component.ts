import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'aqz-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet /> `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-quiz-app';
}
