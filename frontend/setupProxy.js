const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy requests to the users service
  app.use(
    '/user',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
    })
  );

  // Proxy requests to the questions service
  app.use(
    '/question',
    createProxyMiddleware({
      target: 'http://localhost:8030',
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
    })
  );
};
