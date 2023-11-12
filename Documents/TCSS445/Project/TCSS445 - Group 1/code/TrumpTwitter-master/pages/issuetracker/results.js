import fetch from 'isomorphic-unfetch'
import React from 'react';
import Layout from "../../components/myLayout";
import Table from "../../components/Table";

Results.getInitialProps = async ({ req, query }) => {
    const pageRequest = `${"http:"}//${"localhost:8080"}/api/keywordstrength?keyword=${query.keyword}`;
    const res = await fetch(pageRequest);
    const json = await res.json();
    return {data: json, keyword: query.keyword};
};

//Use react-table for results page
function Results(ctx) {
    console.log(ctx);
    let data = [];
    {ctx.data.keywordStrength.map(k => (
        data.push(
            {
                Name: k.name,
                Strength: k.strength
            }
        )))}
    const columns = React.useMemo(
        () => [
            {
                Header: 'Candidate Name',
                accessor: 'Name',
            },
            {
                Header: 'Tweets with Keyword',
                accessor: 'Strength',
            },
        ],
        []
    );
    return (
        <>
            <Layout>
                <h1 style = {{marginTop: '60px'}}>
                    Concern Strength for Keyword "{ctx.keyword}"
                </h1>
                <Table data = {data} columns = {columns} />
            </Layout>
        </>
    )
}

export default Results;