import React, {Component} from 'react';
import '../css/dataTable.css';
import Pagination from "./Pagination";
import InfoBlock from "./InfoBlock";
import ErrorBlock from "./ErrorBlock";

const TABLE_COLUMNS = [
    {
        label: 'ID',
        type: 'id',
        countClick: 0
    },
    {
        label: 'First Name',
        type: 'firstName',
        countClick: 0
    },{
        label: 'Last Name',
        type: 'lastName',
        countClick: 0
    },{
        label: 'Email',
        type: 'email',
        countClick: 0
    },{
        label: 'Phone',
        type: 'phone',
        countClick: 0
    },
];

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: props.data,
            pageOfRows: [],
            columns: TABLE_COLUMNS,
            wasSelected: -1,
            selectedRow: false,
            arrayColor: [],
            selectedEntry: {},
            angle: [
                0,
                0,
                0,
                0,
                0
            ],
            visibility: [
                'hidden',
                'hidden',
                'hidden',
                'hidden',
                'hidden'
            ],
            wasSorted: -1,
            searchText: "",
            errorFlag: false,
            errorText: ""
        };
        this.onChangePage = this.onChangePage.bind(this);
        this.onClickRow = this.onClickRow.bind(this);
        this.sortTable = this.sortTable.bind(this);
        this.tableSearch = this.tableSearch.bind(this);
        this.updateStateSearchText = this.updateStateSearchText.bind(this);
    }

    onChangePage(pageOfRows) {
        this.setState({
            pageOfRows: pageOfRows,
            wasSelected: -1,
            selectedRow: false,
            arrayColor: [],
            wasSorted: -1,
            errorFlag: false
        });
        for (let i = 0; i < this.state.visibility.length; i++)
            this.state.visibility[i] = 'hidden';
    }

    onClickRow(e, entry) {
        if (e.target.tabIndex === this.state.wasSelected) {
            this.setState({
                wasSelected: null,
                selectedRow: false
            });
            this.state.arrayColor[e.target.tabIndex] = null;
        } else {
            this.setState({
                wasSelected: e.target.tabIndex,
                selectedRow: true
            });
            this.state.arrayColor[e.target.tabIndex] = '#99ccff';
            for (let i = 0; i < this.state.arrayColor.length; i++) {
                if (i !== e.target.tabIndex)
                    this.state.arrayColor[i] = null;
            }
        }
        this.setState({
            selectedEntry: entry,
            errorFlag: false
        });
    }

    comparisonFunction(property) {
        let sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (entry1,entry2) {
            const result = (entry1[property] < entry2[property]) ? -1 : (entry1[property] > entry2[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    sortTable(sortableType, countClick, index){
        if (index !== this.state.wasSorted) {
            this.state.visibility[this.state.wasSorted] = 'hidden';
            this.setState({
                wasSorted: index
            });
        }
        if (countClick % 2 !== 0) {
            sortableType = '-' + sortableType;
            this.state.angle[index] = 180;
            this.state.visibility[index] = 'visible';
        } else {
            this.state.angle[index] = 0;
            this.state.visibility[index] = 'visible';
        }
        this.setState({
            pageOfRows: this.state.pageOfRows.sort(this.comparisonFunction(sortableType)),
            wasSelected: -1,
            errorFlag: false,
            selectedRow: false,
            arrayColor: []
        });
    }

    updateStateSearchText(e) {
        this.setState({
            searchText: e.target.value,
            errorFlag: false,
            wasSelected: -1,
            selectedRow: false,
            arrayColor: [],
        });
    }

    tableSearch() {
        const searchData = this.state.searchText.toLowerCase();
        const data = this.props.data;
        const searchResult = data.filter(element => {
            return (element.id.toString().includes(searchData) || element.phone.includes(searchData) ||
                element.firstName.toLowerCase().includes(searchData) || element.lastName.toLowerCase().includes(searchData) ||
                element.email.toLowerCase().includes(searchData))
        });
        if (searchResult.length > 0)
            this.setState({
                records: searchResult,
                searchText: "",
                errorFlag: false,
                errorText: ""
            });
        else
            this.setState({
                records: this.props.data,
                searchText: "",
                errorFlag: true,
                errorText: this.state.searchText
            });
        this.setState({
            wasSelected: -1,
            selectedRow: false,
            arrayColor: [],
        });
    }

    render() {
        return(
            <div>
                <div className="searchBlock">
                    <input id="input-search" type="search" placeholder="&#128269; Поиск..." value={this.state.searchText} onChange={this.updateStateSearchText} />
                    <button id="btn-search" onClick={this.tableSearch}>&#128270; Найти</button>
                </div>
                {this.state.errorFlag ? <ErrorBlock text={this.state.errorText} /> : null}
                <table className="table" cellSpacing="0">
                    <thead>
                    <tr>
                        {this.state.columns.map((element, index) =>
                            <th key={index} onClick={() => this.sortTable(element.type, element.countClick++, index)}>
                                {element.label}
                                <div className={'triangle ' + element.type}
                                    style={{ visibility: this.state.visibility[index], transform: 'rotate('+this.state.angle[index]+'deg)'}}>
                                </div>
                            </th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.pageOfRows.map((element, index) =>
                        <tr key={index} onClick={(e) => this.onClickRow(e,element)} style={{background: this.state.arrayColor[index]}}>
                            <td tabIndex={index}>{element.id}</td>
                            <td tabIndex={index}>{element.firstName}</td>
                            <td tabIndex={index}>{element.lastName}</td>
                            <td tabIndex={index}>{element.email}</td>
                            <td tabIndex={index}>{element.phone}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                {<Pagination data={this.state.records} onChangePage={this.onChangePage} />}
                {this.state.selectedRow ? <InfoBlock entry={this.state.selectedEntry} /> : null}
            </div>
        );
    }
}

export default DataTable;