<script>
    import { createEventDispatcher, onDestroy } from "svelte";

    const dispatch = createEventDispatcher();
    const close = () => dispatch("close");

    export let tap_anywhere = false;
    let modal;

    const previously_focused =
        typeof document !== undefined && document.activeElement;

    if (previously_focused) {
        onDestroy(() => {
            previously_focused.focus();
        });
    }
</script>

<style>
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
    }
    .modal {
        position: absolute;
        left: 50%;
        top: 50%;
        overflow: auto;
        transform: translate(-50%, -50%);
    }
</style>

<div class="modal-background" on:click={close} />

{#if tap_anywhere === true}
    <div
        class="modal"
        role="dialog"
        aria-modal="true"
        bind:this={modal}
        on:click={close}>
        <slot />
    </div>
{:else}
    <div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
        <slot />
    </div>
{/if}
