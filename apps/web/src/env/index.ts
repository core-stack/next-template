import { getEnv } from "@packages/env";

import { publicEnv } from "./env.public";

export const env = { ...getEnv(), ...publicEnv };