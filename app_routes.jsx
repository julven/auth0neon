const AppRoutes = () => {

	let {token, setToken, neonUser} = useContext(AppContext)

	return (
		<>	
		{ token ? 
		<div>
			{neonUser['active?'] == true? 
			<div>
				<Routes>	
					<Route path="/" element={<Brand />}/>
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
				</Routes>
				{/*<Outlet />*/}
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

		</div>
		:
		<Login />
		}

		</>

	)
}