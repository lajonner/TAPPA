/**
 * cordova Maginsoft FileChooser plugin
 */


var app = {
    initialize: function (callback) {
        this.bindEvents();
        callback();
    },    
    // Bind Event Listeners 
    // 
    // Bind any events that are required on startup. Common events are: 
    // 'load', 'deviceready', 'offline', and 'online'. 
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event 
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
      //  if (device.platform == 'android' || device.platform == 'Android') {
            //alert("Register called");
            //tu Project ID aca!! 
//            pushNotification.register(this.successHandler, this.errorHandler, { "senderID": PROJECT_ID_GOOGLE, "ecb": "app.onNotificationGCM" });
    //    }
  //      else {
            //alert("Register called");
  //          pushNotification.register(this.successHandler, this.errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "app.onNotificationAPN" });
//        }
    },
    // result contains any message sent from the plugin call 
    successHandler: function (result) {
        //alert('Callback Success! Result = ' + result)
    },
    errorHandler: function (error) {
        alert(error);
    }
    
};