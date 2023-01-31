export const Info = () => {

    return(
        <div className="about-section-container doc-section">
            <p>This page provides access to raw data for DGIdb. While the application is open source, some of the data sources we import may have restrictions that prevent us from redistributing them. Please refer to the Browse Sources page for license information for each source.</p>
            <p>You may load the latest data dump into your local database instance by running the following command while in your local checkout of the DGIdb repository: rake dgidb:load_local . This will recreate your local database and import the latest data dump directly from the data repository. The data.sql file can then be found in the `data` directory of your local repository. Please see the Installation instructions for more details about creating a local instance of DGIdb.</p>
            <p>TSV download of all gene claims, drug claims, and drug-gene interaction claims in DGIdb from all sources that were mapped to valid genes. For ease of use, we recommend working directly with the API or SQL database dump.</p>
        </div>





    )
}