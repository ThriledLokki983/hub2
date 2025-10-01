import { Search, Logo, Results } from "../index";

export default function Navbar({ children,}) {

	return (
		<nav className="nav-bar">
			<Logo />
			<Search />
			{children}
		</nav>
	)
}