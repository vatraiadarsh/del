const log = require('./config/winston');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const hostname = 'localhost';
const port = parseInt(process.argv[2] || 3000);

module.exports = (app) => {
  if (cluster.isMaster) {
    log.info('Starting mastdr process: ', process.pid);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker) => {
      log.warn(`worker process ${process.pid} had died`);
      log.info(`starting new worker`);
      cluster.fork();
    });
  } else {
    log.info(`started a worker at ${process.pid}`);
    require('./app');
    app.listen(port, hostname, () => {
      log.info(`worker process ${process.pid} :: Server running at http://${hostname}:${port}/`);
    });
  }
};
