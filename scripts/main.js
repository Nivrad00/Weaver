$(document).ready(() => {
    console.log('hello?.');

    $("#add-story").click(() => {
        $("#add-story").before(`
            <a class="box mb-4">
                <div class="media">
                    <div class="media-content">
                        <p class="title is-4">Title</p>
                        <p class="subtitle is-6">Description</p>
                    </div>
                </div>
            </a>
        `);
    });

});