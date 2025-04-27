import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageComponentSignal } from './message-signal.component';
import { Message } from './message.model';
import { MessageService } from './message.services';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [FormsModule, MessageComponentSignal, CommonModule],
  template: `
    <div class="col-md-8 col-md-offset-2">
      @for (msg of messages; track msg.messageId) {
      <app-message-signal
        [messageVarClasse]="msg"
        (messageDeleted)="onMessageDeleted()"
      >
      </app-message-signal>
      <br />
      <br />
      } @empty { Não existem mensagens para exibir! }
    </div>
  `,
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];

  private messageSub!: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageSub = this.messageService.messages$.subscribe((messages) => {
      this.messages = [...messages];
    });

    this.messageService.getMessages();
  }

  ngOnDestroy(): void {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
    }
  }

  onMessageDeleted(): void {
    this.messageService.getMessages();
  }
}
