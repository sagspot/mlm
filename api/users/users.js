const router = require('express').Router();
const userController = require('./userController');
const { protect, authorize } = require('../middlewares/auth');

router.get(
  '/',
  protect,
  authorize('admin', 'superAdmin'),
  userController.users_get_all
);
router.post('/register', userController.users_post_register);
router.post('/login', userController.users_post_login);
router.get('/:id', protect, userController.users_get_user);
router.patch(
  '/:id',
  protect,
  authorize('admin', 'superAdmin'),
  userController.users_patch_user
);
router.patch(
  '/role/:id',
  protect,
  authorize('superAdmin'),
  userController.users_patch_role
);
router.delete(
  '/:id',
  protect,
  authorize('superAdmin'),
  userController.users_delete_user
);

module.exports = router;
