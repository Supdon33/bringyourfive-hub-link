# Bring Your 5

Bring Your 5 is the ecosystem for pickup basketball — find local gyms, discover open runs at your skill level, and never miss a game.

## Tech Stack

- Vite
- TypeScript
- React
- Tailwind CSS
- Capacitor (iOS / Android)

## Getting Started

```sh
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start the development server
npm run dev
```

## Building for iOS

```sh
npm run build
npx cap sync ios
npx cap open ios
```

Then in Xcode: select the **App** scheme → **Any iOS Device (arm64)** → **Product → Archive**.

## Environment

Create a `.env` file with your backend URL and publishable key:

```
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="..."
```

## Custom domain

To point `by5.run` (or any domain) at the app, use the hosting platform's domain settings.
