import '../../App.css';
import React, { useState, useEffect } from 'react';

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
      const inputValue = e.target.value.trim(); // trim any leading/trailing spaces
      // return "None" if no input to follow how applyFilter deals with empty params
      applyFilter(type, inputValue || "None");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        id="title-filter"
        placeholder="Enter filter"
        value={inputValue}
        onKeyPress={handleKeyPress}
        onChange={handleInputChange}
      />
    </>
  )
}

export default QuestionsTitleFilter;