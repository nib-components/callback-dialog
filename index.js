var CallbackForm = require('./form');
var Dialog = require('dialog');

function callback(url){

  var d = new Dialog({
    overlay: true,
    url: url
  });

  d.on('show', function(){

    var form = new CallbackForm({
      el: d.el.find('form')
    });

    form.on('cancel', d.hide, d);

    form.on('save', function(data, resp){
      var thanks = new Dialog({
        content: resp,
        closable: false
      });
      d.hide();
      thanks.show();
      thanks.hide(2000);
    });

    d.on('hide', function(){
      form.off();
      form.remove();
    });

  });

  d.show();
  return d;
}

module.exports = function(){
  $('body').on('click', '.js-book-callback', function(event){
    event.preventDefault();
    event.stopPropagation();
    callback(event.currentTarget.getAttribute('href'));
  });
};

module.exports.Form = CallbackForm;
