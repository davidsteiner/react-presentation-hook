# react-presentation-hook

A React hook for opening, managing and communicating with a child window in a type-safe manner.

## Use-cases

This library can be used for presentations, where the presented view needs to be a separate screen from the presenter's view and the two screens need to communicate with each other to stay in sync. Perhaps the presenter would like to see additional notes that are not displayed to the audience and control the presentation without leaving their own screen. The hooks contained in this package make this easy.

While the primary use-case is presentations, this is a generic implementation which can be used for any scenario where a controlled additional window is needed with bi-directional communication with the parent window.
