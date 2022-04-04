import React, { createContext, useEffect, useRef, useState } from 'react';
import TextConversation, { ChatMessage } from '../../../../../classes/TextConversation';
import useCoveyAppState from '../../../../../hooks/useCoveyAppState';
import { ChatType } from '../../types';

type ChatContextType = {
  isChatWindowOpen: boolean;
  setIsChatWindowOpen: (isChatWindowOpen: boolean) => void;
  chatType: ChatType;
  setChatType: (chatType: ChatType) => void;
  hasUnreadMessages: boolean;
  messages: ChatMessage[];
  proximityMessages: ChatMessage[];
  directMessages: { [playerID: string]: ChatMessage[] };
  conversation: TextConversation | null;
};

export const ChatContext = createContext<ChatContextType>(null!);

export const ChatProvider: React.FC = ({ children }) => {
  const { socket, userName } = useCoveyAppState();
  const isChatWindowOpenRef = useRef(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [conversation, setConversation] = useState<TextConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [proximityMessages, setProximityMessages] = useState<ChatMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<{ [playerID: string]: ChatMessage[] }>({});
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [chatType, setChatType] = useState(ChatType.UNIVERSAL);

  useEffect(() => {
    if (conversation) {
      const handleMessageAdded = (message: ChatMessage) =>
        setMessages(oldMessages => [...oldMessages, message]);

      const handleProximityMessageAdded = (message: ChatMessage) =>
        setProximityMessages(oldMessages => [...oldMessages, message]);

      const handleDirectMessageAdded = (message: ChatMessage) =>
        setDirectMessages({
          ...directMessages,
          [message.author]: [...directMessages[message.author], message],
        });
      //TODO - store entire message queue on server?
      // conversation.getMessages().then(newMessages => setMessages(newMessages.items));
      conversation.onMessageAdded(handleMessageAdded, ChatType.UNIVERSAL);
      conversation.onMessageAdded(handleDirectMessageAdded, ChatType.DIRECT);
      conversation.onMessageAdded(handleProximityMessageAdded, ChatType.PROXIMITY);

      return () => {
        conversation.offMessageAdded(handleMessageAdded, ChatType.UNIVERSAL);
        conversation.offMessageAdded(handleDirectMessageAdded, ChatType.DIRECT);
        conversation.offMessageAdded(handleProximityMessageAdded, ChatType.PROXIMITY);
      };
    }
  }, [conversation]);

  useEffect(() => {
    // If the chat window is closed and there are new messages, set hasUnreadMessages to true
    if (
      !isChatWindowOpenRef.current &&
      (messages.length || proximityMessages.length || directMessages)
    ) {
      setHasUnreadMessages(true);
    }
  }, [messages, proximityMessages, directMessages]);

  useEffect(() => {
    isChatWindowOpenRef.current = isChatWindowOpen;
    if (isChatWindowOpen) setHasUnreadMessages(false);
  }, [isChatWindowOpen]);

  useEffect(() => {
    if (socket) {
      const conv = new TextConversation(socket, userName);
      setConversation(conv);
      return () => {
        conv.close();
      };
    }
  }, [socket, userName, setConversation]);

  return (
    <ChatContext.Provider
      value={{
        isChatWindowOpen,
        setIsChatWindowOpen,
        hasUnreadMessages,
        messages,
        conversation,
        chatType,
        setChatType,
        proximityMessages,
        directMessages,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
