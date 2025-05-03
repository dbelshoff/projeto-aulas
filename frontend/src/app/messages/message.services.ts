import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, subscribeOn } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:5000/api/messages';

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateMessages(messages: Message[]): void {
    this.messagesSubject.next(messages);
  }

  getMessages(): void {
    this.http.get<Message[]>(this.apiUrl).subscribe(
      (messages) => {
        console.log('Mensagens recebidas do backend:', messages);
        this.messagesSubject.next(messages);
      },
      (error) => {
        console.error('Erro ao carregar mensagens:', error);
      }
    );
  }

  addMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  updateMessage(message: Message): Observable<Message> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<Message>(
      `${this.apiUrl}/${message.messageId}`,
      message,
      { headers }
    );
  }
}
