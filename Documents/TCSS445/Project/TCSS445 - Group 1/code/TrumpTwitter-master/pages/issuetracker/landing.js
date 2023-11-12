import fetch from 'isomorphic-unfetch'
import React from 'react';
import Layout from "../../components/myLayout";
import Link from "next/link";
import Table from "../../components/Table";
Landing.getInitialProps = async ({ req, query }) => {
    const pageRequest = `${"http:"}//${"localhost:8080"}/api/keywordstrength?`;
    const res = await fetch(pageRequest);
    const json = await res.json();
    return json;
};

//Landing page for issue tracker
function Landing(ctx) {
    console.log(ctx);
    return (
        <>
            <Layout>
                <h1 style = {{marginTop: '60px', marginLeft: '10px'}}>
                    How concerned are candidates about a particular topic?
                </h1>
                <div style = {{float: 'left'}}>
                    <h2 style = {{marginLeft: '10px'}}>
                        Select an issue from the list:
                    </h2>
                    {ctx.keywordList.map(keyword => (
                        <Link href={`results?keyword=${keyword.keyword}`}>
                            <li style = {{color:'#4e5ae3', cursor: 'pointer', marginLeft: '50px', fontSize: 'x-large'}}> {keyword.keyword} </li>
                        </Link>
                    ))}
                </div>
            </Layout>
        </>
    )
}

export default Landing;