document.addEventListener("DOMContentLoaded", () => {

    solution = "oliver";
    gender = "boy";
    n = solution.length;

    createSquares();

    colors = {
        "green": "rgb(83, 141, 78)",
        "gray": "rgb(58, 58, 60)",
        "yellow": "rgb(181, 159, 59)",
        "black": "rgb(0, 0, 0)",
        "pink": "rgb(194, 83, 161)",
        "blue": "rgb(100, 148, 232)"
    };

    currentRow = 1;
    currentArray = [];
    
    const keys = document.querySelectorAll(".keyboard-row button");

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let i = 0; i < 6*n; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            /*square.classList.add("animate__animated");*/
            square.setAttribute("id", i + 1);
            gameBoard.appendChild(square);
        }

        gameBoard.style.setProperty('grid-template-columns', `repeat(${n}, 1fr)`);
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

        if (currentArray.join('') == solution) {
            handleVictory();
            return;
        }

        currentRow = currentRow + 1
        currentArray = []

        return;
    }

    function handleVictory() {
        const gameBoard = document.getElementById("board");

        for (let i = 0; i < 6 * n; i++) {
            const el = document.getElementById(i + 1);

            if (i < (currentRow - 1) * n || i >= currentRow * n) {
                gameBoard.removeChild(el);
            }

            else {
                width = Math.floor((500 - (n + 1) * 5 - 4 * n) / n);
                el.style.setProperty('width', `${width}px`);
                el.style.setProperty('height', `${width}px`);
                el.style.setProperty('font-size', `${.9 * width}px`);
                if (gender == "boy") {
                    el.style.backgroundColor = colors['blue'];
                    el.style.borderColor = colors['blue'];
                } else {
                    el.style.backgroundColor = colors['pink'];
                    el.style.borderColor = colors['pink'];
                }
                
            }
        }
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

        /* check for greens */
        for (let i = 0; i < n; i++) {

            letter = currentArray[i];
            if (!(letter in counts)) {
                counts[letter] = 0;
            }
            const el = document.getElementById((currentRow - 1) * n + i + 1);

            if (letter == solution[i]) {
                el.style.backgroundColor = colors['green'];
                el.style.borderColor = colors['green'];
                counts[letter] += 1;
            }
        }

        for (let i = 0; i < n; i++) {

            letter = currentArray[i];
            const el = document.getElementById((currentRow - 1) * n + i + 1);

            /* check for grays */
            if (!solution.includes(letter)) {
                el.style.backgroundColor = colors['gray'];
                el.style.borderColor = colors['gray'];
            }

            /* skip the greens */
            else if (letter == solution[i]) {
                continue;
            }

            /* check for yellows */
            else if (counts[letter] < charCount(letter, solution)) {
                el.style.backgroundColor = colors['yellow'];
                el.style.borderColor = colors['yellow'];
                counts[letter] += 1;
            }

            else {
                el.style.backgroundColor = colors['gray'];
            }
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
