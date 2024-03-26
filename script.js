
const addTask = document.querySelector('.add-task-btn');
const searchTask = document.querySelector('.search-task-btn');
const inputText = document.querySelector('#task-input');
const taskList = document.querySelector('.task-list');
const taskEditor = document.querySelector('.task-editor');
const saveEditted = document.querySelector('.save-edit-text');
const cancelEditted = document.querySelector('.cancel-edit-text');
const textArea = document.querySelector('.edit-text');

let tasks = [];            // empty array
let taskId = -1;           // current selected taskId   (no tasks is selected at first)
let prevId = -1;          // previous selected taskid
let search = false;
searchTask.textContent = 'Search';
inputText.value = '';
let dragcall = 1;

let interval;
read();           // will extract from local storage and store in array
populate(tasks);              // will make html referencing array

// when click on add , will add task
addTask.addEventListener('click', addNewTask);
inputText.addEventListener('keydown', enterEvent);

// toggle search feature
searchTask.addEventListener('click', () => {
    if (search) {
        search = false;
    }
    else {
        search = true;
    }

    if (!search) {
        inputText.value = ''
        inputText.style.backgroundColor = 'green'
        searchTask.textContent = 'Search'
        inputText.placeholder = 'Enter new task';
        inputText.addEventListener('keydown', enterEvent);
        inputText.removeEventListener('input', searchSorter)

        populate(tasks)
    }
    else {
        inputText.value = ''
        inputText.style.backgroundColor = 'rgb(144, 3, 3)'
        searchTask.textContent = 'Cancel'
        inputText.placeholder = 'search here';
        inputText.removeEventListener('keydown', enterEvent);
        inputText.addEventListener('input', searchSorter);

    }
})

// function for event 
// when click enter on input field , will add task
function enterEvent(event) {
    let keyPressed = event.key;
    if (keyPressed == 'Enter') {
        event.preventDefault();
        addNewTask();
    }
}
// sort for search task 
function searchSorter() {
    sortTask(inputText.value);
}

