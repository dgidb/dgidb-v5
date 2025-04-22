import React from 'react';
import './Clients.scss';
import { Link } from '@mui/material';

export const Clients: React.FC = () => {
    return (
        <>
            <h1>Clients</h1>
            <p>Academic and commercial resources that use DGIdb data (for example by integrating DGIdb interactions into their own tool). The current list of DGIdb data clients includes:
            </p>
            <ul>
                <p><Link href="http://biogps.org/#goto=welcome" target="_blank" rel="noreffer">BioGPS</Link><br />
                <Link href="http://www.cancergd.org/" target="_blank" rel="noreffer">CancerGD</Link><br />
                <Link href="http://cailab.labshare.cn/cancertracer/index.html" target="_blank" rel="noreffer">CancerTracer</Link><br />
                <Link href="http://cancrox.gmb.bio.br/view/index.php" target="_blank" rel="noreffer">CANCROX</Link><br />
                <Link href="http://bioinformatics.cing.ac.cy/codres" target="_blank" rel="noreffer">CoDReS</Link><br />
                <Link href="http://csgator.ewha.ac.kr/" target="_blank" rel="noreffer">CSgator</Link><br />
                <Link href="https://gemini.readthedocs.io/en/latest/index.html" target="_blank" rel="noreffer">GEMINI - GEnome MINIng</Link><br />
                <Link href="http://www.genemed.tech/gene4denovo/home" target="_blank" rel="noreffer">Gene4Denovo</Link><br />
                <Link href="https://www.genecards.org/" target="_blank" rel="noreffer">GeneCards</Link><br />
                <Link href="https://github.com/guidmt/GMIEC-shiny/" target="_blank" rel="noreffer">GMIEC - a shiny app</Link><br />
                <Link href="http://hemap.uta.fi/hemap/index.html/" target="_blank" rel="noreffer">Hemap</Link><br />
                <Link href="http://mulinlab.tmu.edu.cn/mtctscan/" target="_blank" rel="noreffer">mTCTScan</Link><br />
                <Link href="http://ncg.kcl.ac.uk/" target="_blank" rel="noreffer">NCG - Network of Cancer Genes</Link><br />
                <Link href="http://ndexbio.org/#/network/7e5e64ff-f6cf-11ea-99da-0ac135e8bacf" target="_blank" rel="noreffer">NDEx</Link><br />
                <Link href="https://github.com/fakedrtom/oncogemini" target="_blank" rel="noreffer">OncoGemini</Link><br />
                <Link href="http://bioinformaticstools.mayo.edu/research/panda" target="_blank" rel="noreffer">PANDA (Pathway AND Annotation) Explorer</Link><br />
                <Link href="https://pct.mdanderson.org/home" target="_blank" rel="noreffer">Personalized Cancer Therapy</Link><br />
                <Link href="https://github.com/sdecesco/targetDB" target="_blank" rel="noreffer">TargetDB</Link><br />
                <Link href="https://sl-biodp.nci.nih.gov/sl_index.php" target="_blank" rel="noreffer">SL-BioDP</Link><br />
                <Link href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6206832/" target="_blank" rel="noreffer">SwissMTB</Link><br />
                <Link href="https://precious.polito.it/theringdb/home" target="_blank" rel="noreffer">theRING</Link><br />
                <Link href="http://celllines.tron-mainz.de/" target="_blank" rel="noreffer">TCLP - Tron Cell Line Portal</Link><br />
                <Link href="http://varcards.biols.ac.cn/" target="_blank" rel="noreffer">VarCards</Link><br />
                <Link href="http://rnd.cgu.edu.tw/vareporter/" target="_blank" rel="noreffer">VAReporter</Link></p>
            </ul>
            <p>If your resource is using DGIdb but is missing from this list and you would like us to add it, please contact us at <Link href='mailto:help@dgidb.org'>help@dgidb.org</Link>. </p>
        
        
        
        
        
        
        </>



    );
};