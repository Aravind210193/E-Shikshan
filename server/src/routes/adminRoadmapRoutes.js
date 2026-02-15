const express = require('express');
const router = express.Router();
const { adminAuth, checkPermission } = require('../middlewares/adminAuth');
const ctrl = require('../controllers/adminRoadmapController');

router.use(adminAuth);

router.get('/stats', ctrl.stats);
router.get('/', checkPermission('roadmaps'), ctrl.getAll);
router.get('/:id', checkPermission('roadmaps'), ctrl.getById);
router.post('/', checkPermission('roadmaps'), ctrl.create);
router.put('/:id', checkPermission('roadmaps'), ctrl.update);
router.delete('/:id', checkPermission('roadmaps'), ctrl.remove);

module.exports = router;
