const UiButton1 = ({text, submit, width}) => {



	return(
		<div 

		style={{cursor: "pointer", width: width ? width : '100%'}}
		onClick={submit}
		className="button1 d-flex justify-content-between">

			<p className="fs-5 text-white mb-0 align-self-center">{text}</p>
			<div 
			 className="d-flex justify-content-center"
			style={{border: "1px solid white", width: 50, height: 50, borderRadius: "25px"}}>
				<div style={{width: "20px"}} className="align-self-center">
					<img src="./src/arrow.png" style={{width: "100%"}}/>
				</div>
				
			</div>

		</div>
	)
}