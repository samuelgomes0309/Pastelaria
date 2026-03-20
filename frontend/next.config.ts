import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb", // ajustar conforme sua necessidade
		},
	},
};

export default nextConfig;
