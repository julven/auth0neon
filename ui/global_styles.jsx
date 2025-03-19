const GlobalStyles = () =>{

	const {
		mode, setMode,
		hh, setHh,
		getSrollHeight,
	} = useContext(AppContext)
	const [h, sH] = useState(null)


	const adjustH = () => {
		let scrollHeight =  document.documentElement.scrollHeight
		let clientHeight =  document.documentElement.clientHeight

		
		let newH = 0
		if(mode == 1 || mode == 3) newH = clientHeight;
		if(mode == 2) newH = scrollHeight;

		// console.log({mode, newH, clientHeight, scrollHeight})

		sH(newH)
	}



	useEffect(() =>{

		adjustH()
		getSrollHeight( window.innerHeight)
		window.addEventListener('resize', () => getSrollHeight(window.innerHeight))
	}, [])

	useEffect(() => {
		adjustH()
	}, [mode])

	useEffect(() => {
		console.log({hh})
	}, [hh])

	return (
		<style jsx="true">
		{`
			@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
			@font-face {
			  font-family: 'NordiquePro-Regular';
			  src: URL('./src/NordiquePro-Regular.otf') ;
			}

			body {
				font-family: 'NordiquePro-Regular'!important;
				background-color: #F8F8F8!important;
			}
			.poppins {
				font-family: "Poppins", sans-serif;
			}	
			.entity-table tr, .entity-table td,  .entity-table th, .entity-table  {
				border: 1px solid black;
				border-collapse: collapse;
				padding: 3px;
			}

			.login-bg {

				height: ${h}px;
				background-image: url(./src/bispoke_brandmark_white.png), url(./src/bispoke_brandmark_white_2.png);
				background-position: right bottom, left top;
				background-repeat: no-repeat, no-repeat;
				background-size: 300px;
				

			}
			.container1 {
				padding: 25px 25px;
				border-radius: 15px;		
				background-color: white;
			}	
			.login-container {
				width: 450px;
				padding: 20px 0px;
				border-radius: 25px;
				background-color: white;
			}
			.bispoke-logo {

				background-image: url(./src/bispoke_logo_black_gradient.png);
				height: 70px;
				width: 200px;
				background-size: 100%;
				background-repeat: no-repeat;
			}
			.gradiant-h {
				 background-image: linear-gradient(to right,  #CB3974, #FF9933);
			}

			.input1 {
				background-color: #F8F8F8;
				border-radius: 50px;
				
				padding: 10px 15px;
			}
			.input1 input ,.input1 select{
				border:none;
				background-color: #F8F8F8;

			}
			.input3 {
				border-radius: 25px;
				border: 1px solid #650260;
				padding: 0px 15px;
			}	
			.input3  input {
				border:none;
				background-color: #F8F8F8;
			}

			.button1 {
				height: 50px;
				width: 100%;
				background-color:#650260;
				border-radius: 25px;
				padding: 0px 0px 0px 25px;
			}
			.button2 {
				height: 40px;
				width: 100%;
				cursor: "pointer";
				border: 1px solid white;
				border-radius: 25px;
				
			}
			.button3 {
				border: 1px solid #650260;
				border-radius: 25px;
				cursor: "pointer";
				color:  #650260;

			}
			.navbar-sidebar {
				width: 250px;
			 	background-image: linear-gradient(to bottom,  #CB3974, #FF9933);
				height: ${hh}px;
			}
			.off-icon {
				width: 35px;
				height: 35px;
				background: rgba(255, 255, 255, .2);
			}
			.slider {
				accent-color:#650260;
			}
			.brand-table th:first-child{
				border-top-left-radius: 15px;
				border-bottom-left-radius: 15px;
			
		
			}
			.brand-table th:last-child{
				border-top-right-radius: 15px;
				border-bottom-right-radius: 15px;
			
	
				
			}

			.brand-table th {
				height: 50px;
				background-color:  #650260;
				color: white;
				height: 50px;
				text-align: center;
				padding: 0px 10px;
			}
			.brand-table {
				width: 100%;
				font-family: poppins;
				 overflow:hidden; 
		        white-space:nowrap; 
		        text-overflow: ellipsis;

			}
			.brand-table td {
				text-align: center;
				height: 50px;
				padding: 0px 10px;

				
			}
			.brand-table tbody {
				background-color:  white;
	

			}
			.brand-table>tbody:before {
				content:"@";
				 display:block;
				line-height: 5px;
				text-indent:-99999px;
			}
			.brand-table tbody>tr:first-child>td:first-child{
				border-top-left-radius: 15px;
			}
			.brand-table tbody>tr:first-child>td:last-child{
				border-top-right-radius: 15px;
			}
			.brand-table tbody>tr:last-child>td:first-child{
				border-bottom-left-radius: 15px;
			}
			.brand-table tbody>tr:last-child>td:last-child{
				border-bottom-right-radius: 15px;
			}
			.brand-table tbody>tr:last-child>td{
				border-bottom: 0!important;

			}
			.middle-row-th{
				border-left: 1px solid lightgray;
				border-rigt: 1px solid lightgray;
			}

			.middle-row-td{
				border-left: 1px solid lightgray;
				border-rigt: 1px solid lightgray;
				border-bottom: 1px solid lightgray;
			}

			.brand-table td:first-child{
			
				border-bottom: 1px solid lightgray;
			}
			.brand-table tbody:after {
				content:"@";
				 display:block;
				line-height: 5px;
				text-indent:-99999px;
			}
			.input-radio {
				accent-color: #650260;
				width: 16px;
				height: 16px;
				border-color:#650260;
			}
			


		`}
		</style>

	)
}