import homepage from './homepage'

import navigationPage from './navigationpage'
import test from './test'
import feedback from './feedback'

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  hello: 'Hello',
  ...homepage,
  ...navigationPage,
  ...test,
  ...feedback
}
