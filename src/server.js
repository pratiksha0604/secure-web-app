require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.disable('x-powered-by');                 // hide server info
app.use(helmet());                           // secure HTTP headers
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));    // limit request size
app.use(hpp());                              // prevent parameter pollution
app.use(morgan('combined'));                 // request logging
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));  // rate limiting

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => res.send('Secure web app is running'));

// central error handler: no stack traces leaked
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Something went wrong' });
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('Server started'));
}

module.exports = app;