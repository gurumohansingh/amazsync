require('dotenv').config();
var createError = require('http-errors'),
	express = require('express'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	indexRouter = require('./routes/index'),
	usersRouter = require('./routes/usersRouter'),
	mwsRouter = require('./routes/mwsRouter'),
	productsRouter = require('./routes/productsRouter'),
	session = require('express-session'),
	{ validateToken } = require('./service/requestValidate'),
	MySQLStore = require('express-mysql-session')(session),
	settings = require('./routes/settings'),
	infoRouter = require('./routes/info'),
	suppierRouter = require('./routes/suppliersRouter'),
	locationsRouter = require('./routes/locationRouter'),
	kitRouter = require('./routes/kitRouter'),
	uploadDownloadRouter = require('./routes/uploadDownloadRouter'),
	fileUpload = require('express-fileupload');
var log = require('./service/log');
log.info("Application started")
app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var cors = require('cors');
var corsOptions = {
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
var options = {
	host: process.env.DBSERVER || null,
	port: process.env.DBPORT || null,
	user: process.env.DBUSER || null,
	password: process.env.DBPASSWORD || null,
	database: process.env.DBNAME || null,
	clearExpired: true,
	checkExpirationInterval: 900000,
	expiration: 86400000,
};

var sessionStore = new MySQLStore(options);

app.use(session({
	key: 'amazsync',
	secret: process.env.SECRETKEY || null,
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));
app.use('/users', usersRouter);
app.use('/file', uploadDownloadRouter);
app.use(validateToken);
app.use('/', indexRouter);
app.use('/settings', settings);
app.use('/mws', mwsRouter);
app.use('/products', productsRouter);
app.use('/info', infoRouter);
app.use('/supplier', suppierRouter);
app.use('/location', locationsRouter);
app.use('/kit', kitRouter);

app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.error(res.locals.error);
	log.error(res.locals.error);
	// render the error page
	res.status(err.status || 500);
	res.end(err);
});

module.exports = app;
