import user from './user'
import my from './my'
import ask from './ask'
import home from './home'
import anno from './anno'

export default app => {
  app.use('/user', user)
  app.use('/my', my)
  app.use('/ask', ask)
  app.use('/home', home)
  app.use('/anno', anno)
}