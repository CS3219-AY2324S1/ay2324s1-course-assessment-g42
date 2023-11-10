import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function FormCategoriesSelect({ categories, categoryOptions, setCategories }) {
  const handleCategoriesChange = (event, newValue) => {
    setCategories(newValue);
  };

  return (
    <Autocomplete
      multiple
      id="form-categories-select"
      options={categoryOptions}
      getOptionLabel={(option) => option}
      value={categories}
      onChange={handleCategoriesChange}
      renderInput={(params) => (
        <TextField {...params} label="Select Categories" placeholder="Categories" />
      )}
      sx={{ width: '500px', marginTop: "10px" }}
    />
  );
}

export default FormCategoriesSelect;
