import AppliedCredit from '../../applied-credit'

/**
 * @mixin
 */
const AppliesCreditsSchema = (superclass) => class extends superclass {
  static parse(data) {
    return {
      ...(typeof super.parse === 'function' ? super.parse(data) : {}),

      appliedCredits: (data.applied_credits || []).map(AppliedCredit.create, AppliedCredit)
    }
  }

  serialize(options = {}) {
    return {
      ...(typeof super.serialize === 'function' ? super.serialize(options) : {}),

      applied_credits: this.appliedCredits.map((appliedCredit) => appliedCredit.serialize(options))
    }
  }
}
export default AppliesCreditsSchema
