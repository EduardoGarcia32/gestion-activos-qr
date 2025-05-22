import React from "react";
import {
    Skeleton,
    Box,
    Grid
} from '@mui/material';

const AssetSkeleton = ({ count = 6 }) => {
    return (
        <Grid container spacing={3}>
            {Array.from(new Array(count)).map((_, index) => (
                <Grid item key= {index} xs={12} sm={6} md={4}>
                    <Box sx={{ p: 2}}>
                        <Skeleton variant="rectangular" width="100%" height={118} sx={{ mb: 2}}
        />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="30%" />
                    </Box>
                    </Grid>
            ))}
        </Grid>
    );
};

export default AssetSkeleton;