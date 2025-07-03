import { Grid } from "@mui/material";
import Member from "./Member";

const teamData = [
	{
		name: "Kashni",
		image: "https://res.cloudinary.com/hostingimagesservice/image/upload/v1678629215/mediAid/minhaz_skyejo.png",
		title: "Web Developer",
		bio: "I'm a skilled MERN stack developer with expertise in MongoDB, Express, React, and Node.js. Passionate about building dynamic and efficient fullstack web applications.",
		fb: "https://www.facebook.com/kashni",
		wp: "whatsapp://send?phone=+9991086042",
		gh: "https://github.com/kashnx",
		email: "kashni250@gmail.com"
	},

];

const Team = () => {
	return (
		<Grid container spacing="20px" sx={{ padding: { xs: "16px", sm: "20px" } }}>
			{teamData.map((data, i) => (
				<Member key={i} data={data} />
			))}
		</Grid>
	);
};

export default Team;
