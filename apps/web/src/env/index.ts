import { env as environment } from "@packages/env";

import { publicEnv } from "./env.public";

export const env = { ...environment, ...publicEnv };