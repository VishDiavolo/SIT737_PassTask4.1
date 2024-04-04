const express = require("express");
const app = express();
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculate-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Arithmetic operations
const arithmeticOperations = {
    add: (num1, num2) => num1 + num2,
    subtract: (num1, num2) => num1 - num2,
    multiply: (num1, num2) => num1 * num2,
    divide: (num1, num2) => {
        if (num2 === 0) {
            throw new Error("Division by zero is not allowed");
        }
        return num1 / num2;
    },
};

// Endpoint handler generator
const createArithmeticEndpoint = (operation) => (req, res) => {
    try {
        const num1 = parseFloat(req.query.num1);
        const num2 = parseFloat(req.query.num2);
        if (isNaN(num1) || isNaN(num2)) {
            throw new Error("One or both values you entered are not valid numbers");
        }

        const result = arithmeticOperations[operation](num1, num2);
        logger.info(`Operation ${operation} with parameters ${num1} and ${num2} resulted in ${result}`);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
};

// Define routes
app.get("/add", createArithmeticEndpoint('add'));
app.get("/subtract", createArithmeticEndpoint('subtract'));
app.get("/multiply", createArithmeticEndpoint('multiply'));
app.get("/divide", createArithmeticEndpoint('divide'));

const port = 3040;
app.listen(port, () => {
    console.log(`You can access the calculator from port ${port}`);
});
