define([ 'controllers/footer', 'controllers/header', 'controllers/main', 'controllers/test' ],
function(footer, header, main, test) {

	// angular ui router accepts only functions, not simply names of controllers

   return {
       'footer': footer,
       'header': header,
       'main': main,
       'test': test
   };

});