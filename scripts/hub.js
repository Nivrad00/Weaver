const hubSetup = async function() {

    getStories().then(stories => stories.forEach(story => createStoryCard(story)))

}


const getStories = async function() {
    let stories = [];
    const data = await firebase.database().ref('/users').once('value').then(function(usersSnapshot) {
        var snapshot = usersSnapshot.val()

        for (const [key, value] of Object.entries(snapshot)) {
            var userStories = value.stories;
            if (!(userStories == undefined) && !(userStories == null)) {
                for (const [key, value] of Object.entries(userStories)) {
                    if (value.isShared) {
                        //key is the id of the story.  Each story id has values: title, description, text, image, isShared, id
                        stories.push([key, value.title, value.text]);
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
    let title = story[1];
    let body = story[2];

    console.log(title, body);

    $("#hubStories").append($("<div>").addClass("storyCard").append(
        $("<h1>").addClass("title is-3").text(title)).append(
            $("<p>").addClass("subtitle is-5").text(body)
    ))
}





$(function() {
    hubSetup();
})