<script>
  // import Button from "./lib/Button.svelte";
  // import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
  // import FaBell from 'svelte-icons/fa/FaBell.svelte'
  import Todolist from "./lib/Todolist.svelte";
  import {v4 as uuid} from "uuid"
  import { tick } from "svelte";
  
  let todoList;
  let showList = true
  
  let todos = null 
  let promise = loadTodos()

  // $: console.log(todos)

  function loadTodos() {
    return fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
    .then(response => {
      if(response.ok) {
        return response.json()
      } else {
        throw new Error("An error message")
      }
    })
  }

  async function handleAddtodo(event) {
    event.preventDefault()
    todos = [...todos, {
      title: event.detail.title,
      id: uuid(),
      completed: false
    }]
    await tick()

    todoList.clearInput()

    // setTimeout(() => {
    //   todos = [...todos, {
    //     title: event.detail.title,
    //     id: uuid(),
    //     completed: false
    //   }]
    //   todoList.clearInput()
    // }, 3000)
    
  }

  function handleToggleTodo(event) {
    // console.log(event.detail.id, event.detail.value)
    todos = todos.map(todo => {
      if(todo.id === event.detail.id) {
        return { ...todo, completed: event.detail.value}
      }
      return {...todo}
    })
    console.log(todos)
  }

  function handleRemoveTodo(event) {
    // console.log(event.detail.id)
    todos = todos.filter(todo => todo.id !== event.detail.id)
    // console.log(todos)
  }

</script>

<!-- <Todolist bind:todos /> -->
<!-- {todoList && todoList.readonly}
 -->

 <label>
  <input type="checkbox" bind:checked={showList}>
  show/hide list
 </label>

 
 {#if showList}
  {#await promise}
    <p>Loading.....</p>
    {:then todos}
    <div style:max-width='400px'>
        <Todolist
            {todos} 
            bind:this={todoList}
            on:addtodo={handleAddtodo} 
            on:removetodo={handleRemoveTodo}
            on:toggletodo={handleToggleTodo}
        />
    </div>
    {:catch error}
    <p>{error.message || "An error has occured"}</p>
  {/await}
  <button on:click={() => {
      promise = loadTodos()
      }
    }
  >
  Refresh
  </button>
 {/if}


<!-- <button on:click={() => {
    todoList.focusInput()
    }}
  >
    Input Focus
</button> -->

