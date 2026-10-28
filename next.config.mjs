import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname),
  serverExternalPackages: ['node:sqlite'],
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({
      'node:sqlite': 'commonjs node:sqlite',
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-router-dom': path.resolve(__dirname, 'src/lib/router-compat.tsx'),
    };
    return config;
  },
};

export default nextConfig;
