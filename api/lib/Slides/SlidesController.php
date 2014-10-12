<?php
namespace Slides;

use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class SlidesController {
    
    // Get All Slides
    public function getAllSlidesAction(Application $app){
        return new JsonResponse($app['db']->fetchAll("SELECT * FROM slides"));
    }

    // Get Slides By Name
    public function getSlidesSearchAction($name, Application $app){
        return new JsonResponse($app['db']->fetchAll("SELECT * FROM slides WHERE UPPER(title) LIKE :TITLE ORDER BY title", ['TITLE' => '%'.$name.'%']));
    }
    
    // Get Slide By Id
    public function getSlideAction($id, Application $app){
        return new JsonResponse($app['db']->fetchAssoc("SELECT * FROM slides WHERE id=:ID", ['ID' => $id]));
    }

    // Delete Slide
    public function deleteSlideAction($id, Application $app){
        return $app['db']->delete('slides', ['ID' => $id]);
    }

    // Add Slide
    public function addSlideAction(Application $app, Request $request){
        $slide = json_decode($request->getContent());

        $newSlide = [
            'id'	=> (integer)$app['db']->fetchColumn("SELECT max(id) FROM slides") + 1,
            'title'	=> $slide->title,
            'text'	=> $slide->text,
        ];
        
        $app['db']->insert('slides', $newSlide);
        return new JsonResponse($newSlide);
    }

    // Edit Slide
    public function editSlideAction($id, Application $app, Request $request){
        $slide = json_decode($request->getContent());
        
        $newSlide = [
            'title' 	=> $slide->title,
            'text'	=> $slide->text,
        ];
        
        return $app['db']->update('slides', $newSlide, ['ID' => $id]);
    }
    
    // Get Info
    public function getInfoAction(Application $app){
    	return new JsonResponse($app['db']->fetchAssoc("SELECT * FROM info WHERE id=:ID", ['ID' => 1]));
    }
    
    // Edit Info
    public function editInfoAction(Application $app, Request $request){
    	$info = json_decode($request->getContent());
    
    	$newInfo = [
    	'name' 		=> $info->name,
    	'description'	=> $info->description,
    	'author'	=> $info->author,
    	];
    
    	return $app['db']->update('info', $newInfo, ['ID' => 1]);
    }
}
