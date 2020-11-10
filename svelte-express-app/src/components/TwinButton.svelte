<script>  
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';

import { guess, result } from './../stores.js';

const dispatch = createEventDispatcher();
</script>

<div class="button-platform button-platform--school">
    <div class="button button--school" 
         class:button--school--active="{$guess === 'SCHOOL'}" 
         class:button--school--true="{$guess === 'SCHOOL' && $result === true}" 
         class:button--school--false="{$guess === 'SCHOOL' && $result === false}" 
         on:click={() => {
            dispatch('button_guess', {
                guess: 'SCHOOL'
            }); 
         }}       
         transition:fade>
         SCHOOL
    </div>
</div>

<div class="button-platform button-platform--prison">
    <div class="button button--prison" 
         class:button--prison--active="{$guess === 'PRISON'}" 
         class:button--prison--true="{$guess === 'PRISON' && $result === true}" 
         class:button--prison--false="{$guess === 'PRISON' && $result === false}" 
         on:click={() => {
             dispatch('button_guess', {
                 guess: 'PRISON'
             })
         }}
         transition:fade>
         PRISON
    </div>
</div>

<style>

.button-platform {
    /* display: inline-block; */
    width: 48%;
    z-index: 5;
    min-height: 136px;
    min-width: 136px;
    /* float: none; */

    box-shadow: inset 0 2px 5px 0 rgba(0, 0, 0, 0.5);

    /* text-align: center; */
}

.button {
    z-index: 6;
    /* display: inline-block; */
    width: 95px;
    height: 95px;

    /* margin-right: auto; */
    /* margin-left: auto; */

    border-style: solid;
    border-width: 1px;
    border-radius: 47px;

    font-family: Impact, Oswald, Haettenschweiler, 'Franklin Gothic Bold', Charcoal, sans-serif;
    font-size: 24px;
    line-height: 95px;
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
    background-image: radial-gradient(circle farthest-corner at 50% -50%, #ed997c, #ee5622);
}

.button--school{
    position: absolute;
    left: auto;
    top: 20px;
    right: 20px;
    bottom: auto;

    color: #C7C7C7;
    border-color: #e7e7e7;
    
    background-color: #ee5622;
    box-shadow: 3px -12px 16px 0 hsla(0, 0%, 85.1%, 0.34), -3px 12px 16px 0 rgba(0,0,0,0.35);
    -webkit-transform: rotate(-15deg);
    -ms-transform: rotate(-15deg);
    transform: rotate(-15deg);

    transition: all 0.1s ease-out;

    text-shadow: 0 -1px 3px rgba(0, 0, 0, 0.35), 0 1px 3px hsla(0, 0%, 85.1%, 0.8);
}

.button--school--active {
    position: absolute;
    left: auto;
    top: 23px;
    right: 20px;
    bottom: auto;

    color: #EEEEEE;
    border-color: #e7e7e7;
    
    background-color: #ee5622;
    -webkit-transform: rotate(-15deg);
    -ms-transform: rotate(-15deg);
    transform: rotate(-15deg);

    animation-delay: 1s;

    box-shadow: -1px 2px 4px 0 rgba(0,0,0,0.35);
    text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.7), 0.5px -1px 3px rgba(73, 73, 73, 0.35);
}

.button--school--true {
    color: green;
    
    box-shadow: -1px 2px 4px 0 rgba(0,0,0,0.35);
    text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.7), 0.5px -1px 3px rgba(73, 73, 73, 0.35);
}

.button--school--false {
    color: red;
    
    box-shadow: -1px 2px 4px 0 rgba(0,0,0,0.35);
    text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.7), 0.5px -1px 3px rgba(73, 73, 73, 0.35);
}

.button-platform--prison {
    position: absolute;
    left: auto;
    top: auto;
    right: 0%;
    bottom: 0%;
    
    border-radius: 14px 0px 0px 0px;
    background-image: radial-gradient(circle farthest-corner at 50% -50%, #36616F, #19323c);
}

.button--prison{
    position: absolute;
    left: 20px;
    top: 20px;
    right: auto;
    bottom: auto;

    color: #C7C7C7;
    border-color: #cacaca;
    
    background-color: #1f3e4b;
    box-shadow: -3px -12px 16px 0 hsla(0, 0%, 85.1%, 0.34), 3px 12px 16px 0 rgba(0,0,0,0.35);
    -webkit-transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    transform: rotate(15deg);

    transition: all 0.1s ease-out;

    text-shadow: 0 -1px 3px rgba(0, 0, 0, 0.35), 0 1px 3px hsla(0, 0%, 85.1%, 0.8);
}

.button--prison--active{
    position: absolute;
    left: 20px;
    top: 23px;
    right: auto;
    bottom: auto;

    color: #EEEEEE;
    border-color: #cacaca;
    
    background-color: #1f3e4b;
    -webkit-transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    transform: rotate(15deg);

    box-shadow: -1px 2px 4px 0 rgba(0,0,0,0.35);
    text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.5), 0.5px -1px 3px rgba(114, 114, 114, 0.35);
}

.button--prison--true {
    color: green;
    
    box-shadow: -1px 2px 4px 0 rgba(0,0,0,0.35);
    text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.7), 0.5px -1px 3px rgba(73, 73, 73, 0.35);
}

.button--prison--false {
    color: red;
    
    box-shadow: -1px 2px 4px 0 rgba(0,0,0,0.35);
    text-shadow: -0.5px 1px 3px rgba(239, 239, 239, 0.7), 0.5px -1px 3px rgba(73, 73, 73, 0.35);
}
</style>