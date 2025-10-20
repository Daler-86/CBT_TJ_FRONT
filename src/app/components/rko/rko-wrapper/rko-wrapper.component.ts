import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rko-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './rko-wrapper.component.html',
  styleUrl: './rko-wrapper.component.scss',
})
export class RkoWrapperComponent {}
