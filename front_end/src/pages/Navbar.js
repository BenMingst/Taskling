export default function Navbar() {
    return <nav className="nav">
        <a href="/" className="TamagoTitle">Taskling</a>
        <ul>
            <li className="active">
                <a href="/">
                    <img className="icon" src="../assets/tamagoIcon.png"></img>
                </a>
            </li>
            <li class="active">
                <a href="/">
                    <img className="icon" src="../assets/accountIcon.png"></img>
                </a>
            </li>
            <li class="active">
                <a href="/">
                    <img className="icon" src="../assets/listIcon.png"></img>
                </a>
            </li>
            <li class="active">
                <a href="/">
                    <img className="icon" src="../assets/shopIcon.png"></img>
                </a>
            </li>
        </ul>
    </nav>
}
