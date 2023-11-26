module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/static/:path*",
        destination: `${process.env.CDN}/:path*`, 
      },
    ];
  };

  return {
    rewrites,
  };
};