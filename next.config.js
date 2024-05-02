/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  return {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      BASE_URL: process.env.BACKEND_URL
    },
    output: 'standalone',
  };
}
