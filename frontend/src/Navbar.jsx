import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav class="navbar navbar-dark bg-dark button-group ">
      <Link class="navbar-brand" to="/">
          Home
        </Link>
        <Link class="navbar-brand" to="/gallery">
          Gallery
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
