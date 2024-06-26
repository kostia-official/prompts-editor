import React, { useState, useMemo, useEffect } from 'react';
import { ImagePromptsEditor } from './components/ImagePromptsEditor';
import { useGetAllImagesPrompts } from '../../hooks/useImagesPrompts';
import { Pagination, LinearProgress, Box } from '@mui/material';
import { Wrapper, PaginationWrapper } from './styled';
import { Filters } from '../Filters';
import { useFiltersState } from '../Filters/hooks/useFiltersState';
import { ImagePrompts } from '../../types';

const pageSize = 20;

export const Editor: React.FC = () => {
  const [page, setPage] = useState(0);
  const { filters, updateFilters, getFilteredImagesPrompts } = useFiltersState({ key: 'editor' });

  const { imagesPrompts } = useGetAllImagesPrompts();

  const [filteredImagesPrompts, setFilteredImagesPrompts] = useState<ImagePrompts[]>([]);
  useEffect(() => {
    (async () => {
      const filtered = await getFilteredImagesPrompts(imagesPrompts);
      setFilteredImagesPrompts(filtered);
    })();
  }, [getFilteredImagesPrompts, imagesPrompts, filters]);

  const paginatedImagesPrompts = useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredImagesPrompts?.slice(start, end);
  }, [filteredImagesPrompts, page]);

  return (
    <Wrapper>
      <Box mb={2}>
        <Filters filters={filters} updateFilters={updateFilters} />
      </Box>

      {!imagesPrompts && <LinearProgress />}

      {paginatedImagesPrompts?.map((imagePrompts) => (
        <ImagePromptsEditor key={imagePrompts.name} imagePrompts={imagePrompts} />
      ))}

      {!!imagesPrompts?.length && (
        <PaginationWrapper>
          <Pagination
            count={Math.ceil(filteredImagesPrompts.length / pageSize)}
            page={page + 1}
            onChange={(e, page) => {
              setPage(page - 1);
              window.scrollTo(0, 0);
            }}
          />
        </PaginationWrapper>
      )}
    </Wrapper>
  );
};
