import type { NextConfig } from "next";

const cpanel = process.env.CPANEL === "1";

const nextConfig: NextConfig = {
  // Oculta la burbuja roja "N / Issue" en desarrollo (útil en demos desde el celular).
  devIndicators: false,
  images: {
    qualities: [75, 100],
    ...(cpanel ? { unoptimized: true } : {}),
  },
  ...(cpanel
    ? {
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
  // Celular en WiFi: sin esto Next bloquea /_next/* (403) y el login no hidrata.
  allowedDevOrigins: [
    "127.0.0.1",
    "192.168.1.62",
    "192.168.1.*",
    "192.168.*.*",
    "10.*.*.*",
  ],
};

export default nextConfig;
