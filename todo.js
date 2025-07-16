"use strict";
let todos = [];
let nextId = 1;
let currentlyEditingId = null;
let currentlyEditingDescription = null;
function getCurrentDate() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}
function addTodo(title, description) {
    const newTodo = {
        id: nextId++,
        title: title,
        description: description,
        startDate: getCurrentDate(),
        completed: false
    };
    todos.push(newTodo);
    return newTodo;
}
function removeTodo(id) {
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    return todos.length < initialLength;
}
function completeTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        return true;
    }
    return false;
}
function updateTodo(id, newTitle, newDescription) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.title = newTitle;
        todo.description = newDescription;
        return true;
    }
    return false;
}
function renderTodos() {
    const todoListElement = document.getElementById('todoList');
    if (!todoListElement)
        return;
    todoListElement.innerHTML = '';
    todos.forEach(todo => {
        const taskCard = document.createElement('div');
        taskCard.className = `task-card ${todo.completed ? 'completed' : ''}`;
        taskCard.setAttribute('data-id', todo.id.toString());
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        const cardTitleContainer = document.createElement('div');
        cardTitleContainer.className = 'card-title-container';
        const cardActions = document.createElement('div');
        cardActions.className = 'card-actions';
        let descriptionElement;
        if (currentlyEditingId === todo.id) {
            const editTitleInput = document.createElement('input');
            editTitleInput.type = 'text';
            editTitleInput.value = todo.title;
            editTitleInput.className = 'edit-input';
            editTitleInput.placeholder = "Edit Title Of Task";
            editTitleInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    handleSaveEdit(todo.id, editTitleInput.value, descriptionElement.value);
                }
            };
            cardTitleContainer.appendChild(editTitleInput);
            descriptionElement = document.createElement('textarea');
            descriptionElement.className = 'card-description-input';
            descriptionElement.value = todo.description;
            descriptionElement.placeholder = "Edit Detail Of Your Task";
            const saveButton = document.createElement('button');
            saveButton.className = 'save-btn';
            const saveIcon = document.createElement('i');
            saveIcon.className = 'fas fa-check';
            saveButton.appendChild(saveIcon);
            saveButton.onclick = () => handleSaveEdit(todo.id, editTitleInput.value, descriptionElement.value);
            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-btn';
            const cancelIcon = document.createElement('i');
            cancelIcon.className = 'fas fa-times';
            cancelButton.appendChild(cancelIcon);
            cancelButton.onclick = () => handleCancelEdit();
            cardActions.appendChild(saveButton);
            cardActions.appendChild(cancelButton);
            setTimeout(() => editTitleInput.focus(), 0);
        }
        else {
            const cardTitleSpan = document.createElement('span');
            cardTitleSpan.textContent = todo.title;
            cardTitleSpan.className = 'card-title';
            cardTitleSpan.onclick = () => handleCompleteTodo(todo.id);
            cardTitleContainer.appendChild(cardTitleSpan);
            descriptionElement = document.createElement('p');
            descriptionElement.className = 'card-description';
            descriptionElement.textContent = todo.description;
            const checkButton = document.createElement('button');
            checkButton.className = 'check-btn';
            const checkIcon = document.createElement('i');
            checkIcon.className = 'fas fa-check-circle';
            checkButton.appendChild(checkIcon);
            checkButton.onclick = () => handleCompleteTodo(todo.id);
            const editButton = document.createElement('button');
            editButton.className = 'edit-btn';
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit';
            editButton.appendChild(editIcon);
            editButton.onclick = () => handleEditTodo(todo.id, todo.title, todo.description);
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash-alt';
            deleteButton.appendChild(deleteIcon);
            deleteButton.onclick = () => handleDeleteTodo(todo.id);
            cardActions.appendChild(checkButton);
            cardActions.appendChild(editButton);
            cardActions.appendChild(deleteButton);
        }
        cardHeader.appendChild(cardTitleContainer);
        taskCard.appendChild(cardHeader);
        taskCard.appendChild(cardActions);
        taskCard.appendChild(descriptionElement);
        const cardFooter = document.createElement('div');
        cardFooter.className = 'card-footer';
        cardFooter.textContent = `Start date : ${todo.startDate}`;
        taskCard.appendChild(cardFooter);
        todoListElement.appendChild(taskCard);
    });
}
function handleAddTodo() {
    const newTodoInput = document.getElementById('newTodoInput');
    const newTodoDescriptionInput = document.getElementById('newTodoDescriptionInput');
    if (!newTodoInput || !newTodoDescriptionInput)
        return;
    const title = newTodoInput.value.trim();
    const description = newTodoDescriptionInput.value.trim();
    if (title && description) {
        addTodo(title, description);
        newTodoInput.value = '';
        newTodoDescriptionInput.value = '';
        renderTodos();
        newTodoInput.focus();
    }
    else {
        if (!title) {
            newTodoInput.style.borderColor = 'red';
            newTodoInput.placeholder = 'Title is required!';
            newTodoInput.focus();
        }
        if (!description) {
            newTodoDescriptionInput.style.borderColor = 'red';
            newTodoDescriptionInput.placeholder = 'Detail is required!';
            if (title) {
                newTodoDescriptionInput.focus();
            }
        }
        setTimeout(() => {
            newTodoInput.style.borderColor = '';
            newTodoInput.placeholder = 'Type Title Of Task';
            newTodoDescriptionInput.style.borderColor = '';
            newTodoDescriptionInput.placeholder = 'Detail Of Your Task';
        }, 3000);
    }
}
function handleDeleteTodo(id) {
    removeTodo(id);
    renderTodos();
}
function handleCompleteTodo(id) {
    completeTodo(id);
    renderTodos();
}
function handleEditTodo(id, currentTitle, currentDescription) {
    if (currentlyEditingId !== null && currentlyEditingId !== id) {
        return;
    }
    currentlyEditingId = id;
    currentlyEditingDescription = currentDescription;
    renderTodos();
}
function handleSaveEdit(id, newTitle, newDescription) {
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();
    if (trimmedTitle && trimmedDescription) {
        updateTodo(id, trimmedTitle, trimmedDescription);
        currentlyEditingId = null;
        currentlyEditingDescription = null;
        renderTodos();
    }
    else {
        alert('Both title and detail are required to save the task.');
    }
}
function handleCancelEdit() {
    currentlyEditingId = null;
    currentlyEditingDescription = null;
    renderTodos();
}
function initializeTodoApp() {
    if (todos.length === 0) {
        addTodo("Learn Javascript", "Master the language powering the modern web.");
        addTodo("Learn Javascript", "Master the language powering the modern web.");
        addTodo("Learn Javascript", "Master the language powering the modern web.");
        addTodo("Learn Javascript", "Master the language powering the modern web.");
    }
    const newTodoInput = document.getElementById('newTodoInput');
    const newTodoDescriptionInput = document.getElementById('newTodoDescriptionInput');
    if (newTodoInput) {
        newTodoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAddTodo();
            }
        });
    }
    if (newTodoDescriptionInput) {
        newTodoDescriptionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAddTodo();
            }
        });
    }
    renderTodos();
}
document.addEventListener('DOMContentLoaded', () => {
    initializeTodoApp();
});
