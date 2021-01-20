// So what to do about it ?

// Well, you can use the hack the author suggests in the link I gave you. In summary, for people in a hurry, he uses an event to run a callback function when the script is loaded. So you can put all the code using the remote library in the callback function. For example:

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
// Then you write the code you want to use AFTER the script is loaded in a lambda function:

var myPrettyCode = function() {
   // Here, do whatever you want
};
// Then you run all that:

loadScript("my_lovely_script.js", myPrettyCode);
// Note that the script may execute after the DOM has loaded, or before, depending on the browser and whether you included the line script.async = false;. There's a great article on Javascript loading in general which discusses this.