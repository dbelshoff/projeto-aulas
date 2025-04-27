import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { Message } from './message.model';
import { MessageService } from './message.services';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css',
})
export class MessageInputComponent {
  errorMessage: string | null = null;

  constructor(private messageService: MessageService) {}

  onSubmit(form: NgForm) {
    if (!localStorage.getItem('token')) {
      this.errorMessage = 'Você precisa estar logado para enviar uma mensagem.';
      return;
    }

    const newMessage = new Message(form.value.myContent, 'Vini');

    this.messageService.addMessage(newMessage).subscribe(
      (response) => {
        form.resetForm();
        this.messageService.getMessages();
      },
      (error) => {
        console.error('Erro ao adicionar mensagem:', error);
      }
    );
  }
}
