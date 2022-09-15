import { useContext } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import { generateLog, getSvnRepository } from '../../services/svn';
import { getCommits } from '../../services/svn';
import { filterMessages, filterUsers } from '../../utils/filters';
import Swal from 'sweetalert2';
import { CogIcon } from '../../assets/icons';
import styles from './styles.module.scss';
import { PhotoUpload } from '../../components/photo';


const Settings = () => {

    const {
        username,
        password,
        repository,
        updateUser,
        team,
        updatePassword,
        updateRepository,
        saveSettings,
        loadSettings,
        resetSettings,
        updateTeam,
        users,
        updateMessages,
        updateUsers,
        messages,
        updatePage
    } = useContext(SettingsContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        var success = false;

        Swal.fire({
            text: 'Cloning SVN repository!',
            didOpen: () => {
                getSvnRepository(repository, username, password).then((response) => {
                    console.log(response);
                    success = true;
                    Swal.close();
                })
                    .catch(err => {
                        Swal.fire({
                            text: err.stderr,
                            icon: 'error',
                            showCloseButton: true
                        }).then(confirm => {
                            Swal.close();
                        })
                    })
                Swal.showLoading()
            },
            willClose: () => {
                if (success) {
                    Swal.fire("", "Saved!", "success")
                }
            }
        })
    }

    const handleGenerate = (e) => {
        e.preventDefault();
        var success = false;

        Swal.fire({
            text: 'Generating log!',
            didOpen: () => {
                generateLog().then((response) => {
                    console.log(response);
                    success = true;
                    loadUsers();
                    Swal.close()
                }).catch(err => {
                    console.log(err);
                    Swal.fire({
                        text: err.stderr,
                        icon: 'error',
                        showCloseButton: true
                    }).then(confirm => {
                        Swal.close();
                    })
                })
                Swal.showLoading()
            },
            willClose: () => {
                if (success) {
                    Swal.fire("", "Saved!", "success")
                }
            }
        })
    }

    const loadUsers = () => {
        const commits = getCommits();
        if (users.length === 0 && commits !== null) {
            updateUsers(filterUsers(commits));
            loadMessages();
        }
    }

    const loadMessages = () => {
        const commits = getCommits();
        if(messages.length === 0 && commits !== null) {
            console.log(messages)
            updateMessages(filterMessages(commits));
        }
    }

    // return a form to set the username, password and repository and a button to submit the form
    return (
        <div className={styles.Settings}>
            <div className={styles.Header}>
                <div className={styles.Icon}>
                    <img src={CogIcon} alt="Settings" />
                </div>
                <h1>Settings</h1>
                <div className={styles.Buttons}>
                    <button
                        className={styles.Button}
                        onClick={() => updatePage("home")}
                    >
                        Home
                    </button>
                </div>
            </div>
            <div className={styles.Content}>
                <div className={styles.Row}>
                    <div className={styles.Col}>
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
                    </div>
                    <div className={styles.Col}>
                        <PhotoUpload 
                            image={team.photo}
                            updatePhoto={(photo) => updateTeam({
                                name: team.name,
                                photo
                            })}
                        />
                    </div>
                </div>
                <div className={styles.Actions}>
                    <button type="button" onClick={e => handleSubmit(e)} >Clone</button>
                    <button type='button' onClick={e => handleGenerate(e)}>Generate Log</button>
                    <button type='button' onClick={e => saveSettings()}>Save Settings</button>
                    <button type='button' onClick={e => loadSettings()}>Load Settings</button>
                    <button type='button' onClick={e => {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "You won't be able to revert this!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.value) {
                                resetSettings();
                                saveSettings();
                                Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
                            }
                        })
                    }}>Reset Settings</button>
                </div>
            </div>
        </div>
    );
}

export { Settings };