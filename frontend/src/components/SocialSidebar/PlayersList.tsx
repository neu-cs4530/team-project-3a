import { ListItem, OrderedList, Tooltip } from '@chakra-ui/react';
import React from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerName from './PlayerName';

/**
 * Lists the current players in the town, along with the current town's name and ID
 *
 * Town name is shown in an H2 heading with a ToolTip that shows the label `Town ID: ${theCurrentTownID}`
 *
 * Players are listed in an OrderedList below that heading, sorted alphabetically by userName (using a numeric sort with base precision)
 *
 * Each player is rendered in a list item, rendered as a <PlayerName> component
 *
 * See `usePlayersInTown` and `useCoveyAppState` hooks to find the relevant state.
 *
 */
export default function PlayersInTownList(): JSX.Element {
  const { currentTownID, currentTownFriendlyName } = useCoveyAppState();
  const players = usePlayersInTown();

  return (
    <>
      <Tooltip label={`Town ID: ${currentTownID}`}>
        <h2>Current town: {currentTownFriendlyName}</h2>
      </Tooltip>
      <OrderedList>
        {[...players]
          .sort((player1, player2) =>
            player1.userName.localeCompare(player2.userName, 'en', { numeric: true }),
          )
          .map(player => (
            <ListItem key={player.id}>
              <PlayerName player={player} />
            </ListItem>
          ))}
      </OrderedList>
    </>
  );
}
