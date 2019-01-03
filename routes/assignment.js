const express = require('express');
const router = express.Router();
const assignment = require('../controllers/AssignmentController');
const {ensureAuthenticated} = require('../config/auth');


router.get('/', ensureAuthenticated, assignment.list);
router.get('/create', ensureAuthenticated, assignment.create);
router.post('/create', ensureAuthenticated, assignment.save);

module.exports = router;
