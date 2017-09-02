const tabListContainer = document.querySelector('.tabbar-container');
const tabList = document.querySelector('.list--tabbar');
let tabListItems = [...tabList.children];
let tabListContainerWidth = tabListContainer.clientWidth;
let tabListItemsWidth = getListItemWidth(tabListItems);
const tabPrevBtn = document.querySelector('.tabbar__prev');
const tabNextBtn = document.querySelector('.tabbar__next');
let shiftLeft = 0;
let shiftRight = 0;
let currentListItem = 0;

function getListItemWidth(items) {
    let sum = 0;
    items.forEach((item) => {
        sum = sum + item.clientWidth;
    });

    // 96 is current button width - todo: own variable because it is used on other places
    return sum + 96;
}

function setActive() {
    tabListItems.forEach((item) => {
        item.classList.remove('active');
    });
    this.classList.add('active');
}

function checkSlideControls() {
    if(tabListContainerWidth > tabListItemsWidth) {
        tabListContainer.classList.remove('show-controls');
        shiftLeft = 0;
        shiftRight = 0;
        currentListItem = 0;
        tabList.style.transform = "translateX(0)";
    } else {
        tabListContainer.classList.add('show-controls');
    }
}

tabListItems.forEach((item) => {
    item.addEventListener('click', setActive);
});

tabNextBtn.addEventListener('click', () => {

    if(currentListItem < tabListItems.length - 1) {
        shiftLeft += tabListItems[currentListItem].clientWidth;
        shiftRight -= tabListItems[currentListItem].clientWidth;
        tabList.style.transform = "translateX(" + -shiftLeft + "px)";
        currentListItem++;

        if(shiftLeft + tabListItems[currentListItem].clientWidth > tabListContainerWidth - 96) {
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
});

tabPrevBtn.addEventListener('click', () => {
    if(currentListItem === 0) {
        let widthSum = tabListItems[currentListItem].clientWidth;

        while(widthSum < tabListContainerWidth - 96) {
            widthSum += tabListItems[currentListItem + 1].clientWidth;
            currentListItem++;
        }

        shiftRight -= widthSum - tabListItems[currentListItem].clientWidth;
        shiftLeft += widthSum - tabListItems[currentListItem].clientWidth;

        tabList.style.transform = "translateX(" + shiftRight + "px)";
    }

    if(currentListItem > 0) {
        shiftRight += tabListItems[currentListItem - 1].clientWidth;
        shiftLeft -= tabListItems[currentListItem - 1].clientWidth;
        tabList.style.transform = "translateX(" + shiftRight + "px)";
        currentListItem--;
    } else {
        shiftRight = -(tabList.clientWidth - tabListItems[currentListItem].clientWidth);
        shiftLeft = tabList.clientWidth - tabListItems[currentListItem].clientWidth;
        currentListItem = tabListItems.length - 1;
        tabList.style.transform = "translateX(" + shiftRight + "px)";
    }
});

console.log(tabListItemsWidth);
tabList.style.width = tabListItemsWidth + "px";
checkSlideControls();

window.addEventListener('resize', () => {
    tabListContainerWidth = tabListContainer.clientWidth;
    //tabListItemsWidth = getListItemWidth(tabListItems);
    checkSlideControls();
});
