import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./prisma/generated/client/libquery_engine-rhel-openssl-3.0.x.so.node"],
  },
};

export default nextConfig;
