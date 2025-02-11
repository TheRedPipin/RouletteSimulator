let target;
let wins = 0;
let losses = 0;
let runsTotal = 0;
let startBudget;
let started = false;
let chosen = [];
let timeouts = [];
let lineGraph;
let betSizeGraph;
let maxBet = 0;
let currentWinStreak = 0;
let currentLossStreak = 0;
let longestWinStreak = 0;
let longestLossStreak = 0;
let pieChart;

window.onload = function() {
    loadInputs();
    initializeLineGraph();
    initializeBetSizeGraph();
    initializePieChart();
    makeDraggable(
        document.getElementById('barChart'), 
        document.getElementById('resultsBox'), 
        document.getElementById('lineGraphContainer'),
        document.getElementById('betSizeGraphContainer'),
        document.getElementById('userInputs'),
        document.getElementById('colourInputs'),
        document.getElementById('pieChartContainer')
    );
};

document.getElementById('draggableCheckbox').addEventListener('change', (e) => {
    const elements = [
        document.getElementById('barChart'), 
        document.getElementById('resultsBox'), 
        document.getElementById('lineGraphContainer'),
        document.getElementById('betSizeGraphContainer'),
        document.getElementById('userInputs'),
        document.getElementById('colourInputs'),
        document.getElementById('pieChartContainer')
    ];
    if (e.target.checked) {
        makeDraggable(...elements);
    } else {
        elements.forEach(element => {
            element.removeAttribute('draggable');
        });
    }
});

function makeDraggable(...elements) {
    elements.forEach(element => {
        element.setAttribute('draggable', true);
        let offsetX, offsetY;

        element.addEventListener('dragstart', (e) => {
            offsetX = e.clientX - parseInt(window.getComputedStyle(element).left);
            offsetY = e.clientY - parseInt(window.getComputedStyle(element).top);
            e.dataTransfer.setData('text/plain', null);

            document.addEventListener('drop', onDrop);
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        function onDrop(e) {
            e.preventDefault();
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            document.removeEventListener('drop', onDrop);
        }
    });
}

document.getElementById('blueButton').addEventListener('click', () => {
    selectColor('blue');
    target = 0;
});
document.getElementById('redButton').addEventListener('click', () => {
    selectColor('red');
    target = 1;
});
document.getElementById('greenButton').addEventListener('click', () => {
    selectColor('green');
    target = 2;
});

function selectColor(color) {
    const buttons = document.querySelectorAll('#colourButtons button');
    buttons.forEach(button => {
        button.style.backgroundColor = '';
    });

    const selectedButton = document.getElementById(`${color}Button`);
    selectedButton.style.backgroundColor = color;
}

function updateBarChart(barA, barB, barC){
    document.getElementById("barA").style.height = `${barA}%`;
    document.getElementById("barB").style.height = `${barB}%`;
    document.getElementById("barC").style.height = `${barC}%`;

    document.querySelectorAll('.barText').forEach((element, index) => {
        element.innerText = `${arguments[index].toFixed(2)}%`;
    });
}

function saveInputs() {
    const inputs = document.querySelectorAll("#userInputs input");
    inputs.forEach(input => {
        localStorage.setItem(input.id, input.value);
    });
}

function loadInputs() {
    const inputs = document.querySelectorAll("#userInputs input");
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        if (savedValue !== null) {
            input.value = savedValue;
        }
    });
}

document.querySelectorAll("#userInputs input").forEach(input => {
    input.addEventListener('input', saveInputs);
});

function initializeLineGraph() {
    const ctx = document.getElementById('lineGraph').getContext('2d');
    lineGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Budget Over Time',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Runs',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Budget',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                zoom: {
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true
                      },
                      mode: 'xy',
                    }
                  }
            }
        }
    });
}

function initializeBetSizeGraph() {
    const ctx = document.getElementById('betSizeGraph').getContext('2d');
    betSizeGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Bet Size Over Time',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Runs',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Bet Size',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    wheel: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            }
        }
    });
}

