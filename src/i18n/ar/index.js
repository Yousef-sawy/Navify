import homepage from './homepage'
import navigationPage from './navigationpage'
import report from './report'

export default {
  failed:'فشل الإجراء',
  success:'كان الإجراء ناجحا',
  hello: 'مرحبا',
  ...homepage,
  ...navigationPage,
  ...report,
}
