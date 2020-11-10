<script>
import { result } from '../stores.js';

import { fly, fade } from 'svelte/transition';

let score = 0;
let streak = 0;
let count = 0;

const unsubscribe = result.subscribe(value => {
    if (value === true) {
        count += 1;
        score += 1;
        streak += 1;
    } else if (value === false) {
        count += 1;
        streak = 0;
    }
});

function colorFromRatio(unit_interval) {
    let hue = (unit_interval * 120).toString(10);
    // 0 – red
    // 60 – yellow
    // 120 – green
    // 180 – turquoise
    // 240 – blue
    // 300 – pink
    return ['hsla(', hue, ' , 100%, 50%, 0.75)'].join('');
}

$: ratio = count == 0 ? 0.0 : score/count;
$: percent = ratio*100;
$: colorStr = colorFromRatio(ratio)

// let fadep={
//     duration: 400,
// } transition:fade={fadep}

// let params={
//     delay: 100,
//     x:0,
//     y:15
// }transition:fly={params}
</script>

<div class="status-and-score">
    <div class="silhouette status-bar__silhouette">
        <div class="status-bar__bar" background-color={colorStr} style="width:{percent}%;background-color:{colorStr};"></div>
    </div>

    <div class="silhouette score__silhouette">
        <div class="text" >Score: {score}</div>
    </div>

    <div class="silhouette streak__silhouette">
        <div class="text">Streak: {streak}</div>
    </div>
</div>

<style>
    .status-and-score {
        width: 90%;
        margin-right: auto;
        margin-left: auto;
        transition: all 0.3s ease;
    }

    .silhouette {
        position: static;
        height: 28px;
        border-radius: 14px;
        background-color: #444;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 100%, 0.2), inset 0 1px 1px 0 rgba(0, 0, 0, 0.5);
        /* color: #333 */
    }

    .status-bar__silhouette {
        /* display: block; */
        width: 100%;
        margin-top: 12px;
        margin-right: auto;
        margin-left: auto;

        /* float: none; */
        /* clear: none; */
    }

    .status-bar__bar {
        position: relative;
        top: 4px;
        left: 4px;
        right: 16px;
        height: 20px;
        min-width: 20px;
        max-width: calc(100% - 8px);
        border-radius: 10px;

        box-shadow: 0 1px 3px 0 hsla(0, 0%, 100%, 0.2), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.5);
        
        transition: width 0.5s;
        /* transition: background-color 0.4s; */
    }

    .score__silhouette {
        /* display: inline-block; */
        width: 40%;
        margin-top: 10px;
        /* margin-right: auto; */
        float: left;
        /* clear: none; */
    }

    .streak__silhouette {
        /* display: inline-block; */
        width: 40%;
        margin-top: 10px;
        /* margin-right: auto; */
        float: right;
        /* clear: none; */
    }

    .text {
        font-family: Montserrat, sans-serif;
        color: #fff;
        line-height: 28px;
        text-align: left;
        text-indent: 8px;      
    }
</style>