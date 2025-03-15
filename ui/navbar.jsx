const UiNavbar = (props) => {

	let {token, setToken, neonUser} = props
	let location = useLocation()
	let [path, setPath] = useState("")

	let [width, setWidth] = useState(0)

	const getWidth = () => {

		let h = window.innerWidth

		setWidth(h)
	}

	useEffect(() => {
		console.log({location})
		setPath(location.pathname)
	}, [location])

	useEffect(() => {
		// console.log({width})

	}, [width])

	useEffect(() => {
		getWidth()
		window.addEventListener( "resize", getWidth)
	}, [])

	return (
		<div className="d-flex">
			<div className="navbar-sidebar">
				<Link to="/">
					<div className="d-flex justify-content-center">
						<div style={{width: 130}} className="m-3">	
							<img src="./src/logo-dash.png" className="w-100"/>
						</div>
						
					</div>
				</Link>
				<hr className="text-white m-0"/>



				<div className="m-4 d-flex flex-column gap-3">
				{path == ("/") ?
				<SidebarDashboardBrand path={path}/>
				:
				path.includes("/account") ? 
				<SidebarAccount path={path}/>
				:
				<SidebarDashboardBrand path={path}/>
				}	
				</div>

			</div>

			<div style={{width: width - 250}}>
				<div style={{height: 80}} className="bg-white w-100 px-5">
					<div className="d-flex justify-content-between h-100">
						<p className="poppins align-self-center mb-0">{
							path == "/" ? 
							"Dasboard"
							:
							path.includes( "brand") ?
							"Account/Brand"	
							:
							path.includes("/account")  ?
							"Account"
							:
							""
						}</p>
						<div className="d-flex justify-content-between gap-3 align-self-center">
							<p className="poppins mb-0">Docs</p>
							<p className="poppins mb-0">Contact</p>
							<Link to="/account" style={{textDecoration: "none"}} className="poppins mb-0 text-dark">
								Account
							</Link>
						</div>
					</div>
				</div>
				<div  >
					{ token ? 
					<div>
						{neonUser['active?'] == true? 
						<>
							<Routes>	
								<Route path="/" element={<p>home</p>}/>
								<Route path="/brand" element={<Brand />}/>
								<Route path="/login" element={<Brand />}/>
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
								<Route path="/account/change-pass" element={<AccountChangePassword />}/>	
							</Routes>
							<Outlet />
						</>
						:
						neonUser['active?']  == undefined ? 
						<>
							<p>loading...</p>
						</>
						:
						<div>
							<p>your account access has been revoked. <a href="#" onClick={logoutHandler}>exit</a></p>
						</div>

						}

					</div>
					:
					null
					}
					
				</div>

			</div>

		</div>
	)
}