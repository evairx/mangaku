module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/cdn/:path*",
        destination: `${process.env.CDN}/:path*`, 
      },
    ];
  };

  return {
    rewrites,
  };
};