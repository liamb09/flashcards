function setupStacks () {
    // localStorage.removeItem("liamb09-flashcards");
    if (localStorage.getItem("liamb09-flashcards") === null) {
        localStorage.setItem("liamb09-flashcards", JSON.stringify([0, [], []])); // numStacks, stackNames, stackData
    }

    if (JSON.parse(localStorage.getItem("liamb09-flashcards"))[0] == 0) {
        document.getElementById("no-stacks-message").innerHTML = "<br /><br />You have no stacks saved.";
        return;
    } else {
        document.getElementById("no-stacks-message").innerHTML = "";
    }

    stackNames = JSON.parse(localStorage.getItem("liamb09-flashcards"))[1];
    stackData = JSON.parse(localStorage.getItem("liamb09-flashcards"))[2];
    for (i = 0; i < stackNames.length; i++) {
        document.getElementById("stack-list").innerHTML += getStack(stackNames[i], stackData[i], i);
    }
}

function getStack (stackName, stackData, id) {
    return `<div class="stack-card" id="stackCard${id}" onclick="viewStack(this.id)">
                <h1>${stackName}</h1>
                <p>${stackData.length} terms</p>
            </div>`;
}

stack = [];
editingStack = false;
editingStackID = -1;

function addCard () {
    if (stack.length > 99) {
        return;
    }
    stack.push(["",""]);
    updateStack();
}

function removeCard () {
    if (stack.length <= 3) {
        return;
    }
    stack.pop();
    updateStack();
}

function updateStack () {
    if (stack.length == 0) {
        const urlParams = new URLSearchParams(window.location.search);
        editingStackID = parseInt(urlParams.get('stackID'));
        if (!isNaN(editingStackID)) {
            editingStack = true;
            editingStackData = JSON.parse(localStorage.getItem("liamb09-flashcards"));
            editingStackTitle = editingStackData[1][editingStackID];
            editingStackTerms = editingStackData[2][editingStackID];
            document.getElementById("title-input").value = editingStackTitle;
            editingStackTerms.forEach((term) => {
                stack.push(term);
            });
            document.title = `Edit "${editingStackTitle}"`;
            document.getElementById("add-stack-page-title").innerHTML = `Edit "${editingStackTitle}"`;
        } else {
            editingStack = false;
            stack = [["",""],["",""],["",""]];
        }
    }
    document.getElementById("card-input-list").innerHTML = "";
    stack.forEach((card, index) => {
        document.getElementById("card-input-list").innerHTML += getCard(card, index);
    });
}

function updateCard (id) {
    var idNum = id.match(/\d+/g)[0];
    stack[idNum] = [document.getElementById(`term${idNum}`).value, document.getElementById(`definition${idNum}`).value];
    document.getElementById("error-message").innerHTML = "";
}

function getCard (cardData, index) {
    return `<div class="card-input-container">
                <textarea class="term-input" id="term${index}" placeholder="Enter term..." value="${cardData[0]}" onchange="updateCard(this.id)" onkeyup="updateCard(this.id)" rows="4"></textarea>
                <textarea class="definition-input" id="definition${index}" placeholder="Enter definition..." value="${cardData[1]}" onchange="updateCard(this.id)" onkeyup="updateCard(this.id)" rows="4"></textarea>
            </div>`
}

function saveStack () {
    // Make sure user has inputted title
    if (document.getElementById("title-input").value == "") {
        document.getElementById("error-message").innerHTML = "Please enter a title for your stack.";
        return;
    }

    // Make sure user has chosen unique stack name
    if (!editingStack) {
        stackNames = JSON.parse(localStorage.getItem("liamb09-flashcards"))[1];
        if (stackNames.includes(document.getElementById("title-input").value)) {
            document.getElementById("error-message").innerHTML = "You already have a stack with that name. Please choose a different name.";
            return;
        }
    }

    // Make sure all fields are filled
    var allFieldsFilled = true;
    stack.forEach((card) => {
        if (card[0] == "" || card[1] == "") {
            document.getElementById("error-message").innerHTML = "Please fill out all fields.";
            allFieldsFilled = false;
            return;
        }
    });
    if (!allFieldsFilled) return;

    // Save stack
    currentStackData = JSON.parse(localStorage.getItem("liamb09-flashcards"));
    if (!editingStack) {
        currentStackData[0] = parseInt(currentStackData[0]) + 1
        currentStackData[1].unshift(document.getElementById("title-input").value);
        currentStackData[2].unshift(stack);
    } else {
        currentStackData[1][editingStackID] = document.getElementById("title-input").value;
        currentStackData[2][editingStackID] = stack;
    }
    localStorage.setItem("liamb09-flashcards", JSON.stringify(currentStackData));
    window.location.href = "index.html";
}

