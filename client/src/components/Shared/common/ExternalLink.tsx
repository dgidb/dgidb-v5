import Link, { type LinkProps } from '@mui/material/Link';

type ExternalLinkProps = LinkProps & {
  href: string;
};

export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  return (
    <Link target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </Link>
  );
}
