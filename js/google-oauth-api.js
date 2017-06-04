function handleClientLoad() {
    // Load the API client and auth library
    gapi.load('client:auth2', initAuth);
}

function initAuth() {
    // gapi.client.setApiKey(apiKey);
    gapi.auth2.init({
            client_id: clientId,
            scope: scopes.join(' '),
            immediate: true
        }).then(function() {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        }).then(handleInitialSignInStatus);
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        signinButton.style.display = 'none';
        signoutButton.style.display = 'block';
    }
    else {
        signinButton.style.display = 'block';
        signoutButton.style.display = 'none';
        clearUserProfile();
        clearExplorer();
    }
}

function signIn(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function signOut(event) {
    gapi.auth2.getAuthInstance().signOut();
}