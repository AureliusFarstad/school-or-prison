<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import Modal from './components/Modal.svelte';
	import Upload from './components/Upload.svelte';

	import ScoreDisplay from './components/ScoreDisplay.svelte'
	import ImageCard from './components/ImageCard.svelte'
	import ResultNotification from './components/ResultNotification.svelte'
	import GameOver from './components/GameOver.svelte'
	import TwinButton from './components/TwinButton.svelte'

	import { guess, result } from './stores.js';

	var activeCard;
	var activeImgFilename;
	var unseenCardIds = [];

	var showUpload = false;
	var gameOver = false;

	// This function is used only one. Should it be anonymous? or moved into onMount?
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	async function getCardCount() {
		const res = await fetch('http://localhost:5000/api/card/total_count')
		const json = await res.json()
		if (json['message']=='success') {
			return(json['data']['count'])
		}		

		//WHY DOESN'T THIS WORK?
		// res.json().then(json => {
		// 	if (json['message']=='success') {
		// 		return(response['data']['count'])
		// 	}			
		// })
	}

	async function getNextCard(index) {
		const res = await fetch(`/api/card/${index}`)
		const json = await res.json()
		if (json['message']=='success') {
			activeCard = json['data']
			activeImgFilename = activeCard["img_filename"];
		}
	}

	function isGuessCorrect(submittedGuess) {
		if (submittedGuess == activeCard["building"]) {
			return true;
		} else {
			return false;
		}
	}

	function processGuess(event) {
		if (gameOver === true) {
			console.log("Game over. Cannot keep guessing");
			return;
		}
		// should I use submittedGuess or access store directly with $guess?
		let submittedGuess = event.detail.guess;
		guess.set(submittedGuess);

		let data = {
			id: activeCard["id"],
			vote: submittedGuess
		};
		fetch("http://localhost:5000/api/vote/", {
			method: "POST", 
			headers: {
      			'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(res => {
			console.log("Vote submitted! response:", res);
		});

		// this definitely needs to be cleaned up...
		setTimeout(() => result.set(isGuessCorrect(submittedGuess)), 600);
		var nextId = unseenCardIds.pop(); 
		if (nextId === undefined) {
			gameOver = true;
		} else {
			setTimeout(() => getNextCard(nextId), 1000);
		}
		setTimeout(() => {
			result.set(null)
			guess.set(null)
		}, 1200);
	}

	onMount(async function () {
		const count = await getCardCount();
		//js arrays start from 0. Database starts at 1
		unseenCardIds = [...Array(count+1).keys()]
		unseenCardIds.shift()
		shuffleArray(unseenCardIds);
		getNextCard(unseenCardIds.pop());
	})
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap" rel="stylesheet">
</svelte:head>

<div class="background">
	<div class="header">
		<h1 class="header__heading">SCHOOL or PRISON</h1>
		<h2 class="header__upload" on:click="{() => showUpload = true}">+</h2>
		<ScoreDisplay />
	</div>

		<div class="center-screen">
			{#if gameOver}
				<GameOver />
			{:else}
				<ImageCard imgFilename={activeImgFilename} on:swipe_guess={processGuess}/>
				<ResultNotification />
			{/if}
		</div>

		<div class="footer">
			<TwinButton on:button_guess={processGuess}/>
		</div>
</div>

{#if showUpload}
	<div transition:fade>
		<Modal tap_anywhere={false} on:close="{() => showUpload = false}">
			<Upload/>
		</Modal>
	</div>
{/if}

<style>
.background {
	position: fixed;
	left: 0%;
	top: 0%;
	right: 0%;
	bottom: 0%;
	margin: 0;
	padding: 0;
	background-color: #555;
}

.header {
	position: fixed;
	left: 0%;
	top: 0%;
	right: 0%;
	bottom: auto;

	height: 110px;
	z-index: 0;
}

.header__heading {
	margin-top: 12px;
	margin-bottom: 6px;

	font-family: Oswald, sans-serif;
	color: #a2a2a2;
	font-size: 20px;
	line-height: 20px;
	text-align: center;
}

.header__upload {
	position: fixed;
	margin-top: 0px;
	top: 10px;
	right: 5%;

	border-radius: 12px;
	width: 24px;
	height: 24px;

	background-color: #444;

	color: #a2a2a2;
	font-size: 20px;
	line-height: 20px;
	text-align: center;
	box-shadow: 0 1px 1px 0 hsla(0, 0%, 100%, 0.2), inset 0 1px 1px 0 rgba(0, 0, 0, 0.5);
}

.center-screen {
	position: fixed;
	top: 108px;
	bottom: 138px;
	width: 100%;
	z-index: 1;
}

.footer {
	position: fixed;
	left: 0;
	top: auto;
	right: 0;
	bottom: 0;
	height: 136px;
	z-index: 0;
}
</style>