let state = {}

const setState = nextState => {
  const newState = Object.assign({}, state, nextState);

  state = newState;

  return newState;
}

const initialState = {
  shiftLeft: 0,
  shiftRight: 0,
  currentListItem: 0
}

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
    tabList.style.transform = "translateX(0)";

    // Reset state
    setState(initialState)
  }
}

const moveRight = (tabs, wrapper, tabList) => {
  const { currentListItem, shiftLeft } = state;

  const isLastItem = currentListItem === tabs.length - 1
  const newShiftLeft = shiftLeft + tabs[currentListItem].clientWidth;
  const newShiftRight = shiftRight = tabs[currentListItem].clientWidth;

  const newTabListWidth = tabList.clientWidth - newShiftLeft;

  const isSmallerThanWrapper = newTabListWidth < wrapper.clientWidth - 96

  if (isLastItem || isSmallerThanWrapper) {
    // Reset state
    setState(initialState)
    tabList.style.transform = "translateX(0)";

    return
  }

  const nextListItem = currentListItem + 1;

  const newState = setState({
    shiftLeft: newShiftLeft,
    shiftRigth: newShiftRight,
    currentListItem: nextListItem
  })

  tabList.style.transform = `translateX(${-newState.shiftLeft}px)`;

  return
}

const handleFirstItem = (tabs, wrapper, tabList) => {
  const { shiftLeft, shiftRight, currentListItem } = state;

  const widthSum = tabs.reduce((acc, tab, i) => {
    const largerThanWrapper = acc >= wrapper.clientWidth - 96

    if (largerThanWrapper) return acc

    setState({
      currentListItem: i
    })

    return acc + tab.clientWidth
  }, 0)

  // Because state has meanwhile been manipulated, we need to get the
  // updated currentListItem from the state
  const width = widthSum - tabs[state.currentListItem].clientWidth

  const newShiftRight = shiftRight - width
  const newShiftLeft = shiftLeft + width

  const newState = setState({
    shiftLeft: newShiftLeft,
    shiftRight: newShiftRight
  })

  tabList.style.transform = `translateX(${newState.shiftRight}px)`;
}

const handleOtherItems = (tabs, tabList) => {
  const { shiftLeft, shiftRight, currentListItem } = state;

  const newShiftRight = shiftRight + tabs[currentListItem - 1].clientWidth;
  const newShiftLeft = shiftLeft - tabs[currentListItem - 1].clientWidth;

  const newState = setState({
    shiftRight: newShiftRight,
    shiftLeft: newShiftLeft,
    currentListItem: currentListItem - 1
  })

  tabList.style.transform = `translateX(${newState.shiftRight}px)`;
}

const handleWeirdCase = (tabs, tabList) => {
  const { shiftLeft, shiftRight, currentListItem } = state;

  const newShiftRight = -(tabList.clientWidth - tabs[currentListItem].clientWidth);
  const newShiftLeft = tabList.clientWidth - tabs[currentListItem].clientWidth;
  const newCurrListItem = tabs.length - 1;

  const newState = setState({
    shiftRight: newShiftRight,
    shiftLeft: newShiftLeft,
    currentListItem: newCurrListItem
  })

  tabList.style.transform = `translateX(${newState.shiftRight}px)`;
}

const moveLeft = (tabs, wrapper, tabList) => {
  const { shiftRight, shiftLeft, currentListItem } = state

  const isFirstItem = currentListItem === 0

  if(isFirstItem) {
    handleFirstItem(tabs, wrapper, tabList)
  }

  // if(state.currentListItem > 0) {
    // handleOtherItems(tabs, tabList)
  // } else {
    // handleWeirdCase(tabs, tabList)
  // }
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

  // Set initial state
  setState(initialState)

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
