
const addTask = document.querySelector('.add-task-btn');
const inputText = document.querySelector('#task-input');
const taskList = document.querySelector('.task-list');
const taskEditor = document.querySelector('.task-editor');
const saveEditted = document.querySelector('.save-edit-text');
const cancelEditted = document.querySelector('.cancel-edit-text');
const textArea = document.querySelector('.edit-text');

let tasks = [];            // empty array
let taskId = -1 ;           // current selected taskId   (no tasks is selected at first)
let prevId = -1 ;          // previous selected taskid

read();           // will extract from local storage and store in array
populate();              // will make html referencing array

// when click on add , will add task
addTask.addEventListener('click', () => {
    addNewTask();
});

// when click enter on input field , will add task
inputText.addEventListener('keydown', (event) => {
    let keyPressed = event.key;
    if (keyPressed == 'Enter') {
        event.preventDefault();
        addNewTask();
    }
});

// add task to array , store array in local storage , extract json array from local storage to store in array , populate from array
function addNewTask() {
    if (inputText.value != '') {
        tasks.push({ id: null, task: inputText.value })
        write();
        read();
        populate();

        inputText.value = '';
        inputText.placeholder = 'Enter here';
        console.log('task addded')
    }
    else {
        inputText.placeholder = 'write something';
        console.log('task was not addded')
    }
}

// store array in local storage with automated id number
function write() {
    let numberId = 1;
    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        task.id = numberId;
        numberId++
    };
    localStorage.setItem('tasks', JSON.stringify(tasks));         // convert array into json and store in local storage
    console.log('task saved in local storage')
}

// extract json from local storage ,covert them in a array elements and store in array
function read() {
    let extractTasks = localStorage.getItem('tasks');       // extract json from local storage
    if (extractTasks == null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(extractTasks);            // convert json array into array element
        console.log('task extract from local storage')
    }
    console.log(tasks)
}

// populate html from array
function populate() {
    let tasksHtml = '';
    
    // will add each task-item
    tasks.forEach(task => {
        tasksHtml += `
        <div class="task-item" data-id="${task.id}">
            <div class="task">
                <span class="task-number">${task.id}</span>
                <span class="task-description">${task.task}</span>
            </div>
            <div class="task-actions">
                <button type="button" class="task-options">...</button>
                <div class="task-options-panel">
                    <button class="edit-task option editBtn">Edit</button>
                    <button class="delete-task option editBtn">Delete</button>
                </div>
            </div>
        </div>`;
    });
    taskList.innerHTML = tasksHtml;
    console.log('task added in HTML')
};

// toggle task options panel of selected taskItem
function toggleTaskOptions(taskItem) {
    const taskOptionPanel = taskItem.querySelector('.task-options-panel');
    taskOptionPanel.style.display = taskOptionPanel.style.display === 'block' ? 'none' : 'block';
}

// delete task of selected taskId 
function deleteTask(taskId){
    tasks.splice(taskId-1,1);
    write();
    read();
    populate();
};

// toggle text editor and set textarea's value of given taskId
function toggleTextEditor(taskId) {
    if (taskEditor.style.visibility !== 'visible') {
        taskEditor.style.visibility = 'visible';
        taskEditor.style.zIndex = 2;
        textArea.value = tasks[taskId-1].task ;        //  set textarea's value of given taskId
    } else {
        taskEditor.style.visibility = 'hidden';
        taskEditor.style.zIndex = -2;
    }
}

/* not placing inside document.addeventlistener to avoid uneccessary double click problem  */

//when click on anypart inside of tasklist , condition it's children's function
taskList.addEventListener('click',(e)=>{

    // will get ancestor element (taskItem) of btn clicked 
    const taskItem = e.target.closest('.task-item');  // clicked taskItem
    const taskOption = e.target.closest('.task-options');     // clicked taskOptions
    // will get id of clicked taskItem/btn
    taskId = taskItem.getAttribute('data-id');      // id of clicke taskItem

    prevId = taskId ;         // records currentid for future references
    // when clicked to taks option button
    if (e.target === taskOption) {
        toggleTaskOptions(taskItem);
        console.log(taskId + ' :Option opened')
    }
    
    // when clicked to taks delete button
    const deleteTaskBtn = taskItem.querySelector('.delete-task');
    if(e.target === deleteTaskBtn){
        deleteTask(taskId);
        console.log(taskId + ' :task deleted')
    }
    
    // when clicked to taks edit button
    const editTaskBtn = taskItem.querySelector('.edit-task');
    if(e.target === editTaskBtn){
        toggleTextEditor(taskId);
        console.log('text editor opened')
   }
});

// when clicked on any part inside of page , add function to it's child
document.addEventListener('click', (event) => {
    // each time we clicked

    // hide all option panel 
    const allTaskItems = taskList.querySelectorAll('.task-item');
    allTaskItems.forEach((item,index) => {
        const optionPanel = item.querySelector('.task-options-panel');
        const optionAction = item.querySelector('.task-actions');
        if (!optionAction.contains(event.target)) {
            optionPanel.style.display = 'none';
        }
    });
    console.log('All:Option hided');

    // when clicked on save edit btn
    if(event.target === saveEditted){
        tasks[taskId-1].task = textArea.value
        write();
        read();
        populate();
        toggleTextEditor(taskId-1);

        console.log('edit saved')
        console.log(tasks);
    };
    // when clicked on cancel edit btn
    if(event.target === cancelEditted){
        toggleTextEditor(taskId-1);

        console.log('edit canceled');
    }
});
