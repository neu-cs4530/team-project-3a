import { Select } from '@chakra-ui/react';
import React from 'react';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useChatContext from '../../../hooks/useChatContext/useChatContext';

export type ChatPlayerDropdownProps = {
  currentPlayerID: string;
  setPlayerID: (currentPlayerID: string) => void;
};

export default function ChatPlayerDropdown(props: ChatPlayerDropdownProps) {
  const players = usePlayersInTown();
  const { currentPlayerID, setPlayerID } = props;
  const currentPlayerName = players.find(player => player.id === currentPlayerID)?.userName;
  const appstate = useCoveyAppState();
  const { directMessages, resetNewDirectMessage } = useChatContext();

  const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = event => {
    setPlayerID(event.currentTarget.value);
    resetNewDirectMessage(event.currentTarget.value);
  };

  return (
    <Select
      onChange={changeHandler}
      placeholder={currentPlayerID === '' ? 'Select Player' : currentPlayerName}>
      {players.map(
        player =>
          player.id !== currentPlayerID &&
          player.id !== appstate.myPlayerID && (
            <option
              style={{ color: directMessages[player.id]?.newMessage ? 'red' : 'black' }}
              key={player.id}
              value={player.id}>
              {player.userName}
            </option>
          ),
      )}
    </Select>
  );
}
