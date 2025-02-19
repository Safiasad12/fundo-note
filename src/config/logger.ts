import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, printf, colorize } = format;

const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleLogFormat),
    }),
    new transports.File({
      filename: "logs/app.log",
      level: "error",
      format: combine(timestamp(), json()),
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "logs/rejections.log" }),
  ],
});

export default logger;