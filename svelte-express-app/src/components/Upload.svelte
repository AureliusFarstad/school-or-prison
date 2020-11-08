<script>  
let building;
let country;
let city;
let files;
let source=""
;

async function handleSubmit() {
    const formData = new FormData();
    formData.append("building", building);
    formData.append("country", country);
    formData.append("city", city);
    formData.append("source", source)
    formData.append("image", files[0]); //why index?

    fetch('http://localhost:5000/api/card', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}
</script>

<div class="info-card">
    <!-- TODO: Show success statement upon submit (with submit another button to restart)-->
    <h1>Form</h1>
    <form enctype="multipart/form-data" method="post" on:submit|preventDefault="{handleSubmit}">
        <label for="SCHOOL">
            School
            <input type=radio bind:group={building} value={"SCHOOL"}>
        </label>
        
        <label for="PRISON">
            Prison
            <input type=radio bind:group={building} value={"PRISON"}>
        </label>
        
        <label for="country">
            Country
            <input required type="text" id="country" bind:value={country} />
        </label>

        <label for="city">
            City
            <input required type="text" id="city" bind:value={city} />
        </label>

        <label for="source">
            Source
            <input type="text" id="source" placeholder="optional" bind:value={source} />
        </label>

        <label for="image">
            Upload a picture:
            <input
                accept="image/png, image/jpeg"
                bind:files
                id="image"
                name="image"
                type="file"
            />
        </label>

        <button type="submit">Submit new building</button>
    </form>
</div>

<style>
    /* TODO: Styling */
    .info-card {
        width: auto;
        padding: 0.85em;
        background-color: #19323C;
        border-radius: 2em;
        color: #C5DDE7;
    }

    h1 {
        text-align: center;
        color: #C5DDE7;
        font-family: "Trebuchet MS", sans-serif;
        font-size: 18px;
    }
</style>