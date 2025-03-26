<div align="center">

# react-presentation-hook

**A React hook for opening, managing and communicating with a child window in a type-safe manner.**

![QA](https://img.shields.io/github/actions/workflow/status/davidsteiner/react-presentation-hook/ci.yml)
![NPM](https://img.shields.io/npm/v/react-presentation-hook)
![GitHub License](https://img.shields.io/github/license/davidsteiner/react-presentation-hook)

</div>

## Use-cases

This library can be used for presentations, where the presented view needs to be a separate screen from the presenter's view and the two screens need to communicate with each other to stay in sync. Perhaps the presenter would like to see additional notes that are not displayed to the audience and control the presentation without leaving their own screen. The hooks contained in this package make this easy.

While the primary use-case is presentations, this is a generic implementation which can be used for any scenario where a controlled additional window is needed with bi-directional communication with the parent window.

## How to use it?

The library provides two convenient hooks for opening a child window, establishing
connection between the parent window and the child window and sending messages
in either direction.

These two hooks are `useWindowManager` and `useChildWindowManager` for the parent
window and the child window respectively.
