window.addEventListener("load", () => {
    //Adding variables
    let id = 0;
    let text = "";
    let alert = document.querySelector(".alert");
  
    //function for close element alert
    let close = alert.firstElementChild;
    close.addEventListener("click", () => {
      alert.classList.add("dismissible");
    });
  
    //function for get value input on focus
    let input = document.querySelector("input");
    input.addEventListener("focus", () => {
      document.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });
    });
  
    //function where element arrow is clickable
    let arrow = document.querySelector(".arrow");
    arrow.addEventListener("click", (event) => {
      if (input.value.trim() === "") {
        event.preventDefault();
        input.value = "";
        alert.classList.remove("dismissible");
      } else {
        text = input.value;
        input.value = "";
        id =
          parseInt(
            document.querySelector("tbody")?.lastElementChild?.getAttribute("id")
          ) + 1 || 0;
        document.querySelector("tbody").appendChild(generateRow(id, text));
      }
    });
  
    //function for task complete
    let done = document.querySelectorAll(".fa-circle-check");
    done.forEach((item) => {
      item.addEventListener("click", (event) => {
        deleteTask(event);
      });
    });
  
    //Enable user to edit task
    let edit = document.querySelectorAll(".fa-pen");
    edit.forEach((item)=>{
      item.addEventListener("click", (event)=>{
          editTask(event, false);
      });
    });
  
    let taskContent = document.querySelectorAll(".task");
    taskContent.forEach((item)=>{
      item.addEventListener("focus", (event)=>{
          editTask(event, true);
      });
  
      item.addEventListener("blur", (event)=>{
          event.target.classList.remove("editable");
      })
    });
  
    
    let trash = document.querySelectorAll(".fa-trash");
    trash.forEach((item)=>{
      item.addEventListener("click", (event)=>{
          removeRow(event, false);
      });
    });
  });
  
  //function to create new row
  const generateRow = (id, text) => {
    let newRow = document.createElement("tr");
    newRow.setAttribute("id", id);
    newRow.innerHTML = `
      <td>
          <i class="fa-solid fa-circle-check"></i>
          <span contenteditable="true" class="task">${text}</span>
      </td>
      <td>
          <span class="fa-stack fa-2x">
              <i class="fa-solid fa-square fa-stack-2x"></i>
              <i class="fa-solid fa-pen fa-stack-1x fa-inverse"></i>
          </span>
      </td>
      <td>
      <span class="fa-stack fa-2x">
          <i class="fa-solid fa-square fa-stack-2x"></i>
          <i class="fa-solid fa-trash fa-stack-1x fa-inverse"></i>
      </span>
      </td>
      `;
  
      //Click icon check
      newRow.firstElementChild.firstElementChild.addEventListener("click", (event)=>{
          deleteTask(event);
      });
  
      //Over text
      newRow.firstElementChild.lastElementChild.addEventListener("click", (event)=>{
          editTask(event,true);
      });
  
      //Icon pen
      newRow.firstElementChild.nextElementSibling.firstElementChild.addEventListener("click", (event)=>{
          editTask(event,false);
      });
  
      //Icon trash
      newRow.lastElementChild.firstElementChild.addEventListener("click", (event)=>{
          removeRow(event, false);
      });
  
    return newRow;
  };
  
  //function to complete task
  const deleteTask = (event) => {
    let task = event.target.nextElementSibling;
    let text = task.innerHTML;
    if (text.includes("<del>")) {
      task.parentNode.parentNode.setAttribute("data-complete", "false");
      text = task.firstElementChild.textContent;
      task.innerHTML = text;
    } else {
      task.innerHTML = `<del>${text}</del>`;
      task.parentNode.parentNode.setAttribute("data-complete", "true");
    }
  };
  
  //function to edit task
  const editTask=(event, onFocus)=>{
      if(onFocus===true){
          let editable = event;
          event.target.classList.add("editable");
          document.addEventListener('keydown', (event)=>{
              console.log(event.key);
              if(event.key==="Escape"){
                  if(editable.target.innerHTML.trim()===""){
                      removeRow(editable, true);
                  }
                  event.target.classList.remove("editable");
                  editable.target.blur();        
              }
          })
      }else{
          let editable = event.target.parentNode.parentNode.previousElementSibling.lastElementChild;
          editable.classList.add("editable");
          editable.focus();
      }
  }
  
  //Function to remove row
  const removeRow = (event, editing)=>{
      if(editing){
          //remove when value == ""
          event.target.parentNode.parentNode.remove();
      }else{
          //remove when click icon delete
          event.target.parentNode.parentNode.parentNode.remove();
      }
  }
  
  //hacer un filtro de busqueda con campo select donde exista las siguientes opciones All (por defecto), done, undone, segun la opcion seleccionada debe de aparecer las filas correspondiente de cada uno