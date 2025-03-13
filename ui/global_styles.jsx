const GlobalStyles = () =>{


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

			.login-bg {

				height: 100vh;
				background-image: url(./src/bispoke_brandmark_white.png), url(./src/bispoke_brandmark_white_2.png);
				background-position: right bottom, left top;
				background-repeat: no-repeat, no-repeat;
				background-size: 300px;
				padding: 20px 20px;
			}
			.login-container {
				width: 450px;
				padding: 20px 0px;
				border-radius: 25px;	
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
			.button1 {
				height: 50px;
				width: 100%;
				background-color:#650260;
				border-radius: 25px;
				padding: 0px 0px 0px 25px;
			}
		`}
		</style>

	)
}