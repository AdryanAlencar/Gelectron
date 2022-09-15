import React from "react";
const {app} = window.require('@electron/remote');
const dataPath = app.getPath("userData");

const SettingsContext = React.createContext({
    title: "PDS | Adryan Alencar",
    username: "",
    password: "",
    repository: "",
    page: "splash",
    team: {
        name: "",
        photo: ""
    },
    users: [{
        username: "",
        alias: "",
        photo: ""
    }],
    messages: [{
        message: "",
        timestamp: 0
    }],
    updateUser: (username="") => {},
    updatePassword: (password="") => {},
    updateRepository: (url="") => {},
    updateTeam: (team = {
        name: "",
        photo: ""
    }) => {},
    updateUsers: (users=[{
        username: "",
        alias: "",
        photo: ""
    }]) => {},
    updateMessages: (messages=[{
        message: "",
        timestamp: 0
    }]) => {},
    updateTitle: (title="") => {},
    saveSettings: () => {},
    loadSettings: () => {},
    resetSettings: () => {},
    updatePage: (page="") => {}
});

const UseSettingsContext = (props) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [page, setPage] = React.useState("splash");
    const [repository, setRepository] = React.useState("");
    const [users, setUsers ] = React.useState([]);
    const [messages, setMessages] = React.useState([]);
    const [team, setTeam] = React.useState({});
    const [title, setTitle] = React.useState("PDS | Adryan Alencar");

    const updateUser = (username) => {
        setUsername(username);
    }

    const updatePassword = (password) => {
        setPassword(password);
    }

    const updateRepository = (repository) => {
        setRepository(repository);
    }

    const updateTeam = (team) => {
        setTeam(team);
    }

    const updateUsers = (users) => {
        setUsers(users);
    }

    const updateMessages = (messages) => {
        setMessages(messages);
    }

    const updateTitle = (title) => {
        setTitle(title);
    }

    const updatePage = (page) => {
        setPage(page);
    }

    const saveSettings = () => {
        const settings = {
            username,
            password,
            repository,
            team,
            users,
            messages,
            title
        }
        const settingsPath = `${dataPath}/settings.json`;
        const fs = window.require('fs');
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
    }

    const loadSettings = () => {
        const settingsPath = `${dataPath}/settings.json`;
        const fs = window.require('fs');

        //IF FILE DOESN'T EXIST, CREATE IT
        if (!fs.existsSync(settingsPath)) {
            fs.writeFileSync(settingsPath, JSON.stringify({}));
        }

        const settings = JSON.parse(fs.readFileSync(settingsPath));
        setUsername(settings.username);
        setPassword(settings.password);
        setRepository(settings.repository);
        setUsers(settings.users || []);
        setTeam(settings.team || {
            name: "",
            photo: ""
        });
        setMessages(settings.messages || []);
        setTitle(settings.title || "PDS | Adryan Alencar");
    }
    
    const resetSettings = () => {

        // delete projetolog.xml and settings.json file
        const {exec} = window.require('child_process');
        const command = `rm -rf ${dataPath}/projectolog.xml && rm -rf ${dataPath}/settings.json`;
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }
        });

        const settingsPath = `${dataPath}/settings.json`;
        const fs = window.require('fs');

        //IF FILE DOESN'T EXIST, CREATE IT
        if (!fs.existsSync(settingsPath)) {
            fs.writeFileSync(settingsPath, JSON.stringify({}));
        }


        updateUser("");
        updatePassword("");
        updateRepository("");
        updateUsers([]);
        updateTeam({
            name: "",
            photo: ""
        });
        updateMessages([]);
        updateTitle("PDS | Adryan Alencar");

    }

    return(
        <SettingsContext.Provider value={{
            username,
            password,
            repository,
            team,
            users,
            messages,
            title,
            page,
            updateUser,
            updatePassword,
            updateRepository,
            updateTeam,
            saveSettings,
            loadSettings,
            resetSettings,
            updateUsers,
            updateMessages,
            updateTitle,
            updatePage,
        }}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export { UseSettingsContext, SettingsContext }