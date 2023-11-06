import '../../App.css';
import React, { useState } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';

const ITEM_HEIGHT = 48;

function QuestionsFilter({ type, filters, options, applyFilter }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilter = (value) => {
    applyFilter(type, value);
    setAnchorEl(null); // Close the filter menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the filter menu
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="complexity-filter-button"
        aria-controls={open ? 'complexity-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FilterListIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleFilter(option)}>
            { option === filters[type]
              ?
                <>
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
                <ListItemText>{option}</ListItemText>
                </>
              :
              <ListItemText inset>{option}</ListItemText>
            }
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default QuestionsFilter;