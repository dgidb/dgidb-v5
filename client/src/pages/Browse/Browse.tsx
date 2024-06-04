// hooks/dependencies
import { BrowseCategories } from 'components/Browse/Categories';

// styles
import './Browse.scss';

export const Browse = () => {
  return (
    <div className="browse-page-container">
      <BrowseCategories />
    </div>
  );
};
