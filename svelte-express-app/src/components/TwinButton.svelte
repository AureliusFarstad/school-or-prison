<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  import { guess, result } from "./../stores.js";

  const dispatch = createEventDispatcher();
</script>

<style>
  .button-platform {
    display: flex;
    justify-content: center;
    width: 48%;
    z-index: 5;
    min-height: 95px;
    min-width: 136px;

    box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.5);

  }

  .button {
    z-index: 6;
    min-width: 124px;
    width: 80%;
    height: 72px;

    border-style: solid;
    border-width: 1px;
    border-radius: 14px;

    font-family: Impact, Oswald, Haettenschweiler, "Franklin Gothic Bold",
      Charcoal, sans-serif;
    font-size: min(10vw, 70px);

    line-height: 72px;
    text-align: center;
    letter-spacing: 0.5px;
  }

  .button-platform--school {
    position: absolute;
    left: 0%;
    top: auto;
    right: auto;
    bottom: 0%;

    border-radius: 0px 14px 0px 0px;
    background-image: radial-gradient(
      circle farthest-corner at 50% -50%,
      #ed997c,
      #ee5622
    );
  }

  .button--school {
    position: absolute;
    /* left: auto; */
    top: 10px;
    /* right: 20px; */
    bottom: auto;

    color: #c7c7c7;
    border-color: #e7e7e7;

    background-color: hsl(15, 86%, 53%);
    box-shadow: -4px -6px 10px 0 hsla(0, 0%, 85.1%, 0.34),
      4px 12px 16px 0 rgba(0, 0, 0, 0.35);
    /* -webkit-transform: rotate(-15deg);
    -ms-transform: rotate(-15deg);
    transform: rotate(-15deg); */

    transition: all 0.4s ease-out;

    text-shadow: 0 -1px 3px rgba(0, 0, 0, 0.35),
      0 1px 3px hsla(0, 0%, 85.1%, 0.8);
  }

  .button-platform--prison {
    position: absolute;
    left: auto;
    top: auto;
    right: 0%;
    bottom: 0%;

    border-radius: 14px 0px 0px 0px;
    background-image: radial-gradient(
      circle farthest-corner at 50% -50%,
      #36616f,
      #19323c
    );
  }

  .button--prison {
    position: absolute;
    /* left: 20px; */
    top: 10px;
    /* right: auto; */
    bottom: auto;

    color: #c7c7c7;
    border-color: #cacaca;

    background-color: #1f3e4b;
    box-shadow: -4px -6px 10px 0 hsla(0, 0%, 85.1%, 0.34),
      4px 12px 16px 0 rgba(0, 0, 0, 0.35);
    /* -webkit-transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    transform: rotate(15deg); */

    transition: all 0.4s ease-out;
  }

  @keyframes true-animation {
    from {
      top: 10px;
      color: #c7c7c7;
      box-shadow: -4px -6px 10px 0 hsla(0, 0%, 85.1%, 0.34),
        4px 12px 16px 0 rgba(0, 0, 0, 0.35);
      text-shadow: 0 -1px 3px rgba(0, 0, 0, 0.35),
        0 1px 3px hsla(0, 0%, 85.1%, 0.8);
    }
    20% {
      top: 13px;
      color: #e2e2e2;
      box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.35);
      text-shadow: 0 -1px 3px rgba(0, 0, 0, 0.35),
        0 1px 3px hsla(0, 0%, 85.1%, 0.8);
      /* text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.7), 0.5px -1px 3px rgba(73, 73, 73, 0.35); */
    }
    40% {
      color: rgb(87, 255, 87);
      text-shadow: -0.5px 1px 3px rgba(135, 255, 122, 0.753),
        0.5px -1px 3px rgba(58, 136, 34, 0.7);
    }
    95% {
      top: 13px;
      color: rgb(87, 255, 87);
      box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.35);
      text-shadow: -0.5px 1px 3px rgba(135, 255, 122, 0.753),
        0.5px -1px 3px rgba(58, 136, 34, 0.7);
    }
  }

  @keyframes false-animation {
    from {
      top: 10px;
      color: #c7c7c7;
      box-shadow: -4px -6x 10px 0 hsla(0, 0%, 85.1%, 0.34),
        4px 12px 16px 0 rgba(0, 0, 0, 0.35);
      text-shadow: 0 -1px 3px rgba(0, 0, 0, 0.35),
        0 1px 3px hsla(0, 0%, 85.1%, 0.8);
    }
    20% {
      top: 13px;
      color: #e2e2e2;
      box-shadow: -1px 2px 4px 0 rgba(0, 0, 0, 0.35);
      text-shadow: 0 -1px 3px rgba(0, 0, 0, 0.35),
        0 1px 3px hsla(0, 0%, 85.1%, 0.8);
      /* text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.7), 0.5px -1px 3px rgba(73, 73, 73, 0.35); */
    }
    40% {
      color: rgb(255, 62, 62);
      text-shadow: -0.5px 1px 3px rgba(190, 81, 81, 0.7),
        0.5px -1px 3px rgba(73, 73, 73, 0.35);
    }
    95% {
      top: 13px;
      color: rgb(255, 62, 62);
      box-shadow: -1px 2px 4px 0 rgba(0, 0, 0, 0.35);
      text-shadow: -0.5px 1px 3px rgba(190, 81, 81, 0.7),
        0.5px -1px 3px rgba(73, 73, 73, 0.35);
    }
  }

  .run-true {
    animation-name: true-animation;
    animation-duration: 2s;

    top: 13px;
    color: rgb(87, 255, 87);
    box-shadow: -1px 2px 4px 0 rgba(0, 0, 0, 0.35);
    text-shadow: -0.5px 1px 3px rgba(135, 255, 122, 0.753),
      0.5px -1px 3px rgba(58, 136, 34, 0.7);

    /* text-shadow: -0.5px 1px 3px rgba(58, 136, 34, 0.7), 0.5px -1px 3px rgba(25, 63, 21, 0.35); */
  }

  .run-false {
    animation-name: false-animation;
    animation-duration: 2s;

    top: 13px;
    color: rgb(255, 62, 62);
    box-shadow: -1px 2px 4px 0 rgba(0, 0, 0, 0.35);
    text-shadow: -0.5px 1px 3px rgba(190, 81, 81, 0.7),
      0.5px -1px 3px rgba(73, 73, 73, 0.35);
  }
</style>

<div class="button-platform button-platform--school">
  <div
    class="button button--school"
    class:run-true={$guess === 'SCHOOL' && $result === true}
    class:run-false={$guess === 'SCHOOL' && $result === false}
    on:animationend={() => {
      dispatch('animation_done', 'TwinButton');
    }}
    on:click={() => {
      dispatch('button_guess', 'SCHOOL');
    }}
    transition:fade>
    SCHOOL
  </div>
</div>

<div class="button-platform button-platform--prison">
  <div
    class="button button--prison"
    class:run-true={$guess === 'PRISON' && $result === true}
    class:run-false={$guess === 'PRISON' && $result === false}
    on:animationend={() => {
      dispatch('animation_done', 'TwinButton');
    }}
    on:click={() => {
      dispatch('button_guess', 'PRISON');
    }}
    transition:fade>
    PRISON
  </div>
</div>
