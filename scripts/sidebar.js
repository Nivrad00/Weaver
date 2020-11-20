/* placeholder "database" :) */

var stories = [];

const sleep = m => new Promise(r => setTimeout(r, m))

const storyTemplate = {
    id: null,
    image: null,
    title: "",
    description: "",
    content: null,
}

function modelAddStory() {
    let story = {
        ...storyTemplate
    };
    story.id = nextID;

    let imageUrl = ""
    const userId = firebase.auth().currentUser.uid
    var storageRef = firebase.storage().ref('bookIcon.png');

    let newStory =  {
        title: "Untitled " + nextID,
        description: "(description goes here)",
        content: null,
        id: nextID,
        isShared: false
    }
    
    firebase.database().ref('users/' + userId + "/stories/" + newStory.id).set(newStory).catch(error => {
        console.log(error.message)
    });
    nextID ++;

    firebase.database().ref('users/' + userId + "/nextID/").set(nextID).catch(error => {
        console.log(error.message)
    });

    imageUrl = storageRef.getDownloadURL().then(function(url) {
        //associates the image url under the user's info in the database
        firebase.database().ref('users/' + userId + "/stories/" + (nextID-2) + "/image").set(url).catch(error => {
            console.log(error.message)
        });
        newImage = true;
      }).catch(function(error) {
          console.log("ran into an error generating the image download url: ", error.message);
      });

    return story;
}

async function modelGetStory(id) {
    let story = {};
    const userId = firebase.auth().currentUser.uid;

    const data = await firebase.database().ref('users/' + userId + "/stories/" + id).once('value').then(function(snapshot) {
        story = snapshot.val()
        return story;
    }, function (errorObject) {
         console.log("The read failed: " + errorObject.code);
    })

    return story;


}

function modelDeleteStory(id) {

    const userId = firebase.auth().currentUser.uid
    firebase.database().ref('users/' + userId + "/stories/" + id).remove().catch(error => {
        console.log(error.message)
    });

}

function modelUpdateStory({id, title, description, content}) {
    if (id == undefined)
        return;
    story = {};
    story.id = id
    //get the id of the current user
    const userId = firebase.auth().currentUser.uid

    if (title != undefined) {
        story.title = title;
        firebase.database().ref('users/' + userId + "/stories/" + id + "/title").set(title).catch(error => {
            console.log(error.message)
        });
    }
    if (description != undefined) {
        story.description = description
        firebase.database().ref('users/' + userId + "/stories/" + id + "/description").set(description).catch(error => {
            console.log(error.message)
    });

    }

    // if (content)
    //     story.content = content;
    //     console.log("idi: " + id)
    //     console.log("content: " + content)
    //     firebase.database().ref('users/' + userId + "/stories/" + id + "/content").set(content).catch(error => {
    //         console.log(error.message)
    //     });

    return story;
}

var state = {
    currentSprint: null,
    selectedStory: null,
    prompt: {
        word: '',
        image: '',
        definition: '',
        attribution: ''
    }
}


function formatStoryButton(data) {
    if (!data.image) {
        return `
            <div class="story" data-story-id="${data.id}">
                <div class="story-options">
                    <a class="has-text-primary story-edit">
                        <span class="icon">
                            <i class="fas fa-edit"></i>
                        </span>
                    </a>
                    <a class="has-text-danger story-delete">
                        <span class="icon">
                            <i class="fas fa-trash"></i>
                        </span>
                    </a>                         
                </div>
                <a class="box mb-4 story-details">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">${data.title || "Untitled"}</p>
                            <p class="subtitle is-6">${data.description}</p>
                        </div>
                    </div>
                </a>
            </div>
        `   
    } else {
        return `
            <div class="story" data-story-id="${data.id}">
                <div class="story-options">
                    <a class="has-text-primary story-edit">
                        <span class="icon">
                            <i class="fas fa-edit"></i>
                        </span>
                    </a>
                    <a class="has-text-danger story-delete">
                        <span class="icon">
                            <i class="fas fa-trash"></i>
                        </span>
                    </a>                         
                </div>  
                <a class="box mb-4 story-details">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image">
                                <img src="${data.image}" class="cover" alt="${data.title || "Untitled"}">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">${data.title || "Untitled"}</p>
                            <p class="subtitle is-6">${data.description}</p>
                        </div>
                    </div>
                </a>
            </div>
        `
     }
}

