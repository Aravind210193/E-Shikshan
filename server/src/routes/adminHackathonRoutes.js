const express = require('express');
const router = express.Router();
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');
const ctrl = require('../controllers/adminHackathonController');

router.use(adminAuth);

router.get('/stats', ctrl.stats);
router.get('/', checkPermission('hackathons'), ctrl.getAll);
router.get('/:id', checkPermission('hackathons'), ctrl.getById);
router.post('/', checkPermission('hackathons'), ctrl.create);
router.put('/:id', checkPermission('hackathons'), ctrl.update);
router.delete('/:id', checkPermission('hackathons'), ctrl.remove);

module.exports = router;
