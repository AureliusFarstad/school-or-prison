<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	import ScoreDisplay from "./components/ScoreDisplay.svelte";
	import ImageCard from "./components/ImageCard.svelte";
	import ResultNotification from "./components/ResultNotification.svelte";
	import TwinButton from "./components/TwinButton.svelte";

	import Modal from "./components/Modal.svelte";
	import Upload from "./components/Upload.svelte";
	import Error from "./components/Error.svelte";
	import GameOver from "./components/GameOver.svelte";

	import { guess, result } from "./stores.js";

	onMount(async function () {
		// Construct shuffled array of id's to query database
		const count = await getCardCount();
		// js arrays start from 0. Database starts at 1
		unseenCardIds = [...Array(count + 1).keys()];
		unseenCardIds.shift();
		shuffleArray(unseenCardIds);
		await getNextCard();
	});

	let activeCard;
	let activeImgFilename;
	let unseenCardIds = [];

	let showUpload = false;
	let gameOver = false;
	let requestFailed = false;

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	async function getCardCount() {
		const res = await fetch(process.env.URL_ORIGIN + "/api/card/total_count");
		const json = await res.json();
		if (json["message"] == "success") {
			return json["data"]["count"];
		}
	}

	async function fetchCard(index) {
		const res = await fetch(process.env.URL_ORIGIN + `/api/card/${index}`);
		if (!res.ok) {
			requestFailed = true;
			// better way to throw error?
		}
		requestFailed = false;
		const card = await res.json();
		return card;
	}

	async function getNextCard() {
		let nextId = unseenCardIds.pop();
		if (nextId === undefined) {
			gameOver = true;
			setTimeout(() => { //finish final animations
				$result = null;
				$guess = null;
			}, 2000);
			return;
		}
		fetchCard(nextId).then((json) => {
			activeCard = json["data"];
			activeImgFilename = activeCard["img_filename"];
			return;
		});
	}

	let animationDone = {
		// 0 = animating, 1 = done
		ImageCard: 1,
		TwinButton: 1,
	};

	function processGuess(event) {
		if ($guess !== null) {
			console.log("Guess is active. Cannot receive new guess.");
			return;
		}
		if (gameOver === true) {
			console.log("Game over. Cannot keep guessing.");
			return;
		}

		// Set guess and result. Store subscribers will initiate component animations.
		let submittedGuess = event.detail;
		$guess = submittedGuess;
		$result = $guess == activeCard["building"];

		// Some component animations block interaction. Dispatches will notify their completion.
		animationDone.TwinButton = 0;
		animationDone.ImageCard = 0;

		// Submit vote
		// TODO: fetches in parallel? .then()? or make async?
		let data = {
			id: activeCard["id"],
			vote: submittedGuess,
		};
		fetch(process.env.URL_ORIGIN + "/api/vote/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then((res) => {
			//todo: error
			console.log("Vote submitted! response:", res);
		});
		getNextCard();
	}

	function showNextCard(event) {
		animationDone[event.detail] = 1;
		if (animationDone.ImageCard && animationDone.TwinButton) {
			$result = null;
			$guess = null;
		}
	}
</script>

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
		line-height: 22px;
		text-align: center;
		box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5),
            inset 0 1px 1px 0 hsla(0, 0%, 100%, 0.2);

		cursor: pointer;
	}

	.center-screen {
		position: fixed;
		top: 108px;
		bottom: 95px;
		width: 100%;
		z-index: 1;
	}

	.footer {
		position: fixed;
		left: 0;
		top: auto;
		right: 0;
		bottom: 0;
		height: 95px;
		z-index: 0;
	}
</style>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap"
		rel="stylesheet" />
	<link
		href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap"
		rel="stylesheet" />
</svelte:head>

<div class="background">
	<div class="header">
		<h1 class="header__heading">SCHOOL or PRISON</h1>
		<h2 class="header__upload" on:click={() => (showUpload = true)}>+</h2>
		<ScoreDisplay />
	</div>

	<div class="center-screen">
		{#if gameOver}
			<GameOver bind:showUpload={showUpload}/>
		{:else}
			<ImageCard
				imgFilename={activeImgFilename}
				on:swipe_guess={processGuess}
				on:image_loaded={showNextCard} />
			<ResultNotification />
		{/if}
		{#if requestFailed}
			<Error />
		{/if}
	</div>

	{#if !gameOver}
		<div class="footer" transition:fade>
			<TwinButton
				on:button_guess={processGuess}
				on:animation_done={showNextCard} />
		</div>
	{/if}
</div>

{#if showUpload}
	<div transition:fade>
		<Modal tap_anywhere={false} on:close={() => (showUpload = false)}>
			<Upload />
		</Modal>
	</div>
{/if}