function formatEditForm(data) {
    return `
        <div class="story" data-story-id="${data.id}" id="edit-form">
            <div class="box mb-4 story-details">
                <div class="field">
                    <label class="label">Cover</label>
                    <div class="file has-name is-fullwidth">
                        <div id="edit-cover-overlay">
                            <a id="remove-cover">
                                <span class="icon">
                                    <i class="fas fa-times"></i>
                                </span>
                            </a>        
                        </div>  
                        <label class="file-label">
                            <input class="file-input" type="file" accept="image/*" id="edit-cover">
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Choose a file…
                                </span>
                            </span>
                            <span class="file-name" id="cover-name">
                                ${data.imageName || "None"}
                            </span>
                        </label>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Title</label>
                    <input class="input" maxlength="60" id="edit-title" type="text" value="${data.title}">
                </div>
                    
                <div class="field">
                    <label class="label">Description</label>
                    <textarea class="textarea" maxlength="200" id="edit-description">${data.description}</textarea>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-primary" id="edit-submit">Submit</button>
                    </div>
                    <div class="control">
                        <button class="button is-primary is-light" id="edit-cancel">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `
}

function addNewStory() {
    let story = modelAddStory();
    $("#add-story").before(formatStoryButton(story));
}

async function populateStoryTab() {
    //waits until the user is logged in before retrieving data from the database
    if($('#user').data().status === undefined) {
        setTimeout(populateStoryTab, 250);
    } else {
        const userId = firebase.auth().currentUser.uid;
        const data = await firebase.database().ref('users/' + userId + '/stories').once('value').then(function(storySnapshot) {
            var snapshot = storySnapshot.val()

            if (!(snapshot == null) && !(snapshot == undefined)) {
                for (const [key, value] of Object.entries(snapshot)) {
                    let story = {
                        ...storyTemplate
                    }
                    story.id = key;
                    story.description = value.description;
                    story.image = value.image;
                    story.content = value.content;
                    story.title = value.title;
        
                    stories.push(story);
                    nextID++;
                    let storyContainer = $(formatStoryButton(story)).insertBefore('#add-story');
                    if (state.selectedStory && story.id == state.selectedStory.id) {
                        $(storyContainer).addClass("selected-story");
                    }  
                    
                }
            }
        })
    }
}

function updateStoryTab(id, title, description) {
    console.log(id);
    $(`.story[story-id="${id}"]`).find(".title").text(title);
    $(`.story[story-id="${id}"]`).find(".subtitle").text(description);
}

function setTab(tab) {
    if (tab == "stories") {
        $("#sidebar-content").empty();
        $("#sidebar-content").append(`
            <div id="story-list">
                <button id="add-story" class="button is-primary is-rounded">
                    <span class="icon has-text-white">
                        <i class="fas fa-plus"></i>
                    </span>
                    <span>NEW</span>
                </button>
            </div>
        `);
        //puts the story buttons on the sidebar
        populateStoryTab();
    }
    if (tab == "sprints") {
        
        loadSprintTab();
    }
    if (tab == "prompts") {
        $("#sidebar-content").empty();
        $("#sidebar-content").append(`
            <div id="prompt-container" class="box has-text-centered">
                <div id="prompt">
                    <figure class="image">
                        <img src="${state.prompt.image || 'images/weaver.png'}" id="prompt-image">
                    </figure>
                    <p class="is-size-7 has-text-right fine-text" id="prompt-attribution">${state.prompt.attribution}</p>
                    <p class="mt-2 is-size-3" id="prompt-text">${state.prompt.word}</p>
                    <p class="mb-2" id="prompt-definition">${state.prompt.definition}</p>
                </div>
                <p class="field">
                    <div class="control">
                        <button class="button is-primary" id="generate-prompt">New Prompt</button>
                    </div>
                </p>
            </div>
        `);

    }
}

function setTabPrompts() {
    $("#sidebar-content").empty();
}

function setTabSprints() {
    $("#sidebar-content").empty();
}

function deleteStory(deleteButton) {

    $(deleteButton).mouseleave();
    let storyButton = $(deleteButton).closest('.story');
    let id = $(storyButton).data('story-id');
    let story = modelGetStory(id);

    if (state.selectedStory && state.selectedStory.id == id) {
        resetEditor();
    }

    $("#delete-name").text(story.title || "Untitled");
    $("#delete-yes").click(() => {
        $(storyButton).remove();
        modelDeleteStory(id);
        $("#delete-confirm").css("visibility", "hidden");
        $("#delete-yes").unbind("click");
    });
    $("#delete-confirm").css("visibility", "visible");
}

