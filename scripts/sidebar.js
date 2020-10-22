/* placeholder "database" :) */
var stories = [
    {
        id: 0,
        image: "kbxing.png",
        title: "Killbot Crossing",
        description: "A post-apocalyptic road trip novel. With robots!"
    },
    {
        id: 1,
        image: null,
        title: "Tales from Post-War Pyrrhia",
        description: "A collection of short ficlets from Jade Mountain and beyond"
    }
]

var nextID = 2;

const storyTemplate = {
    id: null,
    image: null,
    title: "",
    description: "",
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
                                <img src="images/${data.image}" class="cover" alt="${data.title || "Untitled"}">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">${data.title}</p>
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
            <div class="box mb-4  story-details">
                <div class="field">
                    <label class="label">Cover</label>
                    <div class="file">
                        <label class="file-label">
                            <input class="file-input" type="file" name="resume" id="edit-cover">
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Choose a file…
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Title</label>
                    <input class="input" id="edit-title" type="text" value="${data.title}">
                </div>
                    
                <div class="field">
                    <label class="label">Description</label>
                    <textarea class="textarea" id="edit-description">${data.description}</textarea>
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
    $("#edit-cancel").click();
    let story = {
        ...storyTemplate
    };
    story.id = nextID;
    nextID ++;
    stories.push(story);
    $("#add-story").before(formatStoryButton(story));
}

function addAllStories() {
    for (let story of stories) {
        $("#add-story").before(formatStoryButton(story));
    }
}

function deleteStory(deleteButton) {
    $(deleteButton).mouseleave();
    let storyButton = $(deleteButton).closest('.story');
    let id = $(storyButton).data('story-id');
    let story = stories.filter(s => s.id == id)[0];

    $("#delete-name").text(story.title || "Untitled");
    $("#delete-yes").click(() => {
        $(storyButton).remove();
        stories = stories.filter(s => s.id != id);
        $("#delete-confirm").css("visibility", "hidden");
        $("#delete-yes").unbind("click");
    });
    $("#delete-confirm").css("visibility", "visible");
}

function editStory(editButton) {
    $("#edit-cancel").click();

    let storyButton = $(editButton).closest('.story');
    let id = $(storyButton).data('story-id');
    let story = stories.filter(s => s.id == id)[0];
    storyButton.replaceWith(formatEditForm(story));

    $("#edit-cancel").click(() => {
        $("#edit-form").replaceWith(formatStoryButton(story));
    });
    
    $("#edit-submit").click(() => {
        story.title = $("#edit-title").val();
        story.description = $("#edit-description").val();
        $("#edit-form").replaceWith(formatStoryButton(story));
    });
}

$(document).ready(() => {
    addAllStories();

    $("#add-story").click(() => {
        addNewStory()
    });

    $("#story-list").on("mouseover", ".story", function() { 
        $(this).children(".story-options").css("display", "inline"); 
    });

    $("#story-list").on("mouseleave", ".story", function() { 
        $(this).children(".story-options").css("display", "none"); 
    });
    
    $("#story-list").on("click", ".story .story-options .story-edit", function() { 
        editStory(this);
    });
    
    $("#story-list").on("click", ".story .story-options .story-delete", function() { 
        deleteStory(this);
    });
    
    $("#delete-no").click(() => {
        $("#delete-confirm").css("visibility", "hidden");
        $("#delete-yes").unbind("click");
    });
});