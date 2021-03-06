var models = require(__dirname + "/../models");
var validation = require(__dirname + '/../validations')

module.exports = function(req, res) {
	if (req.metaData.current_user) {
		res.redirect("/user/home");
	} 
	else{
		var loginValidation = validation.loginValidation
		message = loginValidation.checkLoginInfo(req.flash('error')[0])
		res.render(
			"static/login", {
				metaData: req.metaData,
				message: message
			});   	
	}

}