// add task to array , store array in local storage , extract json array from local storage to store in array , populate from array
function addNewTask() {
    inputText.style.backgroundColor = 'green'
    if (inputText.value != '') {
        tasks.push({ id: null, task: inputText.value })
        write(tasks);
        read();
        populate(tasks);

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
function write(tasks) {
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

// will drag and drop element
function drag() {
    dragcall = 0;
    const dragTasks = document.querySelectorAll('.task-item');

    // includes dragged element only 
    dragTasks.forEach(dragTask => {
        dragTask.addEventListener("dragstart", (e) => {
            //dragTask == dragged element
            console.log('dragging started')
            dragTask.classList.add('hold')
        })
        dragTask.addEventListener("dragend", (e) => {
            console.log('dragging ended')

            updateArrayDrag();            /// update after dragging is completed
        })
    });
    
    // excludes dragged element in each eventlistener
    dragTasks.forEach(dragTask => {
        dragTask.addEventListener("dragover", (e) => {
            console.log('drag over')
            e.preventDefault()
            if (!dragTask.classList.contains('hold')) {           /// exclude dragged task
                dragTask.classList.add('holdover');
            }
        })
        dragTask.addEventListener("dragleave", () => {
            console.log('drag leave')
            if (!dragTask.classList.contains('hold')) {          /// exclude dragged task
                dragTask.classList.remove('holdover')
            }
        })
        dragTask.addEventListener("drop", (e) => {
            //dragTask == dragged over element
            console.log('drop')
            e.preventDefault();

            const TaskArray = Array.from(dragTask.parentElement.children);

            const targettedDropIndex = TaskArray.indexOf(dragTask);
            const dragElement = document.querySelector('.hold');
            const dragElementIndex = TaskArray.indexOf(dragElement);
            console.log('lenth of taskArray: ')
            console.log(TaskArray.length )
        
            //Swap DOM
            // The dragElement is moved to the new position (immediately ( after or before) dragTask), and the original instance of dragElement in its previous position is removed. 
            if (targettedDropIndex > dragElementIndex) {
                dragTask.parentElement.insertBefore(dragElement,dragTask.nextSibling);      
            }
            else{
                dragTask.parentElement.insertBefore(dragElement, dragTask);
            }
        })
    });
    dragcall = 1;
}
// update array after drag by extracting data directly from html
function updateArrayDrag() {
    let extractHtmlTasks = []
    const HtmlTask = document.querySelectorAll('.task-item');
    HtmlTask.forEach(task => {
        const taskdragid = task.querySelector('.task-number')
        const taskDescriptiondrag = task.querySelector('.task-description');
        extractHtmlTasks.push({ id: taskdragid.textContent, task: taskDescriptiondrag.textContent });
    });
    console.log('After dragging :')
    console.log(extractHtmlTasks);
    write(extractHtmlTasks);
    read();
    populate(tasks);
}

// populate html from array
function populate(tasks) {
    let tasksHtml = '';
    console.log('tasks:')
    console.log(tasks)
    // will add each task-item
    tasks.forEach(task => {
        tasksHtml += `
        <div class="task-item draggable" draggable="true" data-id="${task.id}">
            <div class="task">
                <span class="task-number">${task.id}</span>
                <span class="task-description " >${task.task}</span>
            </div>
            <div class="task-actions">
                <button type="button" class="task-options">...</button>
                <div class="task-options-panel">
                    <button class="edit-task option editBtn">Edit</button>
                    <button class="delete-task option editBtn">Delete</button>
                </div>ghf
            </div>
        </div>`;
    });
    taskList.innerHTML = tasksHtml;
    console.log('task added in HTML');

    // prevent recursion
    if (dragcall == 1) {
        drag();
    }

};

// toggle task options panel of selected taskItem
function toggleTaskOptions(taskItem) {
    const taskOptionPanel = taskItem.querySelector('.task-options-panel');
    taskOptionPanel.style.display = taskOptionPanel.style.display === 'block' ? 'none' : 'block';
}

// delete task of selected taskId 
function deleteTask(taskId) {
    tasks.splice(taskId - 1, 1);
    write(tasks);
    read();
    populate(tasks);
};

// toggle text editor and set textarea's value of given taskId
function toggleTextEditor(taskId) {
    if (taskEditor.style.visibility !== 'visible') {
        taskEditor.style.visibility = 'visible';
        taskEditor.style.zIndex = 2;
        textArea.value = tasks[taskId - 1].task;        //  set textarea's value of given taskId
    } else {
        taskEditor.style.visibility = 'hidden';
        taskEditor.style.zIndex = -2;
    }
}

/* not placing inside document.addeventlistener to avoid uneccessary double click problem  */
//when click on anypart inside of tasklist , condition it's children's function
taskList.addEventListener('click', (e) => {


    // will get ancestor element (taskItem) of btn clicked 
    const taskItem = e.target.closest('.task-item');  // clicked taskItem
    if (taskItem == null) {
        return;
    }
    const taskOption = e.target.closest('.task-options');     // clicked taskOptions
    // will get id of clicked taskItem/btn
    taskId = taskItem.getAttribute('data-id');      // id of clicke taskItem

    prevId = taskId;         // records currentid for future references
    // when clicked to taks option button
    if (e.target === taskOption) {
        toggleTaskOptions(taskItem);
        console.log(taskId + ' :Option opened')
    }

    // when clicked to taks delete button
    const deleteTaskBtn = taskItem.querySelector('.delete-task');
    if (e.target === deleteTaskBtn) {
        deleteTask(taskId);
        console.log(taskId + ' :task deleted')
    }

    // when clicked to taks edit button
    const editTaskBtn = taskItem.querySelector('.edit-task');
    if (e.target === editTaskBtn) {
        toggleTextEditor(taskId);
        console.log('text editor opened')
    }
});

// when clicked on any part inside of page , add function to it's child
document.addEventListener('click', (event) => {
    // each time we clicked

    // hide all option panel 
    const allTaskItems = taskList.querySelectorAll('.task-item');
    allTaskItems.forEach((item, index) => {
        const optionPanel = item.querySelector('.task-options-panel');
        const optionAction = item.querySelector('.task-actions');
        if (!optionAction.contains(event.target)) {
            optionPanel.style.display = 'none';
        }
    });
    console.log('All:Option hided');

    // when clicked on save edit btn
    if (event.target === saveEditted) {
        tasks[taskId - 1].task = textArea.value
        write(tasks);
        read();
        populate(tasks);
        toggleTextEditor(taskId - 1);

        console.log('edit saved')
        console.log(tasks);
    };
    // when clicked on cancel edit btn
    if (event.target === cancelEditted) {
        toggleTextEditor(taskId - 1);

        console.log('edit canceled');
    }
});

// will sort task based on search
function sortTask(word) {
    let searchedtask = []
    tasks.forEach(element => {
        if (element.task.includes(word)) {
            searchedtask.push(element);
        };
    });

    if (searchedtask.length == 0) {
        taskList.innerHTML = '<div class="noResult">No result founded</div>';
        console.log('no results');
        return;
    }
    console.log('searchTask:')
    console.log(searchedtask)

    populate(searchedtask)
}