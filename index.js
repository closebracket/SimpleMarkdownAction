const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');
const startDirectory = process.env.START_DIRECTORY;
let alltemplates = [];


async function main() {
    try {
        // Enter main function
        // Check directories and add templates to alltemplates array
        await checkDirectories(startDirectory);
        // Exit success 
        core.ExitCode = 0;
    }
    catch (error) {
        core.setFailed(error.message);
        // Exit failure
        core.ExitCode = 1;
    }
}

main();

async function checkDirectories(directoryPath) {
    try {
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);

            // Change filePath to your preferred directory name, e.g. "guides" or "contents"
            // The default directory name is "templates"
            if (stats.isDirectory()) {
                if (filePath != "templates") {
                    continue;
                }
                else {
                    core.info(`Found template directory: ${filePath}`);
                    await checkDirectories(filePath);

                    const templates = fs.readdirSync(filePath);
                    for (const template of templates) {
                        alltemplates.push(template);
                        core.info(`Added Template: ${template}`);
                    }
                }
            }
        }
    } catch (error) {
        core.setFailed(error.message);
        // Exit failure
        core.ExitCode = 1;
    }
}