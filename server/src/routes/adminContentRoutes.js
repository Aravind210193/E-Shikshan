const express = require('express');
const router = express.Router();
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');
const ctrl = require('../controllers/adminContentController');

router.use(adminAuth);

router.get('/stats', ctrl.stats);
router.get('/', checkPermission('content'), ctrl.getAll);
router.get('/:id', checkPermission('content'), ctrl.getById);
router.post('/', checkPermission('content'), ctrl.create);
router.put('/:id', checkPermission('content'), ctrl.update);
router.delete('/:id', checkPermission('content'), ctrl.remove);

module.exports = router;
