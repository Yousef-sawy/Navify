import homepage from './homepage'

import navigationPage from './navigationpage'
import report from './report'
import feedback from './feedback'

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  hello: 'Hello',
  ...homepage,
  ...navigationPage,
  ...report,
  ...feedback
}
