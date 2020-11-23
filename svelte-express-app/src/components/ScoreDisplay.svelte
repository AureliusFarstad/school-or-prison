<script>
    import { result } from "../stores.js";

    let score = 0;
    let streak = 0;
    let count = 0;
    let correct_count = 0;
    let score_gain;
    let gain_txt = "+100";

    let fade_down_red = false;
    let fade_up_green = false;

    function trueResult() {
        if (streak == 0) {
            score_gain = 100;
        } else {
            score_gain = streak * 100;
        }
        gain_txt = "+" + score_gain;
        fade_up_green = true;
    }
    function updateScore() {
        score += score_gain;
    }
    function falseResult() {
        if (streak !== 0) {
            fade_down_red = true;
        }
        count += 1;
    }
    function updateStreak() {
        if (fade_up_green) {
            streak += 1;
            fade_up_green = false;
        } else if (fade_down_red) {
            streak = 0;
            fade_down_red = false;
        }
    }
    function colorFromRatio(unit_interval) {
        let hue = (unit_interval * 130).toString(10);
        // 0 – red
        // 60 – yellow
        // 120 – green
        // 180 – turquoise
        // 240 – blue
        // 300 – pink
        return ["hsla(", hue, " , 100%, 50%, 0.75)"].join("");
    }

    $: if ($result === true) {
        correct_count += 1;
        count += 1;
        trueResult();
    } else if ($result === false) {
        count += 1;
        falseResult();
    }
    $: ratio = count == 0 ? 0.0 : correct_count / count;
    $: percent = ratio * 100;
    $: colorStr = colorFromRatio(ratio);
</script>

<style>
    .status-and-score {
        width: 90%;
        margin-right: auto;
        margin-left: auto;
        /* transition: all 0.3s ease; */
    }

    .silhouette {
        position: static;
        height: 28px;
        border-radius: 14px;
        background-color: #444;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 100%, 0.2),
            inset 0 1px 1px 0 rgba(0, 0, 0, 0.5);
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

        box-shadow: 0 -1px 3px 0 hsla(0, 0%, 100%, 0.2),
            0 1px 3px 0 hsla(0, 0%, 15%, 0.603),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.5);

        transition: width 0.5s;
    }

    .score__silhouette {
        width: 40%;
        margin-top: 10px;
        float: left;
    }

    .streak__silhouette {
        width: 40%;
        margin-top: 10px;
        float: right;
    }

    .text {
        font-family: Montserrat, sans-serif;
        color: #fff;
        line-height: 28px;
        text-align: left;
        text-indent: 8px;
        width: auto;

        overflow: visible;
    }

    @keyframes fade-down-red {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        40% {
            transform: translateY(0);
            opacity: 1;
            color: white;
        }
        100% {
            transform: translateY(15px);
            opacity: 0;
            color: red;
        }
    }

    .fade_down_red {
        animation-name: fade-down-red;
        animation-duration: 1.6s;
        opacity: 0;
    }

    @keyframes fade_up_green {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        40% {
            transform: translateY(0);
            opacity: 1;
            color: white;
        }
        100% {
            transform: translateY(-15px);
            opacity: 0;
            color: lime;
        }
    }

    .fade_up_green {
        animation-name: fade_up_green;
        animation-duration: 1.6s;
        opacity: 0;
    }

    @keyframes offset_fade_up_green {
        0% {
            transform: translateY(0px);
            opacity: 0;
        }
        10% {
            transform: translateY(-3px);
            opacity: 1;
        }
        100% {
            transform: translateY(-18px);
            opacity: 0;
            color: lime;
        }
    }

    .offset_fade_up_green {
        animation-name: offset_fade_up_green;
        animation-duration: 1.5s;
        animation-delay: 500ms;
        opacity: 0;
    }

    .gain {
        position: fixed;
        left: calc(5% + 50px);
        opacity: 0;
    }

    span {
        transition: opacity 0.4s ease;
        opacity: 1;
        position: fixed;
    }
</style>

<div class="status-and-score">
    <div class="silhouette status-bar__silhouette">
        <div
            class="status-bar__bar"
            background-color={colorStr}
            style="width:{percent}%;background-color:{colorStr};" />
    </div>

    <div class="silhouette score__silhouette">
        <div class="text">
            Score:
            <span>{score}</span>
            <span
                on:animationstart={updateScore}
                class:offset_fade_up_green={fade_up_green}
                class="gain">{gain_txt}</span>
        </div>
    </div>

    <div class="silhouette streak__silhouette">
        <div class="text">
            Streak:
            <span
                on:animationend={updateStreak}
                class:fade_up_green
                class:fade_down_red>{streak}</span>
        </div>
    </div>
</div>
