const Navbar = () => {

	
	let {token, setToken, neonUser} = useContext(AppContext	)

	const logoutHandler = async (e) => {
		e.preventDefault()
		await webAuth.logout({
		  returnTo: baseUrl+"/callback",
		  clientID: client
		});

		setToken(null)
	}

	useEffect(() => {

	}, [])

	return(
		<div>
		{token && neonUser.email ? 
			<>
			{ui?
			<UiNavbar />
			:
			<div>
				{/*<span><Link to="/">Home</Link></span>&nbsp;*/}
				{["admin","owner"].includes(neonUser.role) && 
				<>
				{/*|&nbsp;<span><Link to="/users">Users</Link></span>&nbsp;*/}
				|&nbsp;<span><Link to="/brand">Brands</Link></span>&nbsp;
				|&nbsp;<span><Link to="/subscription">Subscription</Link></span>&nbsp;
				</>}
				|&nbsp;<span><Link to="/account">Account</Link></span>&nbsp;
				{/*|&nbsp;<span><Link to="/login">Login</Link></span>&nbsp;*/}
			</div>

			}
			</>
			
		:
		null
		}
			
		

	</div>
	)
}