<script>
  // import Button from "./lib/Button.svelte";
  // import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte'
  // import FaBell from 'svelte-icons/fa/FaBell.svelte'
  import Todolist from "./lib/Todolist.svelte";
  import {v4 as uuid} from "uuid"
  import { onMount, tick } from "svelte";
  import { fly } from "svelte/transition";
  import spin from "./lib/transition/spin";  

  let todoList;
  let showList = true
  
  let todos = null
  let error = null
  let isLoading = false
  let isAdding = false
  let disabledItems = []
  
  // let promise = loadTodos()

  // $: console.log(todos)

  // function loadTodos() {
  //   return fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
  //   .then(response => {
  //     if(response.ok) {
  //       return response.json()
  //     } else {
  //         throw new Error("An error message")
  //     }
  //   })
  // }

  onMount(() => {
    loadTodos()
  })

  async function loadTodos() {
    isLoading = true
    await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
    .then(async response => {
      if(response.ok) {
        todos = await response.json()
      } else {
        error = 'An error has occured'
          // throw new Error("An error message")
      }
    })
    isLoading = false
  }

  async function handleAddtodo(event) {
    event.preventDefault()
    isAdding = true
    await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({
        title: event.detail.title,
        completed: false
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }).then(async (response) => {
        if(response.ok) {
          const todo = await response.json()
          todos = [...todos, {...todo, id: uuid()},  ]

          todoList.clearInput()
          // console.log(todo)
        } else {
          alert('An error occured')
        }
    })
    isAdding = false
    await tick()
    todoList.focusInput()
    // todos = [...todos, {
    //   title: event.detail.title,
    //   id: uuid(),
    //   completed: false
    // }]
    // await tick()

    // setTimeout(() => {
    //   todos = [...todos, {
    //     title: event.detail.title,
    //     id: uuid(),
    //     completed: false
    //   }]
    //   todoList.clearInput()
    // }, 3000)    
  }

  async function handleToggleTodo(event) {
    const id = event.detail.id
    const value = event.detail.value
    if(disabledItems.includes(id)) return;
    disabledItems = [...disabledItems, id]
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        completed: value
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    }).then(async (response) => {
      if(response.ok) {
        const updatedTodo = await response.json()
        todos = todos.map(todo => {
          if(todo.id === id) {
            return updatedTodo
          }
          return {...todo}
        })
      } else {
        alert('An error has occured')
      } 
    })
    disabledItems = disabledItems.filter((itemId) => itemId !== id)
  }

  async function handleRemoveTodo(event) {
    const id = event.detail.id
    if(disabledItems.includes(id)) return;
    disabledItems = [...disabledItems, id]
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',
      }).then((response) => {
        if(response.ok) {
          todos = todos.filter(todo => todo.id !== event.detail.id)
        } else {
          alert('An error has occured')
        }
      })
      disabledItems = disabledItems.filter((itemId) => itemId !== id)
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
 <!-- <div
  style:max-width='800px'
  style="opacity = 0.5"
  transition:spin={{spin: 6}}
  > -->
  <div
    style:max-width='800px'
    style="opacity = 0.5"
  >
    <Todolist
      {todos} 
      {isLoading}
      {error}
      {disabledItems}
      disableAdding={isAdding}
      bind:this={todoList}
      on:addtodo={handleAddtodo} 
      on:removetodo={handleRemoveTodo}
      on:toggletodo={handleToggleTodo}
      let:todo
      let:handleToggleTodo
      let:index
    >
    <!-- <svelte:fragment slot='title'>{index + 1} - {todo.title}</svelte:fragment> -->
      <!-- {@const {id, completed, title} = todo}
      <div>
        <input
          type="checkbox"
          disabled={disabledItems.includes(id)}
          checked={completed}
          on:input={(event) => {
            event.currentTarget.checked = completed
            handleToggleTodo(id, !completed)
        }} />
        {title}
      </div> -->
    </Todolist>
  </div>

  {#if todos}
    <p>Number of todos: 
      {#key todos.length}
        <span 
          style:display="inline-block" 
          in:fly|local={{y: -10}}>
            {todos.length}
        </span>
      {/key} 
  {/if} 

  <!-- {#await promise}
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
  {/await} -->
  
  <!-- <button on:click={() => {
      promise = loadTodos()
      }
    }
  >
  Refresh
  </button> -->
 {/if}


<!-- <button on:click={() => {
    todoList.focusInput()
    }}
  >
    Input Focus
</button> -->

