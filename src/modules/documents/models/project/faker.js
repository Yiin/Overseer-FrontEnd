import faker from 'faker'

const ProjectFaker = (superclass) => class extends superclass {
  static fakeData() {
    return {
      name: faker.company.bs(),
      description: faker.lorem.sentences()
    }
  }
}

export default ProjectFaker
