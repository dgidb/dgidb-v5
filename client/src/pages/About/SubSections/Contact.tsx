import { Email, GitHub, Home, LinkedIn } from '@mui/icons-material';
import { Link } from '@mui/material';

export const Contact = () => {
  return (
    <div className="contact-section-container doc-section">
      <div>
        <p>
          DGIdb was developed at The McDonnell Genome Institute, Washington
          University School of Medicine. If you have a source of information
          related to the druggable genome you would like us to incorporate,
          please contact us at{' '}
          <Link href="mailto:help@dgidb.org">help@dgidb.org.</Link>
        </p>
        <p>
          Citation: Integration of the Drug–Gene Interaction Database (DGIdb
          4.0) with open crowdsource efforts. Freshour SL*, Kiwala S*, Cotto
          KC*, Coffman AC, McMichael JF, Song JJ, Griffith M, Griffith OL,
          Wagner AH. Nucleic Acids Research. 2021 Jan 8.
          doi:https://doi.org/10.1093/nar/gkaa1084.
        </p>
        <h3 id="current-contributors">Current Contributors</h3>
      </div>

      <div className="left-section">
        <h4>
          <Link
            href="http://genome.wustl.edu/"
            target="_blank"
            rel="noreferrer"
          >
            The McDonnell Genome Institute
          </Link>
        </h4>
        <p>Washington University</p>

        <h4>Malachi Griffith</h4>
        <p>
          Creator
          <br />
          <Link href="https://griffithlab.org" target="_blank" rel="noreferrer">
            <Home />
          </Link>
          <Link
            href="mailto:mgriffit@wustl.edu"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Obi Griffith</h4>
        <p>
          Creator
          <br />
          <Link href="https://griffithlab.org" target="_blank" rel="noreferrer">
            <Home />
          </Link>
          <Link
            href="mailto:obigriffith@wustl.edu"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Susanna Kiwala</h4>
        <p>
          Software developer
          <br />
          <Link
            href="https://github.com/susannasiebert"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub />
          </Link>
          <Link
            href="mailto:susanna.kiwala@wustl.edu"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Kelsy Cotto</h4>
        <p>
          Curator, software developer
          <br />
          <Link
            href="https://www.linkedin.com/in/kelsy-cotto-94b9018b/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedIn />
          </Link>
          <Link
            href="mailto:kelsy.cotto@wustl.edu"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Sharon Freshour</h4>
        <p>
          Curator, software developer
          <br />
          <Link
            href="https://www.linkedin.com/in/sharonfreshour/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedIn />
          </Link>
          <Link
            href="mailto:sharonfreshour@wustl.edu"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Adam Coffman</h4>
        <p>
          Software developer
          <br />
          <Link
            href="https://github.com/acoffman"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub />
          </Link>
          <Link
            href="mailto:acoffman@wustl.edu"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Josh McMichael</h4>
        <p>
          User experience (UX) developer
          <br />
          <Link
            href="https://github.com/jmcmichael"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub />
          </Link>
          <Link
            href="mailto:jmcmicha@wustl.edu"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
      </div>

      <div className="right-section">
        <h4>
          <Link
            href="https://www.nationwidechildrens.org/specialties/institute-for-genomic-medicine"
            target="_blank"
            rel="noreferrer"
          >
            The Institute for Genomic Medicine
          </Link>
        </h4>
        <p>Nationwide Children's Hospital</p>

        <h4>Alex Wagner</h4>
        <p>
          Creator, software developer
          <br />
          <Link href="http://alexwagner.info" target="_blank" rel="noreferrer">
            <Home />
          </Link>
          <Link
            href="mailto:Alex.Wagner@nationwidechildrens.org"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Matthew Cannon</h4>
        <p>
          Software developer
          <br />
          <Link
            href="https://www.linkedin.com/in/matthew-cannon-b250a730/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedIn />
          </Link>
          <Link
            href="mailto:Matthew.Cannon2@nationwidechildrens.org"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>Katie Stahl</h4>
        <p>
          Software developer
          <br />
          <Link
            href="https://github.com/katiestahl"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub />
          </Link>
          <Link
            href="https://www.linkedin.com/in/katie-stahl-05b81a126/"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedIn />
          </Link>
          <Link
            href="mailto:Kathryn.Stahl@nationwidechildrens.org"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
        <h4>James Stevenson</h4>
        <p>
          Software developer
          <br />
          <Link
            href="https://jsstevenson.github.io/"
            target="_blank"
            rel="noreferrer"
          >
            <Home />
          </Link>
          <Link
            href="mailto:James.Stevenson@nationwidechildrens.org"
            target="_blank"
            rel="noreferrer"
          >
            <Email />
          </Link>
        </p>
      </div>
      <div className="contact-section-container spacing"></div>

      <div className="contact-session-container">
        <h3 id="acknowledgements">Acknowledgements</h3>

        <h4>Conceptual designers / mentors</h4>
        <p>Elaine Mardis, Rick Wilson</p>

        <h4>Additional software developers</h4>
        <p>
          Indraniel Das, James Koval, Nicholas Spies, Avinash Ramu, Jim Eldred,
          Yang-Yang Feng, Jim Weible, Scott Smith, Ben Ainscough
        </p>

        <h4>Beta testers</h4>
        <p>David Larson, Jason Walker, Chris Miller, Ron Bose, Runjun Kumar</p>

        <h4>Expert curators</h4>
        <p>
          Malachi Griffith, Obi Griffith, Alex Wagner, Janakiraman Subramanian,
          Nicholas Spies, Jaclyn Boozalis, Deng Pan, Kelsy Cotto, Sharon
          Freshour
        </p>

        <h4>Additional conceptual contributors</h4>
        <p>Timothy J. Ley, Li Ding, David J. Dooling, Ramaswamy Govindan</p>

        <h4>Miscellaneous contributions</h4>
        <p>
          Kilannin Krysiak, Zachary Skidmore, Robert Lesurf, Lee Trani, Jonathan
          Song
        </p>
      </div>
    </div>
  );
};
