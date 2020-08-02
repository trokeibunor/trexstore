var nodemailer = require('nodemailer');
// try {
//     require('./postinstall')
// } catch (e) {
//     console.log('error from node mailer')
// }
module.exports = function(credentials){
    var mailTransport = nodemailer.createTransport({
    service :'Gmail',
    auth : {
        user : credentials.gmail.user,
        pass : credentials.gmail.password
    }
}) 
    var from = '"trex stores" <DO NOT REPlY@trexstores.com>';
    var errorRecipient = 'okeibunoremma@gmail.com';

    return{
        send: function(to,subj,body){
            mailTransport.sendMail({
                from:from,
                to: to,
                subject: subj,
                html: body,
                generateTextFromHtml: true,
            },function(err){
                console.log('unable to send mail: ' + err)
            })
        },
        emailError: function(message,filename,exception){
            var body = '<h1>Trex stores website error</h1>' + 'message: <br><pre>' + message + '</pre></br>';
            if(exception){
                body += 'exception:<br><pre>' + exception + '</pre></br>'
            };
            if(filename){
                body += 'Filename:<br><pre>' + filename + '</pre></br>'
            };
            mailTransport.sendMail({
                from:from,
                to: errorRecipient,
                subject: 'trEX stores website Error',
                html: body,
                generateTextFromHtml: true,
            },function(err){
                console.log('unable to send mail: ' + err)
            })
        }
    }
}
