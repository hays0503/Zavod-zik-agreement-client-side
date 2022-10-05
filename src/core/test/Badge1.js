import React, { useState, useEffect } from "react";
import { Badge } from "antd";

let a = 0;

let test = setInterval(() => {
	let randomNUm = Math.floor(Math.random() * 10);
	a = JSON.parse(JSON.stringify(randomNUm));
	//console.log('Badge tick', randomNUm)
}, 1000);

let Badge1 = React.memo((props) => {
	let [count, setCount] = useState("");

	//console.log("Badge props", props);

	useEffect(() => {
		setCount(a);
		//console.log("Badge effect", a);
	}, [a]);

	let newCount = count;
	return <Badge>{count}</Badge>;
});

export default Badge1;
