const { exec } = require("child_process");

/**
 * @typedef {import('../../../types/types.ts').CommandResponse} CommandResponse
 * @typedef {import('../../../types/types.ts').Command} Command
 */

/**
 * 
 * @param {Command} data - The command object containing the command
 * @param {Function} callback - The callback function to call after executing the command
 * @returns {CommandResponse} The response object containing the success status, message and data
 */
function handleCommand(data, callback) {
    let command = data?.data?.command;
    let currentDirectory = process.cwd();

    console.log("Command received:", command);

    let resp = null;

    if (command === "pwd") {
        console.log("Printing working directory");
        resp = {
            success: true,
            message: "Printing working directory",
            data: { currentDirectory },
        };

        console.log("Response: ", resp);
        callback(resp);
    }

    if (command.startsWith("cd")) {
        console.log("Changing directory");

        const targetDirectory = command.slice(3).trim(); // Extract target directory
        process.chdir(targetDirectory); // Change directory locally
        currentDirectory = process.cwd(); // Update current directory

        resp = {
            success: true,
            message: "Changing directory",
            data: { currentDirectory },
        };

        console.log("Response: ", resp);
        callback(resp);
    } else {
        console.log("Executing command");

        exec(command, (error, stdout, stderr) => {
            console.log("Command executed successfully::" + stdout);

            if (error) {
                console.log(`error: ${error.message}`);
                resp = {
                    success: false,
                    message: error.message,
                    data: "",
                };
                console.log(" Error response: ", resp);
                callback(resp);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                resp = {
                    success: false,
                    message: stderr,
                    data: "",
                };

                console.log(" Error response: ", resp);
                callback(resp);
            }
            console.log(`stdout: ${stdout}`);
            resp = {
                success: true,
                message: "Command executed successfully",
                data: stdout,
            };

            console.log("Response: ", resp);
            callback(resp);
        });
    }
}

const CommandHandler = { handleCommand };
module.exports = CommandHandler;