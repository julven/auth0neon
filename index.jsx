
// console.log(window)
// const baseUrl = 'http://localhost/test-auth';


const Index = () => {

	const location = useLocation()
	const {pathname} = location
	const {
		authUser, setAuthUser,
		token, setToken,
		initUrl, setInitUrl,
		setLoginLoaded,
		fetchData,
		neonUser, setNeonUser,
		getNeonUser,
		offCanvas, setOffCanvas,

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

	
	const initOffCanvas = () => {

		let el = document.querySelector("#offcanvasRight")

		setOffCanvas(new bootstrap.Offcanvas(el))
	}



	useEffect(() => {
		console.log("index")
		getInitUrl()
		checkToken()

		initOffCanvas()

	}, [])

	useEffect(() => {
		console.log({token})
		if(token && token.idTokenPayload.sub) {
			getNeonUser()
		} 
	}, [token])

	
	useEffect(() => {
		console.log({neonUser})
	},[neonUser])


	return (
		<div>
			<Navbar />
			{/*<Account />*/}
			<style jsx="true">{`
			
			
		`}

		</style>
		</div>
	)
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
	<AppContextProvider>
		<HashRouter>
			
				<Index />
				<UiPopupSidebar />
				<GlobalStyles />
		</HashRouter>
	</AppContextProvider>
);

