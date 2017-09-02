let state = {}

/**
  * TODO
  */
const setState = nextState => {
  const newState = Object.assign({}, state, nextState);

  state = newState;

  return newState;
}

/**
  * TODO
  */
const initialState = {
  shift: 0,
  currItemIndex: 0
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

/**
  * TODO
  */
const checkSlideControls = (tabs, tabList) => {
  const wrapper = document.querySelector('.tabbar-container');

  const tabListItemsWidth = tabs.reduce((acc, tab) => {
    return acc + tab.clientWidth;
  }, 0);

  tabList.style.width = `${tabListItemsWidth}px`;

  const itemsFillContainer = wrapper.clientWidth < tabListItemsWidth

  if(itemsFillContainer) {
    wrapper.classList.add('show-controls');
  } else {
    wrapper.classList.remove('show-controls');
    tabList.style.transform = "translateX(0)";

    // Reset state
    setState(initialState)
  }
}

/**
  * TODO
  */
const moveRight = (tabs, tabList) => {
  const { currItemIndex, shift } = state;
  const wrapper = document.querySelector('.tabbar-container');

  const isLastItem = currItemIndex === tabs.length - 1
  const shiftIsNegative = shift < 0
  const newShift = shiftIsNegative
    ? -(shift - tabs[currItemIndex].clientWidth)
    : shift + tabs[currItemIndex].clientWidth;

  const newTabListWidth = tabList.clientWidth - shift;
  const isSmallerThanWrapper = newTabListWidth < wrapper.clientWidth - 96;

  if (isLastItem || isSmallerThanWrapper) {
    // Reset state
    setState(initialState)
    tabList.style.transform = "translateX(0)";

    return
  }

  const nextListItem = currItemIndex + 1;

  setState({
    shift: newShift,
    currItemIndex: nextListItem
  })

  tabList.style.transform = `translateX(${-newShift}px)`;

  return
}

/**
  * TODO
  */
const moveLeft = (tabs, tabList) => {
  const { shift, currItemIndex } = state;
  const wrapper = document.querySelector('.tabbar-container');

  const isFirstItem = currItemIndex === 0;

  if (isFirstItem) {
    // Set index to last item of the list
    setState({ currItemIndex: tabs.length - 1 });

    const reverseTabs = tabs.slice().reverse();

    const tabListWidth = reverseTabs.reduce((acc, tab, i, list) => {
      const isLastTab = i === list.length - 1;

      if (isLastTab) return acc.sum;

      if (acc.done) return acc;

      const nextTab = list[i + 1];
      const sumWithNext = acc.sum + tab.clientWidth + nextTab.clientWidth

      const isLargerThanWrapper = sumWithNext >= wrapper.clientWidth - 96;

      const sum = acc.sum + tab.clientWidth

      if (isLargerThanWrapper) return { sum, done: true };

      setState({ currItemIndex: state.currItemIndex - 1 });

      return { sum, done: false };
    }, { sum: 0, done: false });

    const newShift = tabList.clientWidth - tabListWidth;

    setState({ shift: newShift })

    tabList.style.transform = `translateX(${-newShift}px)`;

    return
  }

  const prevListItem = tabs[currItemIndex - 1];
  const shiftIsPositive = shift > 0;

  const newShift = shiftIsPositive
    ? -(shift - prevListItem.clientWidth)
    : shift + prevListItem.clientWidth;

  const prevItemIndex = currItemIndex - 1;

  setState({
    shift: newShift,
    currItemIndex: prevItemIndex
  })

  tabList.style.transform = `translateX(${newShift}px)`;
}


/**
  * TODO
  */
const addButtonEventListeners = (tabs, tabList) => {
  const tabPrevBtn = document.querySelector('.tabbar__prev');
  const tabNextBtn = document.querySelector('.tabbar__next');

  tabNextBtn.addEventListener('click', () => moveRight(tabs, tabList));
  tabPrevBtn.addEventListener('click', () => moveLeft(tabs, tabList));
}

// IIFE called when script is loaded
// Immediately invoked function expression
(initModule = () => {
  const tabList = document.querySelector('.list--tabbar');
  const tabListItems = [...tabList.children];

  // Set initial state
  setState(initialState)

  checkSlideControls(tabListItems, tabList);

  // Add tab event listeners
  tabListItems.forEach((item) => {
    item.addEventListener('click', e => setActiveTab(e.target, tabListItems));
  });

  addButtonEventListeners(tabListItems, tabList)

  window.addEventListener('resize', () => {
    checkSlideControls(tabListItems,  tabList);
  });
})()
