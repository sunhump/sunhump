// npm packages
import jQuery from 'jquery';

// Foundation - Uncomment to use foundation
// import Foundation from 'foundation-site';

// components
import MyCustomTodoComponent from './components/c-todo/c-todo';

'use strict';
module.exports = (() => {
    window.jQuery = window.jQuery || jQuery;
    window.$ = window.jQuery;
    
    // Foundation - Uncomment to use foundation
    // Foundation.addToJquery(jQuery);
    
    jQuery(document).ready(() => {

        // Framework

        // Foundation - Uncomment to use foundation
        // jQuery(document).foundation();

        // init
        MyCustomTodoComponent.init();
    });
});