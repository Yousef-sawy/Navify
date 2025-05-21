import homepage from './homepage'
import navigationPage from './navigationpage'
import test from './test'
import feedback from './feedback'
import headertranslations from './headertranslations'
import print from './printPage'

export default {
  failed:'فشل الإجراء',
  success:'كان الإجراء ناجحا',
  hello: 'مرحبا',
  ...homepage,
  ...navigationPage,
  ...test,
  ...feedback,
  ...headertranslations,
  ...print,
}
