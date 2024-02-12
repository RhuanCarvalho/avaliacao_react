import React, { useState, useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Pagination from './Pagination';
import { fetchMockData } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { IProduct, ISortInfo } from './type';
import { createFilterDropdown } from './utils/filterDropdown';

const ListTable: React.FC = () => {
    // Definindo o número de itens por página
    const itemsPerPage = 25;

    // Estados para armazenar os dados da tabela e o estado atual da página
    const [data, setData] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Estado para armazenar o texto de pesquisa global
    const [searchText, setSearchText] = useState<string>('');

    // Estados para armazenar dados filtrados e filtros individuais por coluna
    const [filteredData, setFilteredData] = useState<IProduct[]>([]);
    const [idFilter, setIdFilter] = useState<string>('');
    const [titleFilter, setTitleFilter] = useState<string>('');
    const [priceFilter, setPriceFilter] = useState<string>('');
    const [descriptionFilter, setDescriptionFilter] = useState<string>('');

    // Estados para armazenar dados ordenados e informações sobre a ordenação
    const [sortedData, setSortedData] = useState<IProduct[]>([]);
    const [sortInfo, setSortInfo] = useState<ISortInfo>({
        column: null,
        order: null,
    });

    // Cálculos para determinar os itens da página atual
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = sortedData.slice(start, end);

    // Função para lidar com a mudança de página
    const handlePageChange = (selectedPage: number) => setCurrentPage(selectedPage);

    // Efeito para ordenar os dados sempre que houver mudanças nos dados filtrados ou nas informações de ordenação
    useEffect(() => {
        const updatedData = [...filteredData];

        if (sortInfo.order === 'ascend') {
            updatedData.sort((a, b) => {
                if (sortInfo.column && typeof a[sortInfo.column] === 'string' && typeof b[sortInfo.column] === 'string') {
                    return (a[sortInfo.column] as string).localeCompare(b[sortInfo.column] as string);
                }
                if (sortInfo.column && typeof a[sortInfo.column] === 'number' && typeof b[sortInfo.column] === 'number') {
                    return (a[sortInfo.column] as number) - (b[sortInfo.column] as number);
                }
                return 0;
            });
        } else if (sortInfo.order === 'descend') {
            updatedData.sort((a, b) => {
                if (sortInfo.column && typeof a[sortInfo.column] === 'string' && typeof b[sortInfo.column] === 'string') {
                    return (b[sortInfo.column] as string).localeCompare(a[sortInfo.column] as string);
                }
                if (sortInfo.column && typeof a[sortInfo.column] === 'number' && typeof b[sortInfo.column] === 'number') {
                    return (b[sortInfo.column] as number) - (a[sortInfo.column] as number);
                }
                return 0;
            });
        }

        setSortedData(updatedData);
    }, [filteredData, sortInfo]);

    // Efeito para carregar dados iniciais ao montar o componente
    useEffect(() => {
        fetchMockData().then((response) => {
            const formattedData = response.map((product: IProduct) => ({
                ...product,
                formattedPrice: formatPrice(product.price),
            }));
            setData(formattedData);
            setFilteredData(formattedData);
        });
    }, []);

    // Função para limpar todos os filtros
    const handleClearFilters = () => {
        setIdFilter('');
        setTitleFilter('');
        setPriceFilter('');
        setDescriptionFilter('');

        // Restaurar os dados filtrados para os dados originais
        setFilteredData(data);
        setCurrentPage(1);

        // Preservar a informação de ordenação ao limpar os filtros
        setSortInfo({ column: null, order: null });
    };

    // Função para realizar a pesquisa global
    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data.filter((item) => {
            return (
                item.title.toLowerCase().includes(value.toLowerCase()) ||
                String(item.id).includes(value) ||
                String(item.price).includes(value) ||
                item.category.toLowerCase().includes(value.toLowerCase()) ||
                item.description.toLowerCase().includes(value.toLowerCase())
            );
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    // Função para realizar a pesquisa em uma coluna específica
    const handleColumnSearch = (column: string, value: string) => {
        setSearchText(value);
        const filtered = data.filter((item) => {
            switch (column) {
                case 'id':
                    return String(item.id).includes(value);
                case 'title':
                    return item.title.toLowerCase().includes(value.toLowerCase());
                case 'price':
                    return String(item.price).includes(value);
                case 'category':
                    return item.category.toLowerCase().includes(value.toLowerCase());
                case 'description':
                    return item.description.toLowerCase().includes(value.toLowerCase());
                default:
                    return false;
            }
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    // Função para lidar com a ordenação das colunas na tabela
    const handleSort = (column: { dataIndex: keyof IProduct; order: 'ascend' | 'descend' | null }) => {
        const { dataIndex, order } = column;
        setSortInfo({ column: dataIndex, order });
    };

    // Definição das colunas da tabela
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            sortOrder: sortInfo.column === 'id' ? sortInfo.order : null,
            onHeaderCell: (column: any) => ({
                onClick: () => handleSort({ dataIndex: 'id', order: sortInfo.order === 'ascend' ? 'descend' : 'ascend' }),
            }),
            filters: [],
            onFilter: (value: any, record: IProduct) => record.id === Number(value),
            filterDropdown: () => createFilterDropdown(
                'Search ID',
                idFilter,
                (e) => setIdFilter(e.target.value),
                () => handleColumnSearch('id', idFilter),
                handleClearFilters
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            sortOrder: sortInfo.column === 'title' ? sortInfo.order : null,
            onHeaderCell: (column: any) => ({
                onClick: () => handleSort({ dataIndex: 'title', order: sortInfo.order === 'ascend' ? 'descend' : 'ascend' }),
            }),
            filters: Array.from(new Set(data.map((item) => item.title))).map((title) => ({
                text: title,
                value: title,
            })),
            onFilter: (value: any, record: IProduct) => record.title.toLowerCase().includes(value.toLowerCase()),
            filterDropdown: () => createFilterDropdown(
                'Search Title',
                titleFilter,
                (e) => setTitleFilter(e.target.value),
                () => handleColumnSearch('title', titleFilter),
                handleClearFilters
            ),
        },
        {
            title: 'Price',
            dataIndex: 'formattedPrice',
            key: 'price',
            sorter: true,
            sortOrder: sortInfo.column === 'price' ? sortInfo.order : null,
            onHeaderCell: (column: any) => ({
                onClick: () => handleSort({ dataIndex: 'price', order: sortInfo.order === 'ascend' ? 'descend' : 'ascend' }),
            }),
            filters: [],
            onFilter: (value: any, record: IProduct) => record.price === Number(value),
            filterDropdown: () => createFilterDropdown(
                'Search Price',
                priceFilter,
                (e) => setPriceFilter(e.target.value),
                () => handleColumnSearch('price', priceFilter),
                handleClearFilters
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            sortOrder: sortInfo.column === 'category' ? sortInfo.order : null,
            onHeaderCell: (column: any) => ({
                onClick: () => handleSort({ dataIndex: 'category', order: sortInfo.order === 'ascend' ? 'descend' : 'ascend' }),
            }),
            filters: Array.from(new Set(data.map((item: any) => item.category))).map((category) => ({
                text: category,
                value: category,
            })),
            onFilter: (value: any, record: IProduct) => record.category.includes(value),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: true,
            sortOrder: sortInfo.column === 'description' ? sortInfo.order : null,
            onHeaderCell: (column: any) => ({
                onClick: () => handleSort({ dataIndex: 'description', order: sortInfo.order === 'ascend' ? 'descend' : 'ascend' }),
            }),
            filters: Array.from(new Set(data.map((item) => item.description))).map((description) => ({
                text: description,
                value: description,
            })),
            onFilter: (value: any, record: IProduct) => record.description.toLowerCase().includes(value.toLowerCase()),
            filterDropdown: () => createFilterDropdown(
                'Search Description',
                descriptionFilter,
                (e) => setDescriptionFilter(e.target.value),
                () => handleColumnSearch('description', descriptionFilter),
                handleClearFilters
            ),
        },
    ];

    // Mapeando as colunas para adicionar propriedades adicionais se necessário
    const mappedColumns = columns.map((col) => ({
        ...col,
    }));

    return (
        <div>
            {/* Barra de pesquisa global e botão para limpar todos os filtros */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="Pesquisar Produto (Nome, Categoria, Descrição, Preço...)"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    suffix={<SearchOutlined />}
                />
                <Button type="primary" onClick={handleClearFilters} style={{ marginLeft: 8 }}>
                    Limpar Todos os Filtros
                </Button>
            </div>

            {/* Tabela de dados */}
            <Table
                dataSource={currentItems}
                columns={mappedColumns}
                pagination={false}  // Desativando a paginação padrão do Ant Design
            />

            {/* Componente de paginação personalizado */}
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ListTable;
