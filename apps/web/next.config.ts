import type { NextConfig } from 'next'

const config: NextConfig = {
  // Produces a self-contained server bundle for Docker deployments
  output: 'standalone',
}

export default config
