const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 8888;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.enable('trust proxy');

const run_npz = async (gameArr) => {
    let result;
    try {
        if (!Array.isArray(gameArr)) throw new Error ("Arg is not array");
        if (gameArr.length != 9) throw new Error ("Arg array size != 9");
        for (let i=0; i<9; i++) {
            if (!Number.isInteger(gameArr[i])) throw new Error ("Non-integer element in array : " + i);
            if (gameArr[i]<0 || gameArr[i]>8) throw new Error ("Array element value out of range : " + i);
        };
        if (new Set(gameArr).size !== gameArr.length) throw new Error ("Array has duplicates");
        let inputStr = "echo 3 ";
        inputStr = inputStr + gameArr.join(" ");
        let execStr = inputStr + "| ./n-puzzle"
        const { stdout } = await exec(execStr)
        result = await JSON.parse(stdout.split("JSON")[1]);
        if (result.solvable && result.nMoves != result.moves.length - 1) 
            throw new Error ("Something's wrong, I can feel it");
        result.success = true;
    } catch (err) {
        console.log (err);
        result = {
            success: false,
        };
    } finally {
        return result;
    };
};

app.post('/api/getSolution', async (req, res) => {
    console.log ("received: " + req.body);
    let result = await run_npz (req.body);
    res.send(result);
});

app.use(express.static(path.resolve(__dirname, 'html')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'html', 'index.html'));
});


app.listen(port, () => {
    console.log (`\n8-Puzzle backend listening on port ${port}\n`);
});
