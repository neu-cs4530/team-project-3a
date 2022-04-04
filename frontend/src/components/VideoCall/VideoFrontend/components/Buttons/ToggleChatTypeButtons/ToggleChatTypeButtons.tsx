import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ChatIcon from '../../../icons/ChatIcon';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';


export enum ChatType {
  UNIVERSAL = 'Universal', PROXIMITY = 'Proximity', DIRECT = 'Direct'
};

type ToggleChatTypeButtonProps = {
  chatType: ChatType;
};

export default function ToggleChatTypeButton(props: ToggleChatTypeButtonProps) {
  const {chatType, setChatType} = useChatContext();

  const toggleChatType = () => {
    setChatType(props.chatType);
  }

  return <Button 
            onClick={toggleChatType} 
            disabled={props.chatType === chatType}>
              {props.chatType.toString()}
          </Button>;
};