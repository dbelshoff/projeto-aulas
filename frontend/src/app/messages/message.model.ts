export class Message {
  messageId?: string;
  content: string;
  userId?: string;
  username: string;
  email?: string;
  imagePath?: string;

  constructor(
    content: string,
    username: string,
    messageId?: string,
    userId?: string,
    email?: string,
    imagePath?: string
  ) {
    this.messageId = messageId;
    this.content = content;
    this.userId = userId;
    this.username = username;
    this.email = email;
    this.imagePath = imagePath;
  }
}
