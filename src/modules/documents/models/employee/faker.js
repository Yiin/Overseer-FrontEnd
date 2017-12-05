import faker from 'faker'

const EmployeeFaker = (superclass) => class extends superclass {

  static fakeData() {
    return {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      job_title: faker.name.jobTitle(),
      email: faker.internet.exampleEmail(),
      phone: faker.phone.phoneNumber()
    }
  }
}

export default EmployeeFaker
