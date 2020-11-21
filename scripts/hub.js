const hubSetup = async function() {

    getStories().then(stories => stories.forEach(story => createStoryCard(story)))

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

    /*$("#hubStories").append($("<div>").addClass("storyCard").append(
        $("<h1>").addClass("title is-4").text(title)).append(
            $("<p>").addClass("subtitle is-5").text(description)
    ))*/

    if (!story.image) {
        $("#hubStories").append(`
            <div class="storyCard" data-story-id="${story.id}">
                <div class="media">
                    <div class="media-content">
                        <p class="title is-4">${story.title || "Untitled"}</p>
                        <p class="subtitle is-6">${story.description}</p>
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
                            <a class="author">${story.author}</a>
                        </div>
                    </div>
                </div>
            </div>
        `)
     }
}




$(function() {
    hubSetup();
})