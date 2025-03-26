<div align="center">

# react-presentation-hook

**A React hook for opening, managing and communicating with a child window in a type-safe manner.**

[![QA](https://img.shields.io/github/actions/workflow/status/davidsteiner/react-presentation-hook/ci.yml)](https://github.com/davidsteiner/react-presentation-hook/actions)
[![NPM](https://img.shields.io/npm/v/react-presentation-hook)](https://www.npmjs.com/package/react-presentation-hook)
[![GitHub License](https://img.shields.io/github/license/davidsteiner/react-presentation-hook)](LICENSE)

</div>

## Use-cases

This library can be used for presentations, where the presented view needs to be a separate screen from the presenter's view and the two screens need to communicate with each other to stay in sync. Perhaps the presenter would like to see additional notes that are not displayed to the audience and control the presentation without leaving their own screen. The hooks contained in this package make this easy.

While the primary use-case is presentations, this is a generic implementation which can be used for any scenario where a controlled additional window is needed with bi-directional communication with the parent window.

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
  const onMessage = useCallback(() => {
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
