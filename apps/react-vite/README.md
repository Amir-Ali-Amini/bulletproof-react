# Azkivam React Vite App

Azkivam is a React 18 + Vite application that delivers a modern payment dashboard. It showcases cards and transactions, provides QR code scanning, and now includes NFC reading to send values securely to the backend via an Axios instance configured with bearer authentication.

## Features

- **Dashboard UI** – Material UI driven layouts for cards, transactions, and account actions.
- **API Client** – Axios instance with automatic bearer token handling, JSON defaults, and 401 redirects.
- **React Query** – Built-in caching layer with sensible defaults for data fetching.
- **QR + NFC Scanning** – Camera-based QR detector plus Web NFC reader for tag/card scanning.
- **Configurable Environments** – Zod-validated environment parsing for safe runtime configuration.

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn 1.22+

### Installation

```bash
git clone https://github.com/alan2207/Azkivam-react.git
cd Azkivam-react/apps/react-vite
yarn install
```

### Environment Variables

Copy the example file and adjust values for your environment.

```bash
cp .env.example .env
```

`src/config/env.ts` expects variables prefixed with `VITE_APP_`. Common entries:

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_APP_API_URL` | Base URL for the backend API | `https://api.example.com` |
| `VITE_APP_ENABLE_API_MOCKING` | Toggle API mocking (`true`/`false`) | `false` |
| `VITE_APP_APP_URL` *(optional)* | Frontend URL used for redirects | `https://app.example.com` |
| `VITE_APP_APP_MOCK_API_PORT` *(optional)* | Port for local mock server | `8080` |

Place any authentication token needed by the backend into `localStorage` under `token` so the Axios interceptor can attach it as a bearer header.

## Scripts

- `yarn dev` – Start Vite in development mode on `http://localhost:3000`.
- `yarn build` – Type-check with `tsc` and produce a production build in `dist/`.
- `yarn preview` – Preview the production build locally.

## Project Structure

```
src/
  app/            # Routing and providers
  components/     # UI components and pages
  config/         # Environment and path helpers
  lib/            # API client and React Query config
  types/          # Type augmentations
```

## NFC & QR Scanning

- The QR scanner uses the Browser `BarcodeDetector` API. If unsupported, a warning is shown.
- NFC scanning relies on the Web NFC API (`NDEFReader`). For unsupported devices/browsers the UI disables the NFC action.
- Both scanning methods reuse `api.post('/scan', { value })` to submit data.

## Deployment

1. Build the project: `yarn build`
2. Deploy the `dist/` folder to your hosting provider. Follow the [Vite deployment guide](https://vitejs.dev/guide/static-deploy) if needed.

## Troubleshooting

- Ensure your browser grants camera permissions for QR scanning.
- NFC functionality is limited to secure contexts (HTTPS) and supported Android devices.
- Validate environment variables match the backend configuration; invalid envs throw during startup thanks to Zod validation.
