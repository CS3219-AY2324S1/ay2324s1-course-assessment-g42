import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function FormComplexitySelect({ complexity, setComplexity, style, showLabel }) {
  const handleChange = (event) => {
    setComplexity(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120, ...style }}>
      {showLabel && <InputLabel id="complexity-select">Complexity</InputLabel>}
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

export default FormComplexitySelect;
