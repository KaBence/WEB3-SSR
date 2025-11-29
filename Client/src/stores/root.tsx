"use client";

import type { State } from "./store";
import { StoreProvider } from "./store";

export function StoreRoot({children,hydrationState,}: {children: React.ReactNode;hydrationState?: Partial<State>;}) {
  return <StoreProvider hydrationState={hydrationState}>{children}</StoreProvider>;
}