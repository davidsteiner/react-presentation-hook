export type CustomMessage<TPayload> = {
  type: 'custom';
  payload: TPayload;
};

export type InitMessage<TChildState> = {
  type: 'init';
  state: TChildState;
  closeWithParent: boolean;
};

export type CloseMessage = { type: 'close' };

export type PingMessage = {
  type: 'ping';
  timestamp: number;
};

export type ParentMessage<TChildState, TPayload> =
  | InitMessage<TChildState>
  | PingMessage
  | CloseMessage
  | CustomMessage<TPayload>;

export type ParentEnvelope<TChildState, TPayload> = ParentMessage<
  TChildState,
  TPayload
> & { sessionId: string };

export type ReadyMessage = { type: 'ready' };

export type ChildMessage<TCustomPayload> =
  | ReadyMessage
  | CustomMessage<TCustomPayload>;

export type ChildEnvelope<TCustomPayload> = ChildMessage<TCustomPayload> & {
  sessionId: string;
};
