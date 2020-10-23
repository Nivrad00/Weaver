$(function() {

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyA55m9t04M6qN6bx5rZ63Swmq-j_WJkyns",
        authDomain: "weaver-users.firebaseapp.com",
        databaseURL: "https://weaver-users.firebaseio.com",
        projectId: "weaver-users"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();

    //status change
    auth.onAuthStateChanged(user => {
        if (!user) {
            console.log('No user logged in');
            let defaultPage = window.location.pathname;
            console.log(defaultPage);
            if (!defaultPage.includes('index')) {
                window.location.href='index.html';
            }
            //clear user info field
            $('#user').text('');
        }else {
            console.log('User logged in');
            //set user info in home page after log in
            $('#user').text(user.email);
        }
    })

    //Creating new users
    const signup = $('#signupbtn');

    signup.on('click', (e) => {
        e.preventDefault();

        const email = $('#loginEmail').val();
        const password = $('#loginPwd').val();

        
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            console.log(cred.user);
            window.location.href='home.html';
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
            window.location.href='home.html';
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
            window.location.href='index.html';
        }).catch(error => {
            console.log('Logout Error: ' + error);
        })
    })

    
})