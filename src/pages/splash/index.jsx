import { useContext, useState } from 'react';
import { SettingsContext } from '../../context/SettingsContext';
import styles from './styles.module.scss';

const Splash = () => {
    const {updatePage, loadSettings, page} = useContext(SettingsContext)
    const [loaded, setLoaded] = useState(false);

    const onLoad = () => {
        setLoaded(true);
        loadSettings();
        setTimeout(() => {
            updatePage('home');
        }, 2000);
    }
    

    return (
        <div className={styles.splash}>
            <div className={styles.title}>
                <img src={require('../../assets/images/logo-title.png')} alt="logo" />
            </div>
            <div className={styles.subtitle}>
                <h3>
                    @AdryanAlencar
                </h3>
            </div>

        {
            (() => {
                if(!loaded) {
                    onLoad()
                }
            })()
        }
        </div>
    )
}

export {
    Splash
}