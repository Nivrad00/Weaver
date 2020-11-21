var nextID = 1;

let storageRef;
let bookImageURL;
let userId;

$(function () {

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyA55m9t04M6qN6bx5rZ63Swmq-j_WJkyns",
        authDomain: "weaver-users.firebaseapp.com",
        databaseURL: "https://weaver-users.firebaseio.com",
        storageBucket: "gs://weaver-users.appspot.com",
        projectId: "weaver-users"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();
    var data = firebase.database();
    // var storage = firebase.storage();

    //acess the user database
    // const database = firebase.database();
    // const users = database.ref("weaver-users");

    //status change
    auth.onAuthStateChanged(user => {
        if (!user) {
            console.log('No user logged in');
            let defaultPage = window.location.pathname;
            console.log(defaultPage);
            if (!defaultPage.includes('index')) {
                window.location.href = 'index.html';
            }
            //clear user info field
            $('#user').text('');
        } else {
            console.log('User logged in');
            //set user info in home page after log in
            $('#user').text(user.email);
            $('#user').data("status", "ready");
            userId = firebase.auth().currentUser.uid;
            storageRef = firebase.storage().ref('bookIcon.png');
            storageRef.getDownloadURL().then(function(url) {
                bookImageURL = url;
            });
            // get nextID value
            firebase.database().ref('users/' + userId + "/nextID").once('value').then(function(snapshot) {
                nextID = snapshot.val();
                if (nextID == undefined) {
                    nextID = 1;
                }
            })
        }
    })

    //Creating new users
    const signup = $('#signupbtn');

    signup.on('click', (e) => {
        e.preventDefault();

        const email = $('#loginEmail').val();
        const password = $('#loginPwd').val();
        //temp user Id for testing
        const userId = $('#loginEmail').val();


        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            console.log(cred.user);
            window.location.href = 'home.html';
            const userId = cred.user.uid;
            const userName = email.substr(0, email.indexOf('@'));

            function writeUserData(userId, name, email, stories) {
                firebase.database().ref('users/' + userId).set({
                    username: name,
                    email: email,
                    stories: stories,
                    nextID: 1
                });
            }
            writeUserData(userId, userName, email, {});
            // alert(cred.user);
        }).catch(error => {
            console.log('Signup error: ' + error);
            $("#loginmsg").html(`<span style="color:red">${error.message}</span>`)
        })
    })


    //Logging in
    const login = $('#loginbtn');

    login.on('click', (e) => {
        e.preventDefault();

        const email = $('#loginEmail').val();
        const password = $('#loginPwd').val();


        auth.signInWithEmailAndPassword(email, password).then(cred => {
            console.log(cred.user);
            window.location.href = 'home.html';
        }).catch(error => {
            console.log('Login error: ' + error);
            $("#loginmsg").html(`<span style="color:red">${error.message}</span>`)

        })
    })


    //Logging out
    const logout = $('#Logout');

    logout.on('click', (e) => {
        e.preventDefault();

        auth.signOut().then(cred => {
            console.log('Signed Out');
            window.location.href = 'index.html';
        }).catch(error => {
            console.log('Logout Error: ' + error);
        })
    })

    // Get a database reference to our blog




    // var usersRef = ref.child("data");
    //     users.set({
    //     testUserOne: {
    //         date_of_birth: "June 23, 1912",
    //         full_name: "test One"
    //     },
    //     secondTest: {
    //         date_of_birth: "December 9, 1906",
    //         full_name: "Second Test"
    //     }
    // })


})

