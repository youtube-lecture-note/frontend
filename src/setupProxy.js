// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/auth", "/api"],
    createProxyMiddleware({
      target: "https://cpyt.sytes.net:444",
      changeOrigin: true,
      secure: false,
      onProxyRes(proxyRes) {
        const loc = proxyRes.headers["location"];
        if (loc) {
          // 절대 URL → 상대경로로 변경
          proxyRes.headers["location"] = loc.replace(
            /^https:\/\/cpyt\.sytes\.net:444/,
            ""
          );
        }
      },
    })
  );
};
