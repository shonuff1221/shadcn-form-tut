/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/sendMessage",
        destination: "http://localhost:3000/api/sendMessage*",
      },
    ];
  },
};

module.exports = nextConfig;
