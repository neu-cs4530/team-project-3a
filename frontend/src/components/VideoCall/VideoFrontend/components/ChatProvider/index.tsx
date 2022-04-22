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
  directMessages: {
    [playerID: string]: { messages: ChatMessage[]; newMessage: boolean };
  };
  conversation: TextConversation | null;
  directID: string;
  setDirectID: (directID: string) => void;
  newestMessage: ChatMessage | null;
  resetNewDirectMessage: (playerID: string) => void;
  hasUnreadUniversalMessage: boolean;
  hasUnreadProximityMessage: boolean;
  unreadDirectMessageIDs: string[];
};

export const ChatContext = createContext<ChatContextType>(null!);

export const ChatProvider: React.FC = ({ children }) => {
  const { socket, userName, myPlayerID } = useCoveyAppState();
  const isChatWindowOpenRef = useRef(false);
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [conversation, setConversation] = useState<TextConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [proximityMessages, setProximityMessages] = useState<ChatMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<{
    [playerID: string]: { messages: ChatMessage[]; newMessage: boolean };
  }>({});
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [chatType, setChatType] = useState(ChatType.UNIVERSAL);
  const [directID, setDirectID] = useState('');
  const [newestMessage, setNewestMessage] = useState<ChatMessage | null>(null);
  const [hasUnreadUniversalMessage, setHasUnreadUniversalMessage] = useState<boolean>(false);
  const [hasUnreadProximityMessage, setHasUnreadProximitylMessage] = useState<boolean>(false);
  const [unreadDirectMessageIDs, setUnreadDirectMessageIDs] = useState<string[]>([]);

  useEffect(() => {
    if (conversation) {
      const handleMessageAdded = (message: ChatMessage) => {
        setMessages(oldMessages => [...oldMessages, message]);
        if (chatType !== ChatType.UNIVERSAL) setHasUnreadUniversalMessage(true);
        setNewestMessage(message);
      };

      const handleProximityMessageAdded = (message: ChatMessage) => {
        setProximityMessages(oldMessages => [...oldMessages, message]);
        if (chatType !== ChatType.PROXIMITY) setHasUnreadProximitylMessage(true);
        setNewestMessage(message);
      };

      const handleDirectMessageAdded = (message: ChatMessage) =>
        setDirectMessages(oldDirectMessages => {
          setNewestMessage(message);
          const newMessage = directID !== message.senderID;
          const recipient = message.recipients && message.recipients[0];
          if (message.senderID === myPlayerID && recipient) {
            if (chatType !== ChatType.DIRECT && directID !== message.senderID)
              setUnreadDirectMessageIDs(oldMessageIDs => [...oldMessageIDs, message.senderID]);
            return {
              ...oldDirectMessages,
              [recipient]: oldDirectMessages[recipient]
                ? {
                    messages: [...oldDirectMessages[recipient].messages, message],
                    newMessage,
                  }
                : { messages: [message], newMessage },
            };
          } else {
            return {
              ...oldDirectMessages,
              [message.senderID]: oldDirectMessages[message.senderID]
                ? {
                    messages: [...oldDirectMessages[message.senderID].messages, message],
                    newMessage,
                  }
                : {
                    messages: [message],
                    newMessage,
                  },
            };
          }
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
      const conv = new TextConversation(socket, userName, myPlayerID);
      setConversation(conv);
      return () => {
        conv.close();
      };
    }
  }, [socket, userName, setConversation]);

  const resetNewDirectMessage = (playerID: string) => {
    setDirectMessages(oldDirectMessages => {
      setUnreadDirectMessageIDs(oldDirectIDs =>
        oldDirectIDs.filter(_playerID => _playerID !== playerID),
      );
      if (oldDirectMessages[playerID]) {
        return {
          ...oldDirectMessages,
          [playerID]: { ...oldDirectMessages[playerID], newMessage: false },
        };
      } else {
        return oldDirectMessages;
      }
    });
  };

  const setChatTypeResetUnread = (chatType: ChatType) => {
    setChatType(chatType);
    switch (chatType) {
      case ChatType.UNIVERSAL:
        setHasUnreadUniversalMessage(false);
        break;
      case ChatType.PROXIMITY:
        setHasUnreadProximitylMessage(false);
        break;
      case ChatType.DIRECT:
        setUnreadDirectMessageIDs(oldPlayerMessageIDs =>
          oldPlayerMessageIDs.filter(_playerID => _playerID !== directID),
        );
        break;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isChatWindowOpen,
        setIsChatWindowOpen,
        hasUnreadMessages,
        messages,
        conversation,
        chatType,
        setChatType: setChatTypeResetUnread,
        proximityMessages,
        directMessages,
        directID,
        setDirectID,
        newestMessage,
        resetNewDirectMessage,
        hasUnreadUniversalMessage,
        hasUnreadProximityMessage,
        unreadDirectMessageIDs,
      }}>
      {children}
    </ChatContext.Provider>
  );
};
