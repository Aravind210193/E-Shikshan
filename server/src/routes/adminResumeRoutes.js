const express = require('express');
const router = express.Router();
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');
const ctrl = require('../controllers/adminResumeController');

router.use(adminAuth);

router.get('/stats', ctrl.stats);
router.get('/', checkPermission('resumes'), ctrl.getAll);
router.get('/:id', checkPermission('resumes'), ctrl.getById);
router.post('/', checkPermission('resumes'), ctrl.create);
router.put('/:id', checkPermission('resumes'), ctrl.update);
router.delete('/:id', checkPermission('resumes'), ctrl.remove);

module.exports = router;
