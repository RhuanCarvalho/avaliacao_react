import { Button, Input } from "antd";

export const createFilterDropdown = (
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onSearch: () => void,
    onClearFilters: () => void
) => (
    <div style={{ padding: 8 }}>
        <Input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onPressEnter={onSearch}
        />
        <Button type="primary" onClick={onSearch}>
            Search
        </Button>
        <Button type="primary" onClick={onClearFilters}>
            Clear Filters
        </Button>
    </div>
);