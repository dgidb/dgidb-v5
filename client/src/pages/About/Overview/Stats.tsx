import React, { useEffect, useState } from 'react';
import './Stats.scss';

interface StatsData {
    drug_claims: number;
    drugs: number;
    gene_claims: number;
    genes: number;
    interaction_claims: number;
    interactions: number;
    gene_categorization_claims: number;
    gene_categorizations: number;
    sources: number;
    publications: number;
}

export const AboutStats: React.FC = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch stats from counts controller endpoint
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/counts');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();  
                setStats(data);  
                setLoading(false);  
            } catch (error) {
                setError('Failed to fetch data.');
                setLoading(false);
            }
        };

        fetchStats();
    }, []);  

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
   
   
   
    return (
        <>
        <h1>Data Statistics</h1>
        <p>Live counts of claims and groups for data in DGIdb:</p>
        <p>
            <b>Drug Claims: </b>{stats?.drug_claims}<br/>
            <b>Drug Groups: </b>{stats?.drugs}<br/>
            <br />
            <b>Gene Claims: </b>{stats?.gene_claims}<br/>
            <b>Gene Groups: </b>{stats?.genes}<br/>
            <br />
            <b>Interaction Claims: </b>{stats?.interaction_claims}<br/>
            <b>Interaction Groups: </b>{stats?.interactions}<br/>
            <br />
            <b>Gene Category Claims: </b>{stats?.gene_categorization_claims}<br />
            <b>Gene Category Groups: </b>{stats?.gene_categorizations}<br />
            <br />
            <b>Sources: </b>{stats?.sources}<br/>
            <b>Publications: </b>{stats?.publications}<br/>

        </p>
        </>
    );
};