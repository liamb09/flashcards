function setupStacks () {
    // localStorage.clear();
    if (localStorage.getItem("numStacks") === null) {
        localStorage.clear();
        localStorage.setItem("numStacks", 0);
    }

    if (localStorage.getItem("numStacks") == 0) {
        document.getElementById("no-stacks-message").innerHTML = "<br /><br />You have no stacks saved.";
    } else {
        document.getElementById("no-stacks-message").innerHTML = "";
    }

    numStacks = parseInt(localStorage.getItem("numStacks"));
    console.log(numStacks);
    for (i = 1; i <= numStacks; i++) {
        stack = JSON.parse(localStorage.getItem(`stack${i}`));
        console.log(stack);
        document.getElementById("stack-list").innerHTML += getStack(stack, i);
    }
}

function getStack (stack) {
    return `<div id="stack-card">
                <h1>${stack[0]}</h1>
                <p>${stack[1].length} terms</p>
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
    if (document.getElementById("title-input").value == "") {
        document.getElementById("error-message").innerHTML = "Please enter a title for your stack.";
        return;
    }
    console.log(stack);
    stack.forEach((card) => {
        if (card[0] == "" || card[1] == "") {
            document.getElementById("error-message").innerHTML = "Please fill out all fields.";
            return;
        }
    });
    localStorage.setItem("numStacks", parseInt(localStorage.getItem("numStacks")) + 1);
    jsonStack = JSON.stringify([document.getElementById("title-input").value, stack]);
    console.log(stack);
    localStorage.setItem(`stack${localStorage.getItem("numStacks")}`, jsonStack);
}