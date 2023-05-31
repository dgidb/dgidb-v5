export const Info = () => {

    return(
        <div className="about-section-container doc-section">
            <p>This page provides access to raw data for DGIdb. While the application is open source, some of the data sources we import may have restrictions that prevent us from redistributing them. Please refer to the Browse Sources page for license information for each source.</p>
            <p>You may load the latest data dump into your local database instance by running the following command while in your local checkout of the DGIdb repository: psql -d dgidb -f dgidb_v5_20230208_m1.sql. This will recreate your local database and import the <a href='https://nch-igm-wagner-lab-public.s3.us-east-2.amazonaws.com/dgidb_v5_20230208_m1.sql'>latest data dump</a> directly. Please see the Installation instructions for more details about creating a local instance of DGIdb.</p>
            <p>TSV download of all gene claims, drug claims, and drug-gene interaction claims in DGIdb from all sources that were mapped to valid genes. For ease of use, we recommend working directly with the API or SQL database dump.</p>
        </div>





    )
}