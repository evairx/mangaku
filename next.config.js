module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/v1/:path*",
        destination: `${process.env.CDN}/:path*`, 
      },
    ];
  };

  return {
    rewrites,
  };
};