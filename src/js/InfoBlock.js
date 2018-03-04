import React, {Component} from 'react';
import '../css/infoblock.css';

class InfoBlock extends Component {
    constructor(props){
        super(props);
        this.focus = this.focus.bind(this);
    }
    componentDidMount() {
        setTimeout(this.focus, 200);
    }

    componentDidUpdate() {
        setTimeout(this.focus, 200);
    }

    focus() {
        this.textArea.focus();
    }

    render() {
        return (
            <div className="infoBlock">
                <p>Выбран пользователь <b>{this.props.entry.firstName} {this.props.entry.lastName}</b></p>
                <p>Описание:</p>
                <textarea value={this.props.entry.description} readOnly rows="4" ref={(e) => {this.textArea = e;}}></textarea>
                <p>Адрес проживания: <b>{this.props.entry.address.streetAddress}</b></p>
                <p>Город: <b>{this.props.entry.address.city}</b></p>
                <p>Провинция/штат: <b>{this.props.entry.address.state}</b></p>
                <p>Индекс: <b>{this.props.entry.address.zip}</b></p>
            </div>
        );
    }
}

export default InfoBlock;