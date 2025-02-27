const live = true

const baseUrl = live ? 
	'https://julven.github.io/auth0neon' 
	: 
	'http://localhost/auth0neon';	

const apiUrl = live ? 
	'https://y74j6u4w7p35lv2qf3z3dicizm0dpces.lambda-url.us-east-1.on.aws' 
	: 
	'http://localhost:3000';

const client = 'nEBhH88sL6SZeY5Iuag9DYUfKd9teVW9';	

const {useState, useEffect, useContext, createContext } = React
const { createRoot, Link, Navigate, Outlet, Route, Routes, BrowserRouter, HashRouter, useParams, useLocation, useNavigate  } = ReactRouterDOM
// const {createRoot} = ReactRouterDOM


let AppContext = createContext();	

const options = {
		domain: 'bispoke-dev.us.auth0.com', 
		clientID: client,
		// redirectUri: 'http://localhost/test-auth',
		redirectUri: `${baseUrl}/callback`,
		responseType: 'token id_token',
		audience: `https://bispoke-dev.us.auth0.com/api/v2/`,
		
		scope: 'read:current_user update:current_user_identities update:current_user_metadata'
	};

let webAuth = new auth0.WebAuth(options)
