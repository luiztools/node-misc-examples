//logger.js
const winston = require('winston');

//exemplo com severidade
// const logger = winston.createLogger({
//     format: winston.format.combine(
//         winston.format.errors({ stack: true }),
//         winston.format.json()
//     ),
//     transports: [
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'info.log', level: 'info' }),
//     ],
// });

//exemplo com limite de tamanho
// const logger = winston.createLogger({
//     format: winston.format.combine(
//         winston.format.errors({ stack: true }),
//         winston.format.json()
//     ),
//     transports: [
//         new winston.transports.File({
//             filename: 'error.log',
//             maxsize: 1024 * 1024 * 10,
//             maxFiles: 1,
//             tailable: true
//         })
//     ],
// });

//exemplo com logs rotativos
const { WinstonRotatingFile } = require("winston-rotating-file");
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new WinstonRotatingFile({
            filename: 'error.log',
            rfsOptions: { size: "10M", maxFiles: 1, path: "logs" }
        })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger;