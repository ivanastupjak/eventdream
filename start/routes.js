'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.group(()=> {
  Route.post('/register', 'AuthController.registerUser')
  Route.post('/login', 'AuthController.loginUser')
  Route.post('/registerOrganisation','AuthController.registerOrganisation')
  Route.post('/loginOrganisation', 'AuthController.loginOrganisation')
}).prefix('/api/auth')

Route.group(()=>{
  Route.post('/create', 'EventController.addEvent').middleware(['getOrganisation'])
  Route.post('/edit/:event_id', 'EventController.editEvent').middleware(['getOrganisation'])
  Route.delete('/delete/:event_id', 'EventController.deleteEvent').middleware(['getOrganisation'])
  Route.get('/all','EventController.getEvents')
  Route.post('/confirmArrival','EventController')
}).prefix('/api/event')
