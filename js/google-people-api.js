// Load the API and make an API call.  Display the results on the screen.
function makePeopleApiCall() {
    gapi.client.load('people', 'v1', getUserProfile);
}

function getUserProfile() {
    clearUserProfile();
    // Note: In this example, we use the People API to get the current
    // user's name. In a real app, you would likely get basic profile info
    // from the GoogleUser object to avoid the extra network round trip.
    var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    setUserProfile(profile.getGivenName(), profile.getImageUrl());
}

function clearUserProfile() {
    var userProfile = document.getElementById('user-profile');
    var h1 = document.querySelector('#user-profile h1');
    if (h1) {
        h1.innerHTML = 'Myaa';
    }
    var img = document.querySelector('#user-profile img');
    if (img) {
        userProfile.removeChild(img);
    }
}

function setUserProfile(givenName, imageUrl) {
    var h1 = document.querySelector('#user-profile h1');
    if (h1) {
        h1.innerHTML = 'Myaa van ' + givenName;
    }
    else {
        h1 = document.createElement('h1');
        h1.appendChild(document.createTextNode('Myaa van ' + givenName));
        document.getElementById('user-profile').appendChild(h1);
    }
    var img = document.createElement('img');
    img.setAttribute("src", imageUrl);
    document.getElementById('user-profile').appendChild(img);
}