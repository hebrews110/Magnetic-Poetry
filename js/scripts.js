/* 
Name : Jordan Cutler
*/
$(function() {
	attachEventHandlers();

	var words = localStorage.getItem("buttons");
	words = JSON.parse(words);
	if (words.length > 0) {
		$.each (words, function (index, value) {
			var wd = $('<button class="btn2 moveable" type="button">' + value.text + '</button>');
			$(wd).css({
				"top" : value.top + 'px',
				"left" : value.left + 'px',
				"background-color" : value.background_color,
				"color" : value.textColor
			});
			$("body").append(wd);
		});
	}
});

var targetButton = null;
var mouseTopButtonOffset = 0;
var mouseLeftButtonOffset = 0;

function attachEventHandlers() {
	$("#addButton").click( function () {
		var wordToAdd = $("#word").val();
		var button = $('<button class="btn2 moveable" type="button">' + wordToAdd + '</button>');
		$(button).css({
			"background-color": $("#backColor").css("background-color"),
			"color" : $("#textColor").css("background-color")
		});
		$("#buttonDiv").append(button);
		$("#word").val("");
	});

	$(document).mousedown( function (event) {
		var target = event.target;
		if (isMoveable($(target).attr("class"))) {
			targetButton = target;
			var mouseStartTop = event.clientY;
			var mouseStartLeft = event.clientX;
			var topOffset = $(targetButton).offset().top;
			var leftOffset = $(targetButton).offset().left;
			mouseTopButtonOffset = mouseStartTop - topOffset;
			mouseLeftButtonOffset = mouseStartLeft - leftOffset;
		}
	});

	$(document).mousemove (function (event) {
		if (targetButton != null) {		
			targetButton.style.top = (event.clientY - mouseTopButtonOffset) + 'px';
			targetButton.style.left = (event.clientX - mouseLeftButtonOffset) + 'px';
			if (checkOverlap(targetButton)) {
				$("#trashcan").css("opacity", .6);
			} else {
				$("#trashcan").css("opacity", 1);
			}
		}
	});

	$(document).mouseup ( function (event) {
		$("#trashcan").css("opacity", 1);
		var target = event.target;
		if (target.tagName == "BUTTON") {
			if (checkOverlap(target)) {
				$(target).remove();
			}
		}
		targetButton = null;
	});

	$(window).unload( function () {
		var words = getWordsArray(".moveable");
		localStorage.buttons = JSON.stringify(words);
	});
}

function checkOverlap(button) {
	var trashCanTop = $("#trashcan").offset().top;
	var trashCanLeft = $("#trashcan").offset().left;
	var trashCanWidth = $("#trashcan").width();
	var trashCanHeight = $("#trashcan").height();
	var buttonTop = $(button).offset().top;
	var buttonLeft = $(button).offset().left;
	var buttonWidth = $(button).outerWidth();
	var buttonHeight = $(button).outerHeight();

	if (
		(trashCanLeft > (buttonLeft + buttonWidth)) 
		||
		(buttonLeft > (trashCanLeft + trashCanWidth))) {
		return false;
	}
	if (
		(trashCanTop > (buttonTop + buttonHeight)) 
		||
		(buttonTop > (trashCanTop + trashCanHeight))) {
		return false;
	}
	return true;
}

function getWordsArray(selector) {
	var words = [];
	$.each($(selector), function (index, value) {
		var text = $(value).text();
		var left = $(value).offset().left;
		var top = $(value).offset().top;
		var background = $(value).css("background-color");
		var textColor = $(value).css("color");
		var wd = new Word(text, left, top, background, textColor);
		words.push(wd);
	});
	return words;
}

function isMoveable(classes) {
	return classes.match("moveable").length > 0;
}

function Word(text, left, top, background_color, textColor) {
	this.text = text;
	this.left = left;
	this.top = top;
	this.background_color = background_color;
	this.textColor = textColor;
}
