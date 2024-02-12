export interface IProduct {
    id: number;
    title: string;
    price: number;
    formattedPrice: string;
    category: string;
    description: string;
}

export interface ISortInfo {
    column: keyof IProduct | null;
    order: 'ascend' | 'descend' | null;
}
