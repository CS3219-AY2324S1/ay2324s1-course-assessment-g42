import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function MatchComplexitySelect({ complexity, setComplexity }) {
  const handleChange = (event) => {
    setComplexity(event.target.value);
  };

  return (
    <div className='match-form-container'>
      <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: 'white', borderRadius: '8px',
        '& .MuiSelect-select': {
            padding: '8px', // Adjust the padding to control the height
        }, }}>
        <Select
          id="complexity-select"
          value={complexity}
          onChange={handleChange}
          label="Complexity"
          required
        >
          <MenuItem value={"Easy"}>Easy</MenuItem>
          <MenuItem value={"Medium"}>Medium</MenuItem>
          <MenuItem value={"Hard"}>Hard</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default MatchComplexitySelect;
