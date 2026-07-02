const http = require('http');

const PORT = process.env.PORT || 3000;

const server = require('./app');

const req = http.get(`http://localhost:${PORT}`, (res) => {
    if (res.statusCode === 200) {
        console.log('TEST PASSED: GET / returned 200');
        process.exit(0);
    } else {
        console.error(`TEST FAILED: expected 200, got ${res.statusCode}`);
        process.exit(1);
    }
});

req.on('error', (err) => {
    console.error(`TEST FAILED: ${err.message}`);
    process.exit(1);
});
