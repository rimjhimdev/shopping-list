const itemInput = document.querySelector('#item-input');
const itemForm = document.querySelector('#item-form');
const formBtn = document.querySelector('.btn');
const itemList = document.querySelector('#item-list');
const itemFilter = document.querySelector('#filter');
const clear = document.querySelector('#clear');
const addEditBtn = document.querySelector('#addEditBtn');
let isItemDuplicate = false;
let editMode = false;

function init() {
    itemForm.addEventListener('submit', addItem);
    itemList.addEventListener('click', onItemClick);
    clear.addEventListener('click', clearAll);
    document.addEventListener('DOMContentLoaded', checkUI);
    document.addEventListener('DOMContentLoaded', displayItems);
    filter.addEventListener('input', filterItems);
}

init();

function addItem(e) {
    e.preventDefault();

    if (itemInput.value === '') {
        alert('Please enter an item');
        return;
    }
    checkItemDuplicacy();

    if (isItemDuplicate) {
        alert('Item is already present');
        isItemDuplicate = false;
    } else {
        if (editMode) {
            let itemToEdit = document.querySelector('.edit-mode');
            itemToEdit.remove();
            removeItemFromStorage(itemToEdit);
            editMode = false;
            addItemToDomAndStorage(itemInput.value);
        } else {
            addItemToDomAndStorage(itemInput.value);
        }
    }
}

function addItemToDomAndStorage(theValue) {
    createListItem(theValue);
    addItemToStorage();
    checkUI();
    itemInput.focus()
    itemInput.value = '';
}

function checkItemDuplicacy() {
    const items = getItemsFromStorage();
    const itemsMatched = items.filter(item => item.trim().toLowerCase() == itemInput.value.trim().toLowerCase());
    if (itemsMatched.length > 0) {
        isItemDuplicate = true;
        return;
    }
}

function addItemToStorage() {
    const items = getItemsFromStorage();
    items.push(itemInput.value);
    localStorage.setItem('items', JSON.stringify(items));
}

function displayItems() {
    const items = getItemsFromStorage();
    if (items.length > 0) {
        items.forEach(item => createListItem(item));
    }
}

function createListItem(value) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(value));

    const theBtn = createListItemBtn();

    li.appendChild(theBtn);
    itemList.appendChild(li);
}

function createListItemBtn() {
    const btn = document.createElement('button')
    btn.className = 'remove-item btn-link text-red'

    const theIcon = createListItemBtnIcon();
    btn.appendChild(theIcon);

    return btn;
}
function createListItemBtnIcon() {
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-xmark';
    return icon;
}

function onItemClick(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        const itemToBeRemoved = e.target.parentElement.parentElement;
        removeItemFromUI(itemToBeRemoved);
        removeItemFromStorage(itemToBeRemoved);
        checkUI();
    } else {
        editMode = true;
        const item = e.target;
        itemList.querySelectorAll('li').forEach(li => li.classList.remove('edit-mode'));
        item.classList.add('edit-mode');
        addEditBtn.innerHTML = `<i class='fa-solid fa-pen'></i> Edit Item`;
        addEditBtn.style.background = '#228b22';
        itemInput.value = item.textContent;
        itemInput.focus();
    }
}

function removeItemFromUI(item) {
    item.remove();
}

function removeItemFromStorage(item) {
    const text = item.firstChild.textContent;
    const items = getItemsFromStorage();
    const newItems = items.filter(item => item != text);
    localStorage.setItem('items', JSON.stringify(newItems));
}

function clearAll() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }
    localStorage.removeItem('items');
    checkUI();
}

function checkUI(e) {
    const items = getItemsFromStorage();

    itemInput.focus();
    itemInput.value = '';
    addEditBtn.style.background = '#333';
    addEditBtn.innerHTML = `<i class='fa-solid fa-plus'></i> Add Item`;
    editMode = false;

    if (items.length === 0) {
        itemFilter.style.display = 'none';
        clear.style.display = 'none';
    } else {
        itemFilter.style.display = 'block';
        clear.style.display = 'block';
    };
}

function filterItems(e) {
    const items = document.querySelectorAll('#item-list li')
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemText = item.firstChild.textContent.toLowerCase();

        if (itemText.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        };
    })
}

function getItemsFromStorage() {
    let storageItem;
    if (localStorage.getItem('items') === null) {
        storageItem = [];
    } else {
        storageItem = JSON.parse(localStorage.getItem('items'))
    }
    return storageItem;
}