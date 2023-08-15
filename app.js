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
	fileUpload = require('express-fileupload'),
	inventoryPlanner = require('./routes/inventoryPlannerRouter'),
	admn = require('./routes/admnRoute'),                      
	importerRouter = require('./routes/importerRouter'),
	job = require('./routes/jobRouter'),
	restock = require('./routes/restockRouter'),
	historyRouter = require('./routes/historyRouter'),
	profitRouter = require('./routes/profitRouter'),
	tableLayoutRouter = require('./routes/tableLayoutRouter'),
	bodyParser = require('body-parser');
var { authorization } = require("./service/requestValidate");

// var sellingPartnerOperationsService =require("./service/sp-api/sellingPartnerOperationsService");
// sellingPartnerOperationsService.getFeesEstimateBySKU("A2EUQ1WTGCTBG2","1000-2011-MD",34.37)
// var sellingPartnerAPIService =require("./service/sp-api/sellingPartnerAPIService");
// (async()=>{
// var report=await sellingPartnerAPIService.getreportId('GET_STRANDED_INVENTORY_UI_DATA','ATVPDKIKX0DER')
// var reportData=await sellingPartnerAPIService.getreport(report[0].reportDocumentId)

// })()
var log = require('./service/log');
log.info("Application started")
app = express();

app.use(fileUpload());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

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
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/file', uploadDownloadRouter);
app.use('/job', job);

app.use(validateToken);
app.use('/settings', authorization("Admn All"), settings);
app.use('/mws', mwsRouter);
app.use('/products', productsRouter);
app.use('/info', infoRouter);
app.use('/supplier', suppierRouter);
app.use('/location', locationsRouter);
app.use('/kit', kitRouter);
app.use('/layout', tableLayoutRouter);
app.use('/admn', authorization("Admn All"), admn);
app.use('/shipment', authorization("Admn All"), inventoryPlanner);
app.use('/importer', authorization("Admn All"), importerRouter);
//TODO set roles for restock
app.use('/restock', authorization("Admn All"), restock);
app.use('/history', authorization("Admn All"), historyRouter);
app.use('/profit', authorization("Admn All"), profitRouter);
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.error(res.locals);
	// render the error page
	res.status(err.status || 500);
	res.end(err);
});

module.exports = app;
