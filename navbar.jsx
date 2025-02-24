const Navbar = () => {

	
	let {token, neonUser} = useContext(AppContext	)

	return(
		<div>
			<div>
				<span><Link to="/">Home</Link></span>&nbsp;
				{neonUser.role == "admin"&& <>|&nbsp;<span><Link to="/users">Users</Link></span>&nbsp;</>}
				|&nbsp;<span><Link to="/account">Account</Link></span>&nbsp;
				{/*|&nbsp;<span><Link to="/login">Login</Link></span>&nbsp;*/}
			</div>

			

			{ token ? 
			<div>

				<Routes>	
					<Route path="/" element={<Home />}/>
					<Route path="/:id" element={<Home />}/>
					<Route path="/users" element={<Users />}/>
					<Route path="/users-view/:user-id" element={<UsersView />}/>
					<Route path="/users-add" element={<UsersAdd />}/>
					<Route path="/users-edit/:user-id" element={<UsersEdit />}/>
					<Route path="/account" element={<Account />}/> 
				</Routes>

				<Outlet />

			</div>
			:
			<Login />
			}

		</div>
	)
}