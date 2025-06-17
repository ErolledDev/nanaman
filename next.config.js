/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Fix for undici and other Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
      
      // Exclude problematic Node.js modules from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'undici': 'undici',
        'firebase-admin': 'firebase-admin',
        'firebase-admin/app': 'firebase-admin/app',
        'firebase-admin/firestore': 'firebase-admin/firestore',
      });
    }
    
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;