export default function Navbar({ pageData, currPage, changePage }) {
  return (
    <footer className="footer">
      <nav className="navbar">
        {pageData.map((p, i) => <Icon
          key={i} image={p.image} imageSelected={p.imageSelected}
          name={p.name} selected={currPage === i} i={i} changePage={changePage} />)}
      </nav>
    </footer>
  );
};

const Icon = ({ image, imageSelected, name, selected, i, changePage }) =>
  <div className="navbar-icon">
    <img className="navbar-icon-image" src={selected ? imageSelected : image} alt={name} onClick={() => changePage(i)} />
  </div>
