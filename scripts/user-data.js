$(function()  {

    const saveStory = $('#save-story');

    saveStory.on('click', (e) => {
        e.preventDefault();
        const storyDelta = editor.getContents();
        const title = $('#storyTitle').val();

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

    const shareStory = $('#share-story');

    shareStory.on('click', (e) => {
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

})