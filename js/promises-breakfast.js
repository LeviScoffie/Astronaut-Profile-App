const order =false;

const breakfastPromise = new Promise( (resolve, reject) => {

    setTimeout( ()=> {
       if (order) {
        resolve("Here is your Order!");
       }
       else {
        reject(Error('Oh no! There was a problem with your order.')); //changes state of pending Promise to resolved
        }
    },3000);
              
        

});

console.log(breakfastPromise)

breakfastPromise
    .then( val => {console.log(val)}) // chaining 
    .catch( (err) =>{console.log(err)}) ;