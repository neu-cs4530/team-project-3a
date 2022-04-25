import { ChatMessage } from "../../../classes/TextConversation"

const CHAT_BUBBLE_DURATION = 5000;
const TEXT_SCROLL_DELAY = 50;
const MAX_MESSAGE_LENGTH = 20;
const BUBBLE_BACKGROUND_COLORS = {
  Universal: '#89CFF0',
  Proximity: '#F8C8DC',
  Direct: '#85e085',
};

/**
 * Object for creating chat bubbles on a phaser scene
 */

export default class ChatBubble {
    private bubbleText: Phaser.GameObjects.Text;

    private timer: NodeJS.Timeout | undefined;

    private interval: NodeJS.Timeout | undefined;
    
    private scene: Phaser.Scene;
    

    /**
     * Sets the chat bubble to render a new message. The chat bubble types out the new message 
     * and display it for a set number of seconds before dissapearing.
     * @param value the new chat message that the chat bubble should render
    */
    public setMessage(value: ChatMessage) {
        this.bubbleText.setBackgroundColor(BUBBLE_BACKGROUND_COLORS[value.chatType]);
        if (this.timer) {
            clearTimeout(this.timer)
        }

        if (this.interval) {
            clearInterval(this.interval)
        }

        if(value.isGif) {
            this.setText('Sent a GIF');
        }
        else {
            this.setText(value.body);
        }
    }

    private setText(value: string) {
        this.bubbleText.setText('')
        if (value.length > MAX_MESSAGE_LENGTH) {
            value = `${value.substring(0, MAX_MESSAGE_LENGTH)}...`;
        }

        this.bubbleText.setVisible(true);
        let i = 0;
        this.interval = global.setInterval(() => {
            this.bubbleText.setText(value.substring(0, i));
            i += 1;
            if(i === value.length + 1) {
                this.timer = global.setTimeout(() => (this.bubbleText.setVisible(false)), CHAT_BUBBLE_DURATION);
                if(this.interval) {
                    clearInterval(this.interval);
                }
            } 
        }, TEXT_SCROLL_DELAY);
    }

    /**
     * 
     * @param x the new x position of the chat bubble
     */
    public setX(x: number) {
        this.bubbleText.setX(x)
    }

    /**
     * 
     * @param y the new y position of the chat bubble
     */
    public setY(y: number) {
        this.bubbleText.setY(y)
    }

    /**
     * 
     * @param scene The scene which the chat bubble should be rendered on
     * @param x The x position of the chat bubble
     * @param y The y position of the chat bubble
     */
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
