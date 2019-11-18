const { mkdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require('fs');
const { sep, join, dirname } = require('path');
const sjcl = require('sjcl');

const getSourceCode = (b) => {
    let sourceCode = b.getSource();
    if (sourceCode === '') { // handles the @babel/plugin-transform-destructuring bug (that turns the Node object into a plain JavaScript object, causing it not to have any start/end properties)
        const code = file.hub.getCode();
        const lines = code.split(/\r?\n/);
        const { loc: { start, end } } = b.node;
        const sourceLines = lines.slice(start.line-1, end.line);
        sourceLines[sourceLines.length-1] = sourceLines[sourceLines.length-1].slice(0, end.column);
        sourceLines[0] = sourceLines[0].slice(start.column);
        sourceCode = sourceLines.join("\n");
    }
    return sourceCode;
};

module.exports = function({ types: t }) {
    let moduleName;
    let pwd;
    let serverFileName;
    let contents;
    return {
        pre({ opts: { cwd, filename } }) {
            const pieces = filename.substr(cwd.length).split(sep);
            pieces.shift();
            pieces.shift();
            moduleName = pieces.join(sep);
            pwd = cwd;
            serverFileName = null;
            contents = '';
        },
        visitor: {
            CallExpression(path, { file, opts: { targetPath } }) {
                if (targetPath && !serverFileName) {
                    serverFileName = join(pwd, targetPath, 'privy', moduleName);
                }
                if (path.node.callee.name === 'initServerSide') {
                    const a = path.get('arguments');
                    const b = a[0];
                    if (a.length < 1) {
                        throw path.buildCodeFrameError(`Function (runServerSideAsync) has too few arguments (${a.length})`);
                    }
                    if (a.length > 1) {
                        throw path.buildCodeFrameError(`Function (runServerSideAsync) has too many arguments (${a.length})`);
                    }
                    if (!b.isFunction()) {
                        throw path.buildCodeFrameError(`First argument of function (runServerSideAsync) is an unsupported type (${b.type})`);
                    }
                    if (b.node.async === true) {
                        throw path.buildCodeFrameError(`First argument of function (runServerSideAsync) is async`);
                    }
                    const c = b.get('body').get('body');
                    const { loc: { start: { line: startLine } } } = c[0].node;
                    const { loc: { end: { line: endLine } } } = c[c.length-1].node;
                    if (startLine === endLine) {
                        contents += `\n// line ${startLine}\n`;
                    } else {
                        contents += `\n// lines ${startLine}-${endLine}\n/* eslint-disable indent */\n`;
                    }
                    for (let i = 0; i < c.length; i++) {
                        const d = c[i];
                        const sourceCode = d.getSource();
                        contents += `${sourceCode}\n`;
                    }
                    if (startLine !== endLine) {
                        contents += `/* eslint-enable indent */\n`;
                    }
                    path.remove();
                } else if (path.node.callee.name === 'runServerSideAsync') {
                    const a = path.get('arguments');
                    if (a.length < 1) {
                        throw path.buildCodeFrameError(`Function (runServerSideAsync) has too few arguments (${a.length})`);
                    }
                    if (a.length > 1) {
                        throw path.buildCodeFrameError(`Function (runServerSideAsync) has too many arguments (${a.length})`);
                    }
                    const b = a[0];
                    if (b.isStringLiteral()) {
                        return;
                    }
                    if (!b.isFunction()) {
                        throw path.buildCodeFrameError(`First argument of function (runServerSideAsync) is an unsupported type (${b.type})`);
                    }
                    if (b.node.async !== true) {
                        throw path.buildCodeFrameError(`First argument of function (runServerSideAsync) is not async`);
                    }
                    // for (let n in b) {
                    //     // if (n !== 'isStringLiteral') {
                    //     //     continue;
                    //     // }
                    //     // if (n.match(/^is[A-Z]/)) {
                    //     //     console.log(`N: ${n}, ${b[n]}`);
                    //     // } else {
                    //     //     console.log(`N: ${n}`);
                    //     // }
                    //     console.log(`${n} (${typeof b[n]})`);
                    //     }
                    // console.log("**********");
                    // console.log(b);
                    const sourceCode = getSourceCode(b);
                    const bitArray = sjcl.hash.sha256.hash(sourceCode);
                    const exportName = sjcl.codec.hex.fromBits(bitArray);
                    const { loc: { start: { line: startLine }, end: { line: endLine } } } = b.node;
                    if (startLine === endLine) {
                        contents += `\n// line ${startLine}\nmodule.exports['${exportName}'] = ${sourceCode};\n`;
                    } else {
                        contents += `\n// lines ${startLine}-${endLine}\n/* eslint-disable indent */\nmodule.exports['${exportName}'] = ${sourceCode};\n/* eslint-enable indent */\n`;
                    }
                    b.replaceWith(t.stringLiteral(moduleName+':'+exportName));
                }
            }
        },
        post() {
            if (contents === '') {
                if (existsSync(serverFileName)) {
                    unlinkSync(serverFileName);
                }
            } else {
                contents = "// *** code auto-generated by privy-babel-plugin ***\n"+contents;
                if (existsSync(serverFileName)) {
                    const fileContents = readFileSync(serverFileName, 'utf-8');
                    if (fileContents !== contents) {
                        writeFileSync(serverFileName, contents);
                    }
                } else {
                    mkdirSync(dirname(serverFileName), {recursive: true});
                    writeFileSync(serverFileName, contents);
                }
            }
        }
    };
};
