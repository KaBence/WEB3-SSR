"use client";

import { Provider, useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { player_slice, type PlayerState } from "../slices/player_slice";
import { pending_games_slice, type PendingGamesState } from "../slices/pending_games_slice";
import { active_games_slice, type ActiveGamesState } from "../slices/active_games_slice";
import { popup_slice, type PopupState } from "../slices/popup_slice";
import { useEffect } from "react";
import * as api from "@/model/api"

export type State = {
  player: PlayerState;
  pending_games: PendingGamesState;
  active_games: ActiveGamesState;
  popups: PopupState;
};

export function makeStore(preloadedState?: Partial<State>) {
  return configureStore<State>({
    reducer: {
      player: player_slice.reducer,
      pending_games: pending_games_slice.reducer,
      active_games: active_games_slice.reducer,
      popups: popup_slice.reducer,
    },
    preloadedState: preloadedState as State, // narrow if you want stricter typing
  });
}

export type StoreType = ReturnType<typeof makeStore>;
export type Dispatch = StoreType["dispatch"];

const StoreContext = ({ children, hydrationState }: { children: React.ReactNode; hydrationState?: Partial<State> }) => {
  const store = makeStore(hydrationState);
  useEffect(() => {
    const fetchActiveGames = () => {
      const gamesfeed = api.ActiveGamesRXJS()
      gamesfeed.subscribe(({ activeGamesFeed }) => {
        if (!activeGamesFeed) return
        const { action, game, gameId } = activeGamesFeed

        switch (action) {
          case 'ADDED':
          case 'UPDATED':
            if (game) store.dispatch(active_games_slice.actions.upsert(game))
            break;
          case 'REMOVED':
            if (gameId !== undefined) {
              store.dispatch(active_games_slice.actions.remove({ id: gameId }))
            }
            break;
        }
      })
    };
    const fetchPendingGames = () => {
      const gamesfeed = api.PendingGamesRXJS()

      gamesfeed.subscribe(({ pendingGamesFeed }) => {
        if (!pendingGamesFeed) return
        const { action, game, gameId } = pendingGamesFeed

        switch (action) {
          case 'ADDED':
          case 'UPDATED':
            if (game) store.dispatch(pending_games_slice.actions.upsert(game))
            break
          case 'REMOVED':
            if (gameId !== undefined) {
              store.dispatch(pending_games_slice.actions.remove({ id: gameId }))
            }
            break
        }
      })
    }

    fetchPendingGames();
    fetchActiveGames();
  }, [])
  return <Provider store={store}>{children}</Provider>;
};

export const StoreProvider = StoreContext;
export const useStoreDispatch = () => useDispatch<Dispatch>();
export const useStoreState: TypedUseSelectorHook<State> = useSelector;