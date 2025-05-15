import homepage from './homepage'
import navigationPage from './navigationpage'
import report from './report'
import feedback from './feedback'

export default {
  failed:'فشل الإجراء',
  success:'كان الإجراء ناجحا',
  hello: 'مرحبا',
  ...homepage,
  ...navigationPage,
  ...report,
  ...feedback
}
