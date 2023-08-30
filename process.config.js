"use strict";

const path = require("path");
const defaultLogFile = path.join(__dirname, "/logs/next-server.log");

module.exports = {
  apps: [
    {
      name: "next-server",
      script: "pnpm",
      args: "run start",
      cwd: process.env.WORKDIR || ".",
      autorestart: true,
      max_memory_restart: process.env.MAX_MEMORY_RESTART || "750M",
      out_file: defaultLogFile,
      error_file: defaultLogFile,
      log_file: defaultLogFile,
      merge_logs: true,
      kill_timeout: 30000,
      log_date_format: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
