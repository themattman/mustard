// Load the SDK's source Asynchronously
// Note that the debug version is being actively developed and might 
// contain some type checks that are overly strict. 
// Please report such bugs using the bugs tool.
(function(d, debug){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
   ref.parentNode.insertBefore(js, ref);
 }(document, /*debug*/ false));

window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId      : '508101062566302', // App ID from the App Dashboard
    status     : true, // check the login status upon init?
    cookie     : true, // set sessions cookies to allow your server to access the session?
    xfbml      : true  // parse XFBML tags on this page?
  });

  $("#login").click(function() {
    fbLogin(FB);
  });

  

  FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // user is good to go
    setUserInfo(FB, response);
    $("#noteformform").show();
    $("#login").hide();

  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
    $("#noteform").hide();
    $("#login").show();
  } else {
    // the user isn't logged in to Facebook.
    $("#noteform").hide();
    $("#login").show();
  }
 });

}

function fbLogin(FB) {
    FB.login(function(response) {
     if (response.authResponse) {
        // logged in
        setUserInfo(FB, response);
        $("#noteform").show();
        $("#login").hide();

     } else {
        $("#noteform").hide();
        $("#login").show();
     }
   });
  };


function setUserInfo(FB, response) {

  window.fb = {
      id: response.authResponse.userID,
      token: response.authResponse.accessToken
  };

  FB.api('/me', function(response) {
    fb.name = response.name;
    fb.user = response.username;

    $(".fbName").html(response.name);
   
   console.log('Good to see you, ' + response.name + '.');
  });
}