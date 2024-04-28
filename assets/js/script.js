
const taskTitle = $( "#task-title" );
const taskDueDate = $( "#task-due-date" );
const taskDescription = $( "#task-description" );
const modalBtn = $( "#modal-btn" );
const todoCards = $( "#todo-cards" );

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let uniqueId = "";
  for( let i = 0; i < 10; i++ ) {
    uniqueId+= String.fromCharCode( Math.floor( Math.random() * 26 ) + 97 );
  }
  return uniqueId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = 
  `<div class="card" data-task-id="${ task.id }">
    <div class="card-header">
      ${ task.title }
    </div>
    <div class="card-body">
      <p class="card-text">${ task.dueDate }</p>
      <p class="card-text">${ task.description }</p>
      <a href="#" class="btn btn-danger delete-btn">Delete</a>
    </div>
  </div>`;
  todoCards.append( taskCard );
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  todoCards.empty();
  $( taskList ).each( ( index, task ) => {
    createTaskCard( task );
  } );
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  const task = {};
  task.title = taskTitle.val().trim();
  task.dueDate = taskDueDate.val();
  task.description = taskDescription.val().trim();
  task.status = "Not Yet Started";
  task.id = generateTaskId();
  taskList.push( task );
  localStorage.setItem( "tasks", JSON.stringify( taskList ) );
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  const targetTaskId = event.closest( ".card" ).dataset.taskId;
  $( `[data-task-id="${ targetTaskId }"]` ).remove();
  $( taskList ).each( ( index, task ) => {
    if( task.id === targetTaskId ) taskList.splice( index, 1 );
  } );
  localStorage.setItem( "tasks", JSON.stringify( taskList ) );
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Clear Task Inputs
function clearTaskInputs() {
  taskTitle.val( "" );
  taskDueDate.val( "" );
  taskDescription.val( "" );
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  if( localStorage.getItem( "tasks" ) ) renderTaskList();

  // Task Due Date Input Datepicker
  taskDueDate.datepicker();

  modalBtn.on("click", function() {
    handleAddTask();
    renderTaskList();
    clearTaskInputs();
    console.log( taskList );
  });

  $( document ).on( "click", ".delete-btn",function( event ) {
    handleDeleteTask( event.target );
  } );

});
