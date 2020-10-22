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


    // auth state change listener
    auth.onAuthStateChanged(user => {
        console.log('auth state changed')
        if (user !== null) {
            console.log('user logged in')
            let displayName = user.displayName;
            let email = user.email;
            let emailVerified = user.emailVerified;
            let photoURL = user.photoURL;
            let isAnonymous = user.isAnonymous;
            let uid = user.uid;
            let providerData = user.providerData;

        } else {
            console.log('user not logged in')

            // if user not logged in, do not allow access to index.html
            let defaultPage = window.location.pathname
            if (defaultPage.includes("index.html") || defaultPage === "/") {
                window.location.href="user_access.html";
            }
            
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
            window.location.href='index.html';
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
            window.location.href='index.html';
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
            window.location.href='user_access.html';
        }).catch(error => {
            console.log('Logout Error: ' + error);
        })
    })

    
})