// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/builder',
        destination: 'https://builder.aws.com?inviteId=fadb5a42-795d-4f94-8de0-a8b26856ef69',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
