import { Image } from '@chakra-ui/react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles({
  messageContainer: {
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.5em 0.8em 0.6em',
    margin: '0.3em 0 0',
    wordBreak: 'break-word',
    backgroundColor: '#E1E3EA',
    hyphens: 'auto',
    whiteSpace: 'pre-wrap',
  },
  isLocalParticipant: {
    backgroundColor: '#CCE4FF',
  },
});

interface TextMessageProps {
  url: string;
  isLocalParticipant: boolean;
}

export default function GifMessage({ url, isLocalParticipant }: TextMessageProps) {
  const classes = useStyles();

  return (
    <div>
      <div
        className={clsx(classes.messageContainer, {
          [classes.isLocalParticipant]: isLocalParticipant,
        })}>
        <Image src={url} />
      </div>
    </div>
  );
}
