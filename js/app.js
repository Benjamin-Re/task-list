const myForm = document.querySelector("form");

myForm.addEventListener("submit", (event)=> {
    // Prevent refresh
    event.preventDefault();
   
    // Add the inputs text as a new node to .task-list 
    const myTaskList = document.querySelector(".task-list");
    const newEntry = document.createElement("div");
    newEntry.textContent=myForm.elements[0].value;
    // Add icon to new entry
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-delete-left");
    // Add event handler to delete icon
    deleteIcon.addEventListener("click", (e)=> {
        // Remove parent onclick
        e.target.parentNode.remove();
    })
    newEntry.appendChild(deleteIcon);
    myTaskList.appendChild(newEntry);

    // Empty form field
    myForm.elements[0].value="";
})