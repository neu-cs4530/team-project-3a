import { ChakraProvider } from '@chakra-ui/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import React from 'react';
import { Socket } from 'socket.io-client';
import { LocalAudioTrack, Room } from 'twilio-video';
import Player, { UserLocation } from '../../../../../classes/Player';
import { CoveyAppState } from '../../../../../CoveyTypes';
import * as useCoveyAppState from '../../../../../hooks/useCoveyAppState';
import * as usePlayersInTown from '../../../../../hooks/usePlayersInTown';
import * as useChatContext from '../../hooks/useChatContext/useChatContext';
import * as useLocalVideoToggle from '../../hooks/useLocalVideoToggle/useLocalVideoToggle';
import * as useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { ChatContextType, ChatProvider } from '../ChatProvider';
import { IVideoContext, VideoProvider } from '../VideoProvider';
import * as useRestartAudioTrackOnDeviceChange from '../VideoProvider/useRestartAudioTrackOnDeviceChange/useRestartAudioTrackOnDeviceChange';
import ChatWindow from './ChatWindow';

describe('ChatWindow', () => {
  const randomLocation = (): UserLocation => ({
    moving: Math.random() < 0.5,
    rotation: 'front',
    x: Math.random() * 1000,
    y: Math.random() * 1000,
  });
  const wrappedChatWindow = () => (
    <ChakraProvider>
      <React.StrictMode>
        <ChatProvider>
          <VideoProvider
            onError={() => {
              console.error('Error');
            }}>
            <ChatWindow />
          </VideoProvider>
        </ChatProvider>
      </React.StrictMode>
    </ChakraProvider>
  );
  const renderChatWindow = () => render(wrappedChatWindow());
  let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParms: any[]]>;
  let useRestartAudioTrackOnDeviceChangeSpy: jest.SpyInstance;
  let usePlayersInTownSpy: jest.SpyInstance<Player[], []>;
  let useChatContextSpy: jest.SpyInstance<ChatContextType, []>;
  let useCoveyAppStateSpy: jest.SpyInstance<CoveyAppState, []>;
  let useVideoContextSpy: jest.SpyInstance<IVideoContext, []>;
  let useLocalVideoToggleSpy: jest.SpyInstance<readonly [boolean, () => void]>;
  let players: Player[] = [];
  let townID: string;
  let townFriendlyName: string;
  beforeAll(() => {
    // Spy on console.error and intercept react key warnings to fail test
    consoleErrorSpy = jest.spyOn(global.console, 'error');
    consoleErrorSpy.mockImplementation((message?, ...optionalParams) => {
      const stringMessage = message as string;
      if (stringMessage.includes('children with the same key,')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      } else if (stringMessage.includes('warning-keys')) {
        throw new Error(stringMessage.replace('%s', optionalParams[0]));
      }
      // eslint-disable-next-line no-console -- we are wrapping the console with a spy to find react warnings
      console.warn(message, ...optionalParams);
    });
    usePlayersInTownSpy = jest.spyOn(usePlayersInTown, 'default');
    useChatContextSpy = jest.spyOn(useChatContext, 'default');
    useCoveyAppStateSpy = jest.spyOn(useCoveyAppState, 'default');
    useVideoContextSpy = jest.spyOn(useVideoContext, 'default');
    useLocalVideoToggleSpy = jest.spyOn(useLocalVideoToggle, 'default');
    useRestartAudioTrackOnDeviceChangeSpy = jest.spyOn(
      useRestartAudioTrackOnDeviceChange,
      'default',
    );
  });
  beforeEach(() => {
    players = [];
    for (let i = 0; i < 10; i += 1) {
      players.push(
        new Player(
          `testingPlayerID${i}-${nanoid()}`,
          `testingPlayerUser${i}-${nanoid()}}`,
          randomLocation(),
        ),
      );
    }
    usePlayersInTownSpy.mockReturnValue(players);
    townID = nanoid();
    townFriendlyName = nanoid();
    const mockAppState = mock<CoveyAppState>();
    const mockSocket = mock<Socket>();
    mockAppState.currentTownFriendlyName = townFriendlyName;
    mockAppState.currentTownID = townID;
    mockAppState.socket = mockSocket;
    useCoveyAppStateSpy.mockReturnValue(mockAppState);

    const mockVideoContext = mock<IVideoContext>();
    const mockRoom = mock<Room>();
    const mockLocalTrack = mock<LocalAudioTrack>();
    mockVideoContext.room = mockRoom;
    mockVideoContext.localTracks = [mockLocalTrack];
    useVideoContextSpy.mockReturnValue(mockVideoContext);

    useLocalVideoToggleSpy.mockReturnValue([false, () => {}]);

    useRestartAudioTrackOnDeviceChangeSpy.mockImplementation(() => {});
  });

  describe('[T1] Basic Rendering', () => {
    it('Displays a heading "Current town: townName', async () => {
      const renderData = renderChatWindow();
      const heading = await renderData.findByTestId('chat-header');
      expect(heading).toHaveTextContent('Chat');
    });
  });
});
