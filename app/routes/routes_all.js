module.exports = function(app, router) {

    // ROUTES FOR OUR API
    // =============================================================================

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do some logging
        console.log('Something / anything is happening on WebObservatory api.');
        next(); //make sure to continue
    });

    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    router.get('/', function(req, res) {
        res.json({ message: 'Welcome to WebObservatory api!' });   
    });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);
};
