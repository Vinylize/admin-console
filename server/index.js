/* eslint-disable no-console, no-shadow */
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import subdomain from 'express-subdomain';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import chalk from 'chalk';
import webpackConfig from '../webpack.config';
import config from '../config/environment';

const router = express.Router();
const subdomainString = 'admin';

if (config.env === 'development') {
  const app = new WebpackDevServer(webpack(webpackConfig), {
    contentBase: '/build/',
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: true
  });

  // Serve static resources
  router.get('/', express.static(path.join(__dirname, '../build')));
  app.use(subdomain(subdomainString, router));
  app.listen(config.port, () => console.log(chalk.green(`listening on port ${config.port}`)));
} else if (config.env === 'production') {
  // Launch Relay by creating a normal express server
  const app = express();
  app.use(historyApiFallback());
  router.get('/', express.static(path.join(__dirname, '../build')));
  app.use(subdomain(subdomainString, router));
  app.listen(config.port, () => console.log(chalk.green(`listening on port ${config.port}`)));
}
