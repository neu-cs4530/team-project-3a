import { Box, ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ConversationArea, {
  ConversationAreaListener,
  NO_TOPIC_STRING,
} from '../../classes/ConversationArea';
import Player from '../../classes/Player';
import useConversationAreas from '../../hooks/useConversationAreas';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerName from './PlayerName';

type ConversationAreaDisplayProps = {
  conversationArea: ConversationArea;
};
/**
 * Displays the information regarding a single conversation area.
 *
 * Player names are unsorted, appearing in the that they appear in the area's occupantsByID array.
 *
 */
function ConversationAreaDisplay({ conversationArea }: ConversationAreaDisplayProps): JSX.Element {
  const players = usePlayersInTown();
  const [occupants, setOccupants] = useState<Player[]>(
    players.filter(player => conversationArea.occupants.includes(player.id)),
  );

  useEffect(() => {
    const updateOccupants: ConversationAreaListener = {
      onOccupantsChange: newOccupants => {
        const newPlayers: Player[] = [];
        newOccupants.forEach(occupantID => {
          const player = players.find(p => p.id === occupantID);
          if (player) newPlayers.push(player);
        });
        setOccupants(newPlayers);
      },
    };

    conversationArea.addListener(updateOccupants);

    return () => conversationArea.removeListener(updateOccupants);
  }, [conversationArea, players]);

  return (
    <Box>
      <h3>
        {conversationArea.label}: {conversationArea.topic}
      </h3>
      <UnorderedList>
        {occupants.map(player => (
          <ListItem key={player.id}>
            <PlayerName player={player} />
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

/**
 * Displays a list of "active" conversation areas, along with their occupants
 *
 * A conversation area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the ConverationArea file
 *
 * If there are no active conversation areas, it displays the text "No active conversation areas"
 *
 * If there are active areas, it sorts them by label ascending, using a numeric sort with base sensitivity
 *
 * Each conversation area is represented as a Box:
 *  With a heading (H3) `{conversationAreaLabel}: {conversationAreaTopic}`,
 *  and an unordered list of occupants.
 *
 * Occupants are *unsorted*, appearing in the order
 *  that they appear in the area's occupantsByID array. Each occupant is rendered by a PlayerName component,
 *  nested within a ListItem.
 *
 * Each conversation area component must subscribe to occupant updates by registering an `onOccupantsChange` listener on
 *  its corresponding conversation area object.
 * It must register this listener when it is mounted, and remove it when it unmounts.
 *
 * See relevant hooks: useConversationAreas, usePlayersInTown.
 */
export default function ConversationAreasList(): JSX.Element {
  const conversationAreas = useConversationAreas().filter(
    conversationArea => conversationArea.topic !== NO_TOPIC_STRING,
  );

  if (conversationAreas.length === 0) {
    return <>No active conversation areas</>;
  }

  return (
    <>
      {[...conversationAreas]
        .sort((conversationArea1, conversationArea2) =>
          conversationArea1.label.localeCompare(conversationArea2.label, 'en', { numeric: true }),
        )
        .map(conversationArea => (
          <ConversationAreaDisplay
            key={conversationArea.label}
            conversationArea={conversationArea}
          />
        ))}
    </>
  );
}
