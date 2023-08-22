// Fully qualified domain names.
//
// See also https://en.wikipedia.org/wiki/Fully_qualified_domain_name

import { ENV } from "@ggbot2/env"

export const topLevelDomain = ENV.DNS_DOMAIN()

export const apiDomain = `api.${topLevelDomain}`
export const apiNextDomain = `api-next.${topLevelDomain}`
export const apiLocalDomain = `api-local.${topLevelDomain}`

export const assetsDomain = `assets.${topLevelDomain}`

export const authDomain = `auth.${topLevelDomain}`
export const authNextDomain = `auth-next.${topLevelDomain}`
export const authLocalDomain = `auth-local.${topLevelDomain}`

export const adminWebappDomain = `admin.${topLevelDomain}`
export const adminWebappNextDomain = `admin-next.${topLevelDomain}`

export const userWebappDomain = `app.${topLevelDomain}`
export const userWebappNextDomain = `app-next.${topLevelDomain}`

export const webappDomain = `www.${topLevelDomain}`
export const nextWebappDomain = `next.${topLevelDomain}`
