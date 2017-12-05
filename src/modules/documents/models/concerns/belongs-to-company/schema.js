import { methods as CompanyRepository } from '../../../repositories/company'

const BelongsToCompanySchema = (superclass) => class extends superclass {
  static parse(data) {
    return Object.assign(super.parse(data), {
      company: CompanyRepository.findByKey(data.company_uuid)
    })
  }
}

export default BelongsToCompanySchema
