const Student = require('../models/Student');
const {validationResult} = require('express-validator/check');
const log = require('../config/winston');
const mongoose = require('mongoose');
const csvexport = require('csv-express');
const csv = require('fast-csv');

const studentController = {};

studentController.list = (req, res) => {
  Student.find({}).exec((err, students) => {
    if (err) {
      log.error('Error:', err);
    } else {
      res.render('students/index.ejs', {
        students,
        csrfToken: req.csrfToken(),
      });
    }
  });
};

studentController.create = (req, res) => {
  res.render('students/create', {
    data: {},
    errors: {},
    csrfToken: req.csrfToken(),
  });
};


// studentController.create = (req, res) => {
//   Assignment.find({}).populate('assignments').exec((err, assignments) => {
//     if (err) {
//       log.error('Error:', err);
//     } else {
//       res.render('../views/students/create', {
//         assignments,
//         data: {},
//         errors: {},
//         csrfToken: req.csrfToken(),
//       });
//     }
//   });
// };

studentController.save = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('students/create', {
      data: req.body,
      errors: errors.mapped(),
      csrfToken: req.csrfToken(),

    });
  } else {
    const student = new Student({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      message: req.body.message,
      contact: req.body.contact,
    });
    student.save((error) => {
      log.info('student created');
      if (error) {
        log.error(error);
      }
    });
  }
  req.flash('success_msg', 'Successfully created' + req.body.fname + ' ' +
    req.body.lname + '\'s' + ' profile!');

  res.redirect('/students');
};

studentController.edit = (req, res) => {
  Student.findOne({_id: req.params.id}).exec((err, student) => {
    if (err) {
      log.error('Error:', err);
    } else {
      res.render('students/edit', {
        student,
        csrfToken: req.csrfToken(),
      });
    }
  });
};

studentController.update = (req, res) => {
  Student.findOneAndUpdate(req.params.id, {
    $set: {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      message: req.body.message,
      contact: req.body.contact,
    },
  }, {new: true}, (err, student) => {
    if (err) {
      log.error(err);
      res.render('student/edit', {
        student: req.body,
        errors: errors.mapped(),
        csrfToken: req.csrfToken(),
      });
    }
    req.flash('success_msg', ' Successfully Updated ' + req.body.fname + ' ' +
      req.body.lname + '\'s' + ' profile!');
    res.redirect('/students');
  });
};

studentController.delete = (req, res) => {
  Student.deleteOne({
    _id: req.params.id,
  }, (err) => {
    if (err) {
      log.error(err);
    } else {
      log.warn('student deleted!');
      req.flash('error_msg', ' Successfully Deleted Student Profile');
      res.redirect('/students');
    }
  });
};


studentController.export_csv = (req, res, next) => {
  const filename = 'students.csv';
  Student.find().lean().exec({}, (err, students) => {
    if (err) res.send(err);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
    res.csv(students, true);
  });
};


studentController.import_csv = (req, res) => {
  res.render('students/importcsv', {
    csrfToken: req.csrfToken(),
  });
};

studentController.post_import_csv = (req, res) => {
  if (!req.files) {
    return res.render('students/importcsv', {
      csrfToken: req.csrfToken(),
    });
  } else {
    const studentFile = req.files.file;

    const students = [];

    csv.fromString(studentFile.data.toString(), {
      headers: true,
      ignoreEmpty: true,
    })
        .on('data', (data) => {
          data['_id'] = new mongoose.Types.ObjectId();
          students.push(data);
        })
        .on('end', () => {
          Student.create(students, (err, documents) => {
            log.error(err);
          });

          res.send(students.length +
          ' Students have been successfully uploaded.');
        });
  };
};

module.exports = studentController;
