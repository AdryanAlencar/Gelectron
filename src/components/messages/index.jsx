import { useState } from 'react';
import styles from './styles.module.scss';

// a react component that will show a <p> message.
// when user click the message, the message will be turn editable.
// the user can be reverse the message to the original message.
// the message will be saved when the user click the save button.
// the message will be cancel when the user click the cancel button.
const Message = ({ message, onClick }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [content, setContent] = useState(message.message);
    const [isLoading, setIsLoading] = useState(false);
    const [applyMessage, setApplyMessage] = useState("Apply");

    const handleClick = () => {
        setIsEdit(true);
    }
    const handleChange = (e) => {
        setContent(e.target.value);
    }
    const handleSave = () => {
        setIsEdit(false);
        setIsLoading(true);
    }
    const handleCancel = () => {
        setIsEdit(false);
    }

    const apply = () => {
        setApplyMessage("Applying...");
        onClick(message.timestamp, content);
        setTimeout(() => {
            setApplyMessage("Ok!");

            setTimeout(() => {
                setApplyMessage("Apply");
            }, 1000);

        }, 1500);
    }

    return (
        <div className={styles.message}>
            {isEdit ? (
                <div className={styles.edit}>
                    <textarea value={content} onChange={handleChange} />
                    <div className={styles.buttons}>
                        <button onClick={handleSave} className={styles.save}>Save</button>
                        <button onClick={handleCancel} className={styles.cancel} >Cancel</button>
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.text}>
                        <p onClick={handleClick}>{content}</p>
                    </div>
                    <div className={styles.actions}>
                        <button
                            onClick={apply}
                            className={styles.apply}
                        >
                            {applyMessage}
                        </button>
                        <button
                            onClick={() => {
                                setContent(message.message)
                            }}
                            className={styles.cancel}
                        >
                            Reset
                        </button>
                    </div>
                </div>                
            )}
        </div>
    );
}

const MessageList = ({ messages, onClick }) => {
    return (
        <div className={styles.messages}>
            {
                messages.map(message => (
                    <Message
                        key={message.timestamp}
                        message={message}
                        onClick={onClick}
                    />
                ))
            }
        </div>
    );
}

export {
    MessageList,
    Message
}