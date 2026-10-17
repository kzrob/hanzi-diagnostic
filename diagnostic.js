
// Functions

async function fetchCSV(tsv) {
    try {
        const response = await fetch(tsv);
        const csvText = await response.text();
        const rows = csvText.split("\n");
        const headers = rows[0].split("\t");
        const dataset = rows.slice(1).map(row => {
            const values = row.split("\t");
            const rowObject = {};
            headers.forEach((header, index) => {
                rowObject[header] = values[index];
            });
            return rowObject;
        });
        return dataset;
    } catch (error) {
        console.error(error);
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min_value, max_value) {
    return Math.max(min_value, Math.min(value, max_value))
}

function calc_stats(recognized) {
    const p_hat = recognized / n
    const MoE = z * ((p_hat * (1 - p_hat) / n) ** 0.5)

    const num = p_hat * N
    const error = MoE * N
    
    let status = 0
    if (num < 10) { // less than 10 correct
        status = 1
    }
    if (N - num < 10) { // less than 10 incorrect
        status = 2
    }
    
    return { num, error, status }
}

// Variables

const z = 1.96 // 95% confidence level
let n = 50; // default sample size
let N = 2000; // default population size
let i = 1; // dataset index
let count = 1; // number of characters tested
let recognized = 0; // number of recognized characters

// DOM

const configForm = document.getElementById("config-form");
const diagnosticForm = document.getElementById("diagnostic-form");
const diagnosticDiv = document.getElementById("diagnostic-div");
const character = document.getElementById("character");
const log = document.getElementById("log");
const resetButton = document.getElementById("reset-button");
let dataset = fetchCSV("data/CharFreq.tsv").then(data => {dataset = data;});

// Execute

configForm.addEventListener("submit", (event) => {
    event.preventDefault();
    configForm.style.display = "none";
    diagnosticDiv.style.display = "block";
    
    const formData = new FormData(event.target);
    n = clamp(parseInt(formData.get("n")), 1, 100);
    N = clamp(parseInt(formData.get("N")), n, 9933);

    i = randomInt(1, N);
    character.textContent = dataset[i]["char"];
});

diagnosticForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const pinyin = formData.get("pinyin");
    
    if (dataset[i]["pinyin"].split("/").includes(pinyin)) {
        log.textContent = `Correct! (${dataset[i]["pinyin"]})\n` + log.textContent;
        recognized++;
    } else {
        log.textContent = `Incorrect, should be ${dataset[i]["pinyin"]}, you said ${pinyin}\n` + log.textContent;
    }
    
    log.textContent = `#${count}/${n}: ${dataset[i]["char"]}    ` + log.textContent;
    diagnosticForm.reset();
    
    count++;

    if (count > n) {
        const stats = calc_stats(recognized);
        log.textContent = `Config: N=${N}, n=${n}\n` + log.textContent;
        log.textContent = `Estimated vocab: ${stats.num} ± ${stats.error} characters\n` + log.textContent;
        log.textContent = `Score: ${recognized}/${n}\n` + log.textContent;
        diagnosticForm.style.display = "none";
        resetButton.style.display = "block";
        return
    }

    log.textContent = log.textContent;
    i = randomInt(1, N);
    character.textContent = dataset[i]["char"];
});

resetButton.addEventListener("click", () => {
    diagnosticDiv.style.display = "none";
    configForm.style.display = "flex";
    diagnosticForm.style.display = "flex";
    resetButton.style.display = "none";
    i = 1;
    count = 1;
    recognized = 0;
    log.textContent = "";
});