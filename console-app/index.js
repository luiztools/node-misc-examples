//index.js
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function preMenu() {
    rl.question(`Pressione qualquer tecla para continuar...`, () => {
        menu();
    })
}

const customers = [];

async function doSomething1() {
    const readlinePromises = require("readline/promises");
    const rl = readlinePromises.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    })

    console.clear();

    const newCustomer = {};
    newCustomer.name = await rl.question("Informe seu nome: ");
    newCustomer.city = await rl.question("Informe sua cidade: ")

    console.log("Cliente cadastrado com sucesso!");
    customers.push(newCustomer);

    preMenu();
}

function menu() {
    setTimeout(() => {
        console.clear();

        console.log("1 - Opção 1");
        console.log("2 - Opção 2");
        rl.question("Escolha sua opção: ", (answer) => {
            switch (answer) {
                case "1": doSomething1(); break;
                case "2": doSomething2(); break;
                default: {
                    console.log('Opção inválida!');
                    menu();
                }
            }
        })

    }, 1000)
}

menu();