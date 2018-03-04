import React, {Component} from 'react';
import '../css/errorblock.css';

export default class ErrorBlock extends Component {
    render() {
        return(
            <div className="errorBlock">
                По вашему запросу "{this.props.text}" ничего не найдено.
            </div>
        );
    }
}