# Apostle Sunday Iyi - Virtual Assistant

This is a full-stack application featuring a React frontend and a Node.js/Express backend integrated with the Google Gemini API.

## Hostinger Deployment Settings

To deploy this application on Hostinger's Node.js platform via GitHub, use the following settings:

- **Install command:** `npm install`
- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Output directory:** `dist`
- **Entry file:** `dist/server.cjs`

### Environment Variables

Ensure the following environment variables are configured in your Hostinger Node.js application settings:

- `NODE_ENV`: `production`
- `HOSTINGER`: `true`
- `GEMINI_API_KEY`: Your Google Gemini API Key
- `PORT`: (Optional, Hostinger sets this automatically)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.
3. Start the development server:
   ```bash
   npm run dev
   ```
