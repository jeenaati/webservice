const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'service.log');
const logger = createLogger({
    // change level if in dev environment versus production
    level: env === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.json()
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level} [${info.label}]:    ${info.message}`
                )
            )
        }),
        new transports.File({
            filename,
            format: format.combine(
                format.printf(
                    info =>
                        `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
                )
            )
        })
    ]
});
module.exports = {
    saveLogger: function (type, mes) {
        switch (type) {
            case "error":
                logger.error(mes);

                break;
            case "warn":
                logger.warn(mes);

                break;
            case "info":
                logger.info(mes);

                break;
            case "verbose":
                logger.verbose(mes);

                break;
            case "debug":
                logger.debug(mes);

                break;
            case "silly":
                logger.silly(mes);

                break;

            default:
                logger.info(mes);
        }
        return true
    }
}




