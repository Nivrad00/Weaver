function saveHelper(e) {
    e.preventDefault();

    let id = $("#save-story").data('story-id');

    const userId = firebase.auth().currentUser.uid;

    // get Delta content object (holds text + text formatting)
    let content = editor.getContents();

    let title = $("#story-title").val();
    if (title == "") {
        title = $("#save-story").data('story-title');
        if (title == "") {
            title = "untitled";
        }
    }

    if (id === undefined) {
        id = nextID;
    }
    
    let description = $(`.story[data-story-d='${id}']`).find(".edit-description").val();

    if (description == "" || description == undefined) {
        description = content.ops[0].insert.slice(0, 40);
    }

    updateStoryTab(id, title, description);

    firebase.database().ref('users/' + userId + "/stories/" + id + "/content").set(content);
    firebase.database().ref('users/' + userId + "/stories/" + id + "/description").set(description);
    firebase.database().ref('users/' + userId + "/stories/" + id + "/title").set(title);
    firebase.database().ref('users/' + userId + "/stories/" + id + "/id").set(id);
    
    let hasBeenShared = false;
    firebase.database().ref('users/' + userId + "/stories/" + id + "/isShared").once('value').then(function(isSharedSnapshot) {
        hasBeenShared = hasBeenShared || isSharedSnapshot.val();
        firebase.database().ref('users/' + userId + "/stories/" + id + "/isShared").set(hasBeenShared);
    });
}

function shareHelper(e) {
    e.preventDefault();

    let id = $("#save-story").data('story-id');

    const userId = firebase.auth().currentUser.uid;

    // get Delta content object (holds text + text formatting)
    let content = editor.getContents();

    let title = $("#story-title").val();
    if (title == "") {
        title = $("#save-story").data('story-title');
        if (title == "") {
            title = "untitled";
        }
    }

    if (id === undefined) {
        id = nextID;
    }
    
    let description = $(`.story[data-story-d='${id}']`).find(".edit-description").val();

    if (description == "" || description == undefined) {
        description = content.ops[0].insert.slice(0, 40);
    }

    updateStoryTab(id, title, description);

    firebase.database().ref('users/' + userId + "/stories/" + id + "/content").set(content);
    firebase.database().ref('users/' + userId + "/stories/" + id + "/description").set(description);
    firebase.database().ref('users/' + userId + "/stories/" + id + "/title").set(title);
    firebase.database().ref('users/' + userId + "/stories/" + id + "/id").set(id);
    firebase.database().ref('users/' + userId + "/stories/" + id + "/isShared").set(true);

}

$(function() {

    const saveStory = $('#save-story');

    saveStory.on('click', saveHelper);

    const shareStory = $('#share-story');

    shareStory.on('click', shareHelper);
});
 