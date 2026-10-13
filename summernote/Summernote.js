import $ from 'jquery'
module.exports = {
  template: '<textarea :name="name"></textarea>',

  props: {
    model: {
      required: true
    },
    name: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      default: {}
    }
  },

  mounted() {
    const vm = this
    const config = this.config

    config.callbacks = {
      onInit() {
        $(vm.$el).summernote('code', vm.model)
      },

      onChange() {
        vm.$emit('change', $(vm.$el).summernote('code'))
      },

      onBlur() {
        vm.$emit('change', $(vm.$el).summernote('code'))
      }
    }

    $(this.$el).summernote(config)
  }
}
