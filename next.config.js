/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.thedogapi.com',
      },
    ],
  },
  env: {
    NEXTAUTH_URL: "https://1460-177-24-162-3.ngrok-free.app",
    BASE_URL: "http://localhost:8081/api/v1",
  },
};


module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...nextConfig,
      env: {
        NEXTAUTH_URL: "http://localhost:3000",
        BASE_URL: "http://localhost:8081/api/v1",
      },
    }
  }

  return nextConfig
}

