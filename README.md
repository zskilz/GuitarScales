# GuitarScales

Code from blog post moved to github.

# Dependencies

jQuery

# Usage

Include jQuery and guitarScales.js in your html.

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="guitarScales.js"></script>
    
Currently creates a object called 'guitarScales' from which you call the 'init' method once the dom is ready...

    <script>
        $(document).ready(guitarScales.init());
    </script>
    
It will append the guitarScales component to the body unless a jQuery selector is specified. Multiple instances not supported, so make sure your container selector returns one object.