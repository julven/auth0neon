const Navbar = () => {

	
	let {token} = useContext(AppContext	)

	return(
		<div>
			<div>
				<span><Link to="/">Home</Link></span>&nbsp;
				|&nbsp;<span><Link to="/account">Account</Link></span>&nbsp;
				{/*|&nbsp;<span><Link to="/login">Login</Link></span>&nbsp;*/}
			</div>

			

			{ token ? 
			<Routes>	
				<Route path="/" element={<Home />}/>
				<Route path="/:id" element={<Home />}/>
				<Route path="/account" element={<Account />}/> 
			</Routes>
			:
			<Login />
			}

		</div>
	)
}