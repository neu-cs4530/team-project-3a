import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import ChatIcon from '../../../icons/ChatIcon';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { ChatType } from '../../../types';


/**
 * Type to represent props for a chat type button
 */
type ToggleChatTypeButtonProps = {
  chatType: ChatType;
};

/**
 * 
 * @param props Contains a chat type enum, which determines which chat type this button should select
 * @returns A rendered chat type button
 */
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