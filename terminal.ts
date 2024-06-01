// const terminalProcess = spawn("node", ["/Users/apple/Documents/projects/connect/terminal.js"]);
// i am importing the terminal.js file in the server.ts file and running it in a seperate thread. The terminal.js file is as follows:

// take input continuously from terminal and pass to main thread
import readLine from "readline";

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// console.log("Terminal process started");
// console.log("PID:", process.pid);

// process.stdin.setEncoding("utf-8");
// process.stdin.resume();
// process.stdin.on("data", (data) => {
//     console.log("HIII", data.toString());

//     process.stdout.write(data);
//     if (process.send) {
//         console.log("Sending data to main thread");

//         process.send(data, (error: any) => {
//             if (error) {
//                 console.error("Error:", error);
//             }
//         });
//     }
// });

var waitForUserInput = function () {
  rl.on("line", function (line) {
    console.log("Received:", line);
    if (process.send) {
      process.send(line, function (error: any) {
        console.log("Sending data to main thread");

        if (error) {
          console.error("Error:", error);
        }
      });
    }
  });
};
waitForUserInput();

