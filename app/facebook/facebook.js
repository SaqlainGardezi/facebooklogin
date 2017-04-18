'use strict';

angular.module('ngSocial.facebook', ['ngRoute','ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'FacebookCtrl'
  });
}])
.config( function($facebookProvider){
    $facebookProvider.setAppId('1403033816385174');
    $facebookProvider.setPermissions("email, public_profile, user_posts,publish_actions, user_photos");
})

.run(function($rootScope){
     (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk')); 
})

.controller('FacebookCtrl', ['$scope','$facebook', function($scope, $facebook) {
    $scope.isLoggedIn=false;

    $scope.login=function(){
        $facebook.login().then(function(){
            $scope.isLoggedIn=true;
            refresh();
        });
    };

    $scope.logout=function(){
        $facebook.logout().then(function(){
            $scope.isLoggedIn=false;

                        $scope.posts=null;
            refresh();
        });
    };


    function refresh(){
        $facebook.api('/me?fields=first_name, last_name,  email, gender, locale, link').then(function(response){
            $scope.welcomeMsg= "Welcome " + response.first_name + " " + response.last_name;
            $scope.isLoggedIn=true;
            $scope.userInfo=response;

                        console.log("response in posts is :: "+ response.id);
            $facebook.api('/me/picture').then(function(response){
                $scope.picture=response.data.url;
                
                 $facebook.api('/me/permissions').then(function(response){
                     $scope.permissions=response.data;
                    console.log("response in permission is :: "+ response.data);
                   $facebook.api('/me/posts').then(function(response){
                        $scope.posts=response.data;
                        console.log("response in posts is :: "+ response.data);
                    });
                 });
            });
        },
        function(err){
            $scope.welcomeMsg="Please Log In";
        });
    }

    $scope.postStatus=function(){
        var body=this.body;
        $facebook.api('/me/feed', 'post', {message:body}).then(function(response){
            $scope.msg="Thanks for Posting";
            refresh();
        });
    };
    refresh();
}]);