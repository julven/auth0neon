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
		:
		null
		}
			

			

			{ token ? 
			<div>
				{neonUser['active?'] == true? 
				<div>
					<Routes>	
						<Route path="/" element={<Brand />}/>
						{/*<Route path="/:id" element={<Home />}/>*/}
						<Route path="/add-product" element={<BigQueryAdd />}/>	
						<Route path="/edit-product/:id" element={<BigQueryEdit />}/>	
						{['editor', 'normal',null,undefined].includes(neonUser.role) ? 
						null
						:
						<>
						<Route path="/subscription" element={<Subscription />}/>
						<Route path="/brand" element={<Brand />}/>
						<Route path="/brand-auth/:id" element={<BrandAuth />}/>
						<Route path="/brand-auth-view/:id" element={<BrandAuthView />}/>
						<Route path="/brand-add" element={<BrandAdd />}/>
						<Route path="/brand-edit/:id" element={<BrandEdit />}/>
						<Route path="/users" element={<Users />}/>
						<Route path="/users-view/:id" element={<UsersView />}/>
						<Route path="/users-add" element={<UsersAdd />}/>
						<Route path="/users-edit/:id" element={<UsersEdit />}/>
						</>
						}
						<Route path="/account" element={<Account />}/> 
					</Routes>
					<Outlet />
				</div>
				:
				neonUser['active?']  == undefined ? 
				<div>
					<p>loading...</p>
				</div>
				:
				<div>
					<p>your account access has been revoked. <a href="#" onClick={logoutHandler}>exit</a></p>
				</div>

				}
				{/*<Routes>	
					<Route path="/" element={<Home />}/>
					<Route path="/:id" element={<Home />}/>
					<Route path="/add-product" element={<BigQueryAdd />}/>	
					<Route path="/edit-product/:id" element={<BigQueryEdit />}/>	
					<Route path="/users" element={<Users />}/>
					<Route path="/users-view/:id" element={<UsersView />}/>
					<Route path="/users-add" element={<UsersAdd />}/>
					<Route path="/users-edit/:id" element={<UsersEdit />}/>
					<Route path="/account" element={<Account />}/> 
				</Routes>*/}

				

			</div>
			:
			<Login />
			}

		</div>
	)
}