<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    const inParams = {
        duration: 200,
        easing: cubicOut,
        y: -10,
    };

    var cardCount = "";
    var voteCount = "";

    export let showUpload;

    onMount(async function () {
        const card_res = await fetch(
            process.env.URL_ORIGIN + "/api/card/total_count"
        );
        const card_json = await card_res.json();
        if (card_json["message"] == "success") {
            cardCount = card_json["data"]["count"];
        }
        const vote_res = await fetch(
            process.env.URL_ORIGIN + "/api/vote/total_count"
        );
        const vote_json = await vote_res.json();
        if (vote_json["message"] == "success") {
            voteCount = vote_json["data"]["count"];
        }
    });
</script>

<style>
    p {
        font-family: Montserrat, sans-serif;
        font-size: 18px;
        color: #a2a2a2;
        text-align: center;
        margin: 10px 0px;
    }
    h2 {
        font-family: Oswald, sans-serif;
        font-size: 22px;
        color: white;
        text-align: center;
        margin: 0px 0px;
    }
    .center {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 80%;
        transform: translate(-50%, -50%);
    }
    .button__upload {
        margin: 10px auto;

		border-radius: 12px;
		width: 200px;
		height: 32px;

		background-color: #444;

        color: #a2a2a2;
        font-size: 20px;
		line-height: 32px;
		text-align: center;
		box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5),
            inset 0 1px 1px 0 hsla(0, 0%, 100%, 0.2);
            
        cursor: pointer;
	}
</style>

{#if cardCount && voteCount}
    <div class="center" in:fly={inParams}>
        <h2>Thank you for playing!</h2>
        <p>Your votes have been recorded. So far we have</p>
        <h2>{cardCount} buildings</h2>
        <h2>{voteCount} votes</h2>
        <p>It doesn't seem fair to rank just yet.</p>
        <h2>
            Help us grow. Share your score with your friends.
        </h2>
        <h2 class="button__upload" on:click={() => (showUpload = true)}>Submit a building</h2>
    </div>
{/if}
