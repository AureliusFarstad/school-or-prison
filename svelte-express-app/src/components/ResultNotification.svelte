<script>
import { result } from '../stores.js';
import { fly } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

const inParams = {
    duration: 200,
    easing: cubicOut,
    y: -10,
}
const outParams = {
    duration: 200,
    easing: cubicOut,
    y: 10,
}

var string = '';
var strColor = '';

const unsubscribe = result.subscribe(value => {
    if (value === true) {
        string = 'Correct'
        strColor = 'hsla(110 , 100%, 50%, 0.75)'
    } else if (value === false) {
        string = 'Wrong'
        strColor = 'hsla(10 , 100%, 50%, 0.75)'
    } else {
        string =''
    }
})

</script>

{#if string}
    <div class="center" in:fly={inParams} out:fly={outParams}>
        <p style="color:{strColor};">{string}</p>
    </div>
{/if}

<style>
p {
    font-family: Oswald, sans-serif;
    font-size: 40px;
    line-height: 40px;
    text-align: center;
}
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>