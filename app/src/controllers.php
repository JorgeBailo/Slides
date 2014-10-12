<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

// -- HOMEPAGE ----------------------------------------------------------------
$app->get('/', function () use ($app) {
    $client = new GuzzleHttp\Client();
    
    $response = $client->get($app['rest']['url_slides']);
    $slides = $response->json();
    
    $response = $client->get($app['rest']['url_info']);
    $info = $response->json();
    
    return $app['twig']->render('index.twig', array('slides' => $slides,'info' => $info));
})
->bind('homepage');

// -- PçGINAS DE ERROR --------------------------------------------------------
$app->error(function (\Exception $e, $code) use ($app) {
    $paginaError = 404 == $code ? '404.twig' : '500.twig';
    return $app['twig']->render($paginaError, array('mensaje' => $e->getMessage()));
});
