import '../../App.css';
import '../../styles/questions.css';
import React, { useState, useEffect } from 'react';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function QuestionsTitleFilter({ type, filters, applyFilter }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (filters[type]) {
      setInputValue(filters[type]);
    } else {
      setInputValue("");
    }
  }, [filters, type])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    const trimmedInput = inputValue.trim();
    applyFilter(type, trimmedInput || "None");
  }

  return (
    <>
      <input
        type="text"
        id="title-filter"
        placeholder="Enter filter"
        value={inputValue}
        onKeyPress={handleKeyPress}
        onChange={handleInputChange}
        className="title-filter-input"
      />
      <IconButton onClick={handleSearch} style={{ color: '#ffffff' }}>
        <SearchIcon />
      </IconButton>
    </>
  )
}

export default QuestionsTitleFilter;
