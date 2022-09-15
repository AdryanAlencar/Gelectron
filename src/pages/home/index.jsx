import { useContext, useState } from 'react';
import { MessageList } from '../../components/messages';
import { UserList } from '../../components/user';
import { SettingsContext } from '../../context/SettingsContext';
import styles from './styles.module.scss';
import { PlayIcon } from '../../assets/icons';
import { startGource } from '../../services/svn';

// title component that display title.
// on click, it will be editable.
// on blur, it will be saved.
// on enter, it will be saved.
// on esc, it will be saved.

const Title = ({ title, onClick }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [content, setContent] = useState(title);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsEdit(true);
    }
    const handleChange = (e) => {
        setContent(e.target.value);
    }
    const handleSave = () => {
        setIsEdit(false);
        setIsLoading(true);
        onClick(content);
    }

    return (
        <div className={styles.title}>
            {isEdit ? (
                <div className={styles.edit}>
                    <input value={content} onChange={handleChange} />
                    <div className={styles.buttons}>
                        <button onClick={handleSave} className={styles.save}>Save</button>
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.text}>
                        <p onClick={handleClick}>{content}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const Home = () => {
    const [loaded, setLoaded] = useState(false);
    const { team, updatePage, loadSettings, users, updateUsers, saveSettings, messages, updateMessages, title, updateTitle } = useContext(SettingsContext);
    const onChangeUser = (username, alias, photo) => {
        updateUsers(users.map(user => {
            if (user.username === username) {
                user.alias = alias;
                user.photo = photo;
            }

            return user;
        }));

        saveSettings();
    }

    const onChangeMessage = (timestamp, message) => {
        updateMessages(messages.map(m => {
            if (m.timestamp === timestamp) {
                m.message = message;
            }

            return m;
        }));

        saveSettings();
    }


    return (
        <div className={styles.Home}>
            <div className={styles.Header}>
                <div className={styles.logo}>
                    <img src={require('../../assets/images/logo.png')} alt="logo" />
                </div>
                <h1>
                    Gelectron
                </h1>
                <Title 
                    title={title}
                    onClick={updateTitle}
                />              
                <div className={styles.Buttons}>
                    <button 
                        className={styles.Button}
                        onClick={() => updatePage("settings")}    
                    >
                        Settings
                    </button>
                    <button 
                        onClick={e => {
                            startGource(users, team.photo, messages, title);
                        }}
                        className={styles.ButtonIcon}
                    >
                        <img src={PlayIcon} alt="" />
                    </button>
                </div>
            </div>
            <div className={styles.Content}>
                <div className={styles.Users}>
                    <UserList
                        users={users}
                        onClick={onChangeUser}
                    />
                </div>
                <div className={styles.Messages}>
                    <MessageList
                        messages={messages}
                        onClick={onChangeMessage}
                    />
                </div>
            </div>
            {
                (() => {
                    if (!loaded) {
                        loadSettings();
                        setLoaded(true);
                    }
                })()
            }
        </div>
    );
}

export { Home };