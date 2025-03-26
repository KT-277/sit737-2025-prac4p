const express = require('express');
const winston = require('winston');

const app = express();
const port = 3000;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

app.use(express.json());

// Calculator operations
const calculate = (operation, num1, num2) => {
    switch (operation) {
        case 'add': return num1 + num2;
        case 'subtract': return num1 - num2;
        case 'multiply': return num1 * num2;
        case 'divide': return num2 !== 0 ? num1 / num2 : 'Cannot divide by zero';
        case 'exponentiate': return Math.pow(num1, num2);
        case 'modulo': return num1 % num2;
        case 'sqrt': return num1 >= 0 ? Math.sqrt(num1) : 'Cannot take square root of a negative number';
        default: return 'Invalid operation';
    }
};

// API endpoints
app.get('/:operation', (req, res) => {
    const { operation } = req.params;
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid numbers provided');
        return res.status(400).json({ error: 'Invalid numbers' });
    }

    const result = calculate(operation, num1, num2);
    logger.info(`New ${operation} operation requested: ${num1} ${operation} ${num2}`);

    res.json({ operation, num1, num2, result });
});

app.listen(port, () => {
    console.log(`Calculator microservice running at http://localhost:${port}`);
});
