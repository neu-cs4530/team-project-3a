import { nanoid } from 'nanoid';
import { Socket } from 'socket.io-client';
import { ChatType } from '../components/VideoCall/VideoFrontend/types';

/**
 * A basic representation of a text conversation, bridged over a socket.io client
 * The interface to this class was designed to closely resemble the Twilio Conversations API,
 * to make it easier to use as a drop-in replacement.
 */
export default class TextConversation {
  private _socket: Socket;

  private _callbacks: MessageCallback[] = [];

  private _directMessageCallback: MessageCallback[] = [];

  private _proximityMessageCallback: MessageCallback[] = [];

  private _authorName: string;

  /**
   * Create a new Text Conversation
   *
   * @param socket socket to use to send/receive messages
   * @param authorName name of message author to use as sender
   */
  public constructor(socket: Socket, authorName: string) {
    this._socket = socket;
    this._authorName = authorName;
    this._socket.on('chatMessage', (message: ChatMessage) => {
      message.dateCreated = new Date(message.dateCreated);

      switch (message.chatType) {
        case ChatType.UNIVERSAL:
          this.onChatMessage(message);
          break;
        case ChatType.PROXIMITY:
          this.onProximityMessage(message);
          break;
        case ChatType.DIRECT:
          this.onDirectMessage(message);
          break;
        default:
      }
    });
  }

  private onChatMessage(message: ChatMessage) {
    this._callbacks.forEach(cb => cb(message));
  }

  private onDirectMessage(message: ChatMessage) {
    this._directMessageCallback.forEach(cb => cb(message));
  }

  private onProximityMessage(message: ChatMessage) {
    this._proximityMessageCallback.forEach(cb => cb(message));
  }

  /**
   * Send a text message to this channel
   * @param message
   */
  public sendMessage(chatType: ChatType, message: string) {
    const msg: ChatMessage = {
      sid: nanoid(),
      chatType,
      body: message,
      author: this._authorName,
      dateCreated: new Date(),
    };
    this._socket.emit('chatMessage', msg);
  }

  /**
   * Register an event listener for processing new chat messages
   * @param event
   * @param cb
   * @param chatType the type of chat this call back should be called on
   */
  public onMessageAdded(cb: MessageCallback, chatType: ChatType) {
    switch (chatType) {
      case ChatType.UNIVERSAL:
        this._callbacks.push(cb);
        break;
      case ChatType.PROXIMITY:
        this._proximityMessageCallback.push(cb);
        break;
      case ChatType.DIRECT:
        this._directMessageCallback.push(cb);
        break;
      default:
    }
  }

  /**
   * Removes an event listener for processing new chat messages
   * @param cb
   * @param chatType the type of the chat that this callback should be removed from
   */
  public offMessageAdded(cb: MessageCallback, chatType: ChatType) {
    switch (chatType) {
      case ChatType.UNIVERSAL:
        this._callbacks = this._callbacks.filter(_cb => _cb !== cb);
        break;
      case ChatType.PROXIMITY:
        this._proximityMessageCallback = this._callbacks.filter(_cb => _cb !== cb);
        break;
      case ChatType.DIRECT:
        this._directMessageCallback = this._directMessageCallback.filter(_cb => _cb !== cb);
        break;
      default:
    }
  }

  /**
   * Release the resources used by this conversation
   */
  public close(): void {
    this._socket.off('chatMessage');
  }
}
type MessageCallback = (message: ChatMessage) => void;
export type ChatMessage = {
  author: string;
  chatType: ChatType;
  sid: string;
  body: string;
  dateCreated: Date;
  recipients?: string[];
};
