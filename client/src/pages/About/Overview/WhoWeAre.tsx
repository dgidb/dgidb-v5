import React from 'react';
import { Divider, Link } from '@mui/material';
import { Email, GitHub, Home, LinkedIn } from '@mui/icons-material';
import './WhoWeAre.scss';

export const WhoWeAre: React.FC = () => {
    return (
        <>
            <h1>Who We Are</h1>
            <p>DGIdb is actively maintained by the <Link href="https://www.nationwidechildrens.org/specialties/institute-for-genomic-medicine/research-labs/wagner-lab" target="_blank" rel="noopener">Wagner Lab</Link> at the Institute for Genomic Medicine at Nationwide Children’s Hospital in Columbus, OH, and the <Link href="https://griffithlab.org" target="_blank" rel="noopener">Griffith Lab</Link> at The McDonnell Genome Institute at the Washington University School of Medicine in St. Louis, MO. </p>
            <Divider />
            <h2>Current Contributors</h2>
            <div className="contributors">
                <div className="left-section">
                    <h4>
                        <Link href="https://griffithlab.org" target="_blank" rel="noreferrer">
                            The Griffith Laboratory
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
                            href="https://www.nationwidechildrens.org/specialties/institute-for-genomic-medicine/research-labs/wagner-lab"
                            target="_blank"
                            rel="noreferrer"
                        >
                            The Wagner Laboratory
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
                    <h4>Anastasia Bratulin</h4>
                    <p>
                        Expert Curator
                        <br />
                        <Link
                            href="https://www.linkedin.com/in/anastasia-bratulin-5782a0220/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <LinkedIn />
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
            </div>

            <Divider />
            <h2>Acknowledgements</h2>
            <h3>Conceptual designers/mentors</h3>
            <p>Elaine Mardis, Rick Wilson</p>
            <h3>Additional software developers</h3>
            <p>Indraniel Das, James Koval, Nicholas Spies, Avinash Ramu, Jim Eldred, Yang-Yang Feng, Jim Weible, Scott Smith, Ben Ainscough</p>
            <h3>Beta testers</h3>
            <p>David Larson, Jason Walker, Chris Miller, Ron Bose, Runjun Kumar</p>
            <h3>Expert curators</h3>
            <p>Malachi Griffith, Obi Griffith, Alex Wagner, Janakiraman Subramanian, Nicholas Spies, Jaclyn Boozalis, Deng Pan, Kelsy Cotto, Sharon Freshour</p>
            <h3>Additional conceptual contributors</h3>
            <p>Timothy J. Ley, Li Ding, David J. Dooling, Ramaswamy Govindan</p>
            <h3>Miscellaneous contributions</h3>
            <p>Kilannin Krysiak, Zachary Skidmore, Robert Lesurf, Lee Trani, Jonathan Song</p>
        </>
    );
};