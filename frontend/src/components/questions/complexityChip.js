import React from "react";
import Chip from '@mui/material/Chip';

const getColorForComplexity = (complexity) => {
  switch (complexity) {
    case "Easy":
      return "success";
    case "Medium":
      return "warning";
    case "Hard":
      return "error";
    default:
      return "default";
  }
};

function ComplexityChip({ complexity })  {
  return (
    <Chip
      key={complexity}
      label={complexity}
      color={getColorForComplexity(complexity)}
    ></Chip>
  );
};

export default ComplexityChip;
