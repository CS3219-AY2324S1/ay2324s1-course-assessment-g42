import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function FormLanguageSelect({ language, setLanguage }) {
  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="language-select">Language</InputLabel>
        <Select
          id="language-select"
          value={language}
          onChange={handleChange}
          label="Language"
          required
        >
          <MenuItem value={"javascript"}>Javascript</MenuItem>
          <MenuItem value={"python"}>Python</MenuItem>
          <MenuItem value={"c"}>C</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default FormLanguageSelect;
