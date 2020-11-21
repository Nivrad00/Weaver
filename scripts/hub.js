let contentReader;

const hubSetup = async function() {

    getStories().then(stories => stories.forEach(story => createStoryCard(story)));

    $(".modal-background, .modal-close").on("click", closeModals);
    // esc key closes modals
    $(window).on("keydown", function(event) {
        var e = event || window.event;
        if (e.keyCode === 27) {
            closeModals();
        }
    })

    var contentReaderOptions = {
        debug: 'info',
        modules: {
            toolbar: false,
        },
        readOnly: true,
        theme: 'snow'
    };

    contentReader = new Quill('#story-contents', contentReaderOptions);

}

const sharedStoryTemplate = {
    id: null,
    image: null,
    title: "",
    description: "",
    content: null,
    author: ""
}


const getStories = async function() {
    let stories = [];
    const data = await firebase.database().ref('/users').once('value').then(function(usersSnapshot) {
        var snapshot = usersSnapshot.val()

        for (const [key, value] of Object.entries(snapshot)) {
            var userStories = value.stories;
            var user = value.username;
            if (!(userStories == undefined) && !(userStories == null)) {
                for (const [key, value] of Object.entries(userStories)) {
                    if (value.isShared) {
                        let story = {
                            ...sharedStoryTemplate
                        }   
                        // key is the id of the story.  Each story id has values: title, description, text, image, isShared, id
                        story.id = value.id;
                        story.image = value.image;
                        story.title = value.title;
                        story.description = value.description;
                        story.content = value.content;
                        story.author = user;

                        stories.push(story);
                    }
                }
            }
        }
        console.log(stories);
        return stories;
    })
    return stories;
}

const createStoryCard = function(story) {
    if (!story.image) {
        $("#hubStories").append(`
            <div class="storyCard" data-story-id="${story.id}">
                <div class="level">
                    <div class="media-content">
                        <p class="title is-5">${story.title || "Untitled"}</p>
                        <p class="description">${story.description}</p>
                    </div>
                </div>
                <div class="level level-author line-top">
                    <div class="level-left">
                        <div class="level-item">
                            <a class="author"><i class="user-icon fas fa-user"></i>${story.author}</a>
                        </div>
                    </div>
                </div>
            </div>
        `)
    } else {
        $("#hubStories").append(`
            <div class="storyCard" data-story-id="${story.id}">
                <div class="level">
                    <div class="media-left">
                        <figure class="image">
                            <img src="${story.image}" class="cover" alt="${story.title || "Untitled"}">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-5">${story.title || "Untitled"}</p>
                        <p class="description">${story.description}</p>
                    </div>
                </div>
                <div class="level level-author line-top">
                    <div class="level-left">
                        <div class="level-item">
                            <a class="author"><i class="user-icon fas fa-user"></i>${story.author}</a>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    $(`.storyCard[data-story-id="${story.id}"]`).on("click", {story: story}, handleStoryClick);
}

const handleStoryClick = function(info) {
    story = info.data.story;

    $("#story-read-modal").addClass("is-active");
    $(document.documentElement).addClass("is-clipped");

    $("#story-read-details").remove();

    $("#story-contents").before(`
        <div id="story-read-details">
            <div class="level">
                <div class="media-left">
                    <figure class="image">
                        <img src="${story.image}" class="cover" alt="${story.title || "Untitled"}">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-3">${story.title || "Untitled"}</p>
                    <span class="author">By: <a class="author">${story.author}</a></span>
                    <p class="description">${story.description}</p>
                </div>
            </div>
            <div class="level line-top">
                <div class="">
            </div>
        </div>
    `)

    contentReader.setContents(story.content);
}

const closeModals = function() {
    $(document.documentElement).removeClass("is-clipped");
    $(".modal").removeClass("is-active");
}




$(function() {
    hubSetup();
})