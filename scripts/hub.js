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
                        story.id = value.id;
                        story.image = value.image;
                        story.title = value.title;
                        story.description = value.description;
                        story.content = value.content;
                        story.author = user;
                        //key is the id of the story.  Each story id has values: title, description, text, image, isShared, id
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
    //story id is story[0]
    let title = story.title;
    let description = story.description;

    console.log(title, description);

    $("#hubStories").append($("<div>").addClass("storyCard").append(
        $("<h1>").addClass("title is-4").text(title)).append(
            $("<p>").addClass("subtitle is-5").text(description)
    ))
}





$(function() {
    hubSetup();
})