const UiLogin = (props) => {
	const {
		loginLoaded,
		mode,
		wrongPass,
		userRegistered,
		user,
		userChangeHandler,
		loginHandler,
		generalError,
		errList,
		registerUserHandler,
		registerHandler,
		forgetPasswordHandler,
		marketplaceList,
		resetPass
	} = props


	useEffect(() => {
		
	},[])


	return loginLoaded ?  (

		<div className=" d-flex justify-content-center pb-5">
			<div className="align-self-center">
				<div className="d-flex justify-content-center mb-3">
					<div className="bispoke-logo align-self-center"></div>
				</div>


				<div className="bg-white shadow-lg login-container">
				{mode == 1 ? 
				<>
					<div style={{padding: "0px 50px"}}>	
						<p className="fs-2 mb-2">Login</p>
						
							<div style={{height: 2}} className="gradiant-h mb-4"></div>
						
						{generalError != "" && <p className="text-danger">{generalError}</p>}
						{userRegistered ? <p className="text-success">registration successfull</p>: null}
						<div className="d-flex flex-column gap-3">
							<div>
								<p className="mb-1 fw-bold poppins">EMAIL ADDRESS</p>
								<UiInput1 field={"email"} value={user.email} userChangeHandler={userChangeHandler}/>
							</div>

							<div>
								<div className="d-flex justify-content-between">
									<p className="mb-1 fw-bold poppins">PASSWORD</p>
									<p onClick={(e) => registerHandler(e, 3)} className="mb-1 fw-bold" style={{cursor: "pointer", color: '#24CAD2'}}>Forgot Password?</p>
								</div>
								
								<UiInput1 field={"password"} value={user.password} userChangeHandler={userChangeHandler}/>
							</div>

							<div className="form-check mb-4">
							  <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
							  <label className="form-check-label poppins" htmlFor="flexCheckDefault">
							   Remember me
							  </label>
							</div>

							<UiButton1 text={'Login'} submit={loginHandler}/>
							<div className="d-flex gap-2 justify-content-center">
								<hr className="flex-grow-1 m-0 align-self-center"/>
								<p className="m-0 align-self-center poppins">dont have an account?&nbsp;
								<span onClick={(e) => registerHandler(e, 2)} style={{color: '#cb3974', cursor: "pointer"}}>Register</span></p>
								<hr className="flex-grow-1 m-0 align-self-center"/>
							</div>
							
						</div>	
					</div>
				</>
				:
				mode == 2 ?
				<>	
				<div className="d-flex gap-1 mb-2" style={{padding :"0px 25px"}}>
					<i onClick={(e) =>registerHandler(e,1)} style={{cursor: "pointer"}} className="bi bi-chevron-left fs-4 align-self-center"></i>
					<p className="fs-2 mb-0">Register</p>
				</div>
					<div style={{padding :"0px 50px"}} className="pb-4">
					
						<div style={{height: 2}} className="gradiant-h mb-4"></div>
						
						<div className="d-flex flex-column gap-3 ">
							<div>
								<p className="mb-1 fw-bold poppins">NAME</p>
								<UiInput1 field={"fname"} value={user.fname} userChangeHandler={userChangeHandler}/>
							</div>

							<div>
								<p className="mb-1 fw-bold poppins">BUSINESS NAME</p>
								<UiInput1 field={"aname"} value={user.aname} userChangeHandler={userChangeHandler}/>
							</div>

							<div>
								<p className="mb-1 fw-bold poppins">EMAIL ADDRESS</p>
								<UiInput1  field={"email"} value={user.email} userChangeHandler={userChangeHandler}/>
							</div>

							<div>
								<p className="mb-1 fw-bold poppins">Country</p>
								<UiInput1 field={"marketplace"} value={user.marketplace}  userChangeHandler={userChangeHandler}  marketplaceList={marketplaceList}/>
							</div>


							<div>
								<p className="mb-1 fw-bold poppins">PASSWORD</p>							
								<UiInput1 field={"password"} value={user.password} userChangeHandler={userChangeHandler}/>
							</div>

							<div>
								<p className="mb-1 fw-bold poppins">CONFIRM PASSWORD</p>
								<UiInput1 field={"confirm"} value={user.confirm} userChangeHandler={userChangeHandler}/>
							</div>

							<div className="mb-2"/>
							

							<UiButton1 text={"Register"} submit={registerUserHandler}/>
							
							
						</div>	
					</div>
				</>
				:
				mode == 3 ?
				<>
					<div className="d-flex gap-2" style={{padding :"0px 25px"}}>
							<i onClick={(e) =>registerHandler(e,1)} style={{cursor: "pointer"}} className="bi bi-chevron-left fs-4 align-self-center"></i>
							<p className="fs-2 mb-2">Forgot your password?</p>
						</div>
					<div  style={{padding :"0px 50px"}}>
						
						
						<div style={{height: 2}} className="gradiant-h mb-4"></div>
						

						<div>
							<p className="mb-1 fw-bold">EMAIL ADDRESS</p>
							{resetPass? 
							<>
							<div className="d-flex flex-column justify-content-between"  style={{minHeight: 280}}>
								<p className="text-success">password reset email sent to your email</p>
								<a href="#" onClick={(e) =>registerHandler(e,1)}>back</a>
							</div>
								
							</>
							:
							<div className="d-flex flex-column justify-content-between pb-4" style={{minHeight: 300}}>
								<div>
									<UiInput1 field={"email"} value={user.email} userChangeHandler={userChangeHandler}/>
									<p className="my-4" style={{width: "66%", minWidth: 100}}>By clicking "Reset Password" we will send a password reset link</p>
									
								</div>
								<div>
									<UiButton1 text={"Reset Password"} submit={forgetPasswordHandler}/>
									
								</div>
							</div>
						}
							
						</div>
					</div>
					
				</>	
				:
				<>

				</>
				}
					
					
				</div>
		
				
				
			</div>

		</div>
	)
	:
	 <p>loading</p>
}