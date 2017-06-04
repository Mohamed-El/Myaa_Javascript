/*
 * Original idee by Matthew Eernisse (mde@fleegix.org)
 * 2007 Joseph Inghelbrecht CVO Deurne, www.cvodeurne.be
 * 12 juli 2007, zomer in Rièzes, de zon schijnt en de kat slaapt.
 * 1 november 2016, herfst in Les Charmontois.
 */

// De Ajax klasseconstructor:
function Ajax() {
    this.request = null;
    this.url = null;
    this.status = null;
    this.statusText = '';
    this.method = 'GET';
    this.asynchronousFlag = true;
    this.postData = null;
    this.readyState = null;
    this.responseText = null;
    this.responseXML = null;
    this.responseHandle = null;
    this.errorHandle = null;
    this.responseFormat = 'text'; // 'text', 'xml', 'object'
    this.mimeType = null;
    this.accessToken = null; // te gebruiken met oAuth
    this.contentType = 'application/x-www-form-urlencoded'; // default content-type

    // Methoden:
    // Een XMLHttpRequest object maken
    this.initialize = function() {
        if (!this.request) {
            try {
                // Probeer een object te creëren voor Firefox, Safari, IE7
                this.request = new XMLHttpRequest();
            }
            catch (e) {
                try {
                    // Probeer een object te creëren voor latere versies IE
                    this.request = new ActiveXObject('MSXML2.XMLHTTP');
                }
                catch (e) {
                    try {
                        // Probeer een object te maken met oudere versies van IE
                        this.request = new ActiveXObject('Microsoft.XMLHTTP');
                    }
                    catch (e) {
                        // Kan geen XMLHttpRequest maken
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // Een request instellen
    this.setupRequest = function() {
        // Probeer een XMLHttpRequest object aan te maken, als het niet lukt, zeg het
        // retourneer
        if (!this.initialize()) {
            alert('Het XMLHttpRequest object kan niet gecreëerd worden!');
            return;
        }
        // Een XMLHttpRequest object is met succes gecreëerd
        this.request.open(this.method, this.url, this.asynchronousFlag);
        // Making authenticated request using the request header is accessToken is set
        if (this.accessToken) {
            this.request.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
        }

        if (this.method == 'POST') {
            this.request.setRequestHeader('Content-Type', this.contentType);
        }
        var me = this; // fix loss of scope in inner function
        // Een functie toevoegen om het onreadystatechange event af te handelen
        this.request.onreadystatechange = function() {
            // handel de event af als de request volledig uitgevoerd is
            var response = null;
            if (me.request.readyState == 4) {
                // Bereid het antwoord voor in het gewenste formaat
                switch (me.responseFormat) {
                    case 'text':
                        response = me.request.responseText;
                        break;
                    case 'xml':
                        response = me.request.responseXML;
                        break;
                    case 'object':
                        response = request;
                        break;
                }
                // Als er een fout is opgetreden handel die af, in het andere geval
                // geef het antwoord door aan de functie die het antwoord afhandelt
                if (me.request.status >= 200 && me.request.status <= 299) {
                    if (!me.responseHandle) {
                        alert('Geen response handler gedefiniëerd voor dit ' +
                            'XMLHttpRequest object.');
                        return;
                    }
                    else {
                        me.responseHandle(response);
                    }
                }
                else {
                    me.errorHandle(response);
                }
            }
        };
        // Verstuur de request met de send method van het XMLHttpRequest object
        this.request.send(this.postData);
    };

    this.getRequest = function(url, handle, format, accessToken) {
        this.url = url;
        this.responseHandle = handle;
        this.responseFormat = format || 'text';
        this.accessToken = accessToken;
        this.setupRequest();
    };

    this.postRequest = function(url, postData, handle, format, contentType, accessToken) {
        this.url = url;
        this.responseHandle = handle;
        this.responseFormat = format || 'text';
        this.contentType = contentType || 'application/x-www-form-urlencoded'
        this.accessToken = accessToken;
        this.method = 'POST';
        this.postData = postData;
        this.setupRequest();
    };

    this.deleteRequest = function(url, handle, accessToken) {
        this.url = url;
        this.responseHandle = handle;
        this.accessToken = accessToken;
        this.method = 'DELETE';
        this.setupRequest();
    };

    this.errorHandle = function() {
        var errorWindow;
        // Toon een foutmelding in een popup window
        try {
            errorWindow = window.open('', 'errorWin');
            errorWindow.document.body.innerHTML = this.responseText;
        }
        // Als pop-ups in de browser geblokkeerd zijn, zeg het aan de gebruiker
        catch (e) {
            // alert('Er is een fout opgetreden, maar de foutmelding kan niet ' +
            // ' getoond worden omdat je browser pop-ups blokkeert.\n' +
            // 'Je moet pop-ups toelaten voor die Web site als je de foutmeldingen wil zien.');
            var feedback = document.getElementById('feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                document.body.appendChild(feedback);
            }
            var p = document.createElement('p');
            var textContent = document.createTextNode(this.responseText);
            p.appendChild(textContent);
            feedback.appendChild(p);
        }
    };

    // De request annuleren
    this.abort = function() {
        if (this.request) {
            this.request.onreadystatechange = function() {};
            this.request.abort();
            this.request = null;
        }
    };
}
