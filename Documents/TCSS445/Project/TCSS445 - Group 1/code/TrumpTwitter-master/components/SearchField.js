import React from 'react';
import { useRouter } from 'next/router';
import { useState } from "react";

//Unused for now
function SearchField({candidate, id, keyword, href}) {
    const router = useRouter();
    const style = {
        marginRight: 10,
        color: router.pathname === href ? 'red' : 'black',
    };
    const [value, setName] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        router.push({pathname: '/candidate', query: {title: candidate, id: id, keyword: value}});
        //router.prefetch(`/candidate?title=${candidate}&id=${id}&keyword=${value}`);
    };
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Search for a Keyword:
                <input type="text" onChange = {e => setName(e.target.value)} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}

export default SearchField