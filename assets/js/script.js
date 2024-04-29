
const taskTitle = $( "#task-title" );
const taskDueDate = $( "#task-due-date" );
const taskDescription = $( "#task-description" );
const modalBtn = $( "#modal-btn" );
const todoCards = $( "#todo-cards" );
const inProgressCards = $( "#in-progress-cards" );
const doneCards = $( "#done-cards" );

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
const now = dayjs();


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
  `<div class="card draggable mb-3" data-task-id="${ task.id }">
    <div class="card-header">
      ${ task.title }
    </div>
    <div class="card-body">
      <p class="card-text">${ task.dueDate }</p>
      <p class="card-text">${ task.description }</p>
      <a href="#" class="btn btn-danger delete-btn">Delete</a>
    </div>
  </div>`;

  if( task.status === "to-do" ) {
    todoCards.append( taskCard );
  } else if( task.status === "in-progress" ) {
    inProgressCards.append( taskCard );
  } else if( task.status === "done" ) {
    doneCards.append( taskCard );
  }

  // create a dayjs obj by capturing the task due date 
  const taskDueDate = dayjs( task.dueDate );
  // check if the task is due within 2 days or past due
  const daysAway = Math.ceil( taskDueDate.diff( now, "day",true ) );
  // 
  if( daysAway < 0 ) {
    $( `[data-task-id="${ task.id }"]` ).addClass( "bg-danger text-white" );
    $( `[data-task-id="${ task.id }"] .delete-btn` ).addClass( "border border-light" );
  } else if( daysAway >= 0 && daysAway < 3 ) {
    $( `[data-task-id="${ task.id }"]` ).addClass( "bg-warning text-white" );
  }
}

function emptyInputs() {
  todoCards.empty();
  inProgressCards.empty();
  doneCards.empty();
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $( taskList ).each( ( index, task ) => {
    createTaskCard( task );
  } );
  $( ".draggable" ).draggable({
    opacity: .75,
    zIndex: 100,
    helper: function( event ) {
      const taskCard = $( event.target ).hasClass( "card" ) ?
      $( event.target ) : $( event.target ).closest( ".card" );
      return taskCard.clone().css( {
        width: taskCard.outerWidth(),
        cursor: "grabbing"
      } );
    }
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  const task = {};
  task.title = taskTitle.val().trim();
  task.dueDate = taskDueDate.val();
  task.description = taskDescription.val().trim();
  task.status = "to-do";
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

function removeAllUiTasks() {
  $( taskList ).each( ( index, task ) => {
    $( `[data-task-id="${ task.id }"]` ).remove();
  } );
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const eventId = $( event.target ).attr( "id" );
      
  // get generated task id
  const taskId = $( ui.draggable[ 0 ] ).data( "task-id" );

  // change status of task
  $( taskList ).each( ( index, task ) => {
    if( task.id === taskId ) task.status = eventId;
  } );

  // update list to local storage
  localStorage.setItem( "tasks", JSON.stringify( taskList ) );

  // remove all task ui elements
  removeAllUiTasks();

  // render task ui elements
  renderTaskList();
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

  modalBtn.on("click", function( event ) {
    if( taskTitle.val() && taskDueDate.val() && taskDescription.val() ) {
      handleAddTask();
      removeAllUiTasks();
      renderTaskList();
      clearTaskInputs();
      $( "#formModal" ).modal( "hide" );
    }
  });

  $( document ).on( "click", ".delete-btn",function( event ) {
    handleDeleteTask( event.target );
  } );

  $( ".lane" ).droppable( {
    tolerance: "pointer",
    accept: ".draggable",
    drop: handleDrop
  } );

});
