import Button from '@material-ui/core/Button';
import React from 'react';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import { ChatType } from '../../../types';

type ToggleChatTypeButtonProps = {
  chatType: ChatType;
};

export default function ToggleChatTypeButton(props: ToggleChatTypeButtonProps) {
  const { chatType, setChatType } = useChatContext();

  const toggleChatType = () => {
    setChatType(props.chatType);
  };

  return (
    <Button
      data-testid='chat-button'
      onClick={toggleChatType}
      disabled={props.chatType === chatType}>
      {props.chatType.toString()}
    </Button>
  );
}
