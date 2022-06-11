let results;

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    const helpModal = document.getElementById("helpModalId");
    if (event.target == helpModal) {
        helpModal.style.display = "none";
    }
}

function closeHelpModal(){
    const helpModal = document.getElementById("helpModalId");
    helpModal.style.display = "none";
}

function openHelpModal(){
    const helpModal = document.getElementById("helpModalId");
    helpModal.style.display = "block";
}

function closeResultsModal(){
    const resultsModal = document.getElementById("resultsModalId");
    resultsModal.style.display = "none";
}

function copyResultsToClipboard(){
    navigator.clipboard.writeText(results);
}

document.addEventListener("DOMContentLoaded", () => {

    solution = "David";
    solutionFullName = solution + " Jon Magnuson";
    gender = "boy";
    n = solution.length;

    createWordleBoard();

    currentRow = 1;
    currentArray = [];
    
    const keys = document.querySelectorAll(".keyboard-row button");

    function createWordleBoard() {
        const gameBoard = document.getElementById("board");
        createRowOfSquares(6,gameBoard);
        gameBoard.style.setProperty('grid-template-columns', `repeat(${n}, 1fr)`);
    }

    function createRowOfSquares(numOfRows, parent) {
        for (let i = 0; i < numOfRows*n; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            /*square.classList.add("animate__animated");*/
            square.setAttribute("id", i + 1);
            parent.appendChild(square);
        }
    }

    function updateCurrentArray(letter) {

        if (currentArray.length < n) {
            currentArray.push(letter);
            const el = document.getElementById((currentRow - 1) * n + currentArray.length);
            el.textContent = letter;
        }
    }

    function handleDeleteLetter() {
        if (currentArray.length > 0) {
            const el = document.getElementById((currentRow - 1) * n + currentArray.length);
            el.textContent = "";
            currentArray.pop();
        }
    }

    function handleEnterLetter() {
        if (currentArray.length !== n) {
            window.alert("Must enter full guess before submitting!");
            return;
        }

        giveClue();

        if (currentArray.join('') == solution.toLowerCase()) {
            showAnswer();
            return;
        }

        currentRow = currentRow + 1

        if(currentRow > 6){
            showAnswer();
            return;
        }

        currentArray = []

        return;
    }

    function showAnswer() {

        /* Show answer on modal */
        for (let i = 0; i < n; i++) {
            const resultSquare = document.getElementById("babyName"+i);
            if (gender == "boy") {
                resultSquare.classList.add("blue");
            } else if (gender == "girl") {
                resultSquare.classList.add("pink");
            }
            resultSquare.textContent = solution[i];
        }

        /* Show fullname on modal*/
        const babyFullNameDiv = document.getElementById("babyFullName");
        babyFullNameDiv.textContent = solutionFullName;

        /* collect Results */
        const gameBoard = document.getElementById("board");
        results = "Baby Name Wordle ";
        if(currentRow > 6){
            results = results + "X/6";
            currentRow = 6; // For the results collection for loop.
        }else{
            results = results + currentRow +"/6";
        }

        for (let i = 0; i < currentRow*n; i++) {
            if(i%5 == 0){
                results = results + "\n";
            }
            if(gameBoard.children[i].classList.contains("green")){
                results = results + "🟩";
            }else if(gameBoard.children[i].classList.contains("yellow")){
                results = results + "🟨";
            }else{
                results = results + "⬛";
            }
        }

        /* show resutls on modal*/
        console.log(results);
        const resultsView = document.getElementById("resultsView");
        resultsView.textContent = results;

        /* Show modal*/
        const resultsModal = document.getElementById("resultsModalId");
        resultsModal.style.display = "block";

    }

    function charCount(letter, word) {
        count = 0;
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                count += 1;
            }
        }
        return count;
    }

    function giveClue() {

        counts = {};
        solutionLowerCase = solution.toLowerCase();

        /* check for greens */
        for (let i = 0; i < n; i++) {

            letter = currentArray[i];
            if (!(letter in counts)) {
                counts[letter] = 0;
            }
            const el_board = document.getElementById((currentRow - 1) * n + i + 1);
            const el_keys = document.getElementById(letter);
            
            if (letter == solutionLowerCase[i]) {
                el_board.classList.add("green");
                el_keys.classList.add("green");
                counts[letter] += 1;
            }
        }

        for (let i = 0; i < n; i++) {

            letter = currentArray[i];
            const el_board = document.getElementById((currentRow - 1) * n + i + 1);
            const el_keys = document.getElementById(letter);

            /* check for grays */
            if (!solutionLowerCase.includes(letter)) {
                el_board.classList.add("gray");
                el_keys.classList.add("gray");
            }

            /* skip the greens */
            else if (letter == solutionLowerCase[i]) {
                continue;
            }

            /* check for yellows */
            else if (counts[letter] < charCount(letter, solutionLowerCase)) {
                el_board.classList.add("yellow");
                if (!el_keys.style.backgroundColor) {
                    el_keys.classList.add("yellow");
                }
                counts[letter] += 1;
            }

            else {
                el_board.classList.add("gray");
            }
        }

        for (let i = 0; i < keys.length; i++) {

        }
        
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "del") {
                handleDeleteLetter();
                return;
            }

            if (letter === "enter") {
                handleEnterLetter();
                return;
            }

            updateCurrentArray(letter);
        };
    }

    document.addEventListener('keydown', function (event) {
        if (event.keyCode > 64 && event.keyCode < 91) {
            const letter = String.fromCharCode(event.keyCode).toLowerCase();
            updateCurrentArray(letter);
            return;
        }

        if (event.keyCode === 8) {
            handleDeleteLetter();
            return;
        }

        if (event.keyCode === 13) {
            handleEnterLetter();
            return;
        }
    });
});
