const {app} = window.require('@electron/remote');
const { exec } = window.require("child_process");
const dataPath = app.getPath("userData");

const getSvnRepository = async (url, username, password) => {
    const command = `rm -rf repo && svn --non-interactive --trust-server-cert --username=${username} --password=${password} checkout ${url} ${dataPath}/repo`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    });
}

//svn log repo -r 1:HEAD --xml --verbose > projetolog.xml
const generateLog = async () => {
    const command = `svn log ${dataPath}/repo -r 1:HEAD --xml --verbose > ${dataPath}/projetolog.xml`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    });    
}

export { getSvnRepository, generateLog };

