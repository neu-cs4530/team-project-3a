import { createStyles, makeStyles } from '@material-ui/core';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import { ChatType } from '../../../types';
import ToggleChatTypeButton from '../../Buttons/ToggleChatTypeButtons/ToggleChatTypeButtons';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '56px',
      background: '#F4F4F6',
      borderBottom: '1px solid #E4E7E9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
    universalChat: {
      'backgroundColor': '#89CFF0',
      'margin': '2px',
      '&.Mui-disabled': {
        backgroundColor: '#76c5ea',
        color: '#ffffff',
      },
    },
    proximityChat: {
      'backgroundColor': '#F8C8DC',
      'margin': '2px',
      '&.Mui-disabled': {
        backgroundColor: '#f8abcb',
        color: '#ffffff',
      },
    },
    directChat: {
      'backgroundColor': '#85e085',
      'margin': '2px',
      '&.Mui-disabled': {
        backgroundColor: '#6fda6f',
        color: '#ffffff',
      },
    },
  }),
);

export default function ChatWindowTabs() {
  const classes = useStyles();
  const {
    hasUnreadUniversalMessage,
    hasUnreadProximityMessage,
    unreadDirectMessageIDs,
  } = useChatContext();

  return (
    <div className={classes.container}>
      <ToggleChatTypeButton
        className={classes.universalChat}
        chatType={ChatType.UNIVERSAL}
        unreadMessages={hasUnreadUniversalMessage}></ToggleChatTypeButton>
      <ToggleChatTypeButton
        className={classes.proximityChat}
        chatType={ChatType.PROXIMITY}
        unreadMessages={hasUnreadProximityMessage}></ToggleChatTypeButton>
      <ToggleChatTypeButton
        className={classes.directChat}
        chatType={ChatType.DIRECT}
        unreadMessages={unreadDirectMessageIDs?.length !== 0}></ToggleChatTypeButton>
    </div>
  );
}
