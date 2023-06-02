import { Email, GitHub, Home, LinkedIn } from '@mui/icons-material';

export const Contact = () => {
  return (
    <div className="contact-section-container doc-section">
      <div>
        <p>
          DGIdb was developed at The McDonnell Genome Institute, Washington
          University School of Medicine. If you have a source of information
          related to the druggable genome you would like us to incorporate,
          please contact us at{' '}
          <a href="mailto:help@dgidb.org">help@dgidb.org.</a>
        </p>
        <p>
          Citation: Integration of the Drug–Gene Interaction Database (DGIdb
          4.0) with open crowdsource efforts. Freshour SL, Kiwala S, Cotto KC,
          Coffman AC, McMichael JF, Song JJ, Griffith M, Griffith OL, Wagner AH.
          Nucleic Acids Research. 2021 Jan 8.
          doi:https://doi.org/10.1093/nar/gkaa1084.
        </p>
        <h3 id="current-contributors">Current Contributors</h3>
      </div>

      <div className="contact-section-container left-section">
        <h4>
          <a href="http://genome.wustl.edu/">The McDonnell Genome Institute</a>
        </h4>
        <p>Washington University</p>

        <h4>Malachi Griffith</h4>
        <p>
          Creator
          <br />
          <a href="https://griffithlab.org">
            <Home />
          </a>
          <a href="mailto:mgriffit@wustl.edu">
            <Email />
          </a>
        </p>
        <h4>Obi Griffith</h4>
        <p>
          Creator
          <br />
          <a href="https://griffithlab.org">
            <Home />
          </a>
          <a href="mailto:obigriffith@wustl.edu">
            <Email />
          </a>
        </p>
        <h4>Susanna Kiwala</h4>
        <p>
          Software developer
          <br />
          <a href="https://github.com/susannasiebert">
            <GitHub />
          </a>
          <a href="mailto:susanna.kiwala@wustl.edu">
            <Email />
          </a>
        </p>
        <h4>Kelsy Cotto</h4>
        <p>
          Curator, software developer
          <br />
          <a href="https://www.linkedin.com/in/kelsy-cotto-94b9018b/">
            <LinkedIn />
          </a>
          <a href="mailto:kelsy.cotto@wustl.edu">
            <Email />
          </a>
        </p>
        <h4>Sharon Freshour</h4>
        <p>
          Curator, software developer
          <br />
          <a href="https://www.linkedin.com/in/sharonfreshour/">
            <LinkedIn />
          </a>
          <a href="mailto:sharonfreshour@wustl.edu">
            <Email />
          </a>
        </p>
        <h4>Adam Coffman</h4>
        <p>
          Software developer
          <br />
          <a href="https://github.com/acoffman">
            <GitHub />
          </a>
          <a href="mailto:acoffman@wustl.edu">
            <Email />
          </a>
        </p>
        <h4>Josh McMichael</h4>
        <p>
          User experience (UX) developer
          <br />
          <a href="https://github.com/jmcmichael">
            <GitHub />
          </a>
          <a href="mailto:jmcmicha@wustl.edu">
            <Email />
          </a>
        </p>
      </div>

      <div className="contact-section-container right-section">
        <h4>
          <a href="https://www.nationwidechildrens.org/specialties/institute-for-genomic-medicine">
            The Institute for Genomic Medicine
          </a>
        </h4>
        <p>Nationwide Children's Hospital</p>

        <h4>Alex Wagner</h4>
        <p>
          Creator, software developer
          <br />
          <a href="http://alexwagner.info">
            <Home />
          </a>
          <a href="mailto:Alex.Wagner@nationwidechildrens.org">
            <Email />
          </a>
        </p>
        <h4>Matthew Cannon</h4>
        <p>
          Software developer
          <br />
          <a href="https://www.linkedin.com/in/matthew-cannon-b250a730/">
            <LinkedIn />
          </a>
          <a href="mailto:Matthew.Cannon2@nationwidechildrens.org">
            <Email />
          </a>
        </p>
        <h4>Katie Stahl</h4>
        <p>
          Software developer
          <br />
          <a href="https://github.com/katiestahl">
            <GitHub />
          </a>
          <a href="https://www.linkedin.com/in/katie-stahl-05b81a126/">
            <LinkedIn />
          </a>
          <a href="mailto:Kathryn.Stahl@nationwidechildrens.org">
            <Email />
          </a>
        </p>
        <h4>James Stevenson</h4>
        <p>
          Software developer
          <br />
          <a href="https://jsstevenson.github.io/">
            <Home />
          </a>
          <a href="mailto:James.Stevenson@nationwidechildrens.org">
            <Email />
          </a>
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
