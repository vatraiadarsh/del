const log = require('./config/winston');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://localhost/_c`, {useNewUrlParser: true})
    // eslint-disable-next-line max-len
    .then(() => log.info(`worker process ${process.pid} :: Database connection succesful`))
    .catch((err) => log.error(err));
