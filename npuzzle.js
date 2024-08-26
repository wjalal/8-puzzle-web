const { exec } = require('node:child_process');

const runnp = async (gameArr) => {
    // console.log("echo" + gameArr);
    let inputStr = "echo ";
    inputStr = inputStr + gameArr.join(" ");
    console.log(inputStr);
    let execStr = inputStr + "| ./n-puzzle"
    let npzx = exec (execStr, (error, stdout, stderr) => {
        // console.log(stdout);
        let json = JSON.parse(stdout.split("JSON")[1]);
        console.log(json);
    });
};

runnp([4, 8, 10, 6, 4, 1, 15, 12, 11, 7, 9, 5, 2, 13, 3, 14, 0]);

// runnp ( [4, 
//     4, 12, 7, 1, 14, 0, 9, 6, 11, 3, 8, 13, 2, 10, 15, 5
// ]);