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

  // Enable user to add tasks with pressing enter
  let input = document.querySelector("input");
  input.addEventListener("focus", () => {
    document.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
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
          event.preventDefault();
        }
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

  //Enable user to edit task by clicking on pen
  let edit = document.querySelectorAll(".fa-pencil");
  edit.forEach((item) => {
    item.addEventListener("click", (event) => {
      console.log("Clickyu");
      editTask(event, false);
    });
  });

  // Enable user to edit tasks by clicking on the title
  let taskContent = document.querySelectorAll(".task");
  taskContent.forEach((item) => {
    item.addEventListener("focus", (event) => {
      editTask(event, true);
    });
    // Remove editable when losing focus
    item.addEventListener("blur", (event) => {
      console.log("Test");
      event.target.classList.remove("editable");
    });
  });

  let trash = document.querySelectorAll(".fa-trash");
  trash.forEach((item) => {
    item.addEventListener("click", (event) => {
      removeRow(event, false);
    });
  });

  // Get the select element
  const filter = document.querySelector("#filter");
  filter.addEventListener("change", (e)=> {

    let choice = e.target.value; 
    // Get all <tr> with an id (because i dont want the first one)
    let trElements = Array.from(document.querySelectorAll("tr[id]"));
    // Get closed <tr>
    let closedTrElements = Array.from(document.querySelectorAll("tr[data-complete='true']"));
    // Get open <tr>, which is both tr without data-complete & tr with data-complete=false
    // I need the difference from all tr - closed tr
    let openTrElements = trElements.filter((x)=>{
      return !closedTrElements.includes(x);
    })
    
    // First of all hide current tr´s
    trElements.forEach((x)=>{
      x.classList.add("hidden");
    })
    // Check user selection
    if(choice === "all") {
      trElements.forEach((x)=>{
        x.classList.remove("hidden");
      })
    } else if (choice === "open") {
      openTrElements.forEach((x)=>{
        x.classList.remove("hidden");
      })
    } else if(choice === "done") {
      closedTrElements.forEach((x)=>{
        x.classList.remove("hidden");
      })
    }
  })

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
  newRow.firstElementChild.firstElementChild.addEventListener(
    "click",
    (event) => {
      deleteTask(event);
    }
  );

  //Over text
  newRow.firstElementChild.lastElementChild.addEventListener(
    "click",
    (event) => {
      editTask(event, true);
    }
  );

  // Remove editable on losing focus
  newRow.firstElementChild.lastElementChild.addEventListener("blur", (e)=>{
    e.target.classList.remove("editable");
  })

  //Icon pen
  newRow.firstElementChild.nextElementSibling.firstElementChild.addEventListener(
    "click",
    (event) => {
      editTask(event, false);
    }
  );

  //Icon trash
  newRow.lastElementChild.firstElementChild.addEventListener(
    "click",
    (event) => {
      removeRow(event, false);
    }
  );

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
const editTask = (event, onFocus) => {
  if (onFocus === true) {
    let editable = event;
    event.target.classList.add("editable");
    document.addEventListener("keydown", (event) => {
      console.log(event.key);
      if (event.key === "Escape") {
        if (editable.target.innerHTML.trim() === "") {
          removeRow(editable, true);
        }
        event.target.classList.remove("editable");
        editable.target.blur();
      }
    });
  } else {
    let editable =
      event.target.parentNode.parentNode.previousElementSibling
        .lastElementChild;
    editable.classList.add("editable");
    editable.focus();
  }
};

//Function to remove row
const removeRow = (event, editing) => {
  if (editing) {
    //remove when value == ""
    event.target.parentNode.parentNode.remove();
  } else {
    //remove when click icon delete
    event.target.parentNode.parentNode.parentNode.remove();
  }
};

//hacer un filtro de busqueda con campo select donde exista las siguientes opciones All (por defecto), done, undone, segun la opcion seleccionada debe de aparecer las filas correspondiente de cada uno
