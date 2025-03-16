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
        stack = [["",""],["",""],["",""]];
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
                <input class="term-input" id="term${index}" placeholder="Enter term..." value="${cardData[0]}" onchange="updateCard(this.id)" onkeyup="updateCard(this.id)">
                <input class="definition-input" id="definition${index}" placeholder="Enter definition..." value="${cardData[1]}" onchange="updateCard(this.id)" onkeyup="updateCard(this.id)">
            </div>`
}

function saveStack () {
    // Make sure user has inputted title
    if (document.getElementById("title-input").value == "") {
        document.getElementById("error-message").innerHTML = "Please enter a title for your stack.";
        return;
    }

    // Make sure user has chosen unique stack name
    stackNames = JSON.parse(localStorage.getItem("liamb09-flashcards"))[1];
    if (stackNames.includes(document.getElementById("title-input").value)) {
        document.getElementById("error-message").innerHTML = "You already have a stack with that name. Please choose a different name.";
        return;
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
    currentStackData[0] = parseInt(currentStackData[0]) + 1
    currentStackData[1].unshift(document.getElementById("title-input").value);
    currentStackData[2].unshift(stack);
    localStorage.setItem("liamb09-flashcards", JSON.stringify(currentStackData));
    window.location.href = 'index.html';
}

function viewStack (id) {
    var idNum = id.match(/\d+/g)[0];
    window.location.href = `viewer.html?setID=${idNum}`;
}