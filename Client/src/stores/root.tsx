"use client";

import type { State } from "../../src/stores/store";
import { StoreProvider } from "../../src/stores/store";

export function StoreRoot({ children, hydrationState, }: { children: React.ReactNode; hydrationState?: Partial<State>; }) {
    return <StoreProvider hydrationState={hydrationState}>{children}</StoreProvider>;
}