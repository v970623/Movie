import { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Collapse,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import { SearchParams } from "../types/application";

interface SearchProps {
  onSearch: (params: SearchParams) => void;
}

export const ApplicationSearch: React.FC<SearchProps> = ({ onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    status: "",
  });

  const handleSearch = () => {
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== "")
    );
    onSearch(filteredParams);
  };

  const handleReset = () => {
    const emptyParams: SearchParams = {
      keyword: "",
      status: "",
    };
    setSearchParams(emptyParams);
    onSearch({});
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by keyword..."
          value={searchParams.keyword}
          onChange={(e) =>
            setSearchParams({ ...searchParams, keyword: e.target.value })
          }
          sx={{ flexGrow: 1 }}
        />
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          variant="outlined"
        >
          Filters
        </Button>
        {showFilters && (
          <Button
            startIcon={<CloseIcon />}
            onClick={handleReset}
            variant="outlined"
            color="error"
          >
            Clear
          </Button>
        )}
        <Button onClick={handleSearch} variant="contained">
          Search
        </Button>
      </Stack>

      <Collapse in={showFilters}>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={searchParams.status}
              label="Status"
              onChange={(e) =>
                setSearchParams({ ...searchParams, status: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default ApplicationSearch;
