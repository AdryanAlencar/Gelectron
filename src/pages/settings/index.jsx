import { useContext, useState } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { generateLog, getSvnRepository } from '../../services/svn';
import Swal from 'sweetalert2';
import { CogIcon } from '../../assets/icons';
import styles from './styles.module.scss';

const Settings = () => {

    const {
        username,
        password,
        repository,
        updateUser,
        updatePassword,
        updateRepository,
        saveSettings,
        loadSettings
    } = useContext(SettingsContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            text: 'Cloning SVN repository!',
            didOpen: () => {
                getSvnRepository(repository, username, password).then((response) => {
                    console.log(response);
                    Swal.close()
                });
                Swal.showLoading()
            },
            willClose: () => {
                Swal.fire("", "Saved!", "success")
            }
        })
    }

    const handleGenerate = (e) => {
        e.preventDefault();
        Swal.fire({
            text: 'Generating log!',
            didOpen: () => {
                generateLog().then((response) => {
                    console.log(response);
                    Swal.close()
                });
                Swal.showLoading()
            },
            willClose: () => {
                Swal.fire("", "Saved!", "success")
            }
        })
    }

    // return a form to set the username, password and repository and a button to submit the form
    return (
        <div className={styles.Settings}>
            <div className={styles.Header}>
                <div className={styles.Icon}>
                    <img src={CogIcon} alt="Settings" />
                </div>
                <h1>Settings</h1>
            </div>
            <div className={styles.Content}>
                <div className={styles.FormGroup}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => updateUser(e.target.value)} />
                </div>
                <div className={styles.FormGroup}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => updatePassword(e.target.value)} />
                </div>
                <div className={styles.FormGroup}>
                    <label htmlFor="repository">Repository:</label>
                    <input type="url" id="repository" value={repository} onChange={(e) => updateRepository(e.target.value)} />
                </div>
                <div className={styles.Actions}>
                    <button type="button" onClick={e => handleSubmit(e)} >Clone</button>
                    <button type='button' onClick={e => handleGenerate(e)}>Generate Log</button>
                    <button type='button' onClick={e => saveSettings()}>Save Settings</button>
                    <button type='button' onClick={e => loadSettings()}>Load Settings</button>
                </div>
            </div>
        </div>
    );
}

export { Settings };