/* placeholder "database" :) */

var stories = [
    {
        id: 0,
        image: "images/kbxing.png",
        imageName: "kbxing.png",
        title: "Killbot Crossing",
        description: "A post-apocalyptic road trip novel. With robots!",
        text: "robots ooo"
    },
    {
        id: 1,
        image: null,
        imageName: null,
        title: "Tales from Post-War Pyrrhia",
        description: "A collection of short ficlets from Jade Mountain and beyond",
        text: "dragons rerr"
    }
]

var nextID = 2;

const storyTemplate = {
    id: null,
    image: null,
    title: "",
    description: "",
    text: "",
}

function modelAddStory() {
    let story = {
        ...storyTemplate
    };
    story.id = nextID;
    nextID ++;
    stories.push(story);
    return story;
}

function modelGetAllStories() {
    return stories;
}

function modelGetStory(id) {
    return stories.filter(s => s.id == id)[0];
}

function modelDeleteStory(id) {
    stories = stories.filter(s => s.id != id);
}

function modelUpdateStory({id, title, description, content}) {
    if (id == undefined)
        return;
    story = stories.filter(s => s.id == id)[0];
    if (title)
        story.title = title;
    if (description)
        story.description = description
    if (content)
        story.text = content;
    return story;
}

//end placeholder 




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
    } 
    else {
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
        for (let story of modelGetAllStories()) {
            let storyContainer = $(formatStoryButton(story)).insertBefore('#add-story');
            if (state.selectedStory && story.id == state.selectedStory.id) {
                $(storyContainer).addClass("selected-story");
            }           
        }
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

    $("#delete-name").text(story.title || "Untitled");
    $("#delete-yes").click(() => {
        $(storyButton).remove();
        modelDeleteStory(id);
        $("#delete-confirm").css("visibility", "hidden");
        $("#delete-yes").unbind("click");
    });
    $("#delete-confirm").css("visibility", "visible");
}

function selectStory(button) {
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
            content: $("#editor").html()
        });
    }

    $(storyContainer).addClass("selected-story");
    let story = modelGetStory(id);
    $("#editor").html(story.text);
    state.selectedStory = story;

    updateWordcount();
    resetSprint();
}

function editStory(editButton) {
    $("#edit-cancel").click();

    let storyButton = $(editButton).closest('.story');
    let id = $(storyButton).data('story-id');
    let story = modelGetStory(id);
    storyButton.replaceWith(formatEditForm(story));

    $("#edit-cancel").click(() => {
        $("#edit-form").replaceWith(formatStoryButton(story));
    });
    
    $("#edit-submit").click(() => {
        let updatedStory = modelUpdateStory({
            id: id,
            title: $("#edit-title").val(),
            description: $("#edit-description").val()
        });
        
        let storyContainer = $(formatStoryButton(updatedStory)).insertBefore("#edit-form");
        $("#edit-form").remove();

        if (state.selectedStory && story.id == state.selectedStory.id)
            $(storyContainer).addClass("selected-story");
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
        }
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
    state.currentSprint.duration = Math.floor($("#edit-sprint-duration").val()) * 60 + 0.9;
    state.currentSprint.startTime = Date.now();
    state.currentSprint.goal = Math.floor($("#edit-sprint-goal").val());
    state.currentSprint.timerID = setInterval(updateSprint, 1000);
    state.currentSprint.finished = false;
    state.currentSprint.startWordcount = getWordcount();

    loadSprintTab();
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
    // there's so many things wrong with this function, but it works
    // the random-word api was returning ridiculous obscure words
    // so i made it repeatedly call random-word until it finds a word that's in the dictionary (or 5 seconds pass)
    // then it returns the word + definition
    // it's terrible

    if ($("#prompt-container").length > 0) {
        $("#prompt-text").text('...');
        $("#prompt-definition").text('');
        $("#prompt-attribution").text('');
        $("#prompt-image").attr('src', '');

        let unsplash, dictionary, word, definition, image, attribution;
        let timeout = false;
        setTimeout(() => timeout = true, 5000);

        while (!timeout) {
            try {
                word = await $.get('https://random-word.ryanrk.com/api/en/word/random');
            } catch {
                $("#prompt-text").text('Error retrieving word.');
                return;
            }
            
            try {
                dictionary = await $.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
            } catch (e) {
                if (e.responseJSON.title == 'No Definitions Found')
                    continue;
                else {
                    $("#prompt-text").text('Error retrieving definition.');
                    return;
                }
            }

            try {
                definition = dictionary[0].meanings[0].definitions[0].definition;
            } catch {
                continue;
            }
            
            try {
                unsplash = await $.get("https://api.unsplash.com/photos/random?client_id=Zd2AWcZrAxyxixZP5Q3ks-TVRlOIvN7A33ovU-wkmyc"); 
            } catch {
                $("#prompt-text").text('Error retrieving image.');
                return;
            }

            break;
        }

        if (timeout) {
            $("#prompt-text").text('Process timed out.');
            return;
        }
            
        image = unsplash.urls.raw + '&w=300&h=200&fit=crop';
        attribution = `Photo by <a href="https://unsplash.com/@${unsplash.user.username}?utm_source=weaver&utm_medium=referral">${unsplash.user.name}</a> on <a href="https://unsplash.com/?utm_source=weaver&utm_medium=referral">Unsplash</a>`
        
        $("#prompt-image").off('load').on('load', function() {
            $("#prompt-text").text(word);
            $("#prompt-definition").text(definition);
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