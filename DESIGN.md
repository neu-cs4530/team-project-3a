![Chat Architecture](docs/chat-feature-architecture.png)

Most of our code involved modifying the existing `ChatProvider/index.tsx`, `ChatWindow.tsx`, `CoveyTownRequestHandlers.ts`, and `ChatInput.tsx` files. In addition to modifying those files we also created `ChatBubble.tsx`, `ChatPlayerDropdown.tsx`, `ChatWindowTabs.tsx`, and `GifMessage.tsx` files.

When first deciding how to construct our application we realized we had two different options. Option 1 was to build our application using the Twilio text chat API. Option 2 was to build the chat back-end service from scratch. We decided upon option 2 for several reasons:

1. Integrating with a 3rd party API could prove to be complicated, especially since none of us have experience with it.
2. If we implemented the back-end from scratch we would have complete control over it's functionality.
3. Although we could rely on free accounts for testing, the Twilio chat API appeared to be quite costly if multiple messages were sent.

Once we began investigating the codebase, we realized that there was an existing chat functionality albeit extremely simple in its capabailities. This led us to decide to build our chat functionality on top of the existing chat functionality. We expanded the existing code to support GIFs from GIPHY, proximity and direct based messages, and chat bubbles.

The ChatProvider component was expanded to keep track of direct and proximity messages, as well as other stateful variables related to chat. Rather than creating a new context for keeping track of these additional properties, we made the decision to keep it all in ChatProvider because it makes sense to tightly couple all the ChatRelated functionality.

The ChatWindow component was modified to have additional buttons to switch between the different chat types. Rather than having all chat messages appear in the chat window, we decided to have different tabs for each chat message type. We believe this creates a cleaner UI and a better UX as a user can more easily distinguish between different chat messages and read their chat history.
