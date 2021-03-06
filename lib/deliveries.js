var _      = require('underscore');
var helper = require(__dirname + '/lib.js');

//include all delivery types
module.exports = {
  //delivery for email js
  emailjs : function(options) {
    //load the email library from the parent path
    var email = require(options.path);
    var smtp  = email.server.connect(options.config.server);

    return function(tokenToSend, uidToSend, recipient, callback, req) {
      var msg     = options.config.msg;
      var dataObj = {
        hostName    : helper.getBaseUrl(req.headers.referer),
        tokenToSend : tokenToSend,
        uidToSend   : uidToSend,
        recipient   : recipient,
        req         : req
      };

      try {
        var email = {
          text    : _.template(msg.text)(dataObj),
          from    : msg.from ? _.template(msg.to)(dataObj) : options.config.server.user,
          to      : msg.to ? _.template(msg.to)(dataObj) : uidToSend,
          subject : _.template(msg.subject)(dataObj)
        };

        if (msg.html) {
          email.attachment = [
            {
              data : _.template(msg.html)(dataObj),
              alternative:true
            }
          ];
        }

        smtp.send(email, function(err, message) {
          callback(err);
        });
      } catch(err) {
        callback('Error while sending mail : ' + err);
      }
    }
  },

  generic : function(options) {
    //load the email library from the parent path
    var mailer_function = options.mailer_function;

    return function(tokenToSend, uidToSend, recipient, callback, req) {
      var msg     = options.config.msg;
      var dataObj = {
        hostName    : helper.getBaseUrl(req.headers.referer),
        tokenToSend : tokenToSend,
        uidToSend   : uidToSend,
        recipient   : recipient,
        req         : req
      };

      try {
        var email = msg;
        email.from = msg.from ? _.template(msg.from)(dataObj) : options.config.server.user;
        email.to = msg.to ? _.template(msg.to)(dataObj) : uidToSend;
        email.subject = _.template(msg.subject)(dataObj);

        if (msg.html) {
          email_args.html = _.template(msg.html)(dataObj);
        }

        if (msg.text) {
          email_args.text = _.template(msg.text)(dataObj);
        }

        mailer_function(email_args, function(err, message) {
          callback(err);
        });
      } catch(err) {
        callback('Error while sending mail : ' + err);
      }
    }
  },

  custom : function(options) {
    return options.mailer_function;
  }
};
