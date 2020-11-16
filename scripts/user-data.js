function saveHelper(e) {
    e.preventDefault();
    let id = $("#save-story").data('story-id');
    let content = $('#editor').text();

    const userId = firebase.auth().currentUser.uid;

    if (id === undefined) {
        //if no story is selected... need to handle this case?
        console.log("no story selected")
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
        //if no story is selected... need to handle this case?
        console.log("no story selected")
    } else {
        firebase.database().ref('users/' + userId + "/stories/" + id + "/isShared").set(true).catch(error => {
            console.log(error.message)
        });
    }
}

$(function() {

    const saveStory = $('#save-story');

    saveStory.on('click', saveHelper);

    const shareStory = $('#share-story');

    shareStory.on('click', shareHelper);

    //------------------------------ Code from the pull ------------------------------------
    //----------------------------------------V---------------------------------------------
    
    //Incompatible with the database structure/how story data is stored.  The code above has the same functionality (save and share),
    //but I did not want to delete this code below in case it might still be needed -Catherine

    //temp
    const saveOther = $('#otherSave');

    //uncalled
    saveOther.on('click', (e) => {
        e.preventDefault();
        let story = $('#editor').text();
        let title = $('#storyTitle').val();

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
                firebase.database().ref('users/' + userId + "/stories/" + title + "/body").set(story).catch(error => {
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
            firebase.database().ref('users/' + userId + "/stories/" + title + "/body").set(story).catch(error => {
                console.log(error.message)
            });
            firebase.database().ref('users/' + userId + "/stories/" + title + "/isShared").set(true).catch(error => {
                console.log(error.message)
            });

            console.log("\"" + title + "\" saved successfully!")
        }
    })


    //temp
    const shareStoryOther = $('#otherShare')

    //uncalled
    shareStoryOther.on('click', (e) => {
        e.preventDefault();
        const story = $('#editor').text();
        let title = $('#storyTitle').val();

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
                firebase.database().ref('users/' + userId + "/stories/" + title + "/body").set(story).catch(error => {
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
            firebase.database().ref('users/' + userId + "/stories/" + title + "/body").set(story).catch(error => {
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
 