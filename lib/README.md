<div align="center">

# react-presentation-hook

**A React hook for opening, managing and communicating with a child window in a type-safe manner.**

</div>

## Installation

Install `react-presentation-hook` using your favourite package manager.

```shell
npm i react-presentation-hook
```

## How to use it?

The library provides two convenient hooks for opening a child window, establishing
connection between the parent window and the child window and sending messages
in either direction.

These two hooks are `useWindowManager` and `useChildWindowManager` for the parent
window and the child window respectively.

### In the parent window

Implement a message handler function, and pass it to the hook:

```typescript
function ParentComponent() {
  const onMessage = useCallback((message: ChildMessage) => {
  ...
  }, [...]);

  const { openChildWindow, closeChildWindow, isConnected, sendMessage } =
    useWindowManager<PresentationState, ParentMessage, ChildMessage>({
      onMessage,
    });
}
```

You can use `openChildWindow` and `closeChildWindow` to open and close the child window
respectively.

`isConnected` indicates whether the child window is open and a connection
has been established. `sendMessage` can be used to send messages
to the child window. It will be undefined if a connection has not been
established.

By default, the child window will be automatically closed when the
parent window closes. To leave it open, pass `{ onMessage, closeWithParent: false }`
to `useWindowManager`.

`openChildWindow` takes 4 arguments - the URL to open, the initial state to pass the child,
the name of the child window, and
[its features](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#windowfeatures).

> Your app needs to define a route for the URL passed to `openChildWindow`.
> This is where the child hook will be used.

For a complete example, refer to
[the examples](https://github.com/davidsteiner/react-presentation-hook/blob/main/examples/vite-tanstack-app/src/routes/index.tsx).

### In the child window

Ensure that you have a route handling the path which the parent opens
the child window at.

In the component, use the `useChildWindowManager` hook to
establish the connection with the parent:

```typescript
function ChildComponent() {
  const onMessage = useCallback((message: ParentMessage) => {}, []);

  const { initialState, sendMessage } = useChildWindowManager<PresentationState, ParentMessage, ChildMessage>({ onMessage });

  // do something with the initial state and sendMessage
}
```

You can use `sendMessage` to send messages to the parent,
if bidirectional communication is needed.
