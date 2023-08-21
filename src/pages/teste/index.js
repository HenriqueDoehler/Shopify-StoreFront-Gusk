import { useState, useEffect } from "react";
import { searchProducts } from "../../utils/shopify";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = async (event) => {
    setInputValue(event.target.value);
    if (event.target.value) {
      const results = await searchProducts(event.target.value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Pesquisar"
      />
      {searchResults.length > 0 && (
        <div>
          {searchResults.map((product) => (
            <div key={product.node.id}>
              <h2>{product.node.title}</h2>
              <p>{product.node.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
