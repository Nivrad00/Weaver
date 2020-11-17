function saveHelper(e) {
    e.preventDefault();

    let id = $("#save-story").data('story-id');

    const userId = firebase.auth().currentUser.uid;

    // get Delta content object (holds text + text formatting)
    let content = editor.getContents();

    let description = content.ops[0].insert.slice(0, 40);

    let title = $("#story-title").val();
    if (title == "") {
        title = "untitled";
    }

    if (id === undefined) {
        // if story does not yet have id...

        id = nextID;
        updateStoryTab(id, title, description);

        firebase.database().ref('users/' + userId + "/stories/" + id).push({
            content: content,
            title: title,
            isShared: false,
            description: description,
            id: id
        }).catch(error => {
            console.log(error.message)
        }).then(newRef => {
            id = newRef.id;
            firebase.database().ref('users/' + userId + "/stories/" + id + "/id").set(id);
        })

    } else {
        updateStoryTab(id, title, description);
        //save the story to the database under userId/stories/(id of the story)
        firebase.database().ref('users/' + userId + "/stories/" + id).update({
            description: description,
            id: id,
            content: content,
            title: title,
            isShared: false
        }).catch(error => {
            console.log(error.message)
        })
    }
}

function shareHelper(e) {
    e.preventDefault();

    const id = $("#save-story").data('story-id');

    const userId = firebase.auth().currentUser.uid;

    let title = $("#story-title").val();
    if (title == "") {
        title = "untitled" + id;
    }

    if (id === undefined) {
        //if no story is selected... need to handle this case?
        console.log("no story selected")
    } else {
        firebase.database().ref('users/' + userId + "/stories/" + id).update({
            description: description,
            id: id,
            content: content,
            title: title,
            isShared: true
        }).catch(error => {
            console.log(error.message)
        })
    }
}

$(function() {

    const saveStory = $('#save-story');

    saveStory.on('click', saveHelper);

    const shareStory = $('#share-story');

    shareStory.on('click', shareHelper);
});
 