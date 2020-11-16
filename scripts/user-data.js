import {modelAddStory} from "./sidebar.js";

function saveHelper(e) {
    e.preventDefault();
    let id = $("#save-story").data('story-id');
    let content = $('#editor').text();

    const userId = firebase.auth().currentUser.uid;

    if (id === undefined) {
        //if no story is selected...
        console.log("no story selected")
        modelAddStory();
    } else {
        //save the story to the database under userId/stories/(id of the story)
        firebase.database().ref('users/' + userId + "/stories/" + id + '/text').set(content).catch(error => {
            console.log(error.message)
        })
    }
}

function shareHelper(e) {
    e.preventDefault();
    let id = $("#save-story").data('story-id');
    const userId = firebase.auth().currentUser.uid;

    if (id === undefined) {
        //if no story is selected...
        modelAddStory();
    } else {
        firebase.database().ref('users/' + userId + "/stories/" + id + "/isShared").set(true).catch(error => {
            console.log(error.message)
        });
    }

    console.log("story: ", id, " is now shared to the hub");
}

$(function() {

    const saveStory = $('#save-story');

    saveStory.on('click', saveHelper);

    const shareStory = $('#share-story');

    shareStory.on('click', shareHelper);

    //------------------------------ Code from the pull ------------------------------------
    //----------------------------------------V-------------------------------------------

    const saveOther = $('#otherSave');

    saveOther.on('click', (e) => {
        e.preventDefault();
        let id = $("#save-story").data('story-id');
        let story = $('#editor').text();
        let title = $('#storyTitle').val();

        //changed 'body' to 'text' in database to work with the sidebar code

        //get the id of the current user
        const userId = firebase.auth().currentUser.uid;
        console.log(title);

        if (title == null || title == undefined || title == "") {
            var numUntitled;
            firebase.database().ref('users/' + userId + "/numUntitled").once('value').then(function(snapshot) {
                numUntitled = snapshot.val()
                title = "untitled" + numUntitled;
                numUntitled++;
                firebase.database().ref('users/' + userId + "/numUntitled").set(numUntitled).catch(error => {
                    console.log(error.message)
                });
                 //this is what adds the story to the database
                //it points to the users directory under Weaver-Users, and 
                firebase.database().ref('users/' + userId + "/stories/" + title + "/text").set(story).catch(error => {
                    console.log(error.message)
                });
                firebase.database().ref('users/' + userId + "/stories/" + title + "/isShared").set(true).catch(error => {
                    console.log(error.message)
                });

                console.log("\"" + title + "\" saved successfully!")
            })
        } else {
             //this is what adds the story to the database
            //it points to the users directory under Weaver-Users, and 
            firebase.database().ref('users/' + userId + "/stories/" + title + "/text").set(story).catch(error => {
                console.log(error.message)
            });
            firebase.database().ref('users/' + userId + "/stories/" + title + "/isShared").set(true).catch(error => {
                console.log(error.message)
            });

            console.log("\"" + title + "\" saved successfully!")
        }
    })



    const shareStoryOther = $('#otherShare')

    shareStoryOther.on('click', (e) => {
        e.preventDefault();
        const story = $('#editor').text();
        let title = $("#save-story").data('story-title');
        let id = $("#save-story").datat('story-id');
        // let title = $('#storyTitle').val();

        //get the id of the current user
        const userId = firebase.auth().currentUser.uid

        if (title == null || title == undefined || title == "") {
            var numUntitled = 0;
            firebase.database().ref('users/' + userId + "/numUntitled").once('value').then(function(snapshot) {
                numUntitled = snapshot.val()
                if (numUntitled == null) {
                    numUntitled = 0;
                }
                title = "untitled" + numUntitled;
                numUntitled++;
                firebase.database().ref('users/' + userId + "/numUntitled").set(numUntitled).catch(error => {
                    console.log(error.message)
                });
                 //this is what adds the story to the database
                //it points to the users directory under Weaver-Users, and 
                firebase.database().ref('users/' + userId + "/stories/" + title + "/text").set(story).catch(error => {
                    console.log(error.message)
                });
                firebase.database().ref('users/' + userId + "/stories/" + title + "/isShared").set(true).catch(error => {
                    console.log(error.message)
                });

                console.log("\"" + title + "\" saved successfully!")
            })
        } else {
             //this is what adds the story to the database
            //it points to the users directory under Weaver-Users, and 
            firebase.database().ref('users/' + userId + "/stories/" + title + "/text").set(story).catch(error => {
                console.log(error.message)
            });
            firebase.database().ref('users/' + userId + "/stories/" + title + "/isShared").set(true).catch(error => {
                console.log(error.message)
            });

            console.log("\"" + title + "\" saved successfully!")
        }
    })

// }
})
 