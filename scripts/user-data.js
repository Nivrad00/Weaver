function saveStory(e) {
    console.log("IN SAVE STORY")
    e.preventDefault();
    let id = $("#save-story").data('story-id');
    let content = $('#editor').text();
    console.log("saved: id " + id);
    console.log("saved: content: " + content);

    //get the id of the current user
    const userId = firebase.auth().currentUser.uid;
    //save the story to the database under userId/stories/(id of the story)
    firebase.database().ref('users/' + userId + "/stories/" + id + '/text').set(content).catch(error => {
        console.log(error.message)
    })
}

$(document).ready(() => {
    // const saveStory = $('#save-story');
    console.log("INSIDE USERDATA>JS")

    $('#save-story').on('click', function(event) {
        saveStory(event);
    });

})