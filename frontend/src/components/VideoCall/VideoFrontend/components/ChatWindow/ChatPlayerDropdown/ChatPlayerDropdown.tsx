import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Select } from '@chakra-ui/react';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useChatContext from '../../../hooks/useChatContext/useChatContext';

export type ChatPlayerDropdownProps = {
    currentPlayerID: string,
    setPlayerID: any
}


export default function ChatPlayerDropdown(props: ChatPlayerDropdownProps) {
    const players = usePlayersInTown();
    const {currentPlayerID, setPlayerID} = props;
    const currentPlayerName = players.find(player => player.id === currentPlayerID)?.userName

    const changeHandler: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        setPlayerID(event.currentTarget.value);
    }

    return <Select onChange={changeHandler} placeholder={currentPlayerID === '' ? 'Select Player' : currentPlayerName}>
            {players.map(player => player.id !== currentPlayerID && <option key={player.id} value={player.id}>{player.userName}</option>)}
            </Select>
}