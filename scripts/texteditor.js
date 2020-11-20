$(function() {
    $("#save-story").prop("disabled",true);
    $("#share-story").prop("disabled",true);
})



var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];

var options = {
    debug: 'info',
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'Compose a story...',
    theme: 'snow'
};
        
var editor = new Quill('#editor', options);

editor.on('editor-change', function(eventName) {
    if (editor.getLength() > 1) {
        $("#save-story").prop("disabled",false);
        $("#share-story").prop("disabled",false);
    } else {
        $("#save-story").prop("disabled",true);
        $("#share-story").prop("disabled",true);
    }

});