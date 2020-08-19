import { mapActions } from 'vuex'

/**
 * Trigger specific page view events
 * @param {string} eventKey - The page/event we want to trigger.
 * (also is the default payload key)
 * @param {string} [payloadKey] - looks for an object in context for a specified key.
 * (falls back to eventKey)
 * ---
 * Assumes payload data loaded through props or asyncData
 */

export default (eventKey, payloadKey) => {
  const event = `${eventKey}View`

  return {
    created() {
      const payload = payloadKey ? this[payloadKey] : this[eventKey]
      this[event](payload)
    },
    methods: {
      ...mapActions('events', [event])
    }
  }
}

