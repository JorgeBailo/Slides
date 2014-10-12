<?php

// configure your app for the production environment
$app['twig.path'] = array(__DIR__.'/../templates');
$app['twig.options'] = array('cache' => false);
$app['rest'] = array('url_slides'=> 'http://'.$_SERVER['SERVER_NAME']."/api/slides",
                     'url_info'  => 'http://'.$_SERVER['SERVER_NAME']."/api/slides/info/");
