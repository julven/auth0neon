const UiButton3 = ({text, left, w, logo, submit}) => {


	


	return(
		<div className={text ? "button3	" : null} onClick={submit}>
			<div className="d-flex" style={{width: w ? w: "100%"}}>

				{left && 
				
					<div className=" align-self-center flex-grow-1 text-center" onClick={submit}>
						<span className="w-100" >{text}</span>
					</div>
					
				}

				<div 
				onClick={submit}
				className="d-flex gap-2 justify-content-center" style={{width: 40,height: 40, borderRadius: 25, border: "1px solid lightgray", cursor: "pointer"}}>
					<img className="align-self-center" src={logo || "./src/back-arrow.png"} style={{width: 15,height: 15,}}/>
				</div>

				{!left && <p>{text}</p>}

			</div>
		</div>
	)
}