var currentCardID = 0;
var stackID = 0;
var stacks;
var stackTitles;
var stackData;
var canChangeCards = true;

function viewStack (id) {
    var idNum = id.match(/\d+/g)[0];
    window.location.href = `viewer.html?stackID=${idNum}`;
}

function setupViewer () {
    const urlParams = new URLSearchParams(window.location.search);
    stackID = parseInt(urlParams.get('stackID'));
    stacks = JSON.parse(localStorage.getItem("liamb09-flashcards"));
    stackTitles = stacks[1];
    stackData = stacks[2];
    document.title = stackTitles[stackID];
    document.getElementById("stack-title").innerHTML = stackTitles[stackID];
    document.getElementById("stack-progress-indicator").innerHTML = `${currentCardID} / ${stackData[stackID].length}`;
    currentCardID = 0;
    updateViewer();
}

function updateViewer () {
    document.getElementById("prevprev-card").hidden = false;
    document.getElementById("prev-card").hidden = false;
    document.getElementById("current-card").hidden = false;
    document.getElementById("next-card").hidden = false;
    document.getElementById("nextnext-card").hidden = false;
    if (currentCardID <= 1) {
        document.getElementById("prevprev-card").hidden = true;
    }
    if (currentCardID == 0) {
        document.getElementById("prev-card").hidden = true;
    }
    if (stackData[stackID].length - currentCardID - 1 <= 1) {
        document.getElementById("nextnext-card").hidden = true;
    }
    if (stackData[stackID].length - currentCardID - 1 == 0) {
        document.getElementById("next-card").hidden = true;
    }

    if (currentCardID-2 >= 0) {
        document.querySelector("#prevprev-card #front").innerHTML = stackData[stackID][currentCardID-2][0];
        document.querySelector("#prevprev-card #back").innerHTML = stackData[stackID][currentCardID-2][1];
    }
    if (currentCardID-1 >= 0) {
        document.querySelector("#prev-card #front").innerHTML = stackData[stackID][currentCardID-1][0];
        document.querySelector("#prev-card #back").innerHTML = stackData[stackID][currentCardID-1][1];
    }
    document.querySelector("#current-card #front").innerHTML = stackData[stackID][currentCardID][0];
    document.querySelector("#current-card #back").innerHTML = stackData[stackID][currentCardID][1];
    if (currentCardID+1 < stackData[stackID].length) {
        document.querySelector("#next-card #front").innerHTML = stackData[stackID][currentCardID+1][0];
        document.querySelector("#next-card #back").innerHTML = stackData[stackID][currentCardID+1][0];
    }
    if (currentCardID+2 < stackData[stackID].length) {
        document.querySelector("#nextnext-card #front").innerHTML = stackData[stackID][currentCardID+2][0];
        document.querySelector("#nextnext-card #back").innerHTML = stackData[stackID][currentCardID+2][1];
    }
}

function goToPrevCard () {
    prevprevCard = document.getElementById("prevprev-card");
    prevprevCard.classList.remove("prevprev");
    prevprevCard.classList.add("prev");
    prevprevCard.setAttribute("onclick", "goToPrevCard()");

    prevCard = document.getElementById("prev-card");
    prevCard.classList.remove("prev");
    prevCard.classList.add("term");
    prevCard.setAttribute("onclick", "flipCard()");

    currentCard = document.getElementById("current-card");
    currentCard.classList.add("next");
    currentCard.classList.remove("term");
    currentCard.setAttribute("onclick", "goToNextCard()");

    nextCard = document.getElementById("next-card");
    nextCard.classList.remove("next");
    nextCard.classList.add("nextnext");
    nextCard.removeAttribute("onclick");

    nextnextCard = document.getElementById("nextnext-card");

    disablePointerEventsToCards();
    document.getElementById("stack-progress-indicator").innerHTML = `${currentCardID-1} / ${stackData[stackID].length}`;
    setTimeout(() => {
        nextnextCard.remove();
        prevprevCard.id = "prev-card";
        prevCard.id = "current-card";
        currentCard.id = "next-card";
        nextCard.id = "nextnext-card";
        document.getElementById("card-container").innerHTML += `<div class="card prevprev" id="prevprev-card"><div id="front"></div><div id="back"></div></div>`;
        currentCardID--;
        updateViewer();
        enablePointerEventsToCards();
    }, 1000);
}

