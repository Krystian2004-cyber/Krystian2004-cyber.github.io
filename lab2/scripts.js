class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todo-tasks')) || [];
        this.searchTerm = '';
        this.listElement = document.getElementById('todoList');
    }

    saveToStorage() {
        localStorage.setItem('todo-tasks', JSON.stringify(this.tasks));
        console.log(JSON.parse(localStorage.getItem('todo-tasks')));
    }

    add(text, dateStr) {
        if (text.length < 3 || text.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków!');
            return false;
        }

        if (dateStr) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const inputDate = new Date(dateStr);
            if (inputDate < today) {
                alert('Data musi być z przyszłości!');
                return false;
            }
        }

        this.tasks.push({
            id: Date.now(),
            text: text,
            date: dateStr
        });

        this.saveToStorage();
        this.draw(); 
        return true;
    }

    remove(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToStorage();
        this.draw(); 
    }

    edit(id, newText, newDate) {
        if (newText.length < 3 || newText.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków!');
            this.draw(); 
            return;
        }

        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
            task.date = newDate;
            this.saveToStorage();
            this.draw(); 
        }
    }

    setSearchTerm(term) {
        this.searchTerm = term;
        this.draw();
    }


    getFilteredTasks() {
        if (this.searchTerm.length >= 2) {
            return this.tasks.filter(task => 
                task.text.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        return this.tasks;
    }

    
    highlightText(text) {
        if (this.searchTerm.length >= 2) {
            const regex = new RegExp(`(${this.searchTerm})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }
        return text;
    }

    draw() {
      
        this.listElement.innerHTML = '';
        const tasksToRender = this.getFilteredTasks();

        tasksToRender.forEach(task => {
            const li = document.createElement('li');

           
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.innerHTML = this.highlightText(task.text);

      
            const dateSpan = document.createElement('span');
            dateSpan.className = 'task-date';
            if (task.date) {
                dateSpan.textContent = task.date;
            }

            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️';
            deleteBtn.onclick = (e) => {
                e.stopPropagation(); 
                this.remove(task.id);
            };

           
            li.onclick = (e) => {
                if (li.querySelector('input')) return; 
                e.stopPropagation();

             
                const editTextInput = document.createElement('input');
                editTextInput.type = 'text';
                editTextInput.value = task.text;

                const editDateInput = document.createElement('input');
                editDateInput.type = 'date';
                editDateInput.value = task.date;

                
                li.innerHTML = '';
                li.appendChild(editTextInput);
                li.appendChild(editDateInput);
                editTextInput.focus();

               
                const saveChangesOnOutsideClick = (event) => {
                    if (!li.contains(event.target)) {
                        this.edit(task.id, editTextInput.value, editDateInput.value);
                        document.removeEventListener('click', saveChangesOnOutsideClick);
                    }
                };

                document.addEventListener('click', saveChangesOnOutsideClick);
            };

            li.appendChild(textSpan);
            if (task.date) li.appendChild(dateSpan);
            li.appendChild(deleteBtn);

            this.listElement.appendChild(li);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
   
    console.log(JSON.parse(localStorage.getItem('todo-tasks')));
    document.todo = new Todo();
    document.todo.draw(); 

   
    const btnAdd = document.getElementById('addBtn');
    const inputNewTask = document.getElementById('newTaskText');
    const inputNewDate = document.getElementById('newTaskDate');
    const inputSearch = document.getElementById('searchInput');

    btnAdd.addEventListener('click', () => {
        const success = document.todo.add(inputNewTask.value, inputNewDate.value);
        if (success) {
            inputNewTask.value = '';
            inputNewDate.value = '';
        } 
    });

    inputSearch.addEventListener('input', (e) => {
        document.todo.setSearchTerm(e.target.value);
    });
});