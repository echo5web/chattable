# Chattable

Chattable is a highly configurable chat bot built with Vue.js.  

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

You must include the chattable.js file and optionally the chattable.css stylesheet in your document.

```
<script src="chattable.min.js"></script>
```

```
<link type="text/css" rel="stylesheet" href="chattable.min.css"/>
```

### Quick Start

You can use Chattable's default configuration and create a chat bot with a form like so.

```
chattable.init();
chattable.setStepsFromForm('#my-form');
```

### Config

Below are the default configuration options for Chattable.  You can pass these as arguments to chattable's init function to create the initial state.

```
var args = {
  persistateState: 'chattable',
  chatBoxOpen: true,
  messages: [],
  unreadMessages: [],
  steps: [],
  currentStep: null,
  inputValue: null,
  userInputObject: null,
  userData: {},
  isTyping: false,
  defaultDuration: 1500,
  defaultDelay: 2000,
  botAvatar: require('../assets/robot.png'),
  sendButtonImage: require('../assets/send.svg'),
  chatButtonImage: require('../assets/robot.png'),
  notificationSound: require('../assets/just-like-that.mp3')
};

chattable.init(args);
```

### Steps

Chattable's bot runs on a series of steps created through JSON.  A step can be a message from the bot, user input, or a list of selectable options.

```
var steps = [
  {
    id: 'first-step',
    message: 'I\'m a message from the chattable chat bot.',
  },
  {
    id: 'second-step',
    message: 'This step allows user text input.',
    userInput: true,
  },
  {
    id: 'third-step',
    message: 'This step has selectable options.',
    options: [
      {
        label: 'Option 1',
        value: 'option1'
      },
      {
        label: 'Option 2',
        value: 'option2'
      }
    ]
  },
  {
    id: 'fourth-step',
    message: 'This step is delayed for 3 seconds and types for a duration of 2 seconds.',
    delay: 3000,
    duration: 2000
  }
]
```

#### Callbacks

A callback is run after a step is complete.  For steps that only contain messages, this is called after a message has been added.  For steps with user input, this is only called after valid input has been given.

The step itself as well as the userInput object are both passed to this function.

```
var steps = [
  {
    id: 'first-step',
    message: 'I¥'m a message from the chattable chat bot.',
    callback: function(step, userInput) {
      alert('Step 1 complete!');
    }
  }
```

#### Triggers

By default, steps will go in sequential order.  If you add a trigger to a step, it will move to the step with that ID once the current step is complete.

```
var steps = [
  {
    id: 'first-step',
    message: 'I¥'m a message from the chattable chat bot.',
    trigger: 'third-step'
  },
  {
    id: 'second-step',
    message: 'This step will be skipped.'
  },
  {
    id: 'third-step',
    message: 'I was triggered by the first step.'
  },
]
```

Triggers can also be used inside options.

```
var steps = [
  {
    id: 'first-step',
    options: [
      {
        label: 'Continue',
        value: 'option1'
      },
      {
        label: 'Skip to step 3',
        value: 'option2',
        trigger: 'third-step'
      }
    ]
  }
]
```

#### Validation

The validate option accepts a function that should return a boolean value.  If validation does not pass, the invalidMessage property will be added as a message.

```
var steps = [
  {
    id: 'first-step',
    userInput: true,
    validate: function(userInput) {
      if (userInput.value.trim() === 'yes') {
        return true
      }
    },
    invalidMessage: 'Please type "yes" to continue."
  }
]
```

The userInput object will pass back either the user's text input object or the object of the option selected.

#### Steps from forms

Chattable has built-in helper functions to create steps directly from forms.  The class selectors for each element can be configured in this function, but each form step must be wrapped in a group.

```
<div class="form-group">
  <div class="message">I'm shown as a message</div>
  <input type="text" name="myInput" />
  <div class="error-message">I'm shown if validation fails</div>
</div>
<div class="form-group">
  <div class="message">Here are some options:</div>
  <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
  <label><input type="radio" name="myRadio" value="option2" /> Option 2</label>
</div>
```

This form will automatically be parsed into sequential steps.  When an option is selected, Chattable will set the form's input to the user input value.

```
var formSelector = '#my-form',
formGroupSelector = '.form-group',
formLabelSelector = '.message',
formInputSelector = 'input',
formInvalidMessageSelector = '.error-message',
formSubmitCallback = function() {
  // Called at the end of all form steps
  form.submit()
},
validateInput = function(input) {
  // The input node is passed here to perform custom validation
  return true
};
chattable.setStepsFromForm(formSelector, formGroupSelector, formLabelSelector, formInputSelector, formInvalidMessageSelector, formSubmitCallback, validateInput)
```

## Authors

* **Joshua Flowers** - *Initial work* - [Echo 5](https://echo5web.com)

See also the list of [contributors](https://github.com/echo5web/chattable/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details