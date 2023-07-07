<svelte:options immutable={true}/>

<script>
    import Button from "./Button.svelte";
    import { afterUpdate, beforeUpdate, createEventDispatcher, onDestroy, onMount} from "svelte";
    import MdDelete from 'svelte-icons/md/MdDelete.svelte'
    // import { v4 as uuid } from "uuid"; 

    export let todos = [];
    let input, listDiv, autoscroll, listDivScrollHeight;
     
    let inputText = '';
    // export const readonly = "read only"

    let prevTodos = todos

    $: {
        // console.log(prevTodos, todos)
        autoscroll = todos.length > prevTodos.length
        prevTodos = todos
    }
    
    export function clearInput() {
        inputText = ''
    }

    export function focusInput() {
        input.focus()
    }

    onMount(() => {
        return () => {
            console.log('Destroyed 2')
        }
    })

    onDestroy(() => {
        console.log('Destroy')
    })

    afterUpdate(() => {
        if (autoscroll) listDiv.scrollTo(0, listDivScrollHeight)
        autoscroll = false
    })

    beforeUpdate(() => {
        if (listDiv){
            console.log(listDiv.offsetHeight)
        }
    })

 
    const dispatch = createEventDispatcher()

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

{listDivScrollHeight}

<div class="todo-list-wrapper">
    <div class="todo-list" bind:this={listDiv}>
        <div bind:offsetHeight={listDivScrollHeight}>
            {#if todos.length === 0}
                <p class="no-item-text">No Todos yet</p>
            {:else}
                <ul>
                {#each todos as {id, title, completed} (id)}
                    <!-- {@const number = index + 1} -->
                    <li class:completed>
                        <input type="checkbox" checked={completed} on:input={(event) => {
                            event.currentTarget.checked = completed
                            handleToggleTodo(id, !completed)
                        }}>
                        {title}
                        <button class="remove-todo-button" aria-label="Remove todo: {title}" on:click={() => handleRemoveTodo(id)}>
                            <span style:width="10px" style:display="inline-block">
                                <MdDelete/>
                            </span>
                        </button>
                    </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>

    <form class="add-todo-form" on:submit|preventDefault = {handleAddTodo}>
        <!-- <input bind:this={input}/> -->
        <!-- <input on:input={(e)=>{
            inputText = e.currentTarget.value
            // console.log(e.currentTarget.value)
        }}/> -->
        <input bind:this={input} bind:value={inputText} placeholder="New Todo"/>
        <Button type="submit" disabled={!inputText}>Add</Button>
    </form>
</div>

<style>
    .todo-list {
        max-height: 150px;
        overflow: auto;
    }

    .remove-todo-button {

    }
</style>