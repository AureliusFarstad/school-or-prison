<script>
import { onMount } from 'svelte'
import { result } from '../stores.js';
import { fly } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

const inParams = {
    duration: 200,
    easing: cubicOut,
    y: -10,
}

var cardCount = '';
var voteCount = '';

onMount(async function () {
    const res1 = await fetch('http://localhost:5000/api/card/total_count')
    const json1 = await res1.json()
    if (json1['message']=='success') {
        console.log(json1)
        cardCount = json1['data']['count']
        console.log(cardCount)
    }	
    const res2 = await fetch('http://localhost:5000/api/vote/total_count')
    const json2 = await res2.json()
    if (json2['message']=='success') {
        voteCount = json2['data']['count']
    }	
})
</script>

{#if cardCount && voteCount}
    <div class="center" in:fly={inParams}>
        <p>Thanks for playing. So far we have</p>
        <h2>{cardCount} Buildings</h2>
        <h2>{voteCount} votes.</h2>
        <p>We don't think it's fair to judge yet. Help us by sharing SOP or uploading a building near you.</p>
    </div>
{/if}

<style>
p {
    font-family: Oswald, sans-serif;
    font-size: 12px;    
    color: #a2a2a2;
    text-align: center;
}
h2 {
    font-family: Oswald, sans-serif;
    font-size: 20px;
    color: #a2a2a2;
    text-align: center;
}
.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>