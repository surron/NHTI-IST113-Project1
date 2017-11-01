
// using a function contructor form to create an object
function TaskAtHandApp()
{
	var version = "v2.1aRyanK", appStorage = new AppStorage("taskAtHand");
	
	function saveTaskList(){
		var tasks = [];
		$('#task-list .task span.task-name').each(function(){
			tasks.push($(this).text())
		});
		appStorage.setValue('taskList', tasks);
	}
	
	function loadTaskList(){
		var tasks = appStorage.getValue('taskList');
		if(tasks){
			for (var i in tasks){
				addTaskElement(tasks[i]);
			}
		}
	}
	
	// creating a private function
	function setStatus(message)
	{
		$("#app>footer").text(message);
	}

	// creating a public function
	this.start = function()
	{
		$('#new-task-name').keypress(function(e){
			if (e.which == 13){
				addTask();
				return false;
			}
		}).focus();
		$("#app>header").append(version);
		
		setStatus("ready");
		loadTaskList();
	};
	function addTask(){
		var taskName = $('#new-task-name').val();
		if (taskName){
			addTaskElement(taskName);
			$('#new-task-name').val('').focus();
		}
		saveTaskList();
	}
	function addTaskElement(taskName){
		var $task = $('#task-template .task').clone();
		$('span.task-name', $task).text(taskName);
		//var $delete = $("<button class='delete'>X</button>");
		//var $moveUp = $("<button class='move-up'>^</button>");
		//var $moveDown = $("<button class='move-down'>v</button>");
		
		
		
		//$task.text(taskName);
		$('#task-list').append($task);
		//$task.append($delete).append($moveUp).append($moveDown).append("<span class='task-name'>" + taskName + "</span>");
		$task.click(function(){onSelectTask($task);});
		$('button.delete', $task).click(function(){ removeTask($task);});
		$('button.move-up', $task).click(function() {moveTask($task, true);});
		$('button.move-down', $task).click(function() { moveTask($task,false);});
		
		$('span.task-name',$task).click(function(){onEditTaskName($(this));});
		$('input.task-name', $task).change(function(){
			onChangeTaskName($(this));
		})
		.blur(function(){
			$(this).hide().siblings("span.task-name").show();
		});
		
	}
	function onSelectTask($task){
		if($task){
			//unselect other tasks
			$task.siblings('.selected').removeClass('selected');
			//select this task
			$task.addClass('selected');
		}
	}
	function removeTask($task){
		$task.remove();
		saveTaskList();
	}
	function moveTask($task, moveUp){
		if(moveUp){
			$task.insertBefore($task.prev());
		}
		else{
			$task.insertAfter($task.next());
		}
		saveTaskList();
	}

	function onEditTaskName($span){
		$span.hide().siblings("input.task-name").val($span.text()).show().focus();
	}
	function onChangeTaskName($input){
		$input.hide();
		var $span = $input.siblings("span.task-name");
		if($input.val()){
			$span.text($input.val());
		}
		$span.show();
	}
} // end MyApp

/* 	JQuery's shorthand for the document ready event handler
		could be written: $(document).ready(handler);

		When this page loads, we'll create a global variable
		named "app" by attaching it to the "window" object
		(part of the BOM - Browser Object Model)
*/
$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});