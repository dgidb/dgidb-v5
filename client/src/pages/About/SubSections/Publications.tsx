import { Link } from '@mui/material';

export const Publications = () => {
  return (
    <div className="publications-section-container doc-section">
      <div>
        <Link
          href="https://academic.oup.com/nar/article/49/D1/D1144/6006193?login=true"
          target="_blank"
        >
          Integration of the Drug–Gene Interaction Database (DGIdb 4.0) with
          open crowdsource efforts
        </Link>.{' '}
        Freshour S*, Kiwala S*, Cotto KC*, Coffman AC, McMichael JF, Song J,
        Griffith M, Griffith OL, Wagner AH. Nucleic Acids Research. 2020 Nov 25;
        doi: https://doi.org/10.1093/nar/gkaa1084. PMID: 33237278
      </div>
      <div>
        <Link
          href="https://academic.oup.com/nar/article/46/D1/D1068/4634012"
          target="_blank"
        >
          DGIdb 3.0: a redesign and expansion of the drug–gene interaction
          database
        </Link>.{' '}
        Cotto KC*, Wagner AH*, Feng Y, Kiwala S, Coffman AC, Spies G, Wollam A,
        Spies NC, Griffith OL, Griffith M. Nucleic Acids Research. 2018 Jan
        4;46(D1):D1068-D1073. doi: https://doi.org/10.1093/nar/gkx1143. PMID:
        29156001
      </div>
      <div>
        <Link
          href="https://academic.oup.com/nar/article/44/D1/D1036/2502659"
          target="_blank"
        >
          DGIdb 2.0: mining clinically relevant drug-gene interactions
        </Link>.{' '}
        Wagner AH, Coffman AC, Ainscough BJ, Spies NC, Skidmore ZL, Campbell KM,
        Krysiak K, Pan D, McMichael JF, Eldred JM, Walker JR, Wilson RK, Mardis
        ER, Griffith M, Griffith OL. Nucleic Acids Research. 2016 Jan
        4;44(D1):D1036-44. doi: https://doi.org/10.1093/nar/gkv1165. PMID:
        26531824
      </div>
      <div>
        <Link href="https://www.nature.com/articles/nmeth.2689" target="_blank">
          DGIdb: mining the druggable genome
        </Link>.{' '}
        Griffith M, Griffith OL, Coffman AC, Weible JV, McMichael JF, Spies NC,
        Koval J, Das I, Callaway MB, Eldred JM, Miller CA, Subramanian J,
        Govindan R, Kumar RD, Bose R, Ding L, Walker JR, Larson DE, Dooling DJ,
        Smith SM, Ley TJ, Mardis ER, Wilson RK. Nature Methods. 2013
        Dec;10(12):1209-10. doi: https://doi.org/10.1038/nmeth.2689. PMID:
        24122041.
      </div>
    </div>
  );
};
