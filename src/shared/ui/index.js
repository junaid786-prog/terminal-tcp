const inquirer = require("inquirer")

const prompt = inquirer.createPromptModule();


function input(message) {
    return prompt([
        {
            type: "input",
            name: "input",
            message: message,
            theme: "simple",
        },
    ], ((ans) => ans.input));
}

function confirm(message) {
    return prompt([
        {
            type: "confirm",
            name: "confirm",
            message: message,
            theme: "simple",
        },
    ], ((ans) => ans.confirm));
}

function list(message, choices) {
    return prompt([
        {
            type: "list",
            name: "list",
            message: message,
            choices: choices,
            theme: "simple",
        },
    ], ((ans) => ans.list));
}

function select(message, choices) {
    return prompt([
        {
            type: "checkbox",
            name: "select",
            message: message,
            choices: choices,
            theme: "simple",
        },
    ], ((ans) => ans.select));
}

function password(message) {
    return prompt([
        {
            type: "password",
            name: "password",
            message: message,
            theme: "simple",
        },
    ], ((ans) => ans.password));
}

function display(message) {
    prompt([
        {
            type: "list",
            name: "display",
            message: message,
            choices: ["OK"],
            theme: "simple",
        },
    ]);
}

const ui = {
    input,
    confirm,
    list,
    select,
    password,
    display,
};

module.exports = ui;