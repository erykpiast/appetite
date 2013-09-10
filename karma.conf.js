basePath = '';

files = [
    JASMINE,
    JASMINE_ADAPTER,
    'public/app/bower_components/jquery/jquery.min.js',
    { pattern: '**/*.spec.js' }
];

browsers = [ 'PhantomJS' ];
singleRun = true;

reporters = ['progress'];

port = 9876;
runnerPort = 9100;

colors = true;
logLevel = LOG_INFO;

background = true;