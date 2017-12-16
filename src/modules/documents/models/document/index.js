import { mix } from 'mixwith'
import Model from '../model'
import SerializesData from '../concerns/serializes-data'

export default class Document extends mix(Model).with(SerializesData) {
  getTitle() {
    return this.name || 'Undefined'
  }
}
