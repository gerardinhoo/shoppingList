// Get the elements needed for submitting the form
const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearItem = document.querySelector('#clear');
const filterItem = document.querySelector('#filter');
const formBtn = document.querySelector('button');
let isEditMode = false;


const displayItems = () => {
   const itemsFromStorage = getItemsFromStorage();
   itemsFromStorage.forEach((item) => addItemToDOM(item));
   checkUI();
}

const onAddItemSubmit = (e) => {
  e.preventDefault();

// Input validation
  const newItem = itemInput.value;
  if(newItem === '') {
   console.log('Please add an item');
   return;
  }

 // Add item to DOM
   addItemToDOM(newItem);
 
// Add item to local storage
   addItemToStorage(newItem)

   checkUI();

   itemInput.value = '';
}

function addItemToDOM(item) {
   // Create list item
   const li = document.createElement('li');
   li.appendChild(document.createTextNode(item));
   
   const button = createButton('remove-item btn-link text-red');
   li.appendChild(button);
   
   // Add li to the DOM
   itemList.appendChild(li);
}

function createButton(classes){
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
   const icon = document.createElement('i');
   icon.className = classes;
   return icon;
}

function addItemToStorage(item) {
   const itemsFromStorage = getItemsFromStorage();

   // Add new item to array
   itemsFromStorage.push(item);

   // Convert to JSON string and set to local storage
   localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
   let itemsFromStorage;
   if(localStorage.getItem('items') === null) {
      itemsFromStorage = [];
   } else {
      itemsFromStorage = JSON.parse(localStorage.getItem('items'));
   }
   return itemsFromStorage;
}

function onClickItem(e) {
   if(e.target.parentElement.classList.contains('remove-item')) {
     removeItem(e.target.parentElement.parentElement)
   } else {
     setItemToEdit(e.target);
   }
}

function setItemToEdit(item) {
   isEditMode = true;

   itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
   item.classList.add('edit-mode');
   formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
   formBtn.style.backgroundColor = 'green';
   itemInput.value = item.textContent;
}

function removeItem(item) {
   if(confirm('Are you sure?')) {
      // Remove item from DOM
      item.remove();

      // Remove item from storage
      removeItemFromStorage(item.textContent);

      checkUI();
   }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  
 // Filter out item removed 
   itemsFromStorage = itemsFromStorage.filter(i => i !== item);

// Reset to local storage
   localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearAllItems () {
   while(itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
   }
   checkUI();
   
   // clear from local storage
   localStorage.removeItem('items');
}

function filterItems(e) {
   const items = itemList.querySelectorAll('li');
   const text = e.target.value.toLowerCase()
   
   items.forEach((item) => {
      const itemName = item.firstChild.textContent.toLocaleLowerCase();

      if(itemName.indexOf(text) != -1) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none'
      }
   })
}

function checkUI() {
   const items = itemList.querySelectorAll('li');
   
  if(items.length === 0) {
     clearItem.style.display = 'none';
     filterItem.style.display = 'none';
  } else {
     clearItem.style.display = 'block';
     filterItem.style.display = 'block';
  }
}

// Initialize app
function init() {
   // Event Listeners
   itemForm.addEventListener('submit', onAddItemSubmit);
   itemList.addEventListener('click', onClickItem);
   clearItem.addEventListener('click', clearAllItems);
   filterItem.addEventListener('input', filterItems);
   document.addEventListener('DOMContentLoaded', displayItems);
   checkUI()
}

init();
