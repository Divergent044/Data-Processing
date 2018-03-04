import React, {Component} from 'react';
import _ from 'lodash';
import '../css/pagination.css';


class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: {},
            initialPage: 1
        };
    }

    componentWillMount() {
        if (this.props.data && this.props.data.length)
            this.setPage(this.state.initialPage);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            this.setPage(this.state.initialPage);
        }
    }

    setPage(pageNumber) {
        const data = this.props.data;
        let currentPage = this.state.currentPage;
        if (pageNumber < 1 || pageNumber > currentPage.totalPages)
            return;
        currentPage = this.getCurrentPage(data.length, pageNumber);
        const pageOfRows = data.slice(currentPage.startRowIndex, currentPage.endRowIndex + 1);
        this.setState({
            currentPage: currentPage
        });
        this.props.onChangePage(pageOfRows);
    }

    getCurrentPage(allData, actualPage, rowsPerPage) {
        actualPage = actualPage || 1;
        rowsPerPage = rowsPerPage || 50;
        const totalPages = Math.ceil(allData / rowsPerPage);
        let startPage, endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (actualPage <= 6){
                startPage = 1;
                endPage = 10;
            } else if (actualPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = actualPage - 5;
                endPage = actualPage + 4;
            }
        }
        const startRowIndex = (actualPage - 1) * rowsPerPage;
        const endRowIndex = Math.min(startRowIndex + rowsPerPage - 1, allData - 1);
        const pages = _.range(startPage, endPage + 1);
        return {
            allData: allData,
            actualPage: actualPage,
            rowsPerPage: rowsPerPage,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startRowIndex: startRowIndex,
            endRowIndex: endRowIndex,
            pages: pages
        };
    }

    render() {
        const currentPage = this.state.currentPage;
        if (!currentPage.pages || currentPage.pages.length <=1)
            return null;
        return(
            <div className="pagination">
                <div className={currentPage.actualPage === 1 ? "blocks inactive" : "blocks"}
                     onClick={() => this.setPage(1)}>
                    &lt;&lt;
                </div>
                <div className={currentPage.actualPage === 1 ? "blocks inactive" : "blocks"}
                     onClick={() => this.setPage(currentPage.actualPage - 1)}>
                    &lt;
                </div>
                {currentPage.pages.map((page,index) =>
                        <div className={currentPage.actualPage === page ? "blocks active" : "blocks"}
                             key={index} onClick={() => this.setPage(page)}>
                            {page}
                        </div>
                )}
                <div className={currentPage.actualPage === currentPage.totalPages ? "blocks inactive" : "blocks"}
                     onClick={() => this.setPage(currentPage.actualPage + 1)}>
                    &gt;
                </div>
                <div className={currentPage.actualPage === currentPage.totalPages ? "blocks inactive" : "blocks"}
                     onClick={() => this.setPage(currentPage.totalPages)}>
                    &gt;&gt;
                </div>
            </div>
        );
    }
}

export default Pagination;