// handle Forgot Password link
$('#forgot-password').on('click', function () {

    // create modal for reset
    let resetModel =
        `<div id="reset-modal" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Weaver Login</p>
                    <button class="delete" id="reset-close" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="content">
                        <span>Enter a valid email address. An Email will be sent to reset your password.</span>
                        <div class="">
                            <form action="" class="box has-background-grey-lighter">
                                <div class="field">
                                    <label for="" class="label">Email</label>
                                    <div class="control has-icons-left">
                                        <input id="reset-email" type="email" placeholder="e.g. abc@gmail.com" class="input" required>
                                        <span class="icon is-small is-left">
                                            <i class="fa fa-envelope"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="field">
                                    <button id="reset-pwd-button" class="button is-success">Submit</button>
                                </div>
                            </form>
                        </div>
                    <div>
                </section>
            </div>
        </div>`

    // append modal to root div and activate to display
    $('#root').append(resetModel)
    $('#reset-modal').addClass("is-active")

    // register handler for reset modal close button
    $("#reset-close").on('click', closeModal);

    // register handler for reset button
    $("#reset-pwd-button").off('click')
    $("#reset-pwd-button").on('click', function () {
        // alert('reset button clicked')

        // get email from the modal and send to firebase. Firebase sends email to reset password.
        const resetEmail = $('#reset-email').val();
        const auth = firebase.auth();
        auth.sendPasswordResetEmail(resetEmail).then(function () {
            console.log('email sent')
        }).catch(function (error) {
            console.log(error)
        });

        // close modal
        closeModal()
    })
})

// close modal
const closeModal = () => {
    $(".modal").removeClass("is-active");
    $(".modal").remove()
}

// handle user info update
$('#user').on('click', function () {

    // get logged in user
    let user = firebase.auth().currentUser;

    // create modal
    let userModal =
        `<div id="user-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Weaver Login</p>
                <button class="delete" id="user-close" aria-label="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="content">
                    <div class="">
                        <form action="" class="box has-background-grey-lighter">
                            
                            <div class="field">
                                <label for="" class="label">Email</label>
                                <div class="control has-icons-left">
                                    <input id="user-update-email" type="email" value="${user.email}" class="input" required>
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-envelope"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="field">
                                <label for="" class="label">Password</label>
                                <div class="control has-icons-left">
                                    <input id="user-update-password" type="password" placeholder="password" class="input" required>
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-lock"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="field">
                                <button id="user-update" class="button is-success">Update</button>
                                <button id="user-delete" class="button is-success">Delete</button>
                            </div>
                        </form>
                    </div>
                <div>
            </section>
        </div>
    </div>`

    // append modal to root div and activate
    $('#root').append(userModal)
    $('#user-modal').addClass("is-active")

    // register handler for the modal close button
    $("#user-close").on('click', closeModal);

    // register handler for the modal update button
    $("#user-update").off('click')
    $("#user-update").on('click', function () {
        // alert('user update button clicked')

        // get email and password from the modal
        const userEmail = $('#user-update-email').val();
        const userPwd = $('#user-update-password').val();

        // get current logged in user
        let user = firebase.auth().currentUser;

        // update user email address
        if (user.email !== userEmail) {
            user.updateEmail(userEmail).then(function () {
                console.log('user email updated')
                // display email and update message 
                $('#user').text(user.email);
                $('#user-msg').text('User Updated')
            }).catch(function (error) {
                console.log(error)
            });
        }

        // update user password
        if (userPwd !== "") {
            user.updatePassword(userPwd).then(function () {
                console.log('password updated')
                // display update message
                $('#user-msg').text('User Updated')
            }).catch(function (error) {
                console.log(error)
            });
        }

        // close modal
        closeModal()
    })

    //register handler for delete account button
    $("#user-delete").off('click');
    $('#user-delete').on('click', function () {

        let main_user = firebase.auth().currentUser;

        main_user.delete().then(function () {
            window.location.href = 'index.html';
            // console.log('Delete successful');
        }).catch(function (error) {
            // console.log(error);
        })

        closeModal()
    })
})

// Google login
$('#googlebtn').on('click', function () {
    // alert('google')

    let provider = new firebase.auth.GoogleAuthProvider();

    // firebase.auth().signInWithRedirect(provider).then(function (result) {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // Google Access Token to access the Google API.
        let token = result.credential.accessToken;
        // The signed-in user info
        let user = result.user
        // redirect to home page
        window.location.href = 'home.html'
    }).catch(function (error) {
        let errorCode = error.code
        let errorMessage = error.message
        console.log(errorMessage)

        // email used to login
        let email = error.email

        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential
    });

})

// Twitter login
$('#twitterbtn').on('click', function () {
    // alert('twitter')
    // needs twitter app registration, API key, API secret
})