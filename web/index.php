<?php

ini_set('display_errors', 0);

require_once __DIR__.'/../app/vendor/autoload.php';

$app = require __DIR__.'/../app/src/app.php';
require __DIR__.'/../app/config/prod.php';
require __DIR__.'/../app/src/controllers.php';
$app->run();