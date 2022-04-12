import React from 'react';
import { ChatMessage } from '../../../../../../classes/TextConversation';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import GifMessage from './GifMessage/GifMessage';
import MessageInfo from './MessageInfo/MessageInfo';
import MessageListScrollContainer from './MessageListScrollContainer/MessageListScrollContainer';
import TextMessage from './TextMessage/TextMessage';

interface MessageListProps {
  messages: ChatMessage[];
}

const getFormattedTime = (message?: ChatMessage) =>
  message?.dateCreated
    .toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' })
    .toLowerCase();

export default function MessageList({ messages }: MessageListProps) {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  const players = usePlayersInTown();

  return (
    <MessageListScrollContainer messages={messages}>
      {messages.map((message, idx) => {
        const time = getFormattedTime(message)!;
        const previousTime = getFormattedTime(messages[idx - 1]);

        // Display the MessageInfo component when the author or formatted timestamp differs from the previous message
        const shouldDisplayMessageInfo =
          time !== previousTime || message.author !== messages[idx - 1]?.author;

        const isLocalParticipant = localParticipant.identity === message.senderID;

        const profile = players.find(p => p.id == message.author);

        return (
          <React.Fragment key={message.sid}>
            {shouldDisplayMessageInfo && (
              <MessageInfo
                author={profile?.userName || message.author}
                isLocalParticipant={isLocalParticipant}
                dateCreated={time}
              />
            )}
            {message.isGif ? (
              <GifMessage url={message.body} isLocalParticipant={isLocalParticipant} />
            ) : (
              <TextMessage body={message.body} isLocalParticipant={isLocalParticipant} />
            )}
          </React.Fragment>
        );
      })}
    </MessageListScrollContainer>
  );
}
