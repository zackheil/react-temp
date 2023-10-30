import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type UserEvent = {
  unix: number;
  event: string;
};

type LastPostInfo = {
  sha: string;
};

export type UserEventsSliceState = {
  /**
   * User events that have been logged throughout the app
   */
  events: UserEvent[];
  /**
   * The last time a user event was logged
   */
  lastEventUnix: number;
  /**
   * The last time that the last batch of user evens was posted to the server
   */
  lastPostUnix: number;
  /**
   * The endpoint to post user events to following the agreed upon schema
   */
  postEndpoint?: string;
  /**
   * The sha of the last post payload in order to piece together the chronology of the events
   */
  lastPostSha?: string;
  /**
   * The public key of a key set that can be used to optionally encrypt the user events
   */
  publicKey?: string;
};

export const userEventSliceInitialState: UserEventsSliceState = {
  events: [],
  lastEventUnix: 0,
  lastPostUnix: Date.now(),
};

export const _userEventsSlice = createSlice({
  name: '_user-events',
  initialState: userEventSliceInitialState,
  reducers: {
    addEvent: (state, action: PayloadAction<string>) => {
      // If there isn't a post endpoint, reset the buffer every so often so we don't keep consuming memory
      if (!state.postEndpoint && state.events.length > 99) {
        state.events = [];
      }
      const now = Date.now();
      state.lastEventUnix = now;
      state.events.push({ unix: now, event: action.payload });
    },
    setPostEndpoint: (state, action: PayloadAction<string | undefined>) => {
      state.postEndpoint = action.payload;
    },
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.publicKey = action.payload;
    },
    // TODO: not fond of this name
    setLastPostRefresh: (state, action: PayloadAction<LastPostInfo>) => {
      state.lastPostUnix = Date.now();
      state.lastPostSha = action.payload.sha;
      state.events = [];
    },
  },
});

export const { addEvent, setPostEndpoint, setPublicKey, setLastPostRefresh } = _userEventsSlice.actions;
