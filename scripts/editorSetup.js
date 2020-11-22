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

let matcher = function (node, delta) {
    console.log(node.innerText);
    var plaintext = node.innerText
    var Delta = Quill.import('delta')
    return new Delta().insert(plaintext)
};

var options = {
    debug: 'info',
    modules: {
        toolbar: toolbarOptions,
        clipboard: {
            matchers: [
                [Node.ELEMENT_NODE, matcher]
            ]
        }
    },
    placeholder: 'Compose a story...',
    theme: 'snow'
};
        
var editor = new Quill('#editor', options);
