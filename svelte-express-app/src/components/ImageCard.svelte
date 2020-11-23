<script context="module">
    import interact from "interactjs";
</script>

<script>
    import { createEventDispatcher } from "svelte";
    import { guess } from "./../stores.js";

    export let imgFilename;
    let src;
    // set src for first provided imgFilename
    $: if (imgFilename !== undefined && src === undefined) {
        src = process.env.CLOUDINARY_URL + imgFilename;
    }

    let showCard = true;
    let position = { x: 0, y: 0 };
    const interactThreshold = 70;
    const interactMaxRotation = 15; // #TODO: implement rotation?
    let vw;
    let offScreenX = 1.2 * 400;
    $: if (vw > 400) {
        offScreenX = 1.2 * vw;
    }

    // Swipe card when guess is registered
    $: if ($guess == "SCHOOL") {
        position.x = -1 * offScreenX;
    } else if ($guess == "PRISON") {
        position.x = offScreenX;
    } else {
        // guess === null
        // Next card ready for display
        showCard = true;
        position.x = 0;
        position.y = 0;
    }

    function updateImgSrc() {
        showCard = false;
        position.x = 0;
        position.y = -1000;
        src = process.env.CLOUDINARY_URL + imgFilename;
    }

    function transitionEnd(event) {
        // Card offscreen at transitionEnd?
        if (position.x == offScreenX || position.x == -offScreenX) {
            updateImgSrc();
        }
    }

    $: if (imgFilename !== undefined && showCard == false) {
        // Img src only fetched after swip completed:
        updateImgSrc();
    }

    const dispatch = createEventDispatcher();

    interact(".image-card").draggable({
        listeners: {
            start(event) {
                event.target.setAttribute("data-dragging", true);
            },
            move(event) {
                position.x += event.dx;
                position.y += event.dy;
            },
            end(event) {
                event.target.setAttribute("data-dragging", false);
                if (position.x > interactThreshold) {
                    dispatch("swipe_guess", "PRISON");
                } else if (position.x < -interactThreshold) {
                    dispatch("swipe_guess", "SCHOOL");
                } else {
                    position.x = 0;
                    position.y = 0;
                }
            },
        },
    });
</script>

<style>
    div.horizontal {
        height: 100%;
        display: flex;
        justify-content: center;
    }

    div.vertical {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .image-card {
        object-fit: cover;
        opacity: 1;
        transition: opacity 2s;
        z-index: 100;

        max-height: 100%;
        max-width: calc(min(88%, 640px));

        margin: auto;
        display: block;

        border: 2px solid #e7e7e7;
        border-radius: 20px;

        touch-action: none;
        user-select: none;
    }

    .zero-opacity {
        opacity: 0;
        transition: opacity 2s;
    }

    /* For smooth dragging(true) and smooth return to origin(false) */
    .image-card[data-dragging="false"] {
        transition: transform 0.5s;
    }
</style>

<svelte:window bind:outerWidth={vw} />

<div class="horizontal">
    <div class="vertical">
        <img
            {src}
            alt="A school or prison building"
            class="image-card"
            class:zero-opacity={showCard === false}
            on:transitionend={transitionEnd}
            on:load={() => {
                dispatch('image_loaded', 'ImageCard');
            }}
            style="transform: translate({position.x}px, {position.y}px)"
            data-dragging="false" />
    </div>
</div>
