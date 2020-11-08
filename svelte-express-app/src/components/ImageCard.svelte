<script context="module">
    import interact from "interactjs";
</script>

<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { guess } from './../stores.js';

    export let imgFilename;
    $: src = "./images/"+imgFilename

    let element
    onMount(() => {
        element = document.getElementById('image-card');
    })

    const position = { x: 0, y: 0 }
    const interactThreshold = 70;
    const interactMaxRotation = 15; // #TODO: implement rotation?
    const vw = document.documentElement.clientWidth;
    let offScreenX = 1.2*400
    if (vw > 400) {
        offScreenX = 1.2*vw;
    }
    
    let unsubscribe = guess.subscribe(value => {
        if (value == 'SCHOOL') {
            position.x = -1*offScreenX;
        } else if (value == 'PRISON') {
            position.x  = offScreenX;
        } else {
            if (element) {
                element.setAttribute('data-dragging', true);
                element.style.opacity = "0.0";
                position.x = 0;
                position.y = -50;
                setTimeout(() => {
                    element.setAttribute('data-dragging', false);
                    element.style.opacity = "1.0";
                    position.x = 0;
                    position.y = 0;
                }, 400);
            }
        }
    });

    const dispatch = createEventDispatcher();
    interact('.image-card').draggable({
        listeners: {
            start (event) {
                // console.log(event.type, event.target);
                event.target.setAttribute('data-dragging', true);
            },
            move (event) {
                position.x += event.dx; 
                position.y += event.dy;
            },
            end (event) {
                // console.log("end", position.x, position.y);
                // event.target.setAttribute('data-dragging', 'string'); // Why doesn't this work?
                event.target.setAttribute('data-dragging', false);
                if (position.x > interactThreshold) {
                    console.log("SWIPE RIGHT");
                    dispatch('swipe_guess', {
                        guess: 'PRISON'
                    });
                } else if (position.x < -interactThreshold) {
                    console.log("SWIPE LEFT");
                    dispatch('swipe_guess', {
                        guess: 'SCHOOL'
                    });
                } else {
                    position.x = 0;
                    position.y = 0;
                }
            }
        }
    })
</script>

<img {src} 
      alt="A school or prison building" 
      class="image-card" 
      id="image-card" 
      style="transform: translate({position.x}px, {position.y}px)"
      data-dragging=false
>

<style>
.image-card{
    object-fit: cover;

    position: absolute;
    left: 8%;
    top: 6%;
    right: 8%;
    bottom: 6%;
    z-index: 100;
    width: 84%;
    height: 88%;

    border: 2px solid #e7e7e7;
    border-radius: 20px;

    touch-action: none;
    user-select: none;
}

/* .image-card[data-dragging="string"] {
	transition: transform 0.5s;
} */

.image-card[data-dragging="false"] {
	transition: transform 0.5s, opacity 0.8s;
}


</style>