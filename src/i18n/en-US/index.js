import homepage from './homepage'

import navigationPage from './navigationpage'
import report from './report'

export default {
  failed: 'Action failed',
  success: 'Action was successful',
  hello: 'Hello',
  ...homepage,
  ...navigationPage,
  ...report,
}
