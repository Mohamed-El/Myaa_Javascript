/**
 * Load Drive API client library.
 * Samples: https://advancedweb.hu/2015/05/26/accessing-google-drive-in-javascript/
 */
function makeDriveApiCall() {
    gapi.client.load('drive', 'v3', isUploadFolderPresent);
}

/**
 * This returns a promise with the result.
 * One thing we should do is to first check if the folder is present,
 * and only create it if it is not.
 * This is a simple listing with filters to the directory mime type
 * and not trashed (m.a.w. gedeleted door de gebruiker),
 * then check if there is a result.
 */
function isUploadFolderPresent() {
    return gapi.client.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    }).then(function(files) {
        showFeedback(JSON.stringify(files, 4));
        var folder = files.result.files;
        showFoldersInExplorer();
        if (folder.some(function(item) {
                return item.name === 'myap'
            })) {}
        else {
            var request = createFolder('myap');
        }
        return 'myap';
    });
}

/**
 * Drive API Helper function createFolder
 * Create a folder with the name given in the title parameter
 *
 * @param {string} title the name of the folder to be created
 */
function createFolder(title) {
    var body = {
        'title': title,
        'mimeType': "application/vnd.google-apps.folder"
    };

    var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body': body
    });

    request.execute(function(resp) {
        showFeedback(JSON.stringify(resp, 4));
        // console.log('Folder ID: ' + resp.id);
    });

}

/**
 * Drive API Helper function createFolderInParent
 * Create a folder with the name given in the title parameter
 * in the root folder (myap)
 *
 * @param {string} title the name of the folder to be created
 */
function createFolderInParent(title, parentId) {
    var body = {
        'title': title,
        'mimeType': "application/vnd.google-apps.folder",
        'parents': [{
            "id": parentId
        }]
    };

    var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'POST',
        'body': body
    });

    request.execute(function(resp) {
        showFeedback(JSON.stringify(resp, 4));
        // console.log('Folder ID: ' + resp.id);
        showFoldersInExplorer();

    });
}

/**
 * Prepare the creation of a new folder
 */
function prepareCreateFolder() {
    var folderName = document.getElementById('folderName').value;
    var pathName = 'myap';
    if (folderName.length > 0) {
        var regExpresion = new RegExp("[^a-zA-Z0-9_. ]+");
        if (regExpresion.test(folderName)) {
            alert('Ongeldige foldernaam: ' + folderName)
        }
        else {
            gapi.client.drive.files.list({
                q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false"
            }).then(function(files) {
                showFeedback(JSON.stringify(files, 4));
                var folder = files.result.files;
                // check is the folder already exists
                // names not case sensitive
                if (folder.some(function(item) {
                        return item.name.toLowerCase() === folderName.toLowerCase()
                    })) {
                    alert('Folder met de naam ' + folderName + ' bestaat al!')
                }
                else {
                    // fetch folder Id of the root map
                    var folderItem = folder.find(function(item) {
                        return item.name === pathName;
                    })
                    if (folderItem) {
                        createFolderInParent(folderName, folderItem.id);
                    };
                }
            });

        }
    }
    else {
        alert('Typ eerst een naam voor de folder in.');
    }
}

/**
 * Clear files and folders in the Explorer
 */
function clearExplorer() {
    var list = document.querySelector('#list');
    list.innerHTML = '';
    return list;
}

/**
 * Show folders in the Explorer
 */
function showFoldersInExplorer() {
    var explorer = clearExplorer();
    // if no folder info is passed get it from Google Drive API
    gapi.client.drive.files.list({
        q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    }).then(function(files) {
        folder = files.result.files;
        folder.map(function(item) {
            var p = document.createElement('p');
            var textContent = document.createTextNode(item.name);
            p.appendChild(textContent);
            explorer.appendChild(p);
        });
    })
}

/**
 * Show files in the Explorer
 */
function showFilesInExplorer() {
    var explorer = clearExplorer();
    // if no folder info is passed get it from Google Drive API
    // id, name, kind and mimeType are the only possible values
    // you can ommit altogether the fields property
    gapi.client.drive.files.list({
         'pageSize': 100,
         'fields': "nextPageToken, files(id, name, kind, mimeType)"
    }).then(function(files) {
        showFeedback(JSON.stringify(files, 4));
        folder = files.result.files;
        folder.map(function(item) {
            var p = document.createElement('p');
            var textContent = document.createTextNode(item.name);
            p.appendChild(textContent);
            explorer.appendChild(p);
        });
    })
}