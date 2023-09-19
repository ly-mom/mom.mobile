import { mapGetters } from 'vuex'

export const globalMixin = {
  data() {
    return {
      //   primaryTheme: 'theme-default',
    }
  },
  computed: {
    ...mapGetters(['themeName', 'primaryColor', 'infoColor', 'errorColor', 'successColor', 'warnColor']),
    mom() {
      return this.$refs.momLayout
    },
  },
  method: {
    isEmpty(v) {
      switch (typeof v) {
        case 'undefined':
          return true
        case 'string':
          if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
          break
        case 'boolean':
          if (!v) return true
          break
        case 'number':
          if (0 === v || isNaN(v)) return true
          break
        case 'object':
          if (null === v || v.length === 0) return true
          for (const i in v) {
            return false
          }
          return true
      }
      return false
    },
  },
}