function goToNextCard () {
    prevprevCard = document.getElementById("prevprev-card");

    prevCard = document.getElementById("prev-card")
    prevCard.classList.remove("prev");
    prevCard.classList.add("prevprev")
    prevCard.removeAttribute("onclick");

    currentCard = document.getElementById("current-card");
    currentCard.classList.add("prev");
    currentCard.classList.remove("term");
    currentCard.setAttribute("onclick", "goToPrevCard()");

    nextCard = document.getElementById("next-card");
    nextCard.classList.remove("next");
    nextCard.classList.add("term");
    nextCard.setAttribute("onclick", "flipCard()");

    nextnextCard = document.getElementById("nextnext-card");
    nextnextCard.classList.remove("nextnext");
    nextnextCard.classList.add("next");
    nextnextCard.setAttribute("onclick", "goToNextCard()");

    disablePointerEventsToCards();
    document.getElementById("stack-progress-indicator").innerHTML = `${currentCardID+1} / ${stackData[stackID].length}`;
    setTimeout(() => {
        prevprevCard.remove();
        prevCard.id = "prevprev-card";
        currentCard.id = "prev-card";
        nextCard.id = "current-card";
        nextnextCard.id = "next-card";
        document.getElementById("card-container").innerHTML += `<div class="card nextnext" id="nextnext-card"><div id="front"></div><div id="back"></div></div>`;
        currentCardID++;
        updateViewer();
        enablePointerEventsToCards();
    }, 1000);
}

function disablePointerEventsToCards() {
    canChangeCards = false;
    document.getElementById("prevprev-card").style.pointerEvents = "none";
    document.getElementById("prev-card").style.pointerEvents = "none";
    document.getElementById("current-card").style.pointerEvents = "none";
    document.getElementById("next-card").style.pointerEvents = "none";
    document.getElementById("nextnext-card").style.pointerEvents = "none";
}

function enablePointerEventsToCards () {
    canChangeCards = true;
    document.getElementById("prevprev-card").style.pointerEvents = "auto";
    document.getElementById("prev-card").style.pointerEvents = "auto";
    document.getElementById("current-card").style.pointerEvents = "auto";
    document.getElementById("next-card").style.pointerEvents = "auto";
    document.getElementById("nextnext-card").style.pointerEvents = "auto";
}

function flipCard() {
    currentCard = document.getElementById("current-card");
    if (currentCard.classList.contains("flipped")) {
        currentCard.classList.remove("flipped");
    } else {
        currentCard.classList.add("flipped");
    }
}

function addStackAreYouSure () {
    if (!editingStack && confirm("Are you sure you would like to exit? This stack will not be saved.") || editingStack && confirm("Are you sure you would like to exit? Your changes will not be saved.")) {
        window.location.href = "index.html";
    }
}

function viewerAreYouSure () {
    if (confirm("Are you sure you would like to delete this stack? This action cannot be undone.")) {
        currentData = JSON.parse(localStorage.getItem("liamb09-flashcards"));
        currentData[0] -= 1;
        currentData[1].splice(stackID, 1);
        currentData[2].splice(stackID, 1);
        localStorage.setItem("liamb09-flashcards", JSON.stringify(currentData));
        window.location.href = "index.html"
    }
}

document.addEventListener('keydown', (event) => {
    if (!document.URL.includes("viewer.html")) {
        return;
    }
    if (!canChangeCards) {
        return;
    }
    switch (event.key) {
        case "ArrowLeft":
            goToPrevCard();
            break;
        case "ArrowRight":
            goToNextCard();
            break;
        case " ":
            flipCard();
            break;
    }
});

function invertCards () {
    currentSave = JSON.parse(localStorage.getItem("liamb09-flashcards"));
    for (var i = 0; i < currentSave[2][stackID].length; i++) {
        var temp = currentSave[2][stackID][i][0];
        currentSave[2][stackID][i][0] = currentSave[2][stackID][i][1];
        currentSave[2][stackID][i][1] = temp;
    }
    stackData = currentSave[2];
    localStorage.setItem("liamb09-flashcards", JSON.stringify(currentSave));
    updateViewer();
}

function editStack() {
    window.location.href = `add-stack.html?stackID=${stackID}`;
    stack = [];
}