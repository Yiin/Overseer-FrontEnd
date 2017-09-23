export default {
  ADD_RELATIONSHIP(state, { firstTableName, secondTableName }) {
    state.relationshipsMap[firstTableName].push(secondTableName)
  }
}
