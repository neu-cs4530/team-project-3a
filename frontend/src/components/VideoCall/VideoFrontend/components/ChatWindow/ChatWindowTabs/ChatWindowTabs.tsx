import { createStyles, makeStyles } from '@material-ui/core';
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
  }),
);

export default function ChatWindowTabs() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ToggleChatTypeButton chatType={ChatType.UNIVERSAL}></ToggleChatTypeButton>
      <ToggleChatTypeButton chatType={ChatType.PROXIMITY}></ToggleChatTypeButton>
      <ToggleChatTypeButton chatType={ChatType.DIRECT}></ToggleChatTypeButton>
    </div>
  );
}
