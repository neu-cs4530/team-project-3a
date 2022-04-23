# Feature Overview

The feature implemented in this project is a chat feature. The chat feature allows for the users to send text based messages to other uses. Users have three options of message types to send:

- Universal
- Proximity
- Direct

To switch between the different chat types users can use the buttons at the top of the chat window. Additionally, chat bubbles appear above users with the message that they sent. Chat bubbles are color coded, blue represents Universal, pink represents Proximity, green represents Direct. These colors correspond to the color of the different buttons allowing users to easily infer what the different colors represent without explicit instruction.

Additionally, this implementation of the chat features allows users to send random GIFs based on a user provided search term. Users can type /giphy < search term >, and the application will send a GIF based on the search term to the chat.

## Universal

Universal messaging allows users to send messages to the entire room. These messages can be viewed by all players that are logged into the room.

## Proximity

Proximity messaging allows users to send messages to users in close proximity to them. The rules determining who is considered "in-proximity" are the same as the rules defining which video calls appear for each user. Proximity chat also follows the rules of conversation areas, so players in the same conversation area will be able to each other's proximity messages.

## Direct

Direct messaging allows users to send direct, private messages to other users. A drop down menu appears after the "Direct" button is selected from the chat window. The drop down menu contains a list of all users in the room. After selecting a username from the dropdown, a direct message can be sent.
