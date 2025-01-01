import { createLogger, format, level, transports } from "winston";
const {combine, timestamp, json, colorize} = format;


const consoleLogFormate = combine(
    colorize(),
    format.printf(({ level, message, timestamp }) =>{
        return `[${timestamp}] ${level} : ${message}`;
    })
);


const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        json()
    ),
    transports : [
        new transports.Console({
            format: consoleLogFormate
        }),
        new transports.File({
            filename: 'app.log'
        })
    ],
});

export default logger;