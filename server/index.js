/* eslint-disable no-console, no-shadow */
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import WebpackDevServer from 'webpack-dev-server';
import historyApiFallback from 'connect-history-api-fallback';
import chalk from 'chalk';
import webpackConfig from '../webpack.config';
import config from './config/environment';

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
  app.use('/', express.static(path.join(__dirname, '../build')));
  app.listen(config.port, () => console.log(chalk.green(`listening on port ${config.port}`)));
} else if (config.env === 'production') {
  // Launch Relay by creating a normal express server
  const app = express();
  app.use(historyApiFallback());
  app.use(express.static(path.join(__dirname, '../build')));

  // app.get("*", (req, res) => res.sendFile(HTML_FILE));
  app.listen(config.port, () => console.log(chalk.green(`listening on port ${config.port}`)));
}
