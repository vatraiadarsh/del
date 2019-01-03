const express = require('express');
const router = express.Router();
const student = require('../controllers/StudentController');

const {check} = require('express-validator/check');

router.get('/', student.list);

// Make sure to use same route for get and post
router.get('/create', student.create);
// take care first validate then only student.save
router.post('/create', [
  check('fname').isLength({min: 1})
      .withMessage('First name is required').trim(),
  check('lname').isLength({min: 1})
      .withMessage('Last name is required').trim(),
  check('email').isEmail()
      .withMessage('That email doesn‘t look right').trim().normalizeEmail(),
  check('message').isLength({min: 1})
      .withMessage('Message is required').trim(),
  check('contact').isLength({min: 1})
      .withMessage('Contact is required').trim(),
], student.save);

router.get('/edit/:id', student.edit);

router.post('/update/:id', student.update);

router.post('/delete/:id', student.delete);

router.get('/exportcsv', student.export_csv);

router.get('/importcsv', student.import_csv);

router.post('/importcsv', student.post_import_csv);


module.exports = router;

