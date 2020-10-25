/* placeholder "database" :) */
var stories = [
    {
        id: 0,
        image: "images/kbxing.png",
        imageName: "kbxing.png",
        title: "Killbot Crossing",
        description: "A post-apocalyptic road trip novel. With robots!"
    },
    {
        id: 1,
        image: null,
        imageName: null,
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
            <div class="box mb-4  story-details">
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
    let story = {
        ...storyTemplate
    };
    story.id = nextID;
    nextID ++;
    stories.push(story);
    $("#add-story").before(formatStoryButton(story));
}

function setTab(tab) {
    $("#sidebar-content").empty();
    if (tab == "stories") {
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
        for (let story of stories) {
            $("#add-story").before(formatStoryButton(story));
        }
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

        console.log($("#edit-cover").files);
        if ($("#edit-cover").files && $("#edit-cover").files[0]) {
        }
        
        $("#edit-form").replaceWith(formatStoryButton(story));
    });

    $("#edit-cover").on('change', function() {
        console.log(this);
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
    let words = $("#editor").text().match(/\S+/g);
    let wordcount = words ? words.length : 0;
    $("#quick-wordcount").text(wordcount + (wordcount == 1 ? " word" : " words"));
}

$(document).ready(() => {
    setTab("stories");
    updateWordcount();

    $("#sidebar-content").on("click", "#story-list #add-story", () => {
        addNewStory()
    });

    $("#sidebar-content").on("mouseover", "#story-list .story", function() { 
        $(this).children(".story-options").css("display", "inline"); 
    });

    $("#sidebar-content").on("mouseleave", "#story-list .story", function() { 
        $(this).children(".story-options").css("display", "none"); 
    });
    
    $("#sidebar-content").on("click", "#story-list .story .story-options .story-edit", function() { 
        editStory(this);
    });
    
    $("#sidebar-content").on("click", "#story-list .story .story-options .story-delete", function() { 
        deleteStory(this);
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