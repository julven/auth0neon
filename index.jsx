
// console.log(window)
// const baseUrl = 'http://localhost/test-auth';


const Index = () => {

	const {pathname} = useLocation()

	const {
		authUser, setAuthUser,
		token, setToken,
		initUrl, setInitUrl,
		setLoginLoaded,

	} = useContext(AppContext)

	let getInitUrl = () => {
		let url = pathname == "/login" ? "/" : pathname
		console.log({getInitUrl: {pathname, goTo: url}})
		setInitUrl(url)
	}	


	const checkToken = () => {
		
		console.log({checkToken: ""})

		webAuth.checkSession({
			  
		}, function (err, authResult) {
			setLoginLoaded(true)
		  // err if automatic parseHash fails
			console.log({err, authResult})
			if(authResult) {
				
				var auth0Manage = new auth0.Management({
				  domain: 'bispoke-dev.us.auth0.com',
				  token: authResult.accessToken
				});
				auth0Manage.getUser(authResult.idTokenPayload.sub, function (err,userData) {
					console.log({getUser: {err, userData}})
					if(userData) {
						setAuthUser(userData)
					}
				});

				setToken(authResult)
			}
	
		});
	}



	useEffect(() => {
		console.log("index")
		getInitUrl()
		checkToken()

	}, [])


	return (
		<div>
			<Navbar />
			{/*<Account />*/}
		</div>
	)
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
	<AppContextProvider>
		<HashRouter>
			
				<Index />
			
		</HashRouter>
	</AppContextProvider>
);

