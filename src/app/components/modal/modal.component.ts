import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('notificationState', [
      state(
        'visible',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        }),
      ),
      state(
        'hidden',
        style({
          transform: 'translateY(-100%)',
          opacity: 0,
        }),
      ),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class ModalComponent {
  public notification$ = inject(ModalService).getNotification();
}
