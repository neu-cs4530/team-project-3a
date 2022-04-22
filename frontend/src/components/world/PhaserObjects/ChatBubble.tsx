import { ChatMessage } from '../../../classes/TextConversation';

const CHAT_BUBBLE_DURATION = 5000;
const TEXT_SCROLL_DELAY = 50;
const MAX_MESSAGE_LENGTH = 20;
const BUBBLE_BACKGROUND_COLORS = {
  Universal: '#89CFF0',
  Proximity: '#F8C8DC',
  Direct: '#85e085',
};

export default class ChatBubble {
  bubbleText: Phaser.GameObjects.Text;

  timer: NodeJS.Timeout | undefined;

  interval: NodeJS.Timeout | undefined;

  scene: Phaser.Scene;

  setMessage(value: ChatMessage) {
    this.bubbleText.setBackgroundColor(BUBBLE_BACKGROUND_COLORS[value.chatType]);
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (this.interval) {
      clearInterval(this.interval);
    }

    if (value.isGif) {
      this.setText('Sent a GIF');
    } else {
      this.setText(value.body);
    }
  }

  setText(value: string) {
    if (value.length > MAX_MESSAGE_LENGTH) {
      value = `${value.substring(0, MAX_MESSAGE_LENGTH)}...`;
    }

    this.bubbleText.setVisible(true);
    let i = 0;
    this.interval = setInterval(() => {
      this.bubbleText.setText(value.substring(0, i));
      i += 1;
      if (i === value.length + 1) {
        this.timer = setTimeout(() => {
          this.bubbleText.setVisible(false);
          this.bubbleText.setText('');
        }, CHAT_BUBBLE_DURATION);
        if (this.interval) {
          clearInterval(this.interval);
        }
      }
    }, TEXT_SCROLL_DELAY);
  }

  setX(value: number) {
    this.bubbleText.setX(value);
  }

  setY(value: number) {
    this.bubbleText.setY(value);
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const bubbleText = scene.add.text(x, y, '', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#000000',
      backgroundColor: '#ffffff',
    });
    this.bubbleText = bubbleText;
    this.bubbleText.setVisible(false);
    this.scene = scene;
  }
}
