import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

export default passport => {
	passport.use(
		new JwtStrategy(opts, async (jwtPayload, done) => {
			try {
				const user = await User.findById(jwtPayload.id);
				if (user) return done(null, user);
				return done(null, false);
			} catch (err) {
				console.log(err);
				done(err, null);
			}
		}),
	);
};
