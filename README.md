Q1. The slice function returns a specified range of values from an array witout changing the original array. the splice function changes the original array. The splice method can add or remove items from an array returning the items that were removed from the array if there were any.

Q2. The three states of a promise are pending, fulfilled, and rejected. pending is the state that occurs when the promise is created and is waiting for something to happen. fulfilled and rejected are the end states of a promise representing success and failure of the function return.
    Promise chaining is calling promises from a promise using .then() allowing multiple asyncronous functions to be called in order. 
    example:
    
    let promise1 = anAsyncronousFunction();
    let promise2 = foo();
    let promise3 = bar();
    result = promise().then(promise2).then(promise3).catch(failure);
    //the result is the result after each promise is completed.
    
Q3. CRUD represents the 4 basic database manipulations those being: Create, Read, Update, and Delete. In Express these are: POST, GET, PUT, and DELETE. In SQL these are: INSERT INTO VALUES, SELCET FROM WHERE, UPDATE SET WHERE, and DELETE FROM WHERE.