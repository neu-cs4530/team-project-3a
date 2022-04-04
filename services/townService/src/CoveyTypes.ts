export type Direction = 'front' | 'back' | 'left' | 'right';
export type UserLocation = {
  x: number;
  y: number;
  rotation: Direction;
  moving: boolean;
  conversationLabel?: string;
};
export type CoveyTownList = { friendlyName: string; coveyTownID: string; currentOccupancy: number; maximumOccupancy: number }[];

export type ChatMessage = {
  author: string;
  chatType: ChatType;
  sid: string;
  body: string;
  dateCreated: Date;
  recipients?: string[];
};

export enum ChatType {
  UNIVERSAL = 'Universal',
  PROXIMITY = 'Proximity',
  DIRECT = 'Direct',
};