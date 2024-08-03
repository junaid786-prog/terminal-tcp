const { Socket } = require("net");
const ui = require("../../../../shared/ui");
const { install } = require("../../../setup");
const { registerClient, connectClient } = require("../../services/connectionService");

/**
 * 
 * @param {Socket} socket 
 */
function handleMainMenu(socket) {
    let options = ["Install", "Register", "Login", "Exit"];

    ui.list("Select an option", options).then((option) => {
        console.log("Option selected: ", option);

        switch (option.list) {
            case "Install":
                install(socket);
                handleMainMenu(socket);
                break;
            case "Register":
                registerClient(socket);
                handleMainMenu(socket);
                break;
            case "Login":
                connectClient(socket);
                break;
            case "Exit":
                socket.end();
                break;
        }
    });
}

function handleUserLoggedInMenu(socket) {
    let options = [
        "Send Message",
        "View Messages",
        "Send File",
        "Run Command",
        "Main Menu",
        "Logout",
        "Exit"
    ];

    ui.list("Select an option", options).then((option) => {
        console.log("Option selected: ", option);

        switch (option.list) {
            case "Send Message":
                break;
            case "View Messages":
                break;
            case "Send File":
                break;
            case "Run Command":
                break;
            case "Main Menu":
                handleMainMenu(socket);
                break;
            case "Logout":
                socket.write(JSON.stringify({ type: "logout" }));
                handleMainMenu(socket);
                break;
            case "Exit":
                socket.end();
                break;
        }
    });
}

const connection = {
    handleMainMenu,
    handleUserLoggedInMenu
};

module.exports = connection;