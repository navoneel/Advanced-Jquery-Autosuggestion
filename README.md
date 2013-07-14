Advanced-Jquery-Autosuggestion
==============================

A Jquery plugin built over Jquery-UI Autosuggestion


Features:
--------
* Multiple word auto-suggestion.
* Auto-suggestion in any caret position - at the end of text or in-between texts.
* Multiple line support.
* Inbuilt auto height adjustable contenteditable div

Demo
----
Please see a [demo](http://htmlpreview.github.io/?https://github.com/navoneel/Advanced-Jquery-Autosuggestion/blob/master/example.html) here.

Usage:
-----
For Default behaviour - without any options :

    <body>
    Enter you text here
    <div class="textarea" contenteditable="true"></div>
    </body>
    
    <script>
      $(document).ready( function() {
      $('.textarea').advancedautosuggestion();
    });
    </script>


Options:
-------
* tagsreturnedfromServer - Array of suggestions from which user would choose.
* customstyle - style of the tagged content.

Example:
    
     $('.textarea').advancedautosuggestion(   
        tagsreturnedfromServer: [
                        "example.com",
                        "akamai.com",
                        "2charts.com",
                        "gmail.com",
                        "jquery.com",
                        "yahoo.com",
                        "ymail.com",
                        "hotmail.com"
                    ],
        
        customstyle: 'color:green'
        
    );

CREDITS
=======
advancedAutoSuggestion.js - [Navoneel Pal](https://github.com/navoneel)

LICENSE
=======
MIT
