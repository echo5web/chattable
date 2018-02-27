export default {

  getStepsFromForm (formSelector, groupSelector, labelSelector, inputSelector, invalidMessageSelector, submitCallback, validateInput) {
    this.formSelector = formSelector
    this.groupSelector = groupSelector
    this.labelSelector = labelSelector
    this.inputSelector = inputSelector
    this.invalidMessageSelector = invalidMessageSelector
    this.submitCallback = submitCallback
    this.validateInput = validateInput
    this.form = document.querySelector(formSelector)
    this.groups = this.form.querySelectorAll(groupSelector)

    this.groupId = null
    this.steps = []
    this.parseGroups()
    this.steps[this.steps.length - 1].trigger = this.formSelector + '-submit'
    this.steps.push({
      id: this.formSelector + '-submit',
      message: null,
      callback: submitCallback
    })
    console.log(this.steps)
    return this.steps
  },

  parseGroups () {
    for (var i = 0; i < this.groups.length; i++) {
      var label = this.groups[i].querySelector(this.labelSelector)
      this.groupId = this.groups[i].id ? this.groups[i].id : this.formSelector + i
      if (this.steps[this.steps.length - 1]) {
        this.steps[this.steps.length - 1].trigger = this.groupId
      }
      this.steps.push({
        id: this.groupId,
        message: label ? label.innerHTML : null,
        trigger: label.dataset.trigger ? label.dataset.trigger : false,
        delay: label.dataset.delay ? label.dataset.delay : false,
        duration: label.dataset.duration ? label.dataset.duration : false
      })
      var inputs = this.groups[i].querySelectorAll(this.inputSelector)
      if (inputs.length) {
        if (!this.steps[this.steps.length - 1].trigger) {
          this.steps[this.steps.length - 1].trigger = this.groupId + '-input'
        }
        if (inputs[0].type === 'submit') {
          continue
        }
        if (inputs[0].type === 'radio') {
          this.parseRadioInputs(inputs, i)
        } else {
          this.parseTextInput(inputs[0], i)
        }
      }
    }
  },

  parseRadioInputs (inputs, i) {
    var options = []
    var _this = this
    for (var r = 0; r < inputs.length; r++) {
      options.push({
        label: inputs[r].parentElement.textContent.trim(),
        value: inputs[r].value,
        name: inputs[r].name,
        input: inputs[r],
        trigger: inputs[r].dataset.trigger
      })
    }
    this.steps.push({
      id: this.groupId + '-input',
      key: inputs[0].name,
      options: options,
      delay: 0,
      duration: 0,
      validate: function (userInput) {
        return _this.validateInput(userInput)
      },
      invalidMessage: inputs[0].closest(_this.groupSelector).querySelector(_this.invalidMessageSelector) ? inputs[0].closest(_this.groupSelector).querySelector(_this.invalidMessageSelector).innerHTML : '',
      callback: function (step, option) {
        _this.setInputValue(option.input, option.value)
      }
    })
  },

  parseTextInput (input, i) {
    var _this = this
    this.steps.push({
      id: this.groupId + '-input',
      userInput: true,
      key: input.name,
      delay: 0,
      duration: 0,
      validate: function (userInput) {
        userInput.input = input
        return _this.validateInput(userInput)
      },
      invalidMessage: input.closest(_this.groupSelector).querySelector(_this.invalidMessageSelector).innerHTML,
      callback: function (step, userInput) {
        _this.setInputValue(input, userInput.value)
      }
    })
  },

  setInputValue (inputNode, value) {
    if (inputNode.type === 'radio') {
      inputNode.checked = true
    } else {
      inputNode.value = value
    }
  }

}
