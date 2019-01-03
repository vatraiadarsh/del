const userRouter = require('./routes/user');
const studentRouter = require('./routes/student');
const assignmentRouter = require('./routes/assignment');
const {ensureAuthenticated} = require('./config/auth');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('index');
  });
  app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
  });
  app.use('/users', userRouter);
  app.use('/students', studentRouter);
  app.use('/assignments', assignmentRouter);
};
