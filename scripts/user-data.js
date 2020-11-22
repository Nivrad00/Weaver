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
    
    let description = $(`.story[data-story-id='${id}']`).find(".edit-description").val();

    if (description == "" || description == undefined) {
        description = $(`.story[data-story-id='${id}']`).find(".subtitle").text()
        if (description == "" || description == undefined) {
            description = content.ops[0].insert.slice(0, 40);
        }
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
    
    let description = $(`.story[data-story-id='${id}']`).find(".edit-description").val();

    if (description == "" || description == undefined) {
        description = $(`.story[data-story-id='${id}']`).find(".subtitle").text()
        if (description == "" || description == undefined) {
            description = content.ops[0].insert.slice(0, 40);
        }
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

    saveStory.on('click', onSaveButtonClick);

    const shareStory = $('#share-story');

    shareStory.on('click', onShareButtonClick);

    $(".modal-background, .modal-close").on("click", closeModals);
    // esc key closes modals
    $(window).on("keydown", function(event) {
        var e = event || window.event;
        if (e.keyCode === 27) {
            closeModals();
        }
    })
});
 

const closeModals = function() {
    $(document.documentElement).removeClass("is-clipped");
    $(".modal").removeClass("is-active");
}

const onSaveButtonClick = function(e) {
    $("#save-modal").addClass("is-active");
    $(document.documentElement).addClass("is-clipped");

    $("#save-yes").off().on("click", yesSave);
    $("#save-no").off().on("click", closeModals);
}

const yesSave = function(e) {
    id = $("#save-story").data('story-id');

    saveHelper(e);

    closeModals();
}

const onShareButtonClick = function(e) {
    $("#share-modal").addClass("is-active");
    $(document.documentElement).addClass("is-clipped");

    $("#share-yes").off().on("click", yesShare);
    $("#share-no").off().on("click", closeModals);
}

const yesShare = function(e) {
    id = $("#share-story").data('story-id');

    shareHelper(e);

    closeModals();

    window.location.pathname = '/hub.html';
}