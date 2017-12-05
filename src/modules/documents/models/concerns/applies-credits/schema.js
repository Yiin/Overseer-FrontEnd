import AppliedCredit from '../../applied-credit'

/**
 * @mixin
 */
const AppliesCreditsSchema = (superclass) => class extends superclass {
  static parse(data) {
    return Object.assign(super.parse(data), {
      appliedCredits: (data.applied_credits || []).map(AppliedCredit.create, AppliedCredit)
    })
  }

  serialize(options = {}) {
    return Object.assign(super.serialize(options), {
      applied_credits: this.appliedCredits.map((appliedCredit) => appliedCredit.serialize(options))
    })
  }
}
export default AppliesCreditsSchema
