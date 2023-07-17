import './ReleaseInformation.scss';
import React, { useState, useEffect } from 'react';

const ReleaseInformation: React.FC = () => {
  interface GithubRelease {
    html_url: string;
    name: string;
    published_at: string;
  }

  const [currentRelease, setCurrentRelease] = useState<
    GithubRelease | undefined
  >(undefined);

  const fetchRelease = async () => {
    const response = await fetch(
      'https://api.github.com/repos/dgidb/dgidb-v5/releases?per_page=1'
    );
    if (response.ok) {
      const body = await response.json();
      setCurrentRelease(body[0]);
    } else {
      setCurrentRelease(undefined);
    }
  };

  useEffect(() => {
    fetchRelease();
  }, []);

  return (
    <div>
      {currentRelease && (
        <div className="release-info">
          DGIdb {currentRelease.name} (
          {new Date(currentRelease.published_at).toLocaleString().split(',')[0]}
          )&nbsp; &bull; &nbsp;
          <a href={currentRelease.html_url} target="_blank">
            Release Notes
          </a>
          &nbsp; &bull; &nbsp;
          <a href="https://github.com/dgidb/dgidb-v5/releases/" target="_blank">
            History
          </a>
        </div>
      )}
    </div>
  );
};

export default ReleaseInformation;
