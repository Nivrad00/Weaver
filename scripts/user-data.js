$(function()  {

    const saveStory = $('#save-story');

    saveStory.on('click', (e) => {
        e.preventDefault();
        const story = $('#editor').text();
        const title = $('#storyTitle').val();
        //get the id of the current user
        const userId = firebase.auth().currentUser.uid

        //this is what adds the story to the database
        //it points to the users directory under Weaver-Users, and 
        firebase.database().ref('users/' + userId + "/stories/" + title).set(story).catch(error => {
            console.log(error.message)
        });

        console.log("\"" + title + "\" saved successfully!")
    })

})