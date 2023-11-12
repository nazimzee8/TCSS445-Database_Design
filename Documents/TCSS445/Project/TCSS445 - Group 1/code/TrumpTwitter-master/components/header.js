import Head from 'next/head';
import Link from 'next/link'
import React from "react";
import styled from 'styled-components';

const LinkStyle = styled.div`
    ul {
      list-style-type: none;
      margin: auto;
      padding: auto;
      overflow: auto;
      background-color: #333;
      position: fixed;
      top: 0;
      width: 100%;
    }
`;

const StyledLink = styled.a `
   display: block;
   color: white;
   text-align: center;
   text-decoration: none;
   padding: 14px 16px;
   float: left;
   font-size: large;
   
   &:hover:not(.active) {
    background-color: #111;
   }
   .active {
      background-color: #4CAF50;
   }
`;

//Renders navbar, also includes general page behavior
//Will include this component on all pages
const Header = () => (
    <>
        <Head>
            <title>Political Tweet Database</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        </Head>
        <LinkStyle>
            <ul>
                <Link href="/" passHref = {true}>
                    <StyledLink> Home </StyledLink>
                </Link>
                <Link href="/issuetracker/landing" passHref = {true}>
                    <StyledLink> Issue Tracker </StyledLink>
                </Link>
                <Link href="/about" passHref={true}>
                    <StyledLink> About </StyledLink>
                </Link>
            </ul>
        </LinkStyle>
    </>

);

export default Header;