function initializePieChart() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Blue', 'Red', 'Green'],
            datasets: [{
                label: 'Percentage',
                data: [0, 0, 0],
                backgroundColor: ['#0816e0', '#E0080B', '#48ff00'],
                borderColor: ['#0816e0', '#E0080B', '#48ff00'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function updatePieChart(barA, barB, barC) {
    pieChart.data.datasets[0].data = [barA, barB, barC];
    pieChart.update();
}

function updateLineGraph(run, budget) {
    lineGraph.data.labels.push(run);
    lineGraph.data.datasets[0].data.push(budget);
    lineGraph.update();
}

function updateBetSizeGraph(run, betSize) {
    betSizeGraph.data.labels.push(run);
    betSizeGraph.data.datasets[0].data.push(betSize);
    betSizeGraph.update();
}

function resetLineGraph() {
    lineGraph.data.labels = [];
    lineGraph.data.datasets[0].data = [];
    lineGraph.update();
}

function resetBetSizeGraph() {
    betSizeGraph.data.labels = [];
    betSizeGraph.data.datasets[0].data = [];
    betSizeGraph.update();
}

function start() {
    document.getElementById('blueButton').addEventListener('click', () => {
        selectColor('blue');
        target = 0;
    });
    document.getElementById('redButton').addEventListener('click', () => {
        selectColor('red');
        target = 1;
    });
    document.getElementById('greenButton').addEventListener('click', () => {
        selectColor('green');
        target = 2;
    });
    wins = 0;
    losses = 0;
    chosen = [0, 0, 0];
    runsTotal = 0;
    startBudget = 0;
    budget = 0;
    bet = 0;
    maxBet = 0;
    currentWinStreak = 0;
    currentLossStreak = 0;
    longestWinStreak = 0;
    longestLossStreak = 0;
    document.getElementById("winText").innerText = `Wins: ${wins}`;
    document.getElementById("lossText").innerText = `Losses: ${losses}`;
    document.getElementById("runText").innerText = `Runs: ${runsTotal}`;
    document.getElementById("budgetText").innerText = `Budget: $${budget}`;
    document.getElementById("betText").innerText = `Bet: $${bet}`;
    document.getElementById("profitText").innerText = `Profit: $${(budget - startBudget).toFixed(2)}`;
    document.getElementById("maxBetText").innerText = `Max Bet: $${maxBet}`;
    document.getElementById("longestWinStreakText").innerText = `Longest Win Streak: ${longestWinStreak}`;
    document.getElementById("longestLossStreakText").innerText = `Longest Loss Streak: ${longestLossStreak}`;
    if (started) return;
    let inputs = document.querySelectorAll("#userInputs input");
    let buttons = document.querySelectorAll("#userInputs button");
    for (let input of inputs) {
        if (input.type !== 'checkbox' && (isNaN(input.value) || input.value === "")) {
            alert("Please enter valid numbers in all input fields.");
            return;
        }
    }
    started = true;
    inputs.forEach(input => input.disabled = true);
    buttons.forEach(button => button.disabled = true);
    runs = document.getElementById("runsInput").value;
    budget = parseFloat(document.getElementById("budgetInput").value);
    bet = parseFloat(document.getElementById("betInput").value);
    increase = parseFloat(document.getElementById("increaseInput").value);
    speed = parseFloat(document.getElementById("speedInput").value);

    let blueProb = parseFloat(document.getElementById("blueProbInput").value) / 100;
    let redProb = parseFloat(document.getElementById("redProbInput").value) / 100;
    let greenProb = parseFloat(document.getElementById("greenProbInput").value) / 100;
    let multiplier = 0;
    if (target === 0) {
        multiplier = parseFloat(document.getElementById("blueMultiplierInput").value);
    } else if (target === 1) {
        multiplier = parseFloat(document.getElementById("redMultiplierInput").value);
    } else if (target === 2) {
        multiplier = parseFloat(document.getElementById("greenMultiplierInput").value);
    }
    if (blueProb + redProb + greenProb !== 1) {
        alert("Probabilities must sum up to 100%");
        inputs.forEach(input => input.disabled = false);
        buttons.forEach(button => button.disabled = false);
        started = false;
        return;
    }

    if (bet > budget) {
        bet = budget;
    }
    startBudget = budget;
    chosen = [0, 0, 0];

    resetLineGraph();
    resetBetSizeGraph();

    for (let i = 0; i < runs; i++) {
        if (!started) break;
        let timeout = setTimeout(() => {
            if (!started) return;
            if (budget <= 0) {
                betSizeGraph.data.labels.pop();
                betSizeGraph.data.datasets[0].data.pop();
                betSizeGraph.update();
                alert("Simulation ended: Budget reached 0.");
                inputs.forEach(input => input.disabled = false);
                buttons.forEach(button => button.disabled = false);
                started = false;
                clearTimeouts();
                return;
            }
            let num = Math.random();
            if (num < blueProb) {
                num = 0;
            } else if (num < blueProb + redProb) {
                num = 1;
            } else {
                num = 2;
            }
            chosen[num]++;
            if (num === target) {
                budget += bet * multiplier;
                wins += 1;
                currentWinStreak++;
                currentLossStreak = 0;
                if (currentWinStreak > longestWinStreak) {
                    longestWinStreak = currentWinStreak;
                }
                bet = parseFloat(document.getElementById("betInput").value);
            } else {
                budget -= bet;
                currentLossStreak++;
                currentWinStreak = 0;
                if (currentLossStreak > longestLossStreak) {
                    longestLossStreak = currentLossStreak;
                }
                bet *= increase;
                if (bet > budget) {
                    bet = budget;
                }
                losses += 1;
            }
            if (bet > maxBet) {
                maxBet = bet;
            }
            let percentage = chosen.map(value => (value / (i + 1)) * 100);
            updateBarChart(...percentage);
            updatePieChart(...percentage);
            updateLineGraph(runsTotal, budget);
            updateBetSizeGraph(runsTotal, bet);
            if (i === runs - 1) {
                inputs.forEach(input => input.disabled = false);
                buttons.forEach(button => button.disabled = false);
                started = false;
                clearTimeouts();
            }
            runsTotal++;
            document.getElementById("winText").innerText = `Wins: ${wins}`;
            document.getElementById("lossText").innerText = `Losses: ${losses}`;
            document.getElementById("runText").innerText = `Runs: ${runsTotal}`;
            document.getElementById("budgetText").innerText = `Budget: $${parseFloat(budget.toFixed(2))}`;
            document.getElementById("betText").innerText = `Bet: $${parseFloat(bet.toFixed(2))}`;
            document.getElementById("profitText").innerText = `Profit: $${(budget - startBudget).toFixed(2)}`;
            document.getElementById("maxBetText").innerText = `Max Bet: $${parseFloat(maxBet.toFixed(2))}`;
            document.getElementById("longestWinStreakText").innerText = `Longest Win Streak: ${longestWinStreak}`;
            document.getElementById("longestLossStreakText").innerText = `Longest Loss Streak: ${longestLossStreak}`;
        }, i * speed);
        timeouts.push(timeout);
    }
}

function clearTimeouts() {
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
}

document.getElementById('generateMultipliersButton').addEventListener('click', generateMultipliers);

function generateMultipliers() {
    const blueProb = parseFloat(document.getElementById("blueProbInput").value) / 100;
    const redProb = parseFloat(document.getElementById("redProbInput").value) / 100;
    const greenProb = parseFloat(document.getElementById("greenProbInput").value) / 100;

    if (blueProb + redProb + greenProb !== 1) {
        alert("Probabilities must sum up to 100%");
        return;
    }

    const houseEdge = 0.95;

    document.getElementById("blueMultiplierInput").value = (houseEdge / blueProb).toFixed(2);
    document.getElementById("redMultiplierInput").value = (houseEdge / redProb).toFixed(2);
    document.getElementById("greenMultiplierInput").value = (houseEdge / greenProb).toFixed(2);
}