function resetEditor() {
    editor.deleteText();
    $("#story-title").val("");
    $("#save-story").prop("disabled",true);
    $("#share-story").prop("disabled",true);
}

const selectStory = async function(button) {
    let storyContainer = $(button).closest('.story');
    let id = $(storyContainer).data('story-id');

    if (state.selectedStory && state.selectedStory.id == id)
        return;
    if ($(".selected-story").length) {
        let prevStoryContainer = $(".selected-story");
        $(prevStoryContainer).removeClass("selected-story");
        let prevId = $(prevStoryContainer).data('story-id');
        modelUpdateStory({
            id: prevId,
            content: editor.getContents()
        });
    }

    $(storyContainer).addClass("selected-story");

    modelGetStory(id).then(story => {
        if (story != undefined) {
            editor.setContents(story.content);
            state.selectedStory = story;
        } else {
            editor.setText("");
        }
        $("#save-story").data('story-id', id);
        $("#save-story").data('story-title', story.title)
        $("#story-title").val(story.title);
    
        updateWordcount();
        resetSprint();
    })
}

function editStory(editButton) {

    let storyButton = $(editButton).closest('.story');
    let id = $(storyButton).data('story-id');
    let story = modelGetStory(id);
    storyButton.replaceWith(formatEditForm(story));

    $("#edit-cancel").click(() => {
        let originalStory = modelGetStory(id);
        $("#edit-form").replaceWith(formatStoryButton(originalStory));
    });
    

    $("#edit-cover").on('change', function() {
        if (this.files && this.files[0]) {
            $('#cover-name').text(this.files[0].name);
            $(this).css('display', 'absolute');
            var reader = new FileReader();
            reader.onload = function (e) {
                story.image = e.target.result;
                story.imageName = $('#cover-name').text();
            }
            reader.readAsDataURL(this.files[0]);
            let file = this.files[0];
            const userId = firebase.auth().currentUser.uid
            var storageRef = firebase.storage().ref('users/'+userId+'/'+$('#cover-name').text());
            //updates the user's images in the firebaseStorage with the new image
            let imageUrl = storageRef.put(file).then(function(snapshot) {
                //creates the url used to display the image on the webpage
                imageUrl = storageRef.getDownloadURL().then(function(url) {
                    $('#edit-cover').data('imageUrl', url)
                  }).catch(function(error) {
                      console.log("ran into an error generating the image download url: ", error.message);
                  });
            });
        }
    });

    $("#edit-submit").click(() => {
        let submitStoryButton = $(editButton).closest('.story');
        let submitId = $(submitStoryButton).data('story-id');
        let updatedStory = modelUpdateStory({
            id: submitId,
            title: $("#edit-title").val(),
            description: $("#edit-description").val(),
        });
        console.log("ID in edit form submit: "+submitId);
        // let newImageUrl = "url"

        const userId = firebase.auth().currentUser.uid;
        let url = $('#edit-cover').data('imageUrl');
        console.log("url in edit-form thing is: ", url)
        if (url != undefined) {
            //associates the image url under the user's info in the database
            console.log("accidently got  in here");
            firebase.database().ref('users/' + userId + "/stories/" + id + "/image").set(url).catch(error => {
                console.log(error.message)
            });
        } else {
            firebase.database().ref('users/' + userId + "/stories/" + id).on('value', function(snapshot) {
                url = snapshot.val().image;
                // return stories;
    
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
        }
        updatedStory.image = url;
        // if (newImageUrl != "url") {
        //     updatedStory.image = newImageUrl
        // }
        
        let storyContainer = $(formatStoryButton(updatedStory)).insertBefore("#edit-form");
        $("#edit-form").remove();

        if (state.selectedStory && story.id == state.selectedStory.id)
            $(storyContainer).addClass("selected-story");
    });

    $("#remove-cover").click(function() {
        $('#edit-cover').val('');
        $('#cover-name').text("None");
        $(this).css('display', 'none');
        story.image = null;
        story.imageName = null;
    });
}


function updateWordcount() {
    let wordcount = getWordcount();
    $("#quick-wordcount").text(wordcount + (wordcount == 1 ? " word" : " words"));

    if ($("#sprint-timer").length && state.currentSprint && !state.currentSprint.finished) {
        let progress = wordcount - state.currentSprint.startWordcount;
        $("#sprint-timer-progress").text(progress);
        if (state.currentSprint.goal) {
            $("#sprint-timer-progress-bar").val(100 * progress / state.currentSprint.goal);
            if (progress >= state.currentSprint.goal)
                endSprint();
        }
    }
}

function getWordcount() {
    // this is a hacky way to turn, for example, "<div>hello</div><div>this is another line</div>" into "hello this is another line"
    // if i just tried getting using $("editor").text(), it would return "hellothis is another line" so the wordcount would be wrong
    let words = $("#editor").html().replace(/(<([^>]+)>)/ig, ' ').replace(/&nbsp;/ig, ' ').match(/\S+/g); 
    return words ? words.length : 0;
}

function startSprint() {
    state.currentSprint = {};
    state.currentSprint.timerID = setInterval(updateSprint, 1000);
    state.currentSprint.duration = Math.floor($("#edit-sprint-duration").val()) * 60 + 0.9;
    state.currentSprint.goal = Math.floor($("#edit-sprint-goal").val());
    state.currentSprint.startTime = Date.now();
    state.currentSprint.startWordcount = getWordcount();
    state.currentSprint.finished = false;

    loadSprintTab();
}

function updateSprint() {
    if (!state.currentSprint)
        return

    let secRemaining = state.currentSprint.duration - (Date.now() - state.currentSprint.startTime) / 1000;
    if ($("#sprint-timer").length) {
        $("#sprint-timer-minutes").text(secRemaining < 0 ? 0 : Math.floor(secRemaining / 60));
        $("#sprint-timer-seconds").text(secRemaining < 0 ? 0 : Math.floor(secRemaining % 60));
    }
    if (secRemaining <= 0)
        endSprint();
}

function endSprint() {
    if (!state.currentSprint)
        return

    clearInterval(state.currentSprint.timerID);
    state.currentSprint.finished = true;
    state.currentSprint.finalWordcount = getWordcount() - state.currentSprint.startWordcount;

    if ($("#sprint-timer").length)
        loadSprintTab();
}

function resetSprint() {
    if (!state.currentSprint)
        return

    clearInterval(state.currentSprint.timerID);
    state.currentSprint = null;
    
    if ($("#sprint-timer").length)
        loadSprintTab();
}

function loadSprintTab() {
    $("#sidebar-content").empty();
    if (state.currentSprint && state.currentSprint.finished) {
        $("#sidebar-content").append(`
            <div id="sprint-timer" class="box has-text-centered has-background-primary has-text-white">
                <p class="is-size-3 mb-3">All done!</h3>
                <p class="mb-5"><span id="sprint-timer-progress">${state.currentSprint.finalWordcount}</span> words</p>
                <p class="field">
                    <div class="control">
                        <button class="button is-white" id="reset-sprint">Reset</button>
                    </div>
                </div>
            </div>
        `);      
    }
    else if (state.currentSprint) {
        let secRemaining = state.currentSprint.duration - (Date.now() - state.currentSprint.startTime) / 1000;
        let minutes = secRemaining < 0 ? 0 : Math.floor(secRemaining / 60);
        let seconds = secRemaining < 0 ? 0 : Math.floor(secRemaining % 60);
        let wordcount = getWordcount() - state.currentSprint.startWordcount;
        if (state.currentSprint.goal > 0) {
            $("#sidebar-content").append(`
                <div id="sprint-timer" class="box has-text-centered">
                    <p class="mb-3"><span id="sprint-timer-minutes" class="is-size-3">${minutes}</span>m <span id="sprint-timer-seconds" class="is-size-3 ml-1">${seconds}</span>s</p>
                    <p class="mb-5">
                        <span id="sprint-timer-progress">${wordcount}</span> / ${state.currentSprint.goal} words 
                        <progress id="sprint-timer-progress-bar" class="progress is-warning" value="0" max="100"></progress>
                    </p>
                    <p class="field">
                        <div class="control">
                            <button class="button is-primary" id="reset-sprint">Cancel</button>
                        </div>
                    </p>
                </div>
            `);     
        }
        else {
            $("#sidebar-content").append(`
                <div id="sprint-timer" class="box has-text-centered">
                    <p class="mb-3"><span id="sprint-timer-minutes" class="is-size-3">${minutes}</span>m <span id="sprint-timer-seconds" class="is-size-3 ml-1">${seconds}</span>s</p>
                    <p class="mb-5">
                        <span id="sprint-timer-progress">${wordcount}</span> words 
                    </p>
                    <p class="field">
                        <div class="control">
                            <button class="button is-primary" id="reset-sprint">Cancel</button>
                        </div>
                    </p>
                </div>
            `);     

        }
    }
    else {
        $("#sidebar-content").append(`
            <div id="sprint-form" class="box">
                <div class="field">
                    <label class="label">Duration</label>
                    <div class="columns is-vcentered is-gapless">
                        <div class="column">
                            <input class="input" id="edit-sprint-duration" type="number" value="15" min="1" max="100"> 
                        </div>
                        <div class="column is-one-fifth ml-3"">
                            minutes
                        </div>
                    </div>
                </div>
                    
                <div class="field">
                    <label class="label">Word goal (optional)</label>
                    <div class="columns is-vcentered is-gapless">
                        <div class="column">
                            <input class="input" id="edit-sprint-goal" type="number" value="" min="1" max="100000"> 
                        </div>
                        <div class="column is-one-fifth ml-3"">
                            words
                        </div>
                    </div>
                </div>
    
                <div class="field">
                    <div class="control">
                        <button class="button is-primary" id="start-sprint">Sprint!</button>
                    </div>
                </div>
            </div>
        `);
    }
}

async function generatePrompt() {
    if ($("#prompt-container").length > 0) {
        $("#prompt-text").text('...');
        $("#prompt-definition").text('');
        $("#prompt-attribution").text('');
        $("#prompt-image").attr('src', '');

        let unsplash, wordnik, dictionary, definition, word, image, attribution;

        try {
            wordnik = await $.get('http://api.wordnik.com/v4/words.json/randomWords?limit=10&api_key=85r46i2i5dukj9hk1dmy0ql9m9h9gfe93tnq9r1g84pk7u057');
            
            let found = false;
            for (let data of wordnik) {
                try {
                    dictionary = await $.get(`https://api.dictionaryapi.dev/api/v2/entries/en/` + data.word);
                    definition = dictionary[0].meanings[0].definitions[0].definition;
                    word = dictionary[0].word;
                } catch {
                    continue;
                }
                found = true;
                break;
            }
            if (!found)
                $("#prompt-text").text('Couldn\'t retrieve prompt. Try again.');

            unsplash = await $.get("https://api.unsplash.com/photos/random?client_id=Zd2AWcZrAxyxixZP5Q3ks-TVRlOIvN7A33ovU-wkmyc"); 
            image = unsplash.urls.raw + '&w=300&h=200&fit=crop';
            attribution = `Photo by <a href="https://unsplash.com/@${unsplash.user.username}?utm_source=weaver&utm_medium=referral">${unsplash.user.name}</a> on <a href="https://unsplash.com/?utm_source=weaver&utm_medium=referral">Unsplash</a>`
        } 
        
        catch {
            $("#prompt-text").text('Couldn\'t retrieve prompt. Try again.');
            return;
        }

        $("#prompt-image").off('load').on('load', function() {
            $("#prompt-text").text(word);
            $("#prompt-definition").html(definition);
            $("#prompt-attribution").html(attribution);
        }).attr('src', image);

        state.prompt = {
            word: word,
            definition: definition,
            image: image,
            attribution: attribution
        }
    }
}

$(document).ready(() => {
    setTab("stories");
    updateWordcount();

    $("#sidebar-content").on("click", "#add-story", () => {
        addNewStory()
    });

    $("#sidebar-content").on("mouseover", ".story", function() { 
        $(this).children(".story-options").css("display", "inline"); 
    });

    $("#sidebar-content").on("mouseleave", ".story", function() { 
        $(this).children(".story-options").css("display", "none"); 
    });
    
    $("#sidebar-content").on("click", ".story-edit", function() { 
        editStory(this);
    });
    
    $("#sidebar-content").on("click", ".story-delete", function() { 
        deleteStory(this);
    });
    
    $("#sidebar-content").on("click", "a.story-details", function() { 
        selectStory(this);
    });
    
    $("#sidebar-content").on("click", "#start-sprint", function() { 
        startSprint();
    });

    $("#sidebar-content").on("click", "#reset-sprint", function() { 
        resetSprint();
    });
    
    $("#sidebar-content").on("click", "#generate-prompt", function() { 
        generatePrompt();
    });

    $("#delete-no").click(() => {
        $("#delete-confirm").css("visibility", "hidden");
        $("#delete-yes").unbind("click");
    });
    
    $("#editor").on("input", function() {
        updateWordcount();
    });
    
    $("#sidebar-tabs a").on("click", function() {
        $("#active-tab").parent().removeClass("is-active");
        $("#active-tab").attr("id", "");

        $(this).parent().addClass("is-active");
        $(this).attr("id", "active-tab");

        setTab($(this).data("name"));
    });

});