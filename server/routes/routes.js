const authHandler = require("./authRoute");
const profileHandler = require("./profileRoute");

const routes = [
	{
		path: "/api/auth",
		handler: authHandler,
	},
    	{
		path: "/api/profile",
		handler: profileHandler,
	},
];

module.exports = (app) => {
	routes.forEach((router) => {
		app.use(router.path, router.handler);
	});
};