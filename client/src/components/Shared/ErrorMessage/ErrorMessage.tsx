import { Link, Typography } from "@mui/material";

export const ErrorMessage: React.FC = () => (
    <Typography>
      An error was encountered while executing this search. If this error
      persists, please contact us at{' '}
      <Link target="_blank" href={`mailto:help@dgidb.org`}>
        help@dgidb.org
      </Link>{' '}
      or{' '}
      <Link href="https://github.com/dgidb/dgidb-v5/issues" target="_blank">
        create a new issue on GitHub
      </Link>
      .
    </Typography>
)