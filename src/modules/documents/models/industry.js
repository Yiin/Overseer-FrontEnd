import { ObjectModel } from 'objectmodel'

/**
 * Industry model
 * @type {ObjectModel}
 */
const Industry = new ObjectModel({
  id: Number,
  name: String
})

Industry.create = function (data) {
  return new Industry({
    id: data.id,
    name: data.name
  })
}

export default Industry
