/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const HomeController = () => import('#controllers/home_controller')
const AuthSignInController = () => import('#controllers/auth/sign_in_controller')
const AuthSignUpController = () => import('#controllers/auth/sign_up_controller')
const AuthSignOutController = () => import('#controllers/auth/sign_out_controller')
const AuthSocialController = () => import('#controllers/auth/social_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', [HomeController, 'index']).as('home')

/**
 * auth
 */
router.get('/signin', [AuthSignInController, 'create']).as('auth.signin.create')
router.post('/signin', [AuthSignInController, 'store']).as('auth.signin.store')
router.get('/signup', [AuthSignUpController, 'create']).as('auth.signup.create')
router.post('/signup', [AuthSignUpController, 'store']).as('auth.signup.store')
router.post('/signout', [AuthSignOutController, 'handle']).as('auth.signout')

/**
 * auth social
 */
router.get('/:provider/redirect', [AuthSocialController, 'redirect']).as('auth.social.redirect')
router.get('/:provider/callback', [AuthSocialController, 'callback']).as('auth.social.callback')
router.get('/:provider/unlink', [AuthSocialController, 'unlink']).as('auth.social.unlink')//.middleware(['auth'])

/**
 * users
 */
router.get('/users/menu', [UsersController, 'menu']).as('users.menu')

/**
 * content
 */
router.get('/series/:collectionSlug/lessons/:slug', 'todo').as('series.lessons.show')
router.get('/todo-1', 'todo').as('blog.show')
router.get('/todo-2', 'todo').as('news.show')
router.get('/todo-3', 'todo').as('snippets.show')
router.get('/todo-4', 'todo').as('streams.show')