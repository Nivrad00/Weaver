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
                        stories.push([key, value.body]);
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
    let title = story[0];
    let body = story[1];

    console.log(title, body);

    $("#hubStories").append($("<div>").addClass("storyCard").append(
        $("<h1>").addClass("title is-3").text(title)).append(
            $("<p>").addClass("subtitle is-5").text(body)
    ))
}





$(function() {
    hubSetup();
})