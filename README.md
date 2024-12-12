# www.mspaint.cc

A [Next.js](https://nextjs.org/) site that showcases the mspaint roblox script. This site also has a dashboard that allows authorized users to generate mspaint serials that turn into luarmor keys.

### UI Component Libraries used
- shadcn/ui - [shadcn.com/ui](https://ui.shadcn.com/)
- magicui - [magicui.design](https://magicui.design)
- Aceternity UI - [ui.aceternity.com](https://ui.aceternity.com)

## Getting Started
First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Setting up environement variables
Setting up the environement variables is a tedious task but if you are up to do it here you go:
```env
# Used for the GET api route in /api/lookup/discord/<userid>
DISCORD_BOT_TOKEN=""

# Roblox Purchase API Key
API_KEY=""

# Purchase Discord Webhooks
BLOXPRODUCTS_WEBHOOK=""

# Sell.App Secrets
SELLAPP_API_KEY=""
SELLAPP_WEBHOOK_SECRET=""

# Vercel Postgres Variables
POSTGRES_URL=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL_NO_SSL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
POSTGRES_HOST=""
POSTGRES_DATABASE=""

# Luarmor Proxy Server Handler
# Since luarmor only allows requests from one dedicated ip, we use a VPS that acts as a proxy to luarmor's api.
LRM_PROXY_URL=""
LRM_PROXY_API_KEY=""
LRM_PROJECT_ID=""

# Discord Authentication
# Used to authenticate you in the /purchase/completed page & validate your access to the dashboard in /dashboard
# Documentation: https://authjs.dev/getting-started/providers/discord
AUTH_SECRET="" # Added by `npx auth`. Read more: https://cli.authjs.dev
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""
```
