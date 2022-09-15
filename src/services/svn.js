
import { parseXml, xml2json } from "../utils/json2xml";
const {app} = window.require('@electron/remote');
const { exec } = window.require("child_process");
const fs = window.require('fs');
const DecompressZip = window.require('decompress-zip');

const dataPath = app.getPath("userData").replace(" ", "\\ ");
const dirs = [
    `${dataPath}/gource`,
    `${dataPath}/gource/img`,
    `${dataPath}/gource/ffmpeg`
];

const buildDirs = () => {
    dirs.forEach(dir => {
        dir = dir.replace("\\", "");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
}

const getSvnRepository = async (url, username, password) => {
    const command = `rm -rf ${dataPath}/repo && svn --non-interactive --trust-server-cert --username=${username} --password=${password} checkout ${url} ${dataPath}/repo`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({
                    error,
                    stderr
                });
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
                reject({
                    error,
                    stderr
                });
            }
            resolve(stdout);
        });
    });    
}

const startGource = async (users, logo, messages, title) => {
    const command = `gource projetolog.xml --caption-file "timestamp.txt" --caption-size 20 --caption-duration 3 --caption-colour FFD700 --logo "./img/logo.png" --logo-offset 10x10 --stop-at-end --key --user-image-dir "./img" -1280x720 --title "${title}" --seconds-per-day 1.2 --hide filenames --disable-progress --auto-skip-seconds 1 --date-format "%d/%m/%y  %H:%M:%S" -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 "${title}.mp4"`
    
    await preapreGource(users, logo, messages, title)
    
    return new Promise((resolve, reject) => {
        exec(command,{
            cwd: `${dataPath}/gource`
        }, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                console.log(stderr);
                reject({
                    error,
                    stderr
                });
            }
            resolve(stdout);
        });
    });
}

const preapreGource = async (users, logo, messages, title) => {
    buildDirs();
    formatTimestamp(messages);
    exportLogo(logo);
    exportImage(users);

    new Promise((resolve, reject) => {
        try { 
            replaceLog(users).then(log => {
                const file = `${app.getPath('userData')}/gource/projetolog.xml`;
                const writer = fs.createWriteStream(file);
                writer.write(log);
                resolve(log);
            })
        } catch (error) {
            reject({
                error
            })
        }
    })
}

const formatTimestamp = (messages) => {
    const filePath = `${app.getPath('userData')}/gource/timestamp.txt`;
    const file = fs.createWriteStream(filePath);
    //timestamp in seconds with no decimal

    messages.forEach(message => {    
        file.write(`${message.timestamp}|${message.message}\n`);
    });
}

// load projetolog.xml and replace all username by alias
const replaceLog = async (users) => {
    const filePath = `${app.getPath('userData')}/projetolog.xml`;
    var file = fs.readFileSync(filePath, 'utf8');
    users.forEach(user => {
        file = file.replaceAll(user.username, user.alias);
    })
    return file;
}

// save all photos of user
const exportImage = (users) => {
    users.forEach(user => {
        exportBase64ToPng(user.photo, user.alias)
    })
}

const exportLogo = (logo) => {
    exportBase64ToPng(logo, 'logo');
}

// read projetolog.xml file and parse to json
const getCommits = () => {
    const file = `${app.getPath('userData')}/projetolog.xml`;
    const xml = fs.readFileSync(file, 'utf8');
    if(xml.length === 0) {
        return null;
    }
    const json = xml2json(parseXml(xml), '  ');

    return json;
}

const exportBase64ToPng = (base64, name) => {
    // try mkdir
    buildDirs();

    const file = `${app.getPath('userData')}/gource/img/${name}.png`;
    // png and jpeg
    const data = base64.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(file, data, 'base64');
}

export { 
    getSvnRepository,
    generateLog,
    startGource,
    getCommits,
    exportBase64ToPng,
};

