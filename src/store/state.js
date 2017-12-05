export default {
  preloadedData: null,
  encryptedData: null,

  /**
   * Scale page depending on user resolutiono
   *
   * TODO: Make shit responsive yo
   */
  scale: {
    ratio: '',
    offset: 0
  },

  ui: {
    overlay: {
      /**
       * Overlay items that are currently active
       * e.g. employee dialog + product edit modal
       *
       * Used to hide overflow on document body when it's
       * overlayed and non-interactable.
       */
      items: []
    },

    sidebar: {
      isHidden: false
    }
  }
}
