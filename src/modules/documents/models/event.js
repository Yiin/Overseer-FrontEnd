import Model from './model'

class Event extends Model {
  static create(activity) {
    return new Event({
      id: activity.id,
      user: activity.user,
      action: activity.action,
      documentType: activity.document.type,
      activityList: [activity],
      colorIndex: activity.colorIndex,
      timestamp: activity.timestamp
    })
  }
}

export default Event
