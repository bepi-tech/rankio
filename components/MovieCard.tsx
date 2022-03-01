import { Movie } from "@lib/models";
import { shimmer, toBase64 } from "@lib/utils";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const width = 250;
  const height = (width * 750) / 500;

  return (
    <Paper variant="outlined">
      <CardActionArea href={`/rate/${movie.id}`}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="stretch"
          width={width}
          maxWidth={width}
        >
          <Grid
            item
            xs
            height={height}
            maxHeight={height}
            width={width}
            maxWidth={width}
          >
            <Image
              src={movie.poster}
              alt={`${movie.title}'s poster`}
              height={height}
              width={width}
              priority
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(width, height)
              )}`}
            />
          </Grid>
          <Grid item xs textAlign="center" my={1}>
            <Typography variant="h5" component="div">
              {movie.title}
            </Typography>
          </Grid>
        </Grid>
      </CardActionArea>
    </Paper>
    // <Link href={`/rate/${movie.id}`} passHref>
    //   <Card sx={{ width: 250 }} variant="outlined">
    //     <CardActionArea>
    //       <CardMedia
    //         component="img"
    //         image={movie.poster}
    //         alt={`${movie.title}'s poster`}
    //       />
    //       <CardContent>
    //         <Typography gutterBottom variant="h5" component="div">
    //           {movie.title}
    //         </Typography>
    //       </CardContent>
    //     </CardActionArea>
    //   </Card>
    // </Link>
  );
}
