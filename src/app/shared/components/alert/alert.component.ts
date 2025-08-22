import { Component, input } from '@angular/core';

@Component({
  selector: 'alert',
  imports: [],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  errorText = input<string>('Something went wrong')
}
