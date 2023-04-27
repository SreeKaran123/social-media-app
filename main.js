// Importing the functions from the other files
const { function1 } = require('./app.js');
const { function2 } = require('./auth.js');
const { function3 } = require('./user.js');
const { function4 } = require('./post.js');
// Calling the imported functions
function1(); // logs 'Hello from function1!'
function2(); // logs 'Hello from function2!'
function3(); // logs 'Hello from function3!'
function4(); // logs 'Hello from function4!'
