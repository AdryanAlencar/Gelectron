import React, { createRef } from "react"
import { SettingsContext } from "../../context/SettingsContext";
import styles from './styles.module.scss';

class PhotoUpload extends React.Component{

    inputPhoto = createRef(document.createElement('input'));

    static contextType = SettingsContext;

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            file: null,
            imagePreviewUrl: this.props.image
        };
    }

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        
        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result.toString()
            });
            this.props.updatePhoto(reader.result.toString());
        }
        reader.readAsDataURL(file);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const { team, updateTeam } = this.context;
        
        updateTeam({
            ...team,
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.image !== this.props.image) {
            this.setState({
                imagePreviewUrl: this.props.image
            });
        }
    }

    render(){
        return(
            <div className={styles.Photo}>
                <div className={styles.Preview}>
                    <img src={this.state.imagePreviewUrl} />
                </div>
                <input type="file" ref={this.inputPhoto} onChange={e => this.handleImageChange(e) } />
                <button onClick={e => this.inputPhoto.current.click() }>Select Logo</button>
            </div>
        )
    }

}

export {
    PhotoUpload
}