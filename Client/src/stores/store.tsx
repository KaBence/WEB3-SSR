"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { player_slice, type PlayerState } from "../slices/player_slice";
import { pending_games_slice, type PendingGamesState } from "../slices/pending_games_slice";
import { active_games_slice, type ActiveGamesState } from "../slices/active_games_slice";
import { popup_slice, type PopupState } from "../slices/popup_slice";

// Combined state shape mirrors the previous configureStore keys.
export type State = {
  player: PlayerState;
  pending_games: PendingGamesState;
  active_games: ActiveGamesState;
  popups: PopupState;
};

export type Action =
  | ReturnType<(typeof player_slice.actions)[keyof typeof player_slice.actions]>
  | ReturnType<(typeof pending_games_slice.actions)[keyof typeof pending_games_slice.actions]>
  | ReturnType<(typeof active_games_slice.actions)[keyof typeof active_games_slice.actions]>
  | ReturnType<(typeof popup_slice.actions)[keyof typeof popup_slice.actions]>;

type ReducerMap<S, A> = { [K in keyof S]: (state: S[K] | undefined, action: A) => S[K] };

// Minimal combineReducers compatible with useReducer.
function combineReducers<S, A>(reducers: ReducerMap<S, A>) {
  return (state: S | undefined, action: A): S => {
    const next: Partial<S> = {};
    for (const key of Object.keys(reducers) as Array<keyof S>) {
      const reducer = reducers[key];
      const prevSlice = state ? state[key] : undefined;
      next[key] = reducer(prevSlice, action);
    }
    return next as S;
  };
}

const rootReducer = combineReducers<State, Action>({
  player: player_slice.reducer,
  pending_games: pending_games_slice.reducer,
  active_games: active_games_slice.reducer,
  popups: popup_slice.reducer,
});

const initialState: State = {
  player: player_slice.getInitialState(),
  pending_games: pending_games_slice.getInitialState(),
  active_games: active_games_slice.getInitialState(),
  popups: popup_slice.getInitialState(),
};

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export function StoreProvider({
  children,
  hydrationState,
}: {
  children: ReactNode;
  hydrationState?: Partial<State>;
}) {
  const [state, dispatch] = useReducer(
    rootReducer,
    hydrationState ? { ...initialState, ...hydrationState } : initialState
  );

  const memoState = useMemo(() => state, [state]);

  return (
    <StateContext.Provider value={memoState}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useStoreState(): State {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useStoreState must be used inside StoreProvider");
  return ctx;
}

export function useStoreDispatch(): Dispatch<Action> {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useStoreDispatch must be used inside StoreProvider");
  return ctx;
}

export function useStore(): [State, Dispatch<Action>] {
  return [useStoreState(), useStoreDispatch()];
}