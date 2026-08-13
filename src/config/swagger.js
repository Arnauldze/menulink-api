const YAML = require('yamljs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

// Load the base swagger.yaml file
const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));

const options = {
    swaggerDefinition: swaggerDocument,
    apis: [path.join(__dirname, '../routes/*.js')], // Paths to the files containing Swagger annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
