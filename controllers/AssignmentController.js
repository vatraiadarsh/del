const Assignment = require('../models/Asignment');
const log = require('../config/winston');
const assignmentController = {};

assignmentController.list = (req, res) => {
  Assignment.find({}).exec((err, assignments) => {
    if (err) {
      log.error('Error:', err);
    } else {
      res.render('assignments/index', {
        assignments,
        csrfToken: req.csrfToken(),
      });
    }
  });
};

assignmentController.create = (req, res) => {
  res.render('assignments/create', {
    csrfToken: req.csrfToken(),

  });
};

assignmentController.save = (req, res) => {
  const assignments = new Assignment({
    subject: req.body.subject,
    teacher: req.body.teacher,
  });
  assignments.save((error) => {
    log.info(assignments);
    if (error) {
      log.error(error);
    }
  });
  res.redirect('/assignments');
};


module.exports = assignmentController;
