import { text } from './data-types'

export default (contact) => {
  return {
    first_name: text(contact.first_name),
    last_name: text(contact.last_name),
    job_position: text(contact.job_position),
    website: text(contact.website),
    email: text(contact.email),
    phone: text(contact.phone)
  }
}
