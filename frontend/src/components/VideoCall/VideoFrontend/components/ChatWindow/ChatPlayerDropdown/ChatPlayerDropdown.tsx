import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Select } from '@chakra-ui/react';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';

export default function ChatPlayerDropdown() {

    const players = usePlayersInTown();
    return <Select placeholder='Select Player'>
            {players.map(player => <option value={player.id}>{player.userName}</option>)}
            </Select>
}