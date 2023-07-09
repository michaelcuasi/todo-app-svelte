<svelte:options immutable={true}/>

<script>
  import Button from "./Button.svelte";
  import { afterUpdate, createEventDispatcher } from "svelte";
  import TiDelete from "svelte-icons/ti/TiDelete.svelte"  
  import { flip } from "svelte/animate";
  import { scale, crossfade } from "svelte/transition";
  // import { v4 as uuid } from "uuid"; 

  export let todos = null
  export let error = null
  export let isLoading = false
  export let disableAdding = false
  export let disabledItems = []
  // export let scrollOnAdd = undefined
  $: done = todos ? todos.filter(todo => todo.completed) : []
  $: todo = todos ? todos.filter(todo => !todo.completed) : []

  let prevTodos = todos
  let input, listDiv, autoscroll, listDivScrollHeight;
  let inputText = '';

  const dispatch = createEventDispatcher() 
  
  $: {
      // console.log(prevTodos, todos)
      autoscroll = todos && prevTodos && todos.length > prevTodos.length
      prevTodos = todos
  }
  // export const readonly = "read only"
  
  export function clearInput() {
      inputText = ''
  }

  export function focusInput() {
      input.focus()
  }

  afterUpdate(() => {   
      if (autoscroll) listDiv.scrollTo(0, listDivScrollHeight)
      autoscroll = false
    }
  )

  const [send, receive] = crossfade({
    duration: 400,
    fallback(node) {
      return scale(node, {start: 0.5, duration: 300})
    }
  })

  // afterUpdate(() => {
  //   if(scrollOnAdd) {
  //     let pos; 
  //     if(scrollOnAdd === 'top') pos = 0
  //     if(scrollOnAdd === 'bottom') pos = listDivScrollHeight
      
  //     if (autoscroll) listDiv.scrollTo(0, pos)
  //     autoscroll = false
  //   }
  // })

  function handleAddTodo() { 
    const isNotCancelled = dispatch('addtodo', {
        title: inputText
      })

    // if(!inputText) return;
    // todos = [...todos, {
    //     id: uuid(),
    //     title: inputText,
    //     completed: false
    // }]
    // inputText = ''

    // todos.push({
    //     id: uuid(),
    //     title: inputText,
    //     completed: false
    // })
    // todos = todos
  }

  function handleRemoveTodo(id) {
      dispatch('removetodo', {id})
  }

  function handleToggleTodo(id, value) {
      dispatch('toggletodo', {id, value})
  }

</script>

<!-- {listDivScrollHeight} -->
<div class="todo-list-wrapper">
  {#if isLoading}
    <p class="state-text">Is Loading....</p>
  {:else if error}
    <p class="state-text">{error}</p>
  {:else if todos}
    <div class="todo-list" bind:this={listDiv}>
      <div bind:offsetHeight={listDivScrollHeight}>
        {#if todos.length === 0}
          <p class="state-text">No Todos yet</p>
        {:else}
          <div style:display="flex">
            {#each [todo, done] as list, index}
              <div class="list-wrapper">
                <h2>{index === 0 ? "Todo" : "Done"}</h2>
                <ul>
                  {#each list as todo, index (todo.id)}
                  {@const {id, completed, title} = todo}
                  <li animate:flip={{duration: 300}}>
                    <slot {todo} {index} {handleToggleTodo}>
                      <div in:receive|local={{key: id}} out:send|local={{key: id}} class:completed>
                        <label>
                          <input
                            type="checkbox"
                            disabled={disabledItems.includes(id)}
                            checked={completed}
                            on:input={(event) => {
                              event.currentTarget.checked = completed
                              handleToggleTodo(id, !completed)
                          }}>
                          <slot name='title'>{title}</slot>
                          <button
                            class="remove-todo-button"
                            disabled={disabledItems.includes(id)}
                            aria-label="Remove todo: {title}"
                            on:click={() => handleRemoveTodo(id)}>
                              <span style:width="10px" style:display="inline-block">
                                  <TiDelete/>
                              </span>
                          </button>
                        </label>
                      </div>
                    </slot>
                  </li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
    <form class="add-todo-form" on:submit|preventDefault = {handleAddTodo}>
      <input disabled={disableAdding || !todos} bind:this={input} bind:value={inputText} placeholder="New Todo"/>
      <Button class="add-todo-button" type="submit" disabled={!inputText || disableAdding || !todos}>Add</Button>
    </form>
</div>

<style lang="scss">
  .todo-list-wrapper {
    background-color: #424242;
    border: 1px solid #4b4b4b;
    .state-text {
      margin: 0;
      padding: 15px;
      text-align: center;
    }
    .todo-list {
      max-height: 400px;
      overflow: auto;
      .list-wrapper {
        flex: 1;
        padding: 10px;
        margin: 0 0 10px 0;
      }
      ul {
        margin: 0;
        padding: 0px;
        list-style: none;
        li > div {
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          background-color: #303030;
          border-radius: 5px;
          padding: 10px;
          position: relative;
          label {
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: baseline;
            padding-right: 20px;
            input[type='checkbox'] {
              margin: 0 10px 0 0;
              cursor: pointer;
            }
          }
          &.completed > label {
            opacity: 0.5;
            text-decoration: line-through;
          }
          .remove-todo-button {
            border: none;
            background: none;
            padding: 5px;
            position: absolute; 
            right: 10px;
            cursor: pointer;
            display: none;
            &:disabled {
              opacity: 0.4;
              cursor: not-allowed;
            }
            :global(svg) {
              fill: #bd1414;
            }
          }
          &:hover {
            .remove-todo-button {
              display: block;
            }
          }
        }
      }
    }
    .add-todo-form { 
      padding: 15px;
      background-color: #303030;
      display: flex;
      border-top: 1px solid #4b4b4b;
      flex-wrap: wrap;
      // :global(.add-todo-button) {
      //   background-color: aqua;

      // }
      input {
        flex: 1;
        background-color: #424242;
        border: 1px solid #4b4b4b;
        padding: 10px;
        color: white;
        border-radius: 5px;
        margin-right: 10px;
      }
    }
  }
</style>