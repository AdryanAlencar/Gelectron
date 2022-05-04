import React from "react";
const {app} = window.require('@electron/remote');
const dataPath = app.getPath("userData");

const SettingsContext = React.createContext("");

const UseSettingsContext = (props) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repository, setRepository] = React.useState("");

    const updateUser = (username) => {
        setUsername(username);
    }

    const updatePassword = (password) => {
        setPassword(password);
    }

    const updateRepository = (repository) => {
        setRepository(repository);
    }

    const saveSettings = () => {
        const settings = {
            username,
            password,
            repository
        }
        const settingsPath = `${dataPath}/settings.json`;
        const fs = window.require('fs');
        fs.writeFileSync(settingsPath, JSON.stringify(settings));
    }

    const loadSettings = () => {
        const settingsPath = `${dataPath}/settings.json`;
        const fs = window.require('fs');
        const settings = JSON.parse(fs.readFileSync(settingsPath));
        setUsername(settings.username);
        setPassword(settings.password);
        setRepository(settings.repository);
    }
    
    return(
        <SettingsContext.Provider value={{
            username,
            password,
            repository,
            updateUser,
            updatePassword,
            updateRepository,
            saveSettings,
            loadSettings
        }}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export { UseSettingsContext, SettingsContext }