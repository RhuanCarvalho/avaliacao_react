import React from 'react';
import { Pagination as AntPagination } from 'antd';

interface PaginationProps {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    onPageChange: (selectedPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
    return (
        <AntPagination
            current={currentPage}
            total={totalItems}
            pageSize={itemsPerPage}
            onChange={onPageChange}
            showSizeChanger={false}
        />
    );
};

export default Pagination;
