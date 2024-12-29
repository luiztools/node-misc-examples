//index.js
const logger = require('./logger');

//const obj = { name: 'luiztools' }
const obj = undefined;

try {
    console.log(obj.name);
    logger.info('tudo funcionando!');
}
catch (error) {
    logger.error(error);
}