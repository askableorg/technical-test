import React from "react";

type PageNumbersProps = {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    handlePageChange: (page: number) => void;
};

const calculatePageNumbers = (currentPage: number, itemsPerPage: number, totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let pageNumbers = [];

    const maxPagesToShow = 5;
    let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 2);
    let endPage = Math.min(currentPage + Math.floor(maxPagesToShow / 2), totalPages - 1);

    if (currentPage - startPage < Math.floor(maxPagesToShow / 2)) {
        endPage += Math.floor(maxPagesToShow / 2) - (currentPage - startPage);
    }
    if (endPage - currentPage < Math.floor(maxPagesToShow / 2)) {
        startPage -= Math.floor(maxPagesToShow / 2) - (endPage - currentPage);
    }

    startPage = Math.max(startPage, 2);
    endPage = Math.min(endPage, totalPages - 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return pageNumbers;
};

const PageNumbers: React.FC<PageNumbersProps> = ({
    currentPage,
    itemsPerPage,
    totalItems,
    handlePageChange,
}) => {
    const pageNumbers = calculatePageNumbers(currentPage, itemsPerPage, totalItems);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="page-numbers">
            <span
                className={`arrow${currentPage > 1 ? " active" : " disabled"}`}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            >
                {"<"}
            </span>
            <span
                className={`page-number${currentPage === 1 ? " active" : ""}`}
                onClick={() => handlePageChange(1)}
            >
                1
            </span>
            {pageNumbers[0] > 2 && <span style={{ margin: "0 5px" }}>...</span>}
            {pageNumbers.map((number) => (
                <span
                    key={number}
                    className={`page-number${number === currentPage ? " active" : ""}`}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </span>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span style={{ margin: "0 5px" }}>...</span>
            )}
            {totalPages > 1 && (
                <span
                    className={`page-number${currentPage === totalPages ? " active" : ""}`}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </span>
            )}
            <span
                className={`arrow${currentPage < totalPages ? " active" : " disabled"}`}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            >
                {">"}
            </span>
        </div>
    );
};

export default PageNumbers;
