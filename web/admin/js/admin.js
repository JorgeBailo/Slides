// The root URL for the RESTful services
var rootURL = "http://" + window.location.hostname + "/api/slides";

var currentSlide;
var currentInfo;

load();

$('#text').jqte({
    "source"	: false,
    "sub"	: false,
    "sup"	: false,
    "title"	: false,
    "strike"	: false,
    "remove"	: false,
    "funit"	: false,
    "fsize"	: false,
    "color"	: false,
    "indent"	: false,
    "rule"	: false,
    "linktypes" : ["Web URL", "E-mail"]
});

$('#btnDelete').hide();

$('#btnSearch').click(function() {
    search($('#searchKey').val());
    return false;
});

$('#searchKey').keypress(function(e){
    if(e.which == 13) {
	search($('#searchKey').val());
	e.preventDefault();
	return false;
    }
});

$('#btnAdd').click(function() {
    newSlide();
    delMessage();
    return false;
});

$('#btnSave').click(function() {
    if ($('#title').val() == '' )
	    setMessage("warning", "Title is mandatory");
    else
	    if ($('#slideId').val() == '')
		    addSlide();
	    else
		    updateSlide();
    return false;
});

$('#btnDelete').click(function() {
    deleteSlide();
    return false;
});

$('#btnSaveInfo').click(function() {
    if ($('#name').val() == '' )
	    setMessage("warning", "Name is mandatory");
    else
	    editInfo();
    return false;
});

$('#slideList').on('click', 'a', function() {
    findById($(this).data('identity'));
});

// Load
function load(){
    findAll();
    findInfo();
}

// Get Slides By Search
function search(searchKey) {
    if (searchKey == '') 
	findAll();
    else
	findByName(searchKey);
}

// New Slide
function newSlide() {
    $('#btnDelete').hide();
    $('#slideId').val("");
    $('#title').val("");
    $('#text').jqteVal("");
}

// Get All Slides
function findAll() {
    $.ajax({
	    type: 'GET',
	    url: rootURL,
	    dataType: "json",
	    success: renderList
    });
}

// Get Slides By Name
function findByName(searchKey) {
    delMessage();
    $.ajax({
	    type: 'GET',
	    url: rootURL + '/search/' + searchKey,
	    dataType: "json",
	    success: renderList 
    });
}

// Get Slide By Id
function findById(id) {
    delMessage();
    $.ajax({
	    type: 'GET',
	    url: rootURL + '/' + id,
	    dataType: "json",
	    success: function(data){
		$('#btnDelete').show();
		currentSlide = data;
		renderDetails(currentSlide);
	    }
    });
}

// Add Slide
function addSlide() {
    $.ajax({
	    type: 'POST',
	    contentType: 'application/json',
	    url: rootURL,
	    dataType: "json",
	    data: formToJSON(),
	    success: function(data, textStatus, jqXHR){
		    setMessage("success", "Slide created successfully");
		    newSlide();
		    findAll();
	    },
	    error: function(jqXHR, textStatus, errorThrown){
		    setMessage("error", "Sorry, an error has occurred");
		    console.log(jqXHR);
	    }
    });
}

// Add Slide
function updateSlide() {
    $.ajax({
	    type: 'PUT',
	    contentType: 'application/json',
	    url: rootURL + '/' + $('#slideId').val(),
	    dataType: "json",
	    data: formToJSON(),
	    success: function(data, textStatus, jqXHR){
		    setMessage("success", "Slide updated successfully");
		    newSlide();
		    findAll();
	    },
	    error: function(jqXHR, textStatus, errorThrown){
		    setMessage("error", "Sorry, an error has occurred");
	    }
    });
}

// Delete Slide
function deleteSlide() {
    $.ajax({
	    type: 'DELETE',
	    url: rootURL + '/' + $('#slideId').val(),
	    success: function(data, textStatus, jqXHR){
		    setMessage("success", "Slide deleted successfully");
		    newSlide();
		    findAll();
	    },
	    error: function(jqXHR, textStatus, errorThrown){
		    setMessage("error", "Sorry, an error has occurred");
	    }
    });
}

// Render list Slides
function renderList(data) {
    $('#slideList li').remove();
    $.each(data, function(index, slide) {
	$('#slideList').append('<li><a href="#" data-identity="' + slide.id + '">'+ slide.title+'</a></li>');
    });
}

// Render Slide
function renderDetails(slide) {
    $('#slideId').val(slide.id);
    $('#title').val(slide.title);
    $('#text').jqteVal(slide.text);
}

// Get Info
function findInfo() {
    $.ajax({
	    type: 'GET',
	    url: rootURL + '/info/',
	    dataType: "json",
	    success: function(data){
		    currentInfo = data;
		    renderDetailsInfo(currentInfo);
	    }
    });
}

// Edit Info
function editInfo() {
    $.ajax({
	    type: 'PUT',
	    contentType: 'application/json',
	    url: rootURL + '/editinfo/',
	    dataType: "json",
	    data: formToJSONInfo(),
	    success: function(data, textStatus, jqXHR){
		    setMessage("success", "Information updated successfully");
		    findInfo();
	    },
	    error: function(jqXHR, textStatus, errorThrown){
		    setMessage("error", "Sorry, an error has occurred");
	    }
    });
}

// Render Info
function renderDetailsInfo(info) {
    $('#name').val(info.name);
    $('#description').val(info.description);
    $('#author').val(info.author);
}

// Slide to JSON
function formToJSON() {
    return JSON.stringify({
	    "id": 		$('#slideId').val(), 
	    "title": 	$('#title').val(), 
	    "text":		$('#text').val(),
	    });
}

// Info to JSON
function formToJSONInfo() {
    return JSON.stringify({
	    "name": 	$('#name').val(), 
	    "description": 	$('#description').val(), 
	    "author":	$('#author').val(),
	    });
}

// Display Message
function setMessage(type, message){
    $('#message').addClass(type);
    $('#message').html(message);
}

// Delete Message
function delMessage(){
    $('#message').removeClass();
    $('#message').html("");
}
