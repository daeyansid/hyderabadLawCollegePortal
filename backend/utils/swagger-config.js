const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['../routes/*.js']; // Replace with path to your route files

swaggerAutogen(outputFile, endpointsFiles);
