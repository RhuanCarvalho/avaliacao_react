export const fetchMockData = async () => {
    const response = await fetch('http://localhost:3001/products');
    const data = await response.json();
    return data;
  };