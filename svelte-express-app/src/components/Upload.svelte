<script>
    import { fade } from "svelte/transition";

    let building = "SCHOOL";
    let country = "";
    let city = "";
    let files = null;
    let source = "";

    let submitted = false;

    async function handleSubmit() {
        const formData = new FormData();
        formData.append("building", building);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("source", source);
        formData.append("image", files[0]);

        fetch(
 + "/api/card", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("Success:", result);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        submitted = true;

        building = "PRISON";
        country = "";
        city = "";
        files = null;
        source = "";
    }

    function submitAnother() {
        submitted = false;
    }
</script>

<style>
    .info-card {
        width: 80vw;
        border-radius: 14px;
        color: #d4d4d4;
        background-color: #292929;
        padding: 1em;
        font-family: Montserrat, sans-serif;
        transition: max-height 0.25s ease-in;
    }

    .radio-fieldset {
        position: relative;
        height: 40px;
        background-color: #a2a2a2;

        border: 1px solid #cccccc;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 100%, 0.2),
            inset 0 1px 1px 0 rgba(0, 0, 0, 0.5);

        margin: 6px 0px;
        border-radius: 6px;
    }

    input[type="radio"] {
        width: 0px;
        height: 0px;
        display: none;
        pointer-events: none;
    }

    label.radio {
        position: relative;
        color: #eeeeee;
        float: left;
        width: 50%;
        text-align: center;
        line-height: 40px;
        z-index: 2;
    }

    #slider {
        position: absolute;
        margin-left: 2%;
        left: 0%;
        top: 5px;
        z-index: 9;
        height: 30px;
        width: 46%;
        border-color: #cacaca;
        z-index: 1;
        border-radius: 3px;
        box-shadow: -3px -2px 4px 0 hsla(0, 0%, 85.1%, 0.34),
            3px 12px 16px 0 rgba(0, 0, 0, 0.35);
        transition: background-color 0.5s, left 0.5s;
    }

    #school:checked ~ #slider {
        left: 0%;
        background-color: hsl(15, 86%, 53%);
    }
    #prison:checked ~ #slider {
        left: 50%;
        background-color: #1f3e4b;
    }

    input[type="text"] {
        background-color: #a2a2a2;
        border-radius: 6px;
        margin: 6px 0px;
        width: 100%;

        border: 1px solid #cccccc;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 100%, 0.2),
            inset 0 1px 1px 0 rgba(0, 0, 0, 0.5);
    }

    input[type="file"] {
        background-color: #a2a2a2;
        border-radius: 6px;
        margin: 6px 0px;
        width: 100%;
        border: 1px solid #cccccc;
        box-shadow: 0 1px 1px 0 hsla(0, 0%, 100%, 0.2),
            inset 0 1px 1px 0 rgba(0, 0, 0, 0.5);
    }

    button {
        margin: 8px 0px 0px 0px;
        background-color: white;
        position: relative;
        left: 20%;
        width: 60%;
    }

    h1 {
        text-align: center;
        margin-top: 0px;
        color: #d4d4d4;
        font-family: "Trebuchet MS", sans-serif;
        font-size: 18px;
    }

    p {
        text-align: center;
        font-size: 14px;
    }

    .link {
        color: rgb(157, 157, 245);
        text-decoration: underline;
    }
</style>

<div class="info-card">
    {#if submitted}
        <div in:fade>
            <h1>Thank you for your submission!</h1>
            <p>
                It may take a few days before you are able to find your
                submission here. Each entry is inspected by highly skilled
                architects who dissect images for signs of hospitals, care
                homes, offices and homes.
            </p>
            <p class="link" on:click={submitAnother}>Feed our architects.</p>
        </div>
    {:else}
        <div in:fade>
            <h1>Submit a building near you!</h1>
            <form
                enctype="multipart/form-data"
                method="post"
                on:submit|preventDefault={handleSubmit}>
                <div class="radio-fieldset">
                    <label for="school" class="radio">SCHOOL</label>
                    <input
                        id="school"
                        type="radio"
                        bind:group={building}
                        value={'SCHOOL'} />
                    <label for="prison" class="radio">PRISON</label>
                    <input
                        id="prison"
                        type="radio"
                        bind:group={building}
                        value={'PRISON'} />
                    <span id="slider" />
                </div>

                <label for="country">
                    Country
                    <input
                        required
                        type="text"
                        id="country"
                        bind:value={country} />
                </label>

                <label for="city">
                    City
                    <input required type="text" id="city" bind:value={city} />
                </label>

                <label for="image">
                    Upload a picture
                    <input
                        accept="image/png, image/jpeg"
                        bind:files
                        id="image"
                        name="image"
                        type="file" />
                </label>

                <label for="source">
                    Where did you get this picture?
                    <input
                        type="text"
                        id="source"
                        placeholder="optional"
                        bind:value={source} />
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    {/if}
</div>
