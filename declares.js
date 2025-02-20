const live = true

const baseUrl = live ? 
	'https://julven.github.io/auth0neon/' 
	: 
	'http://localhost/test-auth';

const apiUrl = live ? 
	'https://y74j6u4w7p35lv2qf3z3dicizm0dpces.lambda-url.us-east-1.on.aws' 
	: 
	'http://localhost:3000';

const client = 'nEBhH88sL6SZeY5Iuag9DYUfKd9teVW9';	

const {useState, useEffect, useContext, createContext} = React
let AppContext = createContext();	