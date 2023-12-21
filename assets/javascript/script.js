//Global Variables
const schedulerName = 'work-day-scheduler'; //Used for the writeLocalStorage and readLocalStorage functions -- object name

$(function () { // Call to jQuery to ensure that the code isn't run until the browser has finished rendering all the elements in the html.

  // Add a listener for click events on the save button.
  $('button[aria-label="save"]').on("click", handleSave);

  // Applies the past, present, or future class to each time block by comparing the id to the current hour. 
  const currHour = setInterval(getCurrentHour, 5000);
    
  // Gets any user input that was saved in localStorage and set the values of the corresponding textarea elements.
  loadText();
  
  // Display the current date in the header of the page.
  $('#currentDay').text(dayjs().format('dddd, MMMM DD'));

});

//Functions to be called inside the above jQuery check if loaded function.

function getCurrentHour() {
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
  var currObject = readLocalStorage(storageItem);

  if(typeof storageObject !== 'object') { console.log("writeLocalStorage: Invalid type submitted."); return }
  currObject.push(storageObject)

  console.log('writeLocalStorage | ' + storageItem);
  console.log('writeLocalStorage | ' + JSON.stringify(storageObject));

  localStorage.setItem(storageItem, JSON.stringify(currObject))
}

function handleSave(event) {
  console.log("Function handleSave: " + event.currentTarget);
  console.log("Function handleSave: " + event.currentTarget.dataset.index);

  let currIndex = event.currentTarget.dataset.index;
  let txtAr = 'textarea[data-index="' + currIndex + '"]';
  let eventText = $(txtAr).val();

  let data = { //Stores the hour and event in an object
    hour: event.currentTarget.dataset.index,
    text: eventText
  }

  //Calls function to write to local storage
  writeLocalStorage(schedulerName, data)
}

function loadText() {
  //Loads the text into the proper textarea
  let objHours = readLocalStorage(schedulerName);

  objHours.forEach((element) => {
    $('textarea[data-index="' + element.hour + '"]').val(element.text);
  });
}