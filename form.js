var FormValidator = require('form-validator');

function CallBackForm(options){
  this.el = $(options.el);
  this.validator = new FormValidator({
    el: this.el,
    schema: this.validates,
    messages: this.messages
  });
  this.validator.on('submit', this._onSubmit, this);
  this.validator.on('cancel', this._onCancel, this);
  this.render();
}

_.extend(CallBackForm.prototype, Backbone.Events, {
  validates: {
    'Name': function(val){
      return !!val;
    },
    'PhoneNumber': function(val) {
      if( !val ) return false;
      return !!val.replace(/\s/g, '').match(/^0{1}[2-4,7-8]{1}[0-9]{8}$/);
    },
    'CallbackOption': function(val){
      return !!val;
    },
    'Reason': function(val){
      return val && val.length <= 500;
    }
  },
  messages: {
    'Name': function() {
      return 'Please enter your name';
    },
    'PhoneNumber': function(){
      return 'Please enter a valid phone number e.g. 02 1234 5678';
    },
    'CallbackOption': function() {
      return 'Please select a time';
    },
    'Reason': function(){
      return 'Please enter 500 characters or less';
    }
  },
  save: function(data) {

    // Set the correct day to call for weekends
    if(data.DayToCall === "Saturday") {
      data.ClickToCallSection = data.ClickToCallSectionWeekend;
    }

    // Server doesn't use this
    delete data.ClickToCallSectionWeekend;

    return $.ajax({
      url: this.el.attr('action') + '?_=' + Date.now(),
      type: 'POST',
      data: data
    });
  },
  render: function(){
    this.callbackOptions = this.el.find('.js-callback-options');
    this.hours = this.el.find('.js-callback-hours');

    // Changing the time to call
    this.timeSelector = this.el.find('.js-callback-option-select').find('select');
    this.timeSelector.on('change', _.bind(this._onTimeChange, this));

    // Changing the selected day
    this.daySelector = this.el.find('.js-callback-day select');
    this.daySelector.on('change', _.bind(this._onDayChange, this));

    // Rename the callback field for weekends
    this.el.find('input[value="8am - 12:30pm AEST"]').attr('name', 'ClickToCallSectionWeekend').click();
    this._onTimeChange();
  },
  remove: function(){
    this.validator.remove();
  },
  _onTimeChange: function(){
    var val = this.timeSelector.val();
    this.callbackOptions.toggleClass('hide-children', val !== 'CallMeLater');
  },
  _onDayChange: function(){
    var val = this.daySelector.val();
    this.hours.toggleClass('is-weekend', val === "Saturday");
  },
  _onCancel: function(event) {
    this.trigger('cancel');
  },
  _onSubmit: function(event, data){
    event.preventDefault();
    var self = this;
    var saving = this.save(data);
    saving.done(function(resp){
      self.trigger('save', data, resp);
    });
  }
});

module.exports = CallBackForm;