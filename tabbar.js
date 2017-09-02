let shiftLeft = 0;
let shiftRight = 0;
let currentListItem = 0;

/**
 * Given a list of items accumulates the width of each respective item,
 * adds a specified button width and returns the sum.
 * @param {array} items - Array of DOM elements
 * @param {number} buttonWidth - Additional width of a specified button
 * @return {number} Sum of elment widths
 */
const getTabListWidth = (items, buttonWidth) => {
  const sum = items.reduce((acc, item) => {
    return acc + item.clientWidth
  },0)

  return sum + buttonWidth;
}


/**
 * Meant to be used as event listener callback.
 * Sets active class of currently selected tab.
 * @param {object} currTab - Tab node which fired the event
 * @param {array} tabs - Array of tab nodes
 * @return {undefined}
 */
const setActiveTab = (currTab, tabs) => {
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });

  currTab.classList.add('active');
}

const checkSlideControls = (tabListItems, wrapper, tabList) => {
  const tabListItemsWidth = getTabListWidth(tabListItems, 96);
  const itemsFillContainer = wrapper.clientWidth <= tabListItemsWidth

  if(itemsFillContainer) {
    wrapper.classList.add('show-controls');
  } else {
    wrapper.classList.remove('show-controls');
    shiftLeft = 0;
    shiftRight = 0;
    currentListItem = 0;
    tabList.style.transform = "translateX(0)";
  }
}

const moveRight = (tabs, wrapper, tabList) => {
  if(currentListItem < tabs.length - 1) {
    shiftLeft += tabs[currentListItem].clientWidth;
    shiftRight -= tabs[currentListItem].clientWidth;
    tabList.style.transform = "translateX(" + -shiftLeft + "px)";
    currentListItem++;

    if(shiftLeft + tabs[currentListItem].clientWidth > wrapper.clientWidth - 96) {
      shiftLeft = 0;
      shiftRight = 0;
      currentListItem = 0;
      tabList.style.transform = "translateX(0)";
    }
  } else {
    shiftLeft = 0;
    shiftRight = 0;
    currentListItem = 0;
    tabList.style.transform = "translateX(0)";
  }
}

const moveLeft = (tabs, wrapper, tabList) => {
  if(currentListItem === 0) {
    let widthSum = tabs[currentListItem].clientWidth;

    while(widthSum < wrapper.clientWidth - 96) {
      widthSum += tabs[currentListItem + 1].clientWidth;
      currentListItem++;
    }

    shiftRight -= widthSum - tabs[currentListItem].clientWidth;
    shiftLeft += widthSum - tabs[currentListItem].clientWidth;

    tabList.style.transform = `translateX(${shiftRight}px)`;
  }

  if(currentListItem > 0) {
    shiftRight += tabs[currentListItem - 1].clientWidth;
    shiftLeft -= tabs[currentListItem - 1].clientWidth;
    tabList.style.transform = `translateX(${shiftRight}px)`;
    currentListItem--;
  } else {
    shiftRight = -(tabList.clientWidth - tabs[currentListItem].clientWidth);
    shiftLeft = tabList.clientWidth - tabs[currentListItem].clientWidth;
    currentListItem = tabs.length - 1;
    tabList.style.transform = `translateX(${shiftRight}px)`;
  }
}

const addButtonEventListeners = (tabs, wrapper, tabList) => {
  const tabPrevBtn = document.querySelector('.tabbar__prev');
  const tabNextBtn = document.querySelector('.tabbar__next');

  tabNextBtn.addEventListener('click', () => moveRight(tabs, wrapper, tabList));
  tabPrevBtn.addEventListener('click', () => moveLeft(tabs, wrapper, tabList));
}

// IIFE called when script is loaded
(initModule = () => {
  const tabListContainer = document.querySelector('.tabbar-container');
  const tabList = document.querySelector('.list--tabbar');
  const tabListItems = [...tabList.children];

  const tabListItemsWidth = getTabListWidth(tabListItems, 96);
  tabList.style.width = `${tabListItemsWidth}px`;

  checkSlideControls(tabListItems, tabListContainer, tabList);

  // Add tab event listeners
  tabListItems.forEach((item) => {
    item.addEventListener('click', e => setActiveTab(e.target, tabListItems));
  });

  addButtonEventListeners(tabListItems, tabListContainer, tabList)

  window.addEventListener('resize', () => {
    checkSlideControls(tabListItems, tabListContainer, tabList);
  });
})()
