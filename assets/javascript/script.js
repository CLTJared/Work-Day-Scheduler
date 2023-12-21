//Global Variables
const schedulerName = 'work-day-scheduler'; //Used for the writeLocalStorage and readLocalStorage functions -- object name

$(function () { // Call to jQuery to ensure that the code isn't run until the browser has finished rendering all the elements in the html.
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
    const currHour = setInterval(getCurrentHour, 5000);

  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  // buttons have aria-label="save" in common
  let btnSave = $('[aria-label="save"]');
    btnSave.on("click", handleSave);
  
  // Display the current date in the header of the page.
  $('#currentDay').text(dayjs().format('dddd, MMMM DD'));

});

//Functions to be called inside

function getCurrentHour() {
  //Used to get the current hour
  console.log(dayjs().format('H'));
}

function readLocalStorage(storageItem) {
  //Function to read the local storage with passed object name
  let tempStorage = JSON.parse(localStorage.getItem(storageItem));
  //Debug testing for if it's an object/array
  console.log("readLocalStorage | Not an Object: " + !tempStorage);

  if(!tempStorage) { tempStorage = []; localStorage.setItem(storageItem, JSON.stringify(tempStorage)); } 
  console.log("readLocalStorage | " + JSON.stringify(tempStorage));
  //Function returns the local storage object
  return tempStorage;
}

function writeLocalStorage(storageItem, storageObject) {
  //Function to write to LocalStorage
  var currObject = readLocalStorage(lsName);

  if(typeof storageObject !== 'object') { console.log("writeLocalStorage: Invalid type submitted."); return }
  currObject.push(storageObject)

  console.log('writeLocalStorage | ' + storageItem);
  console.log('writeLocalStorage | ' + JSON.stringify(storageObject));

  localStorage.setItem(storageItem, JSON.stringify(currObject))
}

function handleSave(event) {
  console.log(event.target);
}