//Global Variables
const schedulerName = 'work-day-scheduler'; //Used for the writeLocalStorage and readLocalStorage functions -- object name
const alertMsg = $('#system-msg');

$(function () { 
  // Call to jQuery to ensure that the code isn't run until the browser has 
  // finished rendering all the elements in the html.

  // Add a listener for click events on the save button.
  $('button[aria-label="save"]').on("click", handleSave);

  // Applies the past, present, or future class to each time block by comparing the id to the current hour. 
  const currHour = setInterval(setHourClass, 5000);
    
  // Gets any user input that was saved in localStorage and set the values of the corresponding textarea elements.
  loadText();
  
  // Display the current date in the header of the page.
  const currDay = setInterval(updateCurrDay, 100000);
});

//Functions to be called inside the above jQuery check if loaded function.
function updateCurrDay() {
  $('#currentDay').text(dayjs().format('dddd, MMMM DD'));
}

function setHourClass() {
  //Used to get the current hour & color the chart
  let currHour = dayjs().format('H');

  //Loops through the valid hours for the scheduler
  for(let i=9; i<=17; i++) {
    if(currHour == i) { //Adds present class and remvoes future & past
        $('#hour-' + i).addClass('present').removeClass('future past');
    } else if (currHour < i) { //Adds future class and remvoes present & past
        $('#hour-' + i).addClass('future').removeClass('present past');
    } else { //Adds past class and remvoes future & present
        $('#hour-' + i).addClass('past').removeClass('future present');
    }
  }
}

function runOnceStart() {
  //Called in body onload
  setHourClass();
  updateCurrDay();
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

function writeLocalStorage(storageItem, storageObject, overwrite) {
  //Function to write to LocalStorage
  var currObject = readLocalStorage(storageItem);

  //Validation if the passed variable is an object for storageObject
  if(typeof storageObject !== 'object') { console.log("writeLocalStorage: Invalid type submitted."); return }

  if(overwrite === true) { // Do we want to overwrite a key in the array? True/False
    currObject.forEach((element, x) => { // Loop through each part of the array
        var objKey = element.hour;
        var objSome = Object.entries(element);

        if(objKey == storageObject.hour) { //Checks if the element.hour is the same value as storageObject.hour
            console.log("Removing: " + element.hour + " - " + element.text);
            currObject.splice(x,1) //Removes the duplicate key
        }
    })
}

    //Set Alert Message
    alertMsg.text('Successfully saved!');
    alertMsg.addClass('show').removeClass('hide');

  //Adds storageObject to the end of the array
  currObject.push(storageObject)

  console.log('writeLocalStorage | ' + storageItem);
  console.log('writeLocalStorage | ' + JSON.stringify(storageObject));

  //Saves item to local storage
  localStorage.setItem(storageItem, JSON.stringify(currObject))
}

function handleSave(event) {
  console.log("handleSave | Clicked on " + event.currentTarget); //Verifies what the user clicked on
  console.log("handleSave | data-index is " + event.currentTarget.dataset.index); //Gets the value of data-index and logs it

  let currIndex = event.currentTarget.dataset.index;
  let txtAr = 'textarea[data-index="' + currIndex + '"]'; //Get the textarea with the data-index
  let eventText = $(txtAr).val();

  let data = { //Stores the hour and event in an object
    hour: currIndex,
    text: eventText
  }

  //Calls function to write to local storage
  writeLocalStorage(schedulerName, data, true)

  setTimeout(() => {
    alertMsg.addClass('hide').removeClass('show');
  }, 3000);
}

function loadText() {
  //Loads the text into the proper textarea
  let objHours = readLocalStorage(schedulerName);

  objHours.forEach((element) => {
    $('textarea[data-index="' + element.hour + '"]').val(element.text);
  });
}