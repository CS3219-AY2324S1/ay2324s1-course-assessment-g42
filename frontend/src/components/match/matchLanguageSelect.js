import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function MatchLanguageSelect({ language, setLanguage }) {
  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className='match-form-container'>
      <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: 'white', borderRadius: '8px' }}>
        <Select
          id="language-select"
          value={language}
          onChange={handleChange}
          label="Language"
          required
        >
          <MenuItem value={"JavaScript"}>JavaScript</MenuItem>
          <MenuItem value={"Python"}>Python</MenuItem>
          <MenuItem value={"C"}>C</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default MatchLanguageSelect;
