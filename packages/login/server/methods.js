Accounts.onCreateUser(function (options, user) {
	if (options.profile) {
		user.status = options.profile.status;
		user.roles = options.profile.roles;
		user.profile = _.omit(options.profile, "status", "roles");
	}
	return user;
});

Meteor.methods({
	"createAccount": function (user) {
		if (!user || !user.username || !user.password1) {
			throw new Meteor.Error(400, "Missing information.");
		}

		if (user.password1 !== user.password2) {
			throw new Meteor.Error(500, "Passwords do not match.");
		}

		if (Meteor.users.findOne({ username: user.username })) {
			throw new Meteor.Error(500, "Username already exists.");
		}

		// create profile object
		var _profile = {
			status: "pending approval"
			, roles: [ "student-role" ]
		}
		if (user.name) {
			_profile.name = user.name;
		}
		if (user.phone) {
			_profile.mobileNumber = user.phone;
		}
		if (user.email) {
			_profile.emailAddress = user.email;
		}

		return Accounts.createUser({
			"username": user.username
			, "password": user.password1
			, "profile": _profile
		});
	}
})