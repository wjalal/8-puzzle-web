document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', function () {
        this.classList.add('editing');
        this.setAttribute('contenteditable', 'true');
        this.focus();
    });

    tile.addEventListener('keydown', function (event) {
        const value = event.key;

        if (value.length === 1) {
            if (/^[1-8]$/.test(value)) {
                this.textContent = value;
                this.classList.remove('empty');
                this.blur();
            } else if (value === "0" || value === "-" || value === " ") {
                this.textContent = "";
                this.classList.add('empty');
                this.blur();
            } else if (value === "9") {
                event.preventDefault();
            } else {
                event.preventDefault();
            }

            updateTileStyles();
        }
    });

    tile.addEventListener('blur', function () {
        this.classList.remove('editing');
        this.removeAttribute('contenteditable');
        if (this.textContent === "") {
            this.classList.add('empty');
        } else {
            this.classList.remove('empty');
        }
        updateTileStyles();
    });
});

function updateTileStyles() {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const values = tiles.map(tile => tile.textContent.trim());
    const valueCounts = {};
    let blankCount = 0;

    values.forEach(value => {
        if (value === "") {
            blankCount++;
        } else {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        }
    });

    tiles.forEach(tile => {
        const value = tile.textContent.trim();
        if (value === "") {
            if (blankCount > 1) {
                tile.classList.add('multiple-blanks');
            } else {
                tile.classList.remove('multiple-blanks');
            }
        } else {
            tile.classList.remove('multiple-blanks');
        }

        if (valueCounts[value] > 1) {
            tile.classList.add('duplicate');
        } else {
            tile.classList.remove('duplicate');
        }
    });
}

function generateAndPrintArray() {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const array = tiles.map(tile => {
        const value = tile.textContent.trim();
        return value === "" ? 0 : parseInt(value, 10);
    });
    console.log('Generated Array:', array);

    // Sending POST request with the array
    fetch('/api/getSolution', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(array)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);

            // Handle server response

            if (data.success === false) {
                alert("Failed to calculate results for this input!");
            } else if (data.success === true && data.solvable === false) {
                alert("Unfortunately, this puzzle can never be solved.");
            } else if (data.success === true && data.solvable === true) {
                displaySolutions(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while communicating with the server.");
        });
}

// Assume the following function is used to handle the response and display solutions
function displaySolutions(data) {
    // Find the result card element
    const resultCard = document.getElementById('resultCard');

    // Clear any existing content
    resultCard.innerHTML = '';

    // Create a paragraph with the number of moves
    const movesParagraph = document.createElement('p');
    movesParagraph.innerHTML = `This puzzle can be solved in <span class="moves-count">${data.nMoves}</span> moves.`;
    movesParagraph.style.fontSize = '1.5rem'; // Larger font size for moves count
    movesParagraph.style.marginBottom = '30px'; // Add more space below the number of moves for better spacing
    movesParagraph.querySelector('.moves-count').style.fontWeight = 'bold';
    movesParagraph.querySelector('.moves-count').style.color = '#e74c3c'; // Deep red color
    resultCard.appendChild(movesParagraph);

    // Create a container for the solutions
    const solutionsContainer = document.createElement('div');
    solutionsContainer.className = 'solutions-container'; // Optional: For additional styling
    resultCard.appendChild(solutionsContainer);

    // Iterate over each grid in the moves array
    data.moves.forEach((move, index) => {
        // Create a label for each step
        const stepLabel = document.createElement('p');
        stepLabel.textContent = `Step ${index}`; // Start from Step 0
        stepLabel.className = 'step-label';
        solutionsContainer.appendChild(stepLabel);

        // Create the grid for the solution
        const solutionGrid = document.createElement('div');
        solutionGrid.className = 'solution-grid';

        // Determine changed tiles
        if (index > 0) {
            const previousMove = data.moves[index - 1];
            const changedIndices = [];

            move.forEach((value, i) => {
                if (value !== previousMove[i]) {
                    changedIndices.push(i);
                }
            });

            // Fill the grid with tiles and highlight changes
            move.forEach((value, i) => {
                const tile = document.createElement('div');
                tile.className = 'solution-tile';
                tile.textContent = value === 0 ? '' : value; // Show blank tile if value is 0
                if (changedIndices.includes(i)) {
                    tile.classList.add('changed'); // Apply the class to highlight changed tiles
                }
                solutionGrid.appendChild(tile);
            });
        } else {
            // Fill the grid with tiles for the initial step
            move.forEach(value => {
                const tile = document.createElement('div');
                tile.className = 'solution-tile';
                tile.textContent = value === 0 ? '' : value; // Show blank tile if value is 0
                solutionGrid.appendChild(tile);
            });
        }

        // Append the solution grid to the container
        solutionsContainer.appendChild(solutionGrid);

        // Add spacing below each grid
        const spacing = document.createElement('div');
        spacing.className = 'grid-spacing';
        solutionsContainer.appendChild(spacing);
    });

    // Make the result card visible
    resultCard.style.display = 'block';
}

document.getElementById('solveButton').addEventListener('click', generateAndPrintArray);
