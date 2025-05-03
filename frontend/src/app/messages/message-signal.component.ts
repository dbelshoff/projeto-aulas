import { FormsModule } from '@angular/forms';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Message } from './message.model';
import { CommonModule } from '@angular/common';
import { MessageService } from './message.services';

@Component({
  selector: 'app-message-signal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './message-signal.component.html',
  styleUrls: ['./message-signal.component.css'],
})
export class MessageComponentSignal {
  @Input() messageVarClasse: Message = new Message('', '', '', '');
  @Output() messageDeleted = new EventEmitter<void>();

  messageClassContent: any;
  messageClassUser: any;
  messageClassEmail: any;
  currentUserEmail: string | null = localStorage.getItem('email');
  isEditing = false;
  editedMessageContent: string = '';
  messageClassUserImage: string = '';

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageClassContent = this.messageVarClasse.content;
    this.messageClassUser = this.messageVarClasse.username;
    this.messageClassEmail = this.messageVarClasse.email;
    this.editedMessageContent = this.messageClassContent;7
    this.messageClassUserImage = 'http://localhost:5000/' + this.messageVarClasse.imagePath

  }

  onEdit() {
    this.isEditing = true;
  }

  onDelete(): void {
    this.messageService
      .deleteMessage(this.messageVarClasse.messageId!)
      .subscribe(
        () => {
          console.log('Mensagem deletada com sucesso.');
          this.messageDeleted.emit();
        },
        (error) => {
          console.error('Erro ao deletar mensagem:', error);
        }
      );
  }

  saveEdits() {
    const updatedMessage = {
      ...this.messageVarClasse,
      content: this.editedMessageContent,
    };

    this.messageService.updateMessage(updatedMessage).subscribe(
      (response) => {
        console.log('Mensagem atualizada com sucesso:', response);
        this.messageClassContent = this.editedMessageContent;
        this.isEditing = false;
      },
      (error) => {
        console.error('Erro ao salvar a mensagem:', error);
      }
    );
  }

  isOwnerOfMessage(): boolean {
    return this.messageClassEmail === this.currentUserEmail;
  }
}
