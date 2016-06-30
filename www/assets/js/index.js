/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
       $(parentElement).on('click', '.event', this.changePicture);

    },

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

    changePicture : function(event) {
    event.preventDefault();
    if (!navigator.camera) {
        app.showAlert("Camera API not supported", "Error");
        return;
    }
    var options =   {   quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
        targetHeight: 200,
        targetWidth: 170,
        encodingType: 0     // 0=JPG 1=PNG
    };

    navigator.camera.getPicture(
        function(imageData) {
            $('.user-image').attr('src', "data:image/jpeg;base64," + imageData);
        },
        function() {
            app.showAlert('Error taking picture', 'Error');
        },
        options);

    return false;
    }
};
