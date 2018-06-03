import express from 'express';
import chalk from 'chalk';
import mongoose from 'mongoose';

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`, (err) => {
  if (err) console.log(chalk.red(`MONGO: ${err.message}`));
});

// Static route for documentation
app.use('/docs', express.static(`${__dirname}/docs`));

require('./config/express').default(app);
require('./config/routes').default(app);

app.listen(process.env.PORT, () => {
  console.log(chalk.green(`\nAPI server listening on port ${chalk.bold(process.env.PORT)} in ${chalk.bold(app.get('env'))} mode.\n`));
});

export default app;
