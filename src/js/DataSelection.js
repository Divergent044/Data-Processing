import React, {Component} from 'react';
import '../css/dataSelection.css';
import axios from 'axios';
import DataTable from './DataTable';
import Loader from './Loader';

const urlForSmallData = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}';
const urlForBigData = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}';

export default class DataSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            flag: false,
            error: false,
            errorType: ""
        };
        this.handler = this.handler.bind(this);
    }

    handler(url) {
        axios.get(url)
            .then(res => {
                this.setState({
                    data: res.data
                });
            })
            .catch(error => {
                this.setState({
                    errorType: error,
                    error: true
                });
            });
        this.setState({
            flag: true
        });
    }


    renderDataSelection() {
        return (
            <div className="main">
                <p className="text">Выберите<br></br>набор данных</p>
                <div className="select">
                    <button className="btn small" onClick={() => this.handler(urlForSmallData)}>Маленький</button>
                    <button className="btn big" onClick={() => this.handler(urlForBigData)}>Большой</button>
                </div>
            </div>
        );
    }

    renderError() {
        return (
            <div className="main">
                <p className="text">{this.state.errorType.toString()}<br></br>Ошибка соединения с сервером.<br></br>Попробуйте обновить страницу.</p>
            </div>
        );
    }

    render() {
        if (!this.state.flag)
            return this.renderDataSelection();
        else if (this.state.error)
            return this.renderError();
        else if (this.state.data.length === 0)
            return <Loader/>;
        else
            return <DataTable data={this.state.data}/>;
